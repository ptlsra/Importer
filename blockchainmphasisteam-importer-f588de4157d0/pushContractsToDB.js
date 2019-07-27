const Web3 = require('web3');
const express = require('express');
var app = express();
var fs = require('fs');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var mongoUrl = "mongodb://127.0.0.1:27017/";

var solidityFileList        = ["Roles.sol","SalesContract.sol","TradeFinance.sol","MTK.sol"];
var solidityJsonFileList    = ["Roles.json","SalesContract.json","TradeFinance.json","MTK.json"];
var contractNameList        = ["Roles","SalesContract","TradeFinance","MphasisToken"];
var contractAddresses=[];

let rawdata = fs.readFileSync('./contractAddresses.json');
let contractsData = JSON.parse(rawdata);
console.log(JSON.stringify(contractsData));


console.log("************* fetched contract address from config file ****************");


function pushContractToDB(solidityFileName, solidityJsonfileName, contractName, contractAddress, abi){
    var MongoClient = require('mongodb').MongoClient;
    var url = mongoUrl+"blockchaindb";
    MongoClient.connect(mongoUrl, function(err, db) {
        if (err) throw err;
        var blockchaindb = db.db("blockchaindb");
        console.log("************ connected to mongodb client at localhost *************");
        console.log("************ storing record **********");
        let myobj = {contractAddress:contractAddress, contractName:contractName, abi:abi};
        var collectionName = "contracts";
        blockchaindb.collection(collectionName).insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("contract abi pushed to mongodb ....");
            //console.log(res);
            db.close();
        });
    });

}









var rolesContractSource = fs.readFileSync("Roles.json");
var rolesContract = JSON.parse(rolesContractSource)["contracts"];
var rolesabi = JSON.parse(rolesContract["Roles.sol:Roles"].abi);
console.log("************** pushing Roles contract **********");

pushContractToDB(solidityFileList[0], solidityJsonFileList[0], contractNameList[0], contractsData.roles, rolesabi);





setTimeout(function(){
	//ClaimManagement.sol
	var salesContractSource = fs.readFileSync("SalesContract.json");
	var salesContract = JSON.parse(salesContractSource)["contracts"];
	var salesabi = JSON.parse(salesContract["SalesContract.sol:SalesContract"].abi);
	console.log("************** pushing salescontract contract **********");
	pushContractToDB(solidityFileList[1], solidityJsonFileList[1], contractNameList[1], contractsData.sales_contract, salesabi);
},4000);


setTimeout(function(){
	//insurance.sol
	var tradeFinanceContractSource = fs.readFileSync("TradeFinance.json");
	var tradeFinanceContract = JSON.parse(tradeFinanceContractSource)["contracts"];
	var tradeFinanceabi = JSON.parse(tradeFinanceContract["TradeFinance.sol:TradeFinance"].abi);
	console.log("************** pushing TradeFinance contract **********");
	pushContractToDB(solidityFileList[2], solidityJsonFileList[2], contractNameList[2], contractsData.trade_finance, tradeFinanceabi);

},9000);


setTimeout(function(){
	//Hospital.sol
	var mphasisTokenSource = fs.readFileSync("MTK.json");
	var mphasisContract = JSON.parse(mphasisTokenSource)["contracts"];
	var mphasisTokenABI = JSON.parse(mphasisContract["MTK.sol:MphasisToken"].abi);

	console.log("************** pushing MphasisToken contract **********");
	pushContractToDB(solidityFileList[3], solidityJsonFileList[3], contractNameList[3], contractsData.mtkContractAddress, mphasisTokenABI);

},12000);

