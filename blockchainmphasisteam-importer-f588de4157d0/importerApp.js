var fs = require("fs");
var Web3 = require('web3');
var MongoClient = require('mongodb').MongoClient;
//var bodyParser = require('body-parser');
var cors = require('cors');

var abiDecoder = require('abi-decoder');
var express = require('express');
var ipfsAPI = require('ipfs-http-client');

var log4js = require('log4js');
var logger = log4js.getLogger('ExporterAPI');

//initialize app
const app = express();

//read application configuration from appConfig.js
let configRawData = fs.readFileSync('appConfig.json');
let configData = JSON.parse(configRawData); 

var logLevel = configData.logLevel;
var appIP = configData.appIP;
var appPort = configData.appPort;
var mongoDBIP = configData.mongoDBIP;
var mongoDBPort = configData.mongoDBPort;
var importerWalletAddress = configData.importerWalletAddress;
var importerWalletPassword = configData.importerWalletPassword;
var ipfsURL = configData.ipfsURL;
var appIpAddress = configData.appIpAddress;

const fileUpload = require('express-fileupload'); //aug7 -edit  reqiremnt not included
var ipfs=ipfsAPI(ipfsURL);  // aug 7 edit
var web3HTTPProvider = configData.web3HTTPProvider;

/**
 * connect to web3 provider
 */
var web3 = new Web3(new Web3.providers.HttpProvider(web3HTTPProvider));


//read contract addresses
let contractConfigData = fs.readFileSync('contractAddresses.json');
let contractAddresses = JSON.parse(contractConfigData);



var rolesContractAddress = contractAddresses.roles;
var salesContractAddress = contractAddresses.sales_contract;
var tradeFinanceContractAddress = contractAddresses.trade_finance;
var mtkContractAddress = contractAddresses.mtkContractAddress;


//get Roles contract abi
var rolesContractSource = fs.readFileSync("Roles.json");
var rolesContract = JSON.parse(rolesContractSource)["contracts"];
var rolesABI = JSON.parse(rolesContract["Roles.sol:Roles"].abi);
const deployedRolesContract = web3.eth.contract(rolesABI).at(String(rolesContractAddress));

//get Sales contract abi
var salesContractSource = fs.readFileSync("SalesContract.json");
var salesContract = JSON.parse(salesContractSource)["contracts"];
var salesABI = JSON.parse(salesContract["SalesContract.sol:SalesContract"].abi);

const deployedSalesContract = web3.eth.contract(salesABI).at(String(salesContractAddress));

//get TradeFinance contract abi
var tradeContractSource = fs.readFileSync("TradeFinance.json");
var tradeContract = JSON.parse(tradeContractSource)["contracts"];
var tradeABI = JSON.parse(tradeContract["TradeFinance.sol:TradeFinance"].abi);

//edit
var mtkContractSource = fs.readFileSync("MTK.json");
var mtkContract = JSON.parse(mtkContractSource)["contracts"];
var mtkABI = JSON.parse(mtkContract["MTK.sol:MphasisToken"].abi);

const deployedMTKContract = web3.eth.contract(mtkABI).at(String(mtkContractAddress));

const deployedTradeContract = web3.eth.contract(tradeABI).at(String(tradeFinanceContractAddress));

// database configuration
var tradeFinanceTxnDBURL = "mongodb://"+mongoDBIP+":"+mongoDBPort+"/importer_trade_finance_txns";  // : between mongodb Ip and mongodb port
var tradeFinanceTxnDB;
/*
MongoClient.connect(tradeFinanceTxnDBURL, function(err, tradeFinanceTxnDBTemp) {
	logger.info("tradefinance txn db connected");

	tradeFinanceTxnDB = tradeFinanceTxnDBTemp;
});
*/
var tradeFinanceDataDBURL = "mongodb://"+mongoDBIP+":"+mongoDBPort+"/importer_trade_finance_data";
var tradeFinanceDataDB;

var BillOfLadingDBURL = "mongodb://"+mongoDBIP+":"+mongoDBPort+"/importer_Bill_of_lading";
var BillOfLadingDB;
/*
var tradeFinanceDataDB;

MongoClient.connect(tradeFinanceDataDBURL, function(err, tradeFinanceDataDBTemp) {
	logger.info("tradefinance data db connected");
//console.log(err);
	tradeFinanceDataDB = tradeFinanceDataDBTemp; // replace  tradeFinanceDataDBURL  to  tradeFinanceDataDBTemp
});
*/

// mongodb edit

var url = "mongodb://"+mongoDBIP+":"+mongoDBPort;
MongoClient.connect(url, function(err, db) {   //here db is the client obj
    if (err) throw err;
     tradeFinanceDataDB = db.db("importer_trade_finance_data"); //here
   
});

MongoClient.connect(url, function(err, db) {   //here db is the client obj
    if (err) throw err;
	tradeFinanceTxnDB = db.db("importer_trade_finance_txns"); //here
   
});
var tradeFinanceLoginDB;

MongoClient.connect(url, function(err, db) {   //here db is the client obj
    if (err) throw err;
	tradeFinanceLoginDB = db.db("importer_trade_finance_login"); //here
   
});


MongoClient.connect(url, function(err, db) {   //here db is the client obj
	if (err) throw err;
	BillOfLadingDB = db.db("importer_Bill_of_lading"); //here

});


//set log level
logger.level = logLevel;

//set app settings
app.use(cors());
app.use(fileUpload());

app.options("*", cors());


logger.info("###### Trade Finance Importer API ######");

logger.debug("contract addresses : "+(contractConfigData));



//************************************************* Events ************************************************** */

/**
* CreateOffer event.
* @event
*/
var createOfferEvent;
createOfferEvent = deployedSalesContract.CreateAgreement({}, {fromBlock:'latest',toBlock:'latest'});

createOfferEvent.watch(function(error, result) {
	logger.info("createAgreementEvent ");
	logger.debug("result : "+result);

	storeTransaction(
			parseInt(result.args.agreementId), 
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.executedBy),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);
	
	

	//store offer data
	let queryObj = {
			agreementId:parseInt(result.args.agreementId)
	}

	let offerData = {
			agreementId:parseInt(result.args.agreementId),
			createdAt:parseInt(result.args.createdAt),
			assetName:web3.toUtf8(result.args.assetName),
			assetDescription:web3.toUtf8(result.args.assetDescription),
			importer:web3.toUtf8(result.args.executedBy),
			agreementStatus:web3.toUtf8(result.args.agreementStatus),
			unit:web3.toUtf8(result.args.unit),
			quantity:parseInt(result.args.quantity)
			
	}

	storeOfferInfo(queryObj, offerData);


});


/**
* Update Agreement event.
* @event
*/
var updateAgreementEvent;
updateAgreementEvent = deployedSalesContract.UpdateAgreement({}, {fromBlock:'latest',toBlock:'latest'});

updateAgreementEvent.watch(function(error, result) {
	logger.info("UpdateAgreement ");
	logger.debug("result : "+JSON.stringify(result));

	storeTransaction(
			parseInt(result.args.agreementId), 
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.executedBy),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);
	
	

	//store offer data
	let queryObj = {
			agreementId:parseInt(result.args.agreementId)
	}

	let offerData = {
			agreementId:parseInt(result.args.agreementId), // aug 8 edit
			agreementStatus:web3.toUtf8(result.args.agreementStatus),
			agreementMessage:web3.toUtf8(result.args.agreementStatus)
	}

	storeOfferInfoNew(queryObj, offerData);


});


var acceptOfferEvent;
/**
* acceptOffer event
* @event
*/
acceptOfferEvent = deployedSalesContract.AcceptOffer({}, {fromBlock:'latest',toBlock:'latest'});

acceptOfferEvent.watch(function(error, result){
	logger.info("acceptOfferEvent");
	logger.debug("result : "+result);

	storeTransaction(
			parseInt(result.args.agreementId), 
			result.transactionHash,
			"Accept Agreement",
			web3.toUtf8(result.args.executedBy),
			result.blockNumber
	);

	//store offerData
	let queryObj = {
			agreementId:parseInt(result.args.agreementId)
	}

	let offerData = {
			agreementId:parseInt(result.args.agreementId), // aug 8 edit
			agreementStatus:web3.toUtf8(result.args.agreementStatus),
			agreementMessage:web3.toUtf8(result.args.message)
	}

	storeOfferInfoNew(queryObj, offerData);
});



/**
* 
* rejectRequest event 
* @event
* 
*/
var rejectRequestEvent = deployedSalesContract.RejectRequest({}, {fromBlock:'latest',toBlock:'latest'});
rejectRequestEvent.watch(function(error, result){
	logger.info("rejectRequestEvent");
	logger.debug("result : "+result);
	
	storeTransaction(
			parseInt(result.args.agreementId), 
			result.transactionHash,
			"Rejecting Offer Request",
			web3.toUtf8(result.args.executedBy),
			result.blockNumber
	);

	let offerData = {
			agreementId:parseInt(result.args.agreementId),
			offerStatus:web3.toUtf(result.args.offerStatus),
			agreementMessage:web3.toUrf(result.args.offerMessage)
	}

	let queryObj = {
			agreementId:parseInt(result.args.agreementId)
	}

	storeOfferInfoNew(queryObj, offerData);
});


/**
* 
* validateAgreement event
* @event
*/
var validateAgreementEvent = deployedSalesContract.ValidateAgreement({}, {fromBlock:'latest',toBlock:'latest'});

validateAgreementEvent.watch(function(error, result){
	logger.info("Validating Agreement");
	logger.debug("result : "+result);
	
	storeTransaction(
		parseInt(result.args.agreementId), 
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.executedBy),
			result.blockNumber
	);
	
	let queryObj = {
			agreementId : parseInt(result.args.agreementId)
	}
	 

	
	let agreementData = {
			agreementId:parseInt(result.args.agreementId),
			agreementStatus:web3.toUtf8(result.args.agreementStatus),
			agreementMessage:web3.toUtf8(result.args.agreementMessage)
	}
	
	

	storeOfferInfoNew(queryObj, agreementData);
	
});


/**
* 
* UploadLocDocument event
* @event
* 
*/
var uploadLocDocument = deployedSalesContract.UploadLocDocument({}, {fromBlock:'latest',toBlock:'latest'});

uploadLocDocument.watch(function(error, result){
	logger.info("LOC Document uploaded");
	logger.debug("result : "+result);
	
      
	storeTransaction(
		parseInt(result.args.agreementId), 
			result.transactionHash,
			"LOC Document uploaded",
			web3.toUtf8(result.args.executedBy),
			result.blockNumber
	);
	
	let queryObj = {
			agreementId : parseInt(result.args.agreementId)
	}
	  
	let agreementData = {
			agreementId : parseInt(result.args.agreementId),
			agreementStatus:web3.toUtf8(result.args.agreementStatus),
			agreementMessage:web3.toUtf8(result.args.agreementMessage)
	}
	
	storeOfferInfoNew(queryObj, agreementData);
});




/**
* 
* ValidateLOCDraft event
* @event
* 
*/
var ValidateLOCDraft = deployedSalesContract.ValidateLOCDraft({}, {fromBlock:'latest',toBlock:'latest'});

ValidateLOCDraft.watch(function(error, result){
	logger.info("LOC Draft validated");
	logger.debug("result : "+result);
	
      
	storeTransaction(
		parseInt(result.args.agreementId), 
			result.transactionHash,
			"LOC Draft validated",
			web3.toUtf8(result.args.executedBy),
			result.blockNumber
	);
	
	let queryObj = {
			agreementId : parseInt(result.args.agreementId)
	}
	
	let agreementData = {
			agreementId : parseInt(result.args.agreementId),
			agreementStatus:web3.toUtf8(result.args.agreementStatus),
			agreementMessage:web3.toUtf8(result.args.agreementMessage)
	}
	
	storeOfferInfoNew(queryObj, agreementData);
});


/**
* 
* ValidateLOCDocument event
* @event
*/
var validateLOCDocument = deployedSalesContract.ValidateLOCDocument({}, {fromBlock:'latest',toBlock:'latest'});

validateLOCDocument.watch(function(error, result){
	logger.info("validateLOCDocument");
	logger.debug("result : "+result);
	 
	storeTransaction(
			parseInt(result.args.agreementId),
			result.transactionHash,
			"LOC Document validated",
			web3.toUtf8(result.args.executedBy),
			result.blockNumber
	);

	let queryObj = {
			agreementId : parseInt(result.args.agreementId)
	}
	

	let agreementData = {
			agreementId : parseInt(result.args.agreementId),
			agreementStatus:web3.toUtf8(result.args.agreementStatus),
			agreementMessage:web3.toUtf8(result.args.agreementMessage)
	}

	
	storeOfferInfoNew(queryObj, agreementData);
});




/**
* 
* TradeFinance events
*/

var createAssetEvent = deployedTradeContract.CreateAsset({}, {fromBlock:'latest',toBlock:'latest'});

createAssetEvent.watch(function(error, result){
	logger.info("createAssetEvent");
	logger.debug("result : "+result);

	storeTransaction(
			parseInt(result.args.assetId),
			result.transactionHash,
			"New Asset Created",
			web3.toUtf8(result.args.exporterName),
			result.blockNumber
	);


	let queryObj = {
			assetId:parseInt(result.args.assetId) // change query object to asset ID from offer Id
	}
	
	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			assetName:web3.toUtf8(result.args.assetName), // aug 7 addition of web3
			shipper:web3.toUtf8(result.args.shipperName),
			importerName:web3.toUtf8(result.args.importerName),
			exporterPortName:web3.toUtf8(result.args.exporterPortName),
			importerPortName:web3.toUtf8(result.args.importerPortName),
			assetStatus:web3.toUtf8(result.args.assetStatus),
			message:web3.toUtf8(result.args.message),
			assetLocation:web3.toUtf8(result.args.assetLocation), // aug7 edit
			agreementId:parseInt(result.args.agreementId),
			createdAt:parseInt(result.args.createdAt),
			exporterName:web3.toUtf8(result.args.exporterName)
	}

	storeAssetInfo(queryObj, assetInfo);


});



var updateAssetInfo = deployedTradeContract.UpdateAssetInfo({}, {fromBlock:'latest',toBlock:'latest'});

updateAssetInfo.watch(function(error, result){
	logger.info("updateAssetInfo event");
	logger.debug("result : "+result);

	storeTransactionNew(
			parseInt(result.args.assetId),
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.assetLocation),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);

	let queryObj = {
			assetId:parseInt(result.args.assetId)
	}

	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			assetStatus:web3.toUtf8(result.args.assetStatus),
			message:web3.toUtf8(result.args.message),
			assetLocation:web3.toUtf8(result.args.assetLocation) // aug7 edit

	}

	storeAssetInfoNew(queryObj, assetInfo);

});


var documentUploadByShipper = deployedTradeContract.DocumentUploadByShipper({}, {fromBlock:'latest',toBlock:'latest'});


documentUploadByShipper.watch(function(error, result){
	logger.info("documentUploadByShipper event");
	storeTransaction(
			parseInt(result.args.assetId),
			result.transactionHash,
			"Documents Uploaded By Shipper",
			web3.toUtf8(result.args.assetLocation),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);
	logger.debug("result : "+result);
	let queryObj = {
			assetId:parseInt(result.args.assetId)
	}

	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			assetStatus:web3.toUtf8(result.args.assetStatus),
			message:web3.toUtf8(result.args.message),
			assetLocation:web3.toUtf8(result.args.assetLocation) // aug7 edit

	}

	storeAssetInfoNew(queryObj, assetInfo);
});


var confirmShippingByShipper = deployedTradeContract.ConfirmShippingByShipper({}, {fromBlock:'latest',toBlock:'latest'}); 

confirmShippingByShipper.watch(function(error, result){
	logger.info("confirmShippingByShipper event");
	logger.debug("result : "+result);

	storeTransaction(
			parseInt(result.args.assetId),
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.executedBy),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);

	let queryObj = {
			assetId:parseInt(result.args.assetId)
	}

	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			assetStatus:web3.toUtf8(result.args.assetStatus),
			message:web3.toUtf8(result.args.message),
			assetLocation:web3.toUtf8(result.args.assetLocation) // aug7 edit

	}

	storeAssetInfoNew(queryObj, assetInfo);
});

var updateAssetArrival = deployedTradeContract.UpdateAssetArrival({}, {fromBlock:'latest',toBlock:'latest'});


updateAssetArrival.watch(function(error, result){
	logger.info("updateAssetArrival");
	logger.debug("result : "+result);

	storeTransaction(
			parseInt(result.args.assetId),
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.assetLocation),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);

	let queryObj = {
			assetId:parseInt(result.args.assetId)
	}


	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			assetStatus:web3.toUtf8(result.args.assetStatus),
			message:web3.toUtf8(result.args.message),
			assetLocation:web3.toUtf8(result.args.assetLocation) // aug7 edit

	}

	storeAssetInfoNew(queryObj, assetInfo);
});


var documentUploadByExporterPort = deployedTradeContract.DocumentUploadByExporterPort({}, {fromBlock:'latest',toBlock:'latest'});

documentUploadByExporterPort.watch(function(error, result){
	logger.info("documentUploadByExporterPort");
	logger.debug("result : "+result);

	storeTransaction(
			parseInt(result.args.assetId),
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.assetLocation),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);

	let queryObj = {
			assetId:parseInt(result.args.assetId)
	}

	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			assetStatus:web3.toUtf8(result.args.assetStatus),
			message:web3.toUtf8(result.args.message),
			assetLocation:web3.toUtf8(result.args.assetLocation) // aug7 edit

	}

	storeAssetInfoNew(queryObj, assetInfo);
});




var validateAtExporterPortFinalApproval = deployedTradeContract.ValidateAtExporterPortFinalApproval({}, {fromBlock:'latest',toBlock:'latest'});

validateAtExporterPortFinalApproval.watch(function(error, result){
	logger.info("validateAtExporterPortFinalApproval");
	logger.debug("result : "+result);
	storeTransaction(
			parseInt(result.args.assetId),
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.executedBy),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);

	let queryObj = {
			assetId:parseInt(result.args.assetId)
	}

	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			assetStatus:web3.toUtf8(result.args.assetStatus),
			message:web3.toUtf8(result.args.message),
			assetLocation:web3.toUtf8(result.args.assetLocation) // aug7 edit
	}

	storeAssetInfoNew(queryObj, assetInfo);

});



var requestBillOfLadingByImporterBank = deployedTradeContract.RequestBillOfLadingByImporterBank({}, {fromBlock:'latest',toBlock:'latest'});

requestBillOfLadingByImporterBank.watch(function(error, result){
	logger.info("requestBillOfLadingByImporterBank");
	logger.debug("result : "+result);
	storeTransaction(
			parseInt(result.args.assetId),
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.executedBy),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);

	let queryObj = {
			assetId:parseInt(result.args.assetId)
	}

	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			assetStatus:web3.toUtf8(result.args.assetStatus),
			message:web3.toUtf8(result.args.message),
			//assetLocation:web3.toUtf8(result.args.assetLocation) // aug7 edit
	}

	storeAssetInfoNew(queryObj, assetInfo);

});



var validatePaymentByExporterBank = deployedTradeContract.ValidatePaymentByExporterBank({}, {fromBlock:'latest',toBlock:'latest'});

validatePaymentByExporterBank.watch(function(error, result){
	logger.info("validatePaymentByExporterBank");
	logger.debug("result : "+result);
	storeTransaction(
			parseInt(result.args.assetId),
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.executedBy),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);

	let queryObj = {
			assetId:parseInt(result.args.assetId)
	}

	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			assetStatus:web3.toUtf8(result.args.assetStatus),
			message:web3.toUtf8(result.args.message),
			assetLocation:web3.toUtf8(result.args.assetLocation) // aug7 edit
	}

	storeAssetInfoNew(queryObj, assetInfo);

});


var requestBillOfLadingByImporter = deployedTradeContract.RequestBillOfLadingByImporter({}, {fromBlock:'latest',toBlock:'latest'});

requestBillOfLadingByImporter.watch(function(error, result){
	logger.info("RequestBillOfLadingByImporter");
	logger.debug("result : "+result);
	storeTransaction(
			parseInt(result.args.assetId),
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.executedBy),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);

	let queryObj = {
			assetId:parseInt(result.args.assetId)
	}

	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			assetStatus:web3.toUtf8(result.args.assetStatus),
			message:web3.toUtf8(result.args.message),
			assetLocation:web3.toUtf8(result.args.assetLocation) // aug7 edit
	}

	storeAssetInfoNew(queryObj, assetInfo);

});



var requestBillOfLadingByImporterPort = deployedTradeContract.RequestBillOfLadingByImporterPort({}, {fromBlock:'latest',toBlock:'latest'});

requestBillOfLadingByImporterPort.watch(function(error, result){
	logger.info("requestBillOfLadingByImporterPort");
	logger.debug("result : "+result);
	storeTransaction(
			parseInt(result.args.assetId),
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.executedBy),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);

	let queryObj = {
			assetId:parseInt(result.args.assetId)
	}

	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			assetStatus:web3.toUtf8(result.args.assetStatus),
			message:web3.toUtf8(result.args.message),
			assetLocation:web3.toUtf8(result.args.assetLocation) // aug7 edit
	}

	storeAssetInfoNew(queryObj, assetInfo);

});


var finalValidationAtImporterPort = deployedTradeContract.FinalValidationAtImporterPort({}, {fromBlock:'latest',toBlock:'latest'});

finalValidationAtImporterPort.watch(function(error, result){
	logger.info("finalValidationAtImporterPort");
	logger.debug("result : "+result);

	storeTransaction(
			parseInt(result.args.assetId),
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.executedBy),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);
	let queryObj = {
			assetId:parseInt(result.args.assetId)
	}

	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			assetStatus:web3.toUtf8(result.args.assetStatus),
			message:web3.toUtf8(result.args.message),
			assetLocation:web3.toUtf8(result.args.assetLocation) // aug7 edit
	}

	storeAssetInfoNew(queryObj, assetInfo);
});



//added aug 8 
var documentUploadByImporter = deployedTradeContract.DocumentUploadByImporter({}, {fromBlock:'latest',toBlock:'latest'});

documentUploadByImporter.watch(function(error, result){
	logger.info("validateAtImporter");
	logger.debug("result : "+result);

	storeTransaction(
			parseInt(result.args.assetId),
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.assetLocation),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);

	let queryObj = {
			assetId:parseInt(result.args.assetId)
	}

	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			assetStatus:web3.toUtf8(result.args.assetStatus),
			message:web3.toUtf8(result.args.message),
			assetLocation:web3.toUtf8(result.args.assetLocation) // aug7 edit
	}

	storeAssetInfoNew(queryObj, assetInfo);
});



/*
 * 
 * 	BOL events
 * 
 */

/*
 *  Bol Creation
 * 
 */
var bolCreation = deployedTradeContract.BOLCreation({}, {fromBlock:'latest',toBlock:'latest'});

bolCreation.watch(function(error, result){
	logger.info("BOL Creation event");
	logger.debug("result : "+result);

	storeTransaction(
			parseInt(result.args.assetId),
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.executedBy),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);

	let queryObj = {
			assetId:parseInt(result.args.assetId)
	}

	var block = web3.eth.getBlock(parseInt(result.blockNumber));
	var date_time = block.timestamp;
	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			ownedBy:web3.toUtf8(result.args.ownedBy),
			executedBy:web3.toUtf8(result.args.executedBy),
			previousOwner:'',
			txId:result.transactionHash,
			eventName:result.event,
			blockNumber:result.blockNumber,
			timeStamp:date_time
			

	}

	storeBOLInfo(queryObj, assetInfo);

});

/*
 *  Transfer BOL to Exporter Bank
 * 
 */



var bolTransferToExporterBank = deployedTradeContract.BOLTransferToExporterBank({}, {fromBlock:'latest',toBlock:'latest'});

bolTransferToExporterBank.watch(function(error, result){
	logger.info("BOL Transfer to Exporter Bank event");
	logger.debug("result : "+result);

	storeTransaction(
			parseInt(result.args.assetId),
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.executedBy),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);

	let queryObj = {
			assetId:parseInt(result.args.assetId)
	}
/*
	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			ownedBy:web3.toUtf8(result.args.ownedBy),
			executedBy:web3.toUtf8(result.args.executedBy),
			previousOwner:web3.toUtf8(result.args.previousOwner)
				
	}*/
	
	var block = web3.eth.getBlock(parseInt(result.blockNumber));
	var date_time = block.timestamp;
	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			ownedBy:web3.toUtf8(result.args.ownedBy),
			executedBy:web3.toUtf8(result.args.executedBy),
			previousOwner:web3.toUtf8(result.args.previousOwner),
			txId:result.transactionHash,
			eventName:result.event,
			blockNumber:result.blockNumber,
			timeStamp:date_time
			

	}

	storeBOLInfo(queryObj, assetInfo);

});

/*
 *  Transfer BOL to Importer Bank
 * 
 */


var bolTransferToImporterBank = deployedTradeContract.BOLTransferToImporterBank({}, {fromBlock:'latest',toBlock:'latest'});

bolTransferToImporterBank.watch(function(error, result){
	logger.info("BOL Transfer to Importer Bank event");
	logger.debug("result : "+result);

	storeTransaction(
			parseInt(result.args.assetId),
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.executedBy),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);

	let queryObj = {
			assetId:parseInt(result.args.assetId)
	}

	var block = web3.eth.getBlock(parseInt(result.blockNumber));
	var date_time = block.timestamp;
	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			ownedBy:web3.toUtf8(result.args.ownedBy),
			executedBy:web3.toUtf8(result.args.executedBy),
			previousOwner:web3.toUtf8(result.args.previousOwner),
			txId:result.transactionHash,
			eventName:result.event,
			blockNumber:result.blockNumber,
			timeStamp:date_time
			

	}

	storeBOLInfo(queryObj, assetInfo);

});

/*
 *  Transfer BOL to Importer
 * 
 */

var bolTransferToImporter = deployedTradeContract.BOLTransferToImporter({}, {fromBlock:'latest',toBlock:'latest'});

bolTransferToImporter.watch(function(error, result){
	logger.info("BOL Transfer to Importer event");
	logger.debug("result : "+result);

	storeTransaction(
			parseInt(result.args.assetId),
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.executedBy),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);

	let queryObj = {
			assetId:parseInt(result.args.assetId)
	}

	var block = web3.eth.getBlock(parseInt(result.blockNumber));
	var date_time = block.timestamp;
	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			ownedBy:web3.toUtf8(result.args.ownedBy),
			executedBy:web3.toUtf8(result.args.executedBy),
			previousOwner:web3.toUtf8(result.args.previousOwner),
			txId:result.transactionHash,
			eventName:result.event,
			blockNumber:result.blockNumber,
			timeStamp:date_time
			

	}

	storeBOLInfo(queryObj, assetInfo);

});



/*
 *  Transfer BOL to Importer Port
 * 
 */

var bolTransferToImporterPort = deployedTradeContract.BOLTransferToImporterPort({}, {fromBlock:'latest',toBlock:'latest'});

bolTransferToImporterPort.watch(function(error, result){
	logger.info("BOL Transfer to Importer Port event");
	logger.debug("result : "+result);

	storeTransaction(
			parseInt(result.args.assetId),
			result.transactionHash,
			result.event,
			web3.toUtf8(result.args.executedBy),
			result.blockNumber   // edit August6 7:25pm -- spelling of blocknumber for all events
	);

	let queryObj = {
			assetId:parseInt(result.args.assetId)
	}

	var block = web3.eth.getBlock(parseInt(result.blockNumber));
	var date_time = block.timestamp;
	let assetInfo = {
			assetId:parseInt(result.args.assetId),
			ownedBy:web3.toUtf8(result.args.ownedBy),
			executedBy:web3.toUtf8(result.args.executedBy),
			previousOwner:web3.toUtf8(result.args.previousOwner),
			txId:result.transactionHash,
			eventName:result.event,
			blockNumber:result.blockNumber,
			timeStamp:date_time
			

	}

	storeBOLInfo(queryObj, assetInfo);

});


//************************* API Starts Here *****************************


/**
 * API to induce cash flow
 * @param {string} cashFlow	- exporter name
 * @returns {message} message
 *  @returns {Name} Name
 *   @WalletAddress {Name} WalletAddress
 */
app.post('/cashFlow',function(request, response){
	logger.info("cashFlow");

	web3.personal.unlockAccount(importerWalletAddress,importerWalletPassword);

	var transactionId = (deployedRolesContract['cashFlow'](mtkContractAddress,{from: importerWalletAddress, gas: 4000000}));
	logger.info("Cash Flow induction successfull");
	logger.debug("Transaction Completed Successfully with Txid:"+transactionId);

	response.send({
		"txId":transactionId
	});
});

/*
#################################################################################################################################################
Register Importer
#################################################################################################################################################
*/

app.post('/registerImporter', function(request, response) {
	logger.info("registerImporter");
	var importerName = request.query.importerName;
	var importerBankAddress = request.query.importerBankAddress;
	var assignedImporterPort = request.query.assignedImporterPort;
	var city = request.query.city;
	logger.debug("importerName : "+importerName);
	logger.debug("importerBankAddress : "+importerBankAddress);
	logger.debug("assignedImporterPort : "+assignedImporterPort);

	web3.personal.unlockAccount(importerWalletAddress,importerWalletPassword);

	var transactionId = (deployedRolesContract['registerImporter'](importerName,importerBankAddress,assignedImporterPort,city,{from: importerWalletAddress, gas: 4000000}));
	logger.debug("transactionId : "+transactionId);

	var record={
		Name:importerName,
		walletAddress:importerWalletAddress
	}

	tradeFinanceLoginDB.collection("login").insertOne(record, function(err, res) {
        if (err) throw err;
        logger.debug("Transaction record inserted ....");
	});

	
	
	logger.info("initToken");
	var name = "MphasisToken";
	var symbol = "MTK";
	var decimals = 18;
	var totalSupply = 1000000000;
	

	logger.debug("name : "+name);
	logger.debug("symbol : "+symbol);
	logger.debug("decimals : "+decimals);
	logger.debug("totalSupply : "+totalSupply);
	
	var transactionIdToken = deployedMTKContract["init"](name, symbol, decimals, totalSupply,{from: importerWalletAddress, gas: 4000000});
	logger.debug("transactionIdToken : "+transactionIdToken);

	response.send({
		"txId":transactionId
	});
});	


/*
#################################################################################################################################################
Login Importer
#################################################################################################################################################
*/


/**
 * API to login
 * @param {string} importerName	- Importer name
 * @returns {message} message
 *  @returns {Name} Name
 *   @WalletAddress {Name} WalletAddress
 */
app.post('/login',function(request, response){
	logger.info("login");
	var importerName = request.query.importerName;
	
	tradeFinanceLoginDB.collection("login").find({Name:importerName}).toArray(function(err, record) {
		if (err) throw err;
	  //  jsonResponse.push(record.reverse());
		var listLength=record.length;
		if(listLength!=0){
			
	
			response.send({
					"message":"Existing",
					"Name":record[0].Name,
					"WalletAddress":record[0].walletAddress

				
			});
		}
		else {
			
				
			

	response.send({
		"message":"NotExisting",
		"Name":"",
		"WalletAddress":""
	});

		}
	
	});
	
});

/*
#################################################################################################################################################
Create Agreement
#################################################################################################################################################
 */

/**
 * @function createAgreement
 * @param {string} assetName - asset name 
 * @param {string} assetDescription - asset description
 * @param {int} quantity - quantity
 * @param {string} unit - unit
 * @param {int} price - price
 * @param {string} importer - importer name
 * @param {address} importerBankAddress - importer bank address
 * @param {string} importerBankName - importer bank name
 * @param {string} importerPortName - importer port name
 * @returns {txId} txId - transaction id 
 * 
 */


app.post('/createAgreement', function(request, response) {

	logger.info("create agreement");
	var assetName = request.query.assetName;
	var assetDescription = request.query.assetDescription;
	var quantity = request.query.quantity;
	var unit = request.query.unit;
	var price = request.query.price;
	var importer = request.query.importer;
	var exporter = request.query.exporter;

	logger.debug("assetName  : "+assetName);
	logger.debug("assetDescripion  : "+assetDescription);
	logger.debug("quantity : "+quantity);
	logger.debug("unit : "+unit);
	logger.debug("price : "+price);
	logger.debug("exporter : "+importer);

	logger.info("unlock account : "+importerWalletAddress);
	web3.personal.unlockAccount(importerWalletAddress,importerWalletPassword);
	
	var transactionId = (deployedSalesContract['createAgreement'](assetName,assetDescription,parseInt(quantity),unit,parseInt(price),importer,exporter,rolesContractAddress,{from: importerWalletAddress, gas: 4000000}));
	logger.debug("transactionId : "+transactionId);
	response.send({
		"txId":transactionId
	});

});	


/*
#################################################################################################################################################
Update Agreement
#################################################################################################################################################
 */

/**
 * @function updateAgreement
 * @param {int} agreementId - agreementId
 * @param {string} unit - unit
 * @param {int} price - price
 * @param {string} importer - importer name
 * @param {address} importerBankAddress - importer bank address
 * @param {string} importerBankName - importer bank name
 * @param {string} importerPortName - importer port name
 * @returns {txId} txId - transaction id 
 * 
 */

app.post('/updateAgreement', function(request, response) {

	logger.info("update agreement");
	var agreementId = request.query.agreementId;
	var importerBankAddress = request.query.importerBankAddress;
	var importerBankName = request.query.importerBankName;
	var importerPortName = request.query.importerPortName;
	var deliveryDate = request.query.deliveryDate;

	logger.debug("agreementId  : "+agreementId);


	logger.info("unlock account : "+importerWalletAddress);
	web3.personal.unlockAccount(importerWalletAddress,importerWalletPassword);
	var transactionId = (deployedSalesContract['updateAgreement'](agreementId,rolesContractAddress,importerBankAddress,importerBankName,importerPortName,deliveryDate,{from: importerWalletAddress, gas: 4000000}));
	logger.debug("transactionId : "+transactionId);
	response.send({
		"txId":transactionId
	});

});	
/*
#################################################################################################################################################
 Get Trader Path
#################################################################################################################################################
 */

/**
 * @function getTradePath
 */
app.get('/getTradePath', function(request, response) {

	var assetId = request.query.assetId;
	logger.debug("assetId : "+assetId);

	var getTradePath = (deployedTradeContract['getTradePath'](parseInt(assetId)));
	logger.debug("get Trader Path : "+getTradePath);
	
	response.send({
		"assetId":assetId,
		"exporterName":web3.toUtf8(getTradePath[0]),
		"importerName":web3.toUtf8(getTradePath[1]),
		"exporterPortName":web3.toUtf8(getTradePath[2]),
		"importerPortName":web3.toUtf8(getTradePath[3])

	});
});




/*
#################################################################################################################################################
 Get Bank Details by Offer ID
#################################################################################################################################################
 */

/**
 * @function getBankDetailsByOfferId
 */
app.get('/getBankDetailsByOfferId', function(request, response) {

	var offerId = request.query.offerId;
	logger.debug("offerId : "+offerId);

	var getBankDetails = (deployedSalesContract['getSalesAgreementBankDetails'](parseInt(offerId)));
	logger.debug("get Bank Details : "+getBankDetails);
	
	
	response.send({
		"offerId":offerId,
		"exporterBank":getBankDetails[0],
		"importerBank":getBankDetails[1],
		"exporterBankName":web3.toUtf8(getBankDetails[2]),
		"importerBankName":web3.toUtf8(getBankDetails[3])

	});
});




/*
#################################################################################################################################################
 Get All Importer Ports
#################################################################################################################################################
*/

/**
 * API to get all importer ports
 * @return {JSONArray} importer_port_list list of exporterPorts
 */
app.get('/getAllImporterPorts', function(request, response) {

	logger.info("getAllImporterPorts");
	var importerPortList=[];
    var importerPortListObject={};
    
    var getAllImporterPortList = (deployedRolesContract['getAllImporterPorts']());
	
	var importerPortListLength=getAllImporterPortList.length;


	for(var index=0;index<importerPortListLength;index++){
		var importerPortName=getAllImporterPortList[index];
		
		var getImporterPortDetails = (deployedRolesContract['getImporterPortInfo'](importerPortName));
		logger.debug("importer port info : "+JSON.stringify(getImporterPortDetails));


		importerPortListObject={
			"importerPort":web3.toUtf8(importerPortName),
			"importerPortAddress":getImporterPortDetails[0]
		}

		importerPortList.push(importerPortListObject);
	}
	logger.debug("importer Port list : "+JSON.stringify(importerPortList));
	response.send({
		"importer_port_list":importerPortList
	});


});	

/*
#################################################################################################################################################
 Get All Importers
#################################################################################################################################################
 */

/**
 * API to get all importers
 * @return {JSONArray} importer_list list of importers
 */
app.get('/getAllImporters', function(request, response) {

	logger.info("getAllImporters");
	var importerList=[];
	var importerListObject={};

	var getAllImportersList = (deployedRolesContract['getAllImporters']());

	var importerListLength=getAllImportersList.length;


	for(var index=0;index<importerListLength;index++){
		var importerName=getAllImportersList[index];

		importerListObject={
				"importer":web3.toUtf8(importerName)
		}

		importerList.push(importerListObject);
	}
	logger.debug("importer list : "+JSON.stringify(importerList));
	response.send({
		"importer_list":importerList
	});


});	/*
#################################################################################################################################################
 Get All Exporters
#################################################################################################################################################
 */

/**
 * API to get all exporters
 * @return {JSONArray} exporter_list list of exporters
 */
app.get('/getAllExporters', function(request, response) {

	logger.info("getAllExporters");
	var exporterList=[];
	var exporterListObject={};

	var getAllExportersList = (deployedRolesContract['getAllExporters']());

	var exporterListLength=getAllExportersList.length;


	for(var index=0;index<exporterListLength;index++){
		var exporterName=getAllExportersList[index];

		exporterListObject={
				"exporter":web3.toUtf8(exporterName)
		}

		exporterList.push(exporterListObject);
	}
	logger.debug("exporter list : "+JSON.stringify(exporterList));
	response.send({
		"exporter_list":exporterList
	});


});	
/*
#################################################################################################################################################
 Get Importer Details by Importer Name
#################################################################################################################################################
*/


app.get('/getImporterInfoByImporterName', function(request, response) {

	logger.info("getImporterInfoByImporterName");
	var importerName = request.query.importerName;
	logger.debug("importerName : "+importerName);
	
	var getImporterInfoDetails = (deployedContract['getImporterInfo'](importerName));
	logger.debug("getImporterInfoDetails : "+getImporterInfoDetails);
	response.send({
		"importerName":importerName,
		"importerAddress":getImporterInfoDetails[0],
		"isImporterRegsitered":getImporterInfoDetails[1]
	});
});	


/*
#################################################################################################################################################
Accept an Offer
#################################################################################################################################################
*/


app.post('/acceptOffer', function(request, response) {
	logger.info("acceptOffer");
	var offerId = request.query.offerId;
	var importerName = request.query.importerName;
	var deliveryDate = request.query.deliveryDate;
	var importerBankAddress = request.query.importerBankAddress;
	var importerBankName = request.query.importerBankName;
	var importerPortName = request.query.importerPortName;
	
	logger.debug("offerId : "+offerId);
	logger.debug("importerName : "+importerName);

	web3.personal.unlockAccount(importerWalletAddress,importerWalletPassword);

	var transactionId = (deployedSalesContract['acceptOffer'](parseInt(offerId),rolesContractAddress,importerName,parseInt(deliveryDate),importerBankAddress,importerBankName,importerPortName,{from: importerWalletAddress, gas: 4000000})); //

	logger.debug("Accept created Successfully");
	logger.debug("Transaction Completed Successfully with Txid:"+transactionId);

	response.send({
		"txId":transactionId
	});

});	

/*
#################################################################################################################################################
validate Agreement for offer ID ---- To be edited ----agreementDocumentHash with ipfs hash
#################################################################################################################################################
*/

// aug7 edit inclusion of additional variables to satusfy smart contract

app.post('/validateAgreement', function(request, response) {

	logger.info("validateAgreement");
	
	var agreementId = request.body.agreementId;
	
	var importerName=request.body.importerName;
	logger.debug("agreementId : "+agreementId);



	
	try{
		const files=[
			{
				path: request.files.agreementDocument.name,
				content: request.files.agreementDocument.data
			}
			]
		var fileHash=[];
		ipfs.files.add(files, (err, filesAdded) => {

			var agreementDocumentHash = filesAdded[0].hash;

			web3.personal.unlockAccount(importerWalletAddress,importerWalletPassword);
			var transactionId = (deployedSalesContract['validateAgreement'](parseInt(agreementId),agreementDocumentHash,{from: importerWalletAddress, gas: 4000000}));
			logger.debug("Agreement validated Successfully");
			logger.debug("Transaction Completed Successfully with Txid:"+transactionId);
			
			response.send({
				"txId":transactionId
			});

			//response.redirect(307,"http://172.21.80.75:8080/Importer/UploadDocs?UserName="+importerName);
		});
	}catch(e){
		logger.error("error in validateAgreement : "+e);
	}
});	

/*
#################################################################################################################################################
Validate At Exporter Port  -- aug 8 edit addition of method
#################################################################################################################################################
*/

app.post('/validateAtExporterPort', function(request, response) {
	logger.info("validateAtExporterPort");
	var assetId = request.query.assetId;
	logger.debug("assetId : "+assetId);

	web3.personal.unlockAccount(importerWalletAddress,importerWalletPassword);

	var transactionId = (deployedTradeContract['validateAtExporterPort'](parseInt(assetId),{from: importerWalletAddress, gas: 4000000})); //aug 8 edit deployedContract --> deployedTradeContract
	logger.debug("Validation Successfull");
	logger.debug("Transaction Completed Successfully with Txid :"+transactionId);
	response.send({
		"txId":transactionId
	});
});	

/*
#################################################################################################################################################
 Get Exporter Port Validation Details by Asset ID  // added aug 8
#################################################################################################################################################
*/

/**
 * @function getExporterPortValidationDetails
 */
app.get('/getExporterPortValidationDetails', function(request, response) {

	var assetId = request.query.assetId;
	logger.debug("assetId : "+assetId);

	var getExporterPortValidationDetails = (deployedTradeContract['getExporterPortValidationDetails'](parseInt(assetId)));
	logger.debug("validation Details : "+getExporterPortValidationDetails);
	
	response.send({
		"assetId":assetId,
		"isValidatedByExporter":getExporterPortValidationDetails[0],
		"isValidatedByExporterPort":getExporterPortValidationDetails[1],
		"isValidatedByImporter":getExporterPortValidationDetails[2],
		"isValidated":getExporterPortValidationDetails[3]

	});
});

/*
#################################################################################################################################################
Validate At Importer 
#################################################################################################################################################
*/

app.post('/validateAtImporter', function(request, response) {
	logger.info("validateAtImporter");
	var assetId = request.query.assetId;
	logger.debug("assetId : "+assetId);
	
	web3.personal.unlockAccount(importerWalletAddress,importerWalletPassword);
	var transactionId = (deployedTradeContract['validateAtImporter'](parseInt(assetId),salesContractAddress,mtkContractAddress,{from: importerWalletAddress, gas: 4000000}));  //deployedContract to deployed trade contract
	
	logger.debug('Validation Completed Successfully...');
	logger.debug("Transaction Completed Successfully with Txid :"+transactionId);
	response.send({
		"txId":transactionId
	});
});	

/*
#################################################################################################################################################
Validate At Importer Port --aug 8 edit
#################################################################################################################################################
*/

app.post('/validateAtImporterPort', function(request, response) {
	logger.info("validateAtImporterPort");
	var assetId = request.query.assetId;
	logger.debug("assetId");

	web3.personal.unlockAccount(importerWalletAddress,importerWalletPassword);

	var transactionId = (deployedTradeContract['validateAtImporterPort'](parseInt(assetId),{from: importerWalletAddress, gas: 4000000})); // deployed Contract -->deployedTradeContract aug8
	logger.debug("transactionId : "+transactionId);


	response.send({
		"txId":transactionId
	});
});


/**
 * @function transferFrom
 * 
 */
app.post('/transferFrom', function(request, response){
	logger.info("transferFrom");
	//var ownerAddress = request.query.ownerAddress;
	var spenderAddress = request.query.spenderAddress;
	var spenderPassword = request.query.spenderPassword;
	var value = request.query.value;
	web3.personal.unlockAccount(importerWalletAddress,importerWalletPassword);

	//web3.personal.unlockAccount(ownerAddress, "password");
	
	var transactionId = (deployedMTKContract['transfer'](spenderAddress, value, {from: importerWalletAddress, gas: 4000000}));
	logger.debug("trasnactionId : "+transactionId);
	response.send({
		txId:transactionId
	});

});
/*
#################################################################################################################################################
 Get Port Validation Details by Asset ID  // added aug 8
#################################################################################################################################################
*/

/**
 * @function getPortValidationDetailsByAssetId
 */
app.get('/getPortValidationDetailsByAssetId', function(request, response) {

	var assetId = request.query.assetId;
	logger.debug("assetId : "+assetId);
	
	var getExporterPortValidationDetails = (deployedTradeContract['getExporterPortValidationDetails'](parseInt(assetId)));

	var getImporterPortValidationDetails = (deployedTradeContract['getImporterPortValidationDetails'](parseInt(assetId)));
	logger.debug("validation Details : "+getExporterPortValidationDetails);
	
	response.send({
		"assetId":assetId,
		"isValidatedByExporter":getExporterPortValidationDetails[0],
		"isValidatedByExporterPort":getExporterPortValidationDetails[1],
		"isValidatedByImporter":getExporterPortValidationDetails[2],
		"isValidatedExporterPort":getExporterPortValidationDetails[3],
		"isValidatedByExporterAtImporterPort":getImporterPortValidationDetails[0],
		"isValidatedByImporterPort":getImporterPortValidationDetails[1],
		"isValidatedByImporterAtImporterPort":getImporterPortValidationDetails[2],
		"isValidatedImporterPort":getImporterPortValidationDetails[3]

	});
});
/*
#################################################################################################################################################
Update Asset Location of Asset by assetId
#################################################################################################################################################
*/


app.post('/updateAssetArrival', function(request, response) {

	logger.info("updateAssetArrival");
	var assetId = request.query.assetId;
	logger.debug("assetId : "+assetId);
	
	web3.personal.unlockAccount(importerWalletAddress,importerWalletPassword);
	var transactionId = (deployedTradeContract['updateAssetArrival'](parseInt(assetId),{from: importerWalletAddress, gas: 4000000}));  //aug 8 edit
	logger.debug("Location Updated successfully..");
	logger.info("Transaction Completed Successfully with Txid:"+transactionId);

	response.send({
		"txId":transactionId
	});

});	

/*
#################################################################################################################################################
Update Asset Location of Asset by assetId
#################################################################################################################################################
*/


app.post('/requestBillOfLadingByImporter', function(request, response) {

	logger.info("requestBillOfLadingByImporter");
	var assetId = request.query.assetId;
	logger.debug("assetId : "+assetId);
	
	web3.personal.unlockAccount(importerWalletAddress,importerWalletPassword);
	var transactionId = (deployedTradeContract['requestBillOfLadingByImporter'](parseInt(assetId),salesContractAddress,{from: importerWalletAddress, gas: 4000000}));  //aug 8 edit
	logger.debug("BOL Acquired successfully..");
	logger.info("Transaction Completed Successfully with Txid:"+transactionId);

	response.send({
		"txId":transactionId
	});

});	





/*
#################################################################################################################################################
Document Upload By Importer
#################################################################################################################################################
*/

app.post('/documentUploadByImporter', function(request, response) {
	logger.info("documentUploadByImporter");
	var assetId = request.body.assetId;
	var importerName= request.body.importerNameValue;
	logger.debug("assetId : "+assetId);
	
	try{

		const files=[
			{
				path: request.files.goodsReceived.name,
				content: request.files.goodsReceived.data
			}
		]
		var fileHash=[];
		ipfs.files.add(files, (err, filesAdded) => {
			var goodsReceivedHash = filesAdded[0].hash;
			web3.personal.unlockAccount(importerWalletAddress,importerWalletPassword);
			var transactionId = (deployedTradeContract['documentUploadByImporter'](parseInt(assetId),goodsReceivedHash,{from: importerWalletAddress, gas: 4000000}));  //deployedCotract --> deployedTradeContract
			logger.debug('Document Uploaded Successfully...');
			logger.info("Transaction Completed Successfully with Txid :"+transactionId);
			response.send({
				"txId":transactionId
			});
		//	response.redirect(307,"http://172.21.80.75:8080/Importer/UploadGoodsDoc?UserName="+importerName); //august 8 --edit
		});
	}catch(e){
		logger.error("error in documentUploadByImporter");
	}
});





/*
#################################################################################################################################################
 Get Trader Path
#################################################################################################################################################
 */

/**
 * @function getTradePath
 */
app.get('/getTradePath', function(request, response) {

	var assetId = request.query.assetId;
	logger.debug("assetId : "+assetId);

	var getTradePath = (deployedTradeContract['getTradePath'](parseInt(assetId)));
	logger.debug("get Trader Path : "+getTradePath);
	
	response.send({
		"assetId":assetId,
		"exporterName":web3.toUtf8(getTradePath[0]),
		"importerName":web3.toUtf8(getTradePath[1]),
		"exporterPortName":web3.toUtf8(getTradePath[2]),
		"importerPortName":web3.toUtf8(getTradePath[3])

	});
});




/*
#################################################################################################################################################
 Get Bank Details by Offer ID
#################################################################################################################################################
 */

/**
 * @function getBankDetailsByOfferId
 */
app.get('/getBankDetailsByOfferId', function(request, response) {

	var offerId = request.query.offerId;
	logger.debug("offerId : "+offerId);

	var getBankDetails = (deployedSalesContract['getSalesAgreementBankDetails'](parseInt(offerId)));
	logger.debug("get Bank Details : "+getBankDetails);
	
	
	response.send({
		"offerId":offerId,
		"exporterBank":getBankDetails[0],
		"importerBank":getBankDetails[1],
		"exporterBankName":web3.toUtf8(getBankDetails[2]),
		"importerBankName":web3.toUtf8(getBankDetails[3])

	});
});

	

/*
#################################################################################################################################################
 Get Offer Info
#################################################################################################################################################
*/

/**
 * @function getOffer
 * @param {int} offerId - offer id 
 * @returns {int} offerId - offer id 
 * @returns {string} assetName - asset name
 * @returns {string} assetDescription - assetDescription
 * @returns {string} quantity - quantity
 * @returns {int} price - price
 * @returns {string} unit - unit
 * @returns {string} exporter - exporter name
 * @returns {address} exporterAddress - exporter wallet address
 */
app.get('/getOffer', function(request, response) {

	var offerId = request.query.offerId;
	logger.debug('Fetching....');
	logger.info('Fetching Offer Details for ID:'+offerId);


	var getOfferDetails = (deployedSalesContract['getOffer'](parseInt(offerId)));
	var getDetails = (deployedSalesContract['getTradersFromAgreement'](parseInt(offerId)));
	   
	
	console.log("");
	logger.debug("printing offer details : "+getOfferDetails);
	response.send({
		"offerId":offerId,
		"assetName":web3.toUtf8(getOfferDetails[0]),
		"assetDescription":web3.toUtf8(getOfferDetails[1]),
		"quantity":parseInt(getOfferDetails[2]),
		"price":parseInt(getOfferDetails[3]),
		"unit":web3.toUtf8(getOfferDetails[4]),
		"exporter":web3.toUtf8(getOfferDetails[5]),
		"importerName":web3.toUtf8(getDetails[1]),
		"exporterAddress":getOfferDetails[6]
	});
});	

/*
#################################################################################################################################################
 Get Offer Details
#################################################################################################################################################
 */

/**
 * @function getOfferDetails
 * @param {int} offerId
 * @returns {int} offerId - offerId
 * @returns {string} message - message
 * @returns {string} offerStatus - offer status 
 * @returns {int} createdAt - offer creation time 
 */
app.get('/getOfferDetails', function(request, response) {
	logger.info("getOfferDetails");
	var offerId = request.query.offerId;
	logger.debug('Fetching Offer Details for ID:'+offerId);

	var getOfferDetails = (deployedSalesContract['getOfferStatus'](parseInt(offerId)));
	console.log("");
	response.send({
		"offerId":offerId,
		"message":web3.toUtf8(getOfferDetails[0]),
		"offerStatus":web3.toUtf8(getOfferDetails[1]),
		"createdAt":parseInt(getOfferDetails[2]),
		"agreementId":parseInt(getOfferDetails[3]),
		"assetId":parseInt(getOfferDetails[4])
		
	});
	
});


/*
#################################################################################################################################################
 Get Offer Entities
#################################################################################################################################################
 */

/**
 * @function getOfferEntities
 * @param {int} offerId
 * @returns {int} offerId - offerId
 * @returns {string} message - message
 * @returns {string} offerStatus - offer status 
 * @returns {int} createdAt - offer creation time 
 */
app.get('/getOfferEntities', function(request, response) {
	logger.info("getOfferEntities");
	var offerId = request.query.offerId;
	logger.debug('Fetching Offer Details for ID:'+offerId);

	var getOfferDetails = (deployedSalesContract['getOfferEntities'](parseInt(offerId)));
	console.log("");
	
	response.send({
		"offerId":offerId,
		"exporterBankName":web3.toUtf8(getOfferDetails[0]),
		"importerName":web3.toUtf8(getOfferDetails[1]),
		"exporterPortName":web3.toUtf8(getOfferDetails[2]),
		"deliveryDate":parseInt(getOfferDetails[3]),
		"importerBankName":web3.toUtf8(getOfferDetails[4]),
		"importerPortName":web3.toUtf8(getOfferDetails[5]),
		
	});
	
});

/*
#################################################################################################################################################
 Get Offer Details
#################################################################################################################################################
 */

/**
 * @function getOfferDetails
 * @param {int} offerId
 
 */
app.get('/getOfferDetailsForOrder', function(request, response) {
	logger.info("getOfferDetails");
	var jsonResponse = {};
	var jsonResponseList = [];
	//var offerId = request.query.offerId;
	//logger.debug('Fetching Offer Details for ID:'+offerId);
	tradeFinanceDataDB.collection("offers").find({}).toArray(function(err, record) {
		var totalRecLength=record.length;
		console.log(totalRecLength);
		for (var i=0;i<totalRecLength;i++){
		var getOfferDetails = (deployedSalesContract['getOfferStatus'](parseInt(record[i].agreementId)));
		var getOfferVal = (deployedSalesContract['getOffer'](parseInt(record[i].agreementId)));
		var getOfferEntities = (deployedSalesContract['getOfferEntities'](parseInt(record[i].agreementId)));
		var getDetails = (deployedSalesContract['getTradersFromAgreement'](record[i].agreementId));

	
		console.log("");
		jsonResponse={
			"offerId":parseInt(record[i].agreementId),
			"agreementId":parseInt(record[i].agreementId),
			"message":web3.toUtf8(getOfferDetails[0]),
			"offerStatus":web3.toUtf8(getOfferDetails[1]),
			"createdAt":parseInt(getOfferDetails[2]),
			"assetName":web3.toUtf8(getOfferVal[0]),
			"importerName":web3.toUtf8(getOfferVal[5]),
			"exporterBankName":web3.toUtf8(getOfferEntities[0]),
			"importerName":web3.toUtf8(getDetails[1]),
			"quantity":parseInt(getOfferVal[2]),
			"unit":web3.toUtf8(getOfferVal[4]),
			"agreementStatus":record[i].agreementStatus
		};
		jsonResponseList.push(jsonResponse);
		}
	});
	setTimeout(function(){
		response.send(jsonResponseList.reverse());
	},2000);
	
});
/*
#################################################################################################################################################
 Get Offer Entities City ---aug 21
#################################################################################################################################################
 */

/**
 * @function getOfferEntitiesCity
 * @param {int} offerId
 * @returns {int} offerId - offerId
 * @returns {string} message - message
 * @returns {string} offerStatus - offer status 
 * @returns {int} createdAt - offer creation time 
 */
app.get('/getOfferEntitiesCity', function(request, response) {
	logger.info("getOfferEntities");
	var offerId = request.query.offerId;
	logger.debug('Fetching Offer Details for ID:'+offerId);

	var getOfferDetails = (deployedSalesContract['getOfferEntities'](parseInt(offerId)));
	console.log("");
	
	var getOffer = (deployedSalesContract['getOffer'](parseInt(offerId)));
	
	
		var exporterName=web3.toUtf8(getOffer[5]);

	//response.send({
		//"exporterBankName":web3.toUtf8(getOfferDetails[0]),
		var importerName=web3.toUtf8(getOfferDetails[1]);
		var exporterPortName=web3.toUtf8(getOfferDetails[2]);
		var importerBankName=web3.toUtf8(getOfferDetails[4]);
		var importerPortName=web3.toUtf8(getOfferDetails[5]);
		
//	});
		// exporter City
		var getExporterInfo = (deployedRolesContract['getExporterInfo'](exporterName));
		var exporterCity=web3.toUtf8(getExporterInfo[2]);
		
		//importer City
		var getImporterInfo = (deployedRolesContract['getImporterInfo'](importerName));
		var importerCity=web3.toUtf8(getImporterInfo[2]);
		
		//exporter Port City
		var getExporterPortInfo = (deployedRolesContract['getExporterPortInfo'](exporterPortName));
		var exporterPortCity=web3.toUtf8(getExporterPortInfo[2]);
		
		//importer Port City
		
		var getImporterPortInfo = (deployedRolesContract['getImporterPortInfo'](importerPortName));
		var importerPortCity=web3.toUtf8(getImporterPortInfo[2]);
		
		
		response.send({
			"exporterCity":exporterCity,
			"importerCity":importerCity,
			"exporterPortCity":exporterPortCity,
			"importerPortCity":importerPortCity
		
		});
		
});



/*
#################################################################################################################################################
 Get Asset Details by Asset ID
#################################################################################################################################################
*/

/**
 * @function getAssetDetailsByAssetID
 * 
 */
app.get('/getAssetDetailsByAssetID', function(request, response) {

    var assetId = request.query.assetId;
    logger.debug("assetId : "+assetId);    

    var getAssetDetails = (deployedTradeContract['getAssetDetails'](parseInt(assetId)));
    logger.debug("getAssetDetails : "+getAssetDetails);
    
    response.send({
    	"assetId":assetId,
    	"assetName":web3.toUtf8(getAssetDetails[0]),
    	"offerId":parseInt(getAssetDetails[1]),
    	"quantity":parseInt(getAssetDetails[2]),
    	"units":web3.toUtf8(getAssetDetails[3]),
    	"assetStatus":web3.toUtf8(getAssetDetails[4]),
    	"assetLocation":getAssetDetails[5],
    	"message":web3.toUtf8(getAssetDetails[6])
    });

});	


/*
#################################################################################################################################################
 Get Trade Path by Asset ID
#################################################################################################################################################
*/

/**
 * @function getTradersByAssetID
 */
app.get('/getTradersByAssetID', function(request, response) {

	var assetId = request.query.assetId;
	logger.debug("assetId : "+assetId);

	var getTradePath = (deployedTradeContract['getTradePath'](parseInt(assetId)));
	logger.debug("trade path : "+getTradePath);
	
	response.send({
		"assetId":assetId,
		"exporter":web3.toUtf8(getTradePath[0]),
		"importer":web3.toUtf8(getTradePath[1]),
		"exporterPort":web3.toUtf8(getTradePath[2]),
		"importerPort":web3.toUtf8(getTradePath[3]),
		"shipperName":web3.toUtf8(getTradePath[4])
		
	});
});	




/*
#################################################################################################################################################
 Get Asset Documents by Asset ID
#################################################################################################################################################
*/

/**
 * @function getAssetDocumentsByAssetID
 */
app.get('/getAssetDocumentsByAssetID', function(request, response) {

	var assetId = request.query.assetId;
	logger.debug("assetId : "+assetId);

	var getAssetDocuments = (deployedTradeContract['getAssetDocuments'](parseInt(assetId)));
	logger.debug("asset documents : "+getAssetDocuments);

	response.send({
		"assetId":assetId,
		"locHash":getAssetDocuments[0],
		"insuranceHash":getAssetDocuments[1],
		"packagingListHash":getAssetDocuments[2],
		"customDocsHash":getAssetDocuments[3],
		"goodsReceivedHash":getAssetDocuments[4]

	});
});



/*
#################################################################################################################################################
 Get Sales Agreement
#################################################################################################################################################
 */

/**
 * @function getSalesAgreement
 * @param {int} offerId - offer id
 * 
 */
app.get('/getSalesAgreement', function(request, response) {
	logger.info("getSalesAgreement");
	var agreementId = request.query.agreementId;
	logger.debug("agreementId : "+agreementId);

	var getSalesAgreementDetails = (deployedSalesContract['getSalesAgreement'](parseInt(agreementId)));
	 
	response.send({
		"agreementId":agreementId,
		"exporter":getSalesAgreementDetails[0],
		"importer":getSalesAgreementDetails[1],
		"agreementStatus":web3.toUtf8(getSalesAgreementDetails[2]),
		"message":web3.toUtf8(getSalesAgreementDetails[3]),
		"offerId":parseInt(getSalesAgreementDetails[4])
	});
});	

/*
#################################################################################################################################################
 Get Asset Time
#################################################################################################################################################
 */

/**
 * @function getAssetTime
 * @param {int} assetId

 * @returns {int} createdAt - offer creation time 
 */
app.get('/getAssetTime', function(request, response) {
	logger.info("getAssetTime");
	var assetId = request.query.assetId;
	logger.debug('Fetching Asset Details for ID:'+assetId);

	var getOfferDetails = (deployedTradeContract['getAssetTime'](parseInt(assetId)));
	console.log(parseInt(getOfferDetails));
	response.send({
		
		"createdAt":parseInt(getOfferDetails)
		
		
	});
	
});


/*
#################################################################################################################################################
 Get Sales Agreement Details
#################################################################################################################################################
 */

/**
 * @function getSalesAgreementDetails
 * @param {int} offerId - offer id 
 * 
 * 
 */
app.get('/getSalesAgreementDetails', function(request, response) {

	var agreementId = request.query.agreementId;
	logger.debug("agreementId : "+agreementId);
	var getSalesAgreementDetails = (deployedSalesContract['getSalesAgreementDetails'](parseInt(agreementId)));

	response.send({
		"agreementId":agreementId,
		"isVerifiedByExporter":getSalesAgreementDetails[0],
		"isVerifiedByImporter":getSalesAgreementDetails[1],
		"isTradeReady":getSalesAgreementDetails[2],
		"isVerifiedByExporterBank":getSalesAgreementDetails[3],
		"isVerifiedByImporterBank":getSalesAgreementDetails[4],
		"agreementDocument":getSalesAgreementDetails[5],
		"locDocument":getSalesAgreementDetails[6]
	});
});


/*
#################################################################################################################################################
 Get All Banks
#################################################################################################################################################
*/

/**
 * API to get all banks
 * @return {JSONArray} bank_list list of bank
 */
app.get('/getAllBanks', function(request, response) {

	logger.info("getAllBanks");
	var bankList=[];
    var bankListObject={};
    
    var getAllBankList = (deployedRolesContract['getBankList']());
	
	var bankListLength=getAllBankList.length;


	for(var index=0;index<bankListLength;index++){
		var bankAddress=getAllBankList[index];
		var getBankInfo = (deployedRolesContract['getBankInfo']({from:bankAddress}));

	
		bankListObject={
			"bankAddress":getBankInfo[0],
		"bankName":web3.toUtf8(getBankInfo[1])
		}

		bankList.push(bankListObject);
	}
	logger.debug("bank list : "+JSON.stringify(bankList));
	response.send({
		"bank_list":bankList
	});


});	


/*
#################################################################################################################################################
 Get Physical Address of Bank
#################################################################################################################################################
 */


app.get('/getBankAddress', function(request, response) {
	var bankAddress = request.query.bankAddress;
        logger.debug("bankAddress : "+bankAddress);
	logger.info("getBankAddress");
	  var getBankInfo = (deployedRolesContract['getPhysicalAddressBankAddress'](bankAddress));
        logger.debug("bankInfo : "+JSON.stringify(getBankInfo));
   
        response.send({
                "city":web3.toUtf8(getBankInfo[0]),
                "street":getBankInfo[1],
		"state":getBankInfo[2],
		"zipcode":parseInt(getBankInfo[3]),
		"country":web3.toUtf8(getBankInfo[4])
        });

});

/*
####################################################################################################################################$
 Get Physical Address of Shipper
####################################################################################################################################$
 */


app.get('/getShipperAddress', function(request, response) {
        var shipperAddress = request.query.shipperAddress;
        logger.debug("shipperAddress : "+shipperAddress);
        logger.info("getShipperAddress");
          var getBankInfo = (deployedRolesContract['getShippingDetails'](shipperAddress));
        logger.debug("shipperInfo : "+JSON.stringify(getBankInfo));
   	//logger.debug(web3.toUtf8(getBankInfo[8]));
        response.send({
                "city":web3.toUtf8(getBankInfo[0]),
                "street":getBankInfo[1],
                "state":getBankInfo[2],
                "zipcode":parseInt(getBankInfo[3]),
                "country":web3.toUtf8(getBankInfo[4])
        });

});

/*
####################################################################################################################################$
 Get Shipper and Bank
####################################################################################################################################$
 */


app.get('/getShipperandBank', function(request, response) {
        var assetId = request.query.assetId;
        logger.debug("assetId : "+assetId);
        logger.info("getShipperandBank");
        var getShipperInfo = (deployedTradeContract['getShipperandAgreementId'](parseInt(assetId)));
        logger.debug("shipperInfo : "+JSON.stringify(getShipperInfo));
	var getBankInfo = (deployedSalesContract['getBankAddressByOfferId'](parseInt(getShipperInfo[2])));
	
	logger.debug(JSON.stringify(getBankInfo));
        //logger.debug(web3.toUtf8(getBankInfo[8]));
        response.send({
                "shipperAddress":getShipperInfo[0],
                "ShipperName":web3.toUtf8(getShipperInfo[1]),
                "agreementId":parseInt(getShipperInfo[2]),
                "importerBankAddress":getBankInfo[1]
        });

});


/*
####################################################################################################################################$
 Get Bill Of Lading
####################################################################################################################################$
 */
/**
 * @function getBillOfLading
 */
app.get('/getBillOfLading', function(request, response) {

        var assetId = request.query.assetId;
        logger.debug("assetId : "+assetId);

        var getDetails = (deployedTradeContract['getBillOfLadingDetails'](parseInt(assetId),{from: importerWalletAddress}));
        logger.debug("get Bill of Lading Details : "+getDetails);


        response.send({
                "assetId":parseInt(assetId),
 		"billOfLadingId":parseInt(getDetails)

        });
});

/*
####################################################################################################################################$
 Get Bill Of Lading Owner
####################################################################################################################################$
 */
/**
 * @function getBillOfLadingDetails
 */
app.get('/getBillOfLadingDetails', function(request, response) {

        var assetId = request.query.assetId;
        logger.debug("assetId : "+assetId);

        var getDetails = (deployedTradeContract['getBillOfLading'](parseInt(assetId)));
        logger.debug("get Bill of Lading Details : "+getDetails);


        response.send({
                "assetId":parseInt(assetId),
                "ownedBy":web3.toUtf8(getDetails[0]),
                "uploadedBy":web3.toUtf8(getDetails[1]),
                "createdAt":parseInt(getDetails[2])

        });
});


/**
 * @function getBalance
 * 
 */
app.get('/getBalance',function(request, response){
	logger.info("getBalance");
	var ownerAddress = request.query.ownerAddress;

	var balance = (deployedMTKContract['balanceOf'](ownerAddress));
	logger.info("balance : "+balance);
	response.send({
		balance:balance
	});
});

/**
 * @function getAllowance
 * 
 */
app.get('/getAllowance', function(request, response){
	logger.info("getAllowance");
	var ownerAddress = request.query.ownerAddress;
	var spenderAddress = request.query.spenderAddress;
	logger.debug("ownerAddress : "+ownerAddress);
	logger.debug("spenderAddress : "+spenderAddress);
	
	var allowance = (deployedMTKContract['allowance'](ownerAddress, spenderAddress));
	
	logger.debug("allowance : "+allowance);
	
	response.send({
		allowance:allowance
	});
});

/**
 * @function getAssetTx
 */
app.get('/getAssetTx',function(request, response){
	var assetId = request.query.assetId;
	logger.debug("assetId : "+assetId);
	logger.info("getAssetTx");
	var jsonResponse = {};
	var jsonResponseList = [];
	 var mysort = { timeStamp: 1 };
	 var collectionName="offer_"+assetId;
	 
	//tradeFinanceTxnDB.collection("offer_"+assetId).ensureIndex({transactionHash : 1}, {unique : true, dropDups : true});
	//tradeFinanceTxnDB.collection("offer_"+assetId).ensureIndex({"transactionHash":1}, { unique: true , dropDups: true} );
	tradeFinanceTxnDB.collection("offer_"+assetId).find().sort(mysort).toArray(function(err, record) {
   // tradeFinanceTxnDB.collection("offer_"+assetId).distinct("blockNumber",function(err, record) {

		//  jsonResponse.push(record.reverse());
		jsonResponse={
				"records":record.reverse()
		}
	});


	setTimeout(function(){
		response.send(jsonResponse);
	},1500);
});




/**
 * @function getBOLHistory
 */
app.get('/getBOLHistory',function(request, response){
	var assetId = request.query.assetId;
	logger.debug("assetId : "+assetId);
	logger.info("getAssetTx");
	var jsonResponse = {};
	var jsonResponseList = [];
	 var mysort = { timeStamp: 1 };
	 var collectionName="BOL_"+assetId;
	 
	
	//tradeFinanceTxnDB.collection("offer_"+assetId).ensureIndex({"transactionHash":1}, { unique: true , dropDups: true} );
	//tradeFinanceTxnDB.collection("BOL_"+assetId).find({ eventName: { $in: ['BOLCreation', 'BOLTransferToExporterBank','BOLTransferToImporterBank','BOLTransferToImporter','BOLTransferToImporterPort'] } }).toArray(function(err, record) {
	 BillOfLadingDB.collection("BOL_"+assetId).find().toArray(function(err, record) {

		//  jsonResponse.push(record.reverse());
		jsonResponse={
				"records":record.reverse()
		}
		response.send(jsonResponse);
	});

/*
	setTimeout(function(){
		response.send(jsonResponse);
	},1000);*/
});



/**
 * @function getAssetTxDetails
 */
app.get('/getAssetTxDetails',function(request, response){
	var assetId = request.query.assetId;
	var eventName = request.query.eventName;
	logger.debug("assetId : "+assetId);
	logger.info("getAssetTxDetails");
	var jsonResponse = {};
	var jsonResponseList = [];
	
	 var collectionName="offer_"+assetId;
	 
	
	tradeFinanceTxnDB.collection("offer_"+assetId).find({eventName:eventName}).toArray(function(err, record) {
   // tradeFinanceTxnDB.collection("offer_"+assetId).distinct("blockNumber",function(err, record) {

		//  jsonResponse.push(record.reverse());
		jsonResponse={
				"records":record.reverse()
		}
	});


	setTimeout(function(){
		response.send(jsonResponse);
	},1500);
});

app.get('/getOfferTxDetails',function(request, response){
	var offerId = request.query.offerId;
	var eventName = request.query.eventName;
	logger.debug("agreementId : "+offerId);
	logger.info("getOfferTxDetails");
	var jsonResponse = {};
	var jsonResponseList = [];
	
	 var collectionName="offer_"+offerId;
	 
	
	tradeFinanceTxnDB.collection("offer_"+offerId).find({eventName:eventName}).toArray(function(err, record) {
   // tradeFinanceTxnDB.collection("offer_"+assetId).distinct("blockNumber",function(err, record) {

		//  jsonResponse.push(record.reverse());
		jsonResponse={
				"records":record.reverse()
		}
	});


	setTimeout(function(){
		response.send(jsonResponse);
	},1500);
});



/**
 * 
 * Database api
 * 
 */


/**
 * @function getAllTransactions
 */
app.get('/getAllTransactions',function(request, response){
	logger.info('getAllTransactions');
	var jsonResponse = [];
	var jsonResponseList = [];
	 var mysort = { timeStamp: 1 };
	tradeFinanceTxnDB.listCollections().toArray(function(err, result) {
		if (err) throw err;
		for(var index=0; index<result.length; index++){

			var collectionsName = result[index].name;
			tradeFinanceTxnDB.collection(collectionsName).find().sort(mysort).toArray(function(err, record) {
				if (err) throw err;
				jsonResponse.push(record.reverse());
				

			});
		}
	});

	setTimeout(function(){
		response.send({"records":jsonResponse});
	},2500);
	
});


/**
 * @function getAllAssets
 */
app.get('/getAllAssets',function(request, response){
	logger.info("getAllAssets");
	var jsonResponse = {};
	var jsonResponseList = [];
	tradeFinanceDataDB.collection("assets").find({}).toArray(function(err, record) {
       //  jsonResponse.push(record.reverse());
	  jsonResponse={
		"records":record.reverse()
	}
	  response.send(jsonResponse);
   });
   
   /*
   setTimeout(function(){
	   response.send(jsonResponse);
   },2500);*/
});



/**
 * @function getAllAgreements
 */
app.get('/getAllAgreements',function(request, response){
	logger.info("getAllAgreements");
	var jsonResponse = {};
	var jsonResponseList = [];
	tradeFinanceDataDB.collection("agreements").find({}).toArray(function(err, record) {
        if (err) throw err;
      //  jsonResponse.push(record.reverse());
	  jsonResponse={
		"records":record.reverse()
	}
   });
   
   
   setTimeout(function(){
	   response.send(jsonResponse);
   },2500);
});

/**
 * @function getAgreementTx
 */
app.get('/getAgreementTx',function(request, response){
	var offerId = request.query.offerId;
	logger.debug("offerId : "+offerId);
	logger.info("getOfferTx");
	var jsonResponse = {};
	var jsonResponseList = [];
	 var mysort = { timeStamp: 1 };
	 var collectionName="offer_"+offerId;
	 
	//tradeFinanceTxnDB.collection("offer_"+assetId).ensureIndex({transactionHash : 1}, {unique : true, dropDups : true});
	//tradeFinanceTxnDB.collection("offer_"+assetId).ensureIndex({"transactionHash":1}, { unique: true , dropDups: true} );
	tradeFinanceTxnDB.collection("offer_"+offerId).find().skip(2).limit(6).toArray(function(err, record) {
   // tradeFinanceTxnDB.collection("offer_"+assetId).distinct("blockNumber",function(err, record) {

		//  jsonResponse.push(record.reverse());
		jsonResponse={
				"records":record.reverse()
		}
	});


	setTimeout(function(){
		response.send(jsonResponse);
	},1500);
});

/**
 * @function getAllOffers
 */
app.get('/getAllOffers',function(request, response){
	logger.info("getAllOffers");
	var jsonResponse = {};
	var jsonResponseList = [];
	tradeFinanceDataDB.collection("offers").find({}).toArray(function(err, record) {
		if (err) throw err;
	  //  jsonResponse.push(record.reverse());

	 jsonResponse={
		 "records":record.reverse()
	 }
	 response.send(jsonResponse);
	});
	//response.send(jsonResponse);
	
	/*
	setTimeout(function(){
		response.send(jsonResponse);
	},1300);
	*/
	
	
});


/*
#################################################################################################################################################
 Get Traders From Agreement  by Offer ID
#################################################################################################################################################
 */

/**
 * @function getBankDetailsByOfferId
 */
app.get('/getTradersFromAgreement', function(request, response) {

	var offerId = request.query.offerId;
	logger.debug("offerId : "+offerId);

	var getBankDetails = (deployedSalesContract['getTradersFromAgreement'](parseInt(offerId)));
	logger.debug("get Bank Details : "+getBankDetails);
	   
	
	response.send({
		"offerId":offerId,
		"exporterName":web3.toUtf8(getBankDetails[0]),
		"importerName":web3.toUtf8(getBankDetails[1]),
		"exporterPortName":web3.toUtf8(getBankDetails[2]),
		"importerPortName":web3.toUtf8(getBankDetails[3])

	});
});



app.get('/ipfs', function (req, res) {
    logger.info("ipfs");
    var fileHash = req.query.fileHash;

    //create and ipfs url and return
    logger.debug("fileHash : "+fileHash);

    /*
    ipfs.files.cat(fileHash, function (err, file) {
        if (err) throw err;
        res.send(file);
    });
    */
   res.send({
        ipfsUrl : "http://"+appIpAddress+":8080/ipfs/"+fileHash
    });
});

/**
 * @function getOfferTx
 */
app.get('/getOfferTx',function(request, response){
	var agreementId = request.query.agreementId;
	logger.debug("agreementId : "+agreementId);
	logger.info("getOfferTx");
	var jsonResponse = {};
	var jsonResponseList = [];
	 var mysort = { timeStamp: 1 };
	 var collectionName="offer_"+agreementId;
	 
	//tradeFinanceTxnDB.collection("offer_"+assetId).ensureIndex({transactionHash : 1}, {unique : true, dropDups : true});
	//tradeFinanceTxnDB.collection("offer_"+assetId).ensureIndex({"transactionHash":1}, { unique: true , dropDups: true} );
	tradeFinanceTxnDB.collection("offer_"+agreementId).find().sort(mysort).toArray(function(err, record) {
   // tradeFinanceTxnDB.collection("offer_"+assetId).distinct("blockNumber",function(err, record) {

		//  jsonResponse.push(record.reverse());
		jsonResponse={
				"records":record.reverse()
		}
	});


	setTimeout(function(){
		response.send(jsonResponse);
	},1500);
});
/**
 * @function storeTransaction
 * 
 */
function storeTransaction(offerId, transactionHash, eventName,executedBy, blockNumber){
	logger.info("storeTransaction");
	
	//get time stamp
	
	var block = web3.eth.getBlock(blockNumber);
	var date_time = block.timestamp;
	
	//create record
	var record = {
			offerId:offerId,
			transactionHash:transactionHash,
			eventName:eventName,
			blockNumber:blockNumber,
			executedBy:executedBy,
			timeStamp:date_time
	}
	
	//push record to mongodb
	tradeFinanceTxnDB.collection("offer_"+offerId).insertOne(record, function(err, res) {
        if (err) throw err;
        logger.debug("Transaction record inserted ....");
    });
}


/**
 * @function storeAssetInfo
 */
function storeAssetInfoNew(query, assetData){
	logger.info("storeAssetInfo");
	
	var assetId=assetData.assetId;
	var assetStatus=assetData.assetStatus;
	var message=assetData.message;
	tradeFinanceDataDB.collection("assets").update({ assetId: assetId },{ $set:{assetStatus: assetStatus,message:message}},{upsert: false}, function(err,doc){

	//tradeFinanceDataDB.collection("assets").update(query,assetData,{upsert: true}, function(err,doc){  // offerData with assetData
		if (err) throw err;
		console.log("Record inserted/updated ..");
	});
}
/**
 * @function storeOfferInfo
 */
function storeOfferInfo(query, offerData){
	logger.info("storeOfferInfo");
	tradeFinanceDataDB.collection("offers").update(query,offerData,{upsert: true}, function(err,doc){
        if (err) throw err;
        console.log("Record inserted/updated ..");
	});
}

/**
 * @function storeAssetInfo
 */
function storeAssetInfo(query, assetData){
	logger.info("storeAssetInfo");
	tradeFinanceDataDB.collection("assets").update(query,assetData,{upsert: true}, function(err,doc){  // offerData with assetData
        if (err) throw err;
        console.log("Record inserted/updated ..");
	});
}

/**
 * @function storeAgreementInfo
 */
function storeAgreementInfo(query, agreementData){
	logger.info("storeAgreementInfo");
	tradeFinanceDataDB.collection("agreements").update(query,agreementData,{upsert: true}, function(err,doc){   // replace offerData with agreementData
        if (err) throw err;
        console.log("Record inserted/updated ..");
	});
}

/**
 * @function storeOfferInfo
 */
function storeOfferInfoNew(query, offerData){
	logger.info("storeOfferInfo");
	var agreementId=offerData.agreementId;
	var agreementStatus=offerData.agreementStatus;
	var agreementMessage=offerData.agreementMessage;
	
	//db.products.update({ agreementId: agreementId },{ $set:{agreementStatus: agreementStatus,agreementMessage:agreementMessage}})
	tradeFinanceDataDB.collection("offers").update({ agreementId: agreementId },{ $set:{agreementStatus: agreementStatus,agreementMessage:agreementMessage}},{upsert: false}, function(err,doc){
		if (err) throw err;
		console.log("Record inserted/updated ..");
	});
}

/**
 * @function storeTransaction
 * 
 */
function storeBOLInfo(query, assetData){

	logger.info("storeBOLInfo");
	var assetId=assetData.assetId;
	logger.info("assetId is "+assetId);

	
	//push record to mongodb
	BillOfLadingDB.collection("BOL_"+assetId).insertOne(assetData, function(err, res) {
		if (err) throw err;
		logger.debug("Transaction record inserted ....");
	});
}

/**
 * @function storeTransaction
 * 
 */
function storeTransactionNew(assetId, transactionHash, eventName, executedBy,blockNumber){
	logger.info("storeTransaction");

	logger.info("assetId is "+assetId);

	//get time stamp

	var block = web3.eth.getBlock(blockNumber);
	var date_time = block.timestamp;
	tradeFinanceDataDB.collection("assets").find({assetId:assetId}).toArray(function(err, recordOne) {
		var exporterName=recordOne[0].exporterName;

		
	//create record
	var record = {
			assetId:assetId,
			transactionHash:transactionHash,
			eventName:eventName,
			blockNumber:blockNumber,
			executedBy:exporterName,
			timeStamp:date_time
	}

	//push record to mongodb
	tradeFinanceTxnDB.collection("offer_"+assetId).insertOne(record, function(err, res) {
		if (err) throw err;
		logger.debug("Transaction record inserted ....");
	});
	});
}


/**
 * application configuration
 */
app.listen(appPort, appIP,function () {
    logger.info("Server started and serving at IP : "+appIP+", Port : "+appPort);
});

