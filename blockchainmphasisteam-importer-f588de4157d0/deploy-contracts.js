
/**
 * http://usejsdoc.org/
 */
//***** contract deployment code *****//


/**
 * required modules
 */

const Web3 = require('web3');
const express = require('express');
var app = express();
var fs = require('fs');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var mongoUrl = "mongodb://127.0.0.1:27017/";
let configRawData = fs.readFileSync('appConfig.json');
let configData = JSON.parse(configRawData);
var web3HTTPProvider = configData.web3HTTPProvider;
console.log(web3HTTPProvider);
// connecting to web3 provider
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:22002"));

var solidityFileList        = ["Roles.sol","SalesContract.sol","TradeFinance.sol","MTK.sol"];
var solidityJsonFileList    = ["Roles.json","SalesContract.json","TradeFinance.json","MTK.json"];
var contractNameList        = ["Roles","SalesContract","TradeFinance","MphasisToken"];
var contractAddresses=[];

/**
 * program starts here.
 */
function deployContract(solidityFileName, solidityJsonfileName, contractName, requiredGas){
        console.log("deploying ...");
        console.log(solidityFileName);
        console.log(solidityJsonfileName);
        console.log(contractName);

        var exec = require('child_process').exec, child;
        console.log('Going to Execute solidity compile command in terminal');
        child = exec('solc  --optimize --combined-json abi,bin,interface '+solidityFileName+' > '+solidityJsonfileName,
            function (error, stdout, stderr) {
                console.log('Command Executed successfully!');
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
        child;

        console.log('Smart Contract Compiled and Saved the output in JSON file!');

        //BELOW setTimeout is to wait for the compiled json file to be created. second argument "time" is in milliseconds, may need to increase this number in case of a big smart contract to compile.
        setTimeout(readF, 10000);

        function readF(){
            var fileData = fs.readFileSync(solidityJsonfileName);
            console.log("Data inside just created JSON file is: "+fileData);
            var content = JSON.parse(fileData);
            //console.log(content);
            var abi = content.contracts[solidityFileName+":"+contractName].abi;
            console.log("ABI is: "+abi);

            var binary = content.contracts[solidityFileName+":"+contractName].bin;
            //console.log("Parsed binary is: "+binary);
            var bin = '0x'+binary;
            console.log("Required BINARY is: "+bin);
            //////////////////////
            var contractDeployedAt = web3.eth.accounts[0];
	        console.log("account is : "+contractDeployedAt);
            console.log("Contract is going to be deployed at: " + contractDeployedAt);
            var password1stAccount = "";
            //console.log("First account password is : " + password1stAccount);
            var accountUnlocked = web3.personal.unlockAccount(contractDeployedAt, "");
            //console.log("Contract account unlocked: " + accountUnlocked);
            const Contract = web3.eth.contract(JSON.parse(abi));

            Contract.new({
                from: web3.eth.accounts[0],
                data:bin,
                gas: requiredGas
            },function(err, contract){
                if(err) console.log(err);
                    if(typeof contract.address !== 'undefined'){
                        console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash)
                        //return contract.address;
                        //push contractAddress and abi into mongodb
                        var MongoClient = require('mongodb').MongoClient;
                        var url = mongoUrl+"blockchaindb";
                        /*
                        MongoClient.connect(url, function(err, db) {
                            if (err) throw err;
                            console.log("************ connected to mongodb client at localhost *************");
                            console.log("************ storing record **********");
                            let myobj = {contractAddress:contract.address, contractName:contractName, abi:abi}; 
                            var collectionName = "contracts";
                            db.collection(collectionName).insertOne(myobj, function(err, res) {
                                if (err) throw err;
                                console.log("contract abi pushed to mongodb ....");
                                //console.log(res);
                                db.close();
                            });
                        });
                        */
                        contractAddresses.push(contract.address);
                }
            });
        }
    }

    console.log("deploying roles contract");
    deployContract(solidityFileList[0], solidityJsonFileList[0], contractNameList[0], "5000000");
   
    setTimeout(function(){
        console.log("deploying sales contract");
        deployContract(solidityFileList[1], solidityJsonFileList[1], contractNameList[1], "50000000");
    },15000);

    
    setTimeout(function(){
        console.log("deploying TradeFinance contract");
        deployContract(solidityFileList[2], solidityJsonFileList[2], contractNameList[2], "50000000");
    },30000);

    
    setTimeout(function(){
        console.log("deploying MTK contract");
        deployContract(solidityFileList[3], solidityJsonFileList[3], contractNameList[3], "50000000");
    },50000);

    //setTimeout
    setTimeout(function () {

        console.log("**************************** saving cotractsConfig.json ************************");
        console.log("printing contractAddresses list : " + JSON.stringify(contractAddresses));

        let contractObject = {
            roles: contractAddresses[0],
            sales_contract: contractAddresses[1],
        	trade_finance: contractAddresses[2],
        	mtkContractAddress:contractAddresses[3]
        }

        let data = JSON.stringify(contractObject);
        fs.writeFileSync('contractAddresses.json', data);
        let rawdata = fs.readFileSync('contractAddresses.json');
        let contractsData = JSON.parse(rawdata);
        console.log(JSON.stringify(contractsData));
        
    }, 70000);
