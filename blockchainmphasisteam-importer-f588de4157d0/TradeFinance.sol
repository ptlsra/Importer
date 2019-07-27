pragma solidity^0.4.19;
import "./MTK.sol";
import "./SalesContract.sol";
import "./Roles.sol";


/**
 * @title TradeFinance contract
 */
contract TradeFinance{
    
   uint256 public asset_id = 101;
   uint256 public bill_of_Lading=1272345;
  
    
    /** @dev structure to maintain asset details */
    struct Asset{
        uint256 assetId;
        bytes32 assetName;
        mapping(uint256 => address) exporter;
        mapping(uint256 => address) shipper;
        mapping(uint256 => address) importer;
        mapping(uint256 => address) exporterPort;
        mapping(uint256 => address) importerPort;
        mapping(uint256 => address) exporterBank;
        mapping(uint256 => address) importerBank;
        mapping(uint256 => uint256) agreementId;
        uint256 quantity;
        bytes32 units;
        mapping(uint256 => bytes32) assetStatus;
        mapping(uint256 => uint256) createdAt;
        mapping(uint256 => address) assetLocation;
        mapping(uint256 => bytes32) message;
    }
     /** @dev structure to maintain asset trader info details */
     struct TraderInfo{
        uint256 assetId;
        bytes32 exporterName;
        bytes32 importerName;
        bytes32 importerPortName;
        bytes32 exporterPortName;
        bytes32 shipperName;
       
    }
   
   
    /** @dev structure to maintain asset document hashes */
    struct AssetDocuments{
        string locHash;
        mapping(uint256 => string) insuranceHash;
        mapping(uint256 => string) packagingListHash;
        mapping(uint256 => string) customDocs;
        mapping(uint256 => string) goodsReceivedHash;
    }
    
    /** @dev structure to maintain bill of Lading */
    struct BillOfLading{
        uint256 billOfLadingId;
      
    }
    struct BillOfLadingAsset{
      //  string billOfLadingHash;
       bytes32 ownedBy;
        bytes32 uploadedBy;
        uint256 createdAt;
        mapping (address => BillOfLading) billOfLading;
    }
    
    
    /**  @dev structure to maintain importerPort Validation info */
    struct ImporterPortValidation{
        uint256 assetId;
        bool isValidatedByExporterBank;
        bool isValidatedByImporterPort;
        bool isValidatedByImporterBank;
        bool isValidated;
    }
    
 
    
    
    //mappings
 

    /** @dev map Asset struct to uint256(assetId) */
    mapping(uint256 => Asset) public asset;
    /** @dev map Asset struct to uint256(assetId) */
    mapping(uint256 => TraderInfo) public traderInfo;
    
    /** @dev list to maintain assets */
    uint256[] public assetList;

    /** @dev map AssetDocuments to uint256(assetId) */
    mapping(uint256 => AssetDocuments) public assetDocuments;
    
    /** @dev map Bill of Lading  to msg.sender */
    mapping(address => BillOfLading) public billOfLading;
    /** @dev map AssetDocuments to uint256(assetId) */
    mapping(uint256 => BillOfLadingAsset)  billOfLadingAsset;
    
    /** @dev map ImporterPortValidation to uint256(assetId) */
    mapping(uint256 => ImporterPortValidation) public importerPortValidation;

   

    
    /**
     * Events
     */
     
     /**
      * @dev createAsset event
      */
    event CreateAsset(
        uint256 assetId, 
        bytes32 assetName, 
        bytes32 shipperName,
        bytes32 importerName, 
        bytes32 exporterPortName, 
        bytes32 importerPortName, 
        bytes32 assetStatus, 
        bytes32 message, 
        bytes32 assetLocation,
        uint256 agreementId,
        uint256 createdAt,
        bytes32 exporterName
    );
    
     /**
      * @dev updateAssetInfo event
      */
    event UpdateAssetInfo(
        uint256 agreementId,
        uint256 assetId, 
        bytes32 assetStatus, 
        bytes32 message, 
        bytes32 assetLocation    );
    
    event BOLCreation(
        uint256 assetId,
        bytes32 ownedBy,
        bytes32 executedBy
    );
    
     event BOLTransferToExporterBank(
        uint256 assetId,
        bytes32 ownedBy,
         bytes32 executedBy,
         bytes32 previousOwner
    );
    
     event BOLTransferToImporterBank(
        uint256 assetId,
        bytes32 ownedBy,
         bytes32 executedBy,
        bytes32 previousOwner

    );
    
    event BOLTransferToImporter(
        uint256 assetId,
        bytes32 ownedBy,
         bytes32 executedBy,
        bytes32 previousOwner

    );
    
    event BOLTransferToImporterPort(
        uint256 assetId,
        bytes32 ownedBy,
         bytes32 executedBy,
        bytes32 previousOwner

    );
     
     /**
      * @dev documentUploadByShipper event
      * 
      */
    event DocumentUploadByShipper(
        uint256 agreementId, 
        uint256 assetId,
        string insuranceHash,
        string packagingListHash,
        bytes32 assetStatus, 
        bytes32 message, 
        bytes32 assetLocation
    );
    
     /**
      * @dev confirmShippingByShipper event
      * 
      */
    event ConfirmShippingByShipper(
        uint256 agreementId, 
        uint256 assetId,
        bytes32 assetStatus, 
        bytes32 message, 
        bytes32 assetLocation,
        bytes32 nextLocation,
        bytes32 executedBy
    );
    
     /**
      * @dev UpdateAssetArrival event
      * 
      */
    event UpdateAssetArrival(
        uint256 agreementId, 
        uint256 assetId,
        bytes32 assetStatus,
        bytes32 message, 
        bytes32 assetLocation
    );
     
     /**
      * @dev documentUploadByExporterPort event
      */
    event DocumentUploadByExporterPort(
        uint256 agreementId, 
        uint256 assetId,
        string billOfLadingHash,
         bytes32 assetStatus, 
        bytes32 message, 
        bytes32 assetLocation);
    
  
    /**
     * @dev validateAtExporterPort event
     */
    event ValidateAtExporterPortFinalApproval(
        uint256 agreementId, 
        uint256 assetId, 
        bytes32 assetStatus, 
        bytes32 message, 
        bytes32 assetLocation,
         bytes32 executedBy
    );
    
     /**
     * @dev requestBillOfLadingByImporterBank event
     */
    event RequestBillOfLadingByImporterBank(
        uint256 agreementId, 
        uint256 assetId, 
        bytes32 assetStatus, 
        bytes32 message, 
         bytes32 executedBy
    );
    
     /**
     * @dev validatePaymentByExporterBank event
     */
    event ValidatePaymentByExporterBank(
        uint256 agreementId, 
        uint256 assetId, 
        bytes32 assetStatus, 
        bytes32 message, 
        bytes32 assetLocation,
         bytes32 executedBy
    );
    
     /**
     * @dev requestBillOfLadingByImporter event
     */
    event RequestBillOfLadingByImporter(
        uint256 agreementId, 
        uint256 assetId, 
        bytes32 assetStatus, 
        bytes32 message, 
        bytes32 assetLocation,
         bytes32 executedBy
    );
    
     /**
     * @dev requestBillOfLadingByImporterPort event
     */
    event RequestBillOfLadingByImporterPort(
        uint256 agreementId, 
        uint256 assetId, 
        bytes32 assetStatus, 
        bytes32 message, 
        bytes32 assetLocation,
         bytes32 executedBy
    );
    
      /**
     * @dev finalValidationAtImporterPort event
     */
    event FinalValidationAtImporterPort(
        uint256 agreementId, 
        uint256 assetId, 
        bytes32 assetStatus, 
        bytes32 message, 
        bytes32 assetLocation,
         bytes32 executedBy
    );
    
    
    /**
     * @dev validateAtImporterPort event
     */
    event ValidateAtImporterPortByExporter(
        uint256 agreementId, 
        uint256 assetId, 
        bytes32 assetStatus, 
        bytes32 message, 
        bytes32 assetLocation,
        bytes32 executedBy

        );
     
     /**
      * @dev validateAtImporterPort event
      */
    event ValidateAtImporterPortByImporter(
        uint256 agreementId, 
        uint256 assetId, 
        bytes32 assetStatus, 
        bytes32 message, 
        bytes32 assetLocation,
         bytes32 executedBy
    );
     
     /**
      * @dev validateAtImporterPort event
      */
    event ValidateAtImporterPortByImporterPort(
        uint256 agreementId, 
        uint256 assetId, 
        bytes32 assetStatus, 
        bytes32 message, 
        bytes32 assetLocation,
         bytes32 executedBy
    );
     
     /**
      * @dev validateAtImporterPort event
      */
    event ValidateAtImporterPortFinalApproval(
        uint256 agreementId, 
        uint256 assetId, 
        bytes32 assetStatus, 
        bytes32 message, 
        bytes32 assetLocation,
         bytes32 executedBy
    );
     
     
     /**
      * @dev validateAtImporter event
      */
    event ValidateAtImporter(
        uint256 agreementId, 
        uint256 assetId, 
        bytes32 assetStatus, 
        bytes32 message, 
        bytes32 assetLocation
    );
      
     /**
      * @dev documentUploadByImporter event
      */
    event DocumentUploadByImporter(
        uint256 agreementId, 
        uint256 assetId,
        string goodsReceivedHash,
        bytes32 assetStatus, 
        bytes32 message, 
        bytes32 assetLocation
    );
      
    
    
   
    
    /**
     *  @dev function to create asset
     *  @param assetName asset name
     *  @param agreementId agreement id from InitialAgreement contract
     *  @param quantity asset quantity
     *  @param units unit name
     */
     
     
    function createAsset(
        bytes32 assetName,
        uint256 quantity,
        bytes32 units,
        address salesContractAddress,
        uint256 agreementId,
        address shipper,
        bytes32 shipperName
       )public{
        
         bytes32 exporterName;
         bytes32 importerName;
         bytes32 exporterPortName;
         bytes32 importerPortName;
        
        //get details of traders from sales contract
        SalesContract sales = SalesContract(salesContractAddress);
        (exporterName,importerName,exporterPortName,importerPortName) = sales.getTradersFromAgreement(agreementId);
         // get Exporter Port address fro roles contract
        sales.addAssetId(agreementId,asset_id);
        
       
        asset[asset_id] = Asset({
            assetId: asset_id,
            assetName:assetName,
            quantity:quantity,
            units:units
        });

       asset[asset_id].agreementId[asset_id] = agreementId;
       asset[asset_id].shipper[asset_id]=shipper;

        traderInfo[asset_id] = TraderInfo({
            assetId: asset_id,
            exporterName:exporterName,
            importerName:importerName,
            importerPortName:importerPortName,
            exporterPortName:exporterPortName,
            shipperName:shipperName
        });
        
        //set assetStatus and message
    
        asset[asset_id].assetStatus[asset_id] = "Asset_Created";
        asset[asset_id].message[asset_id] = "update_info";
        asset[asset_id].createdAt[asset_id] = block.timestamp;
        
     //  asset[asset_id].assetLocation[asset_id] = exporter;
        
       
        importerPortValidation[asset_id] = ImporterPortValidation({
            assetId:asset_id,
            isValidatedByImporterBank:false,
            isValidatedByImporterPort:false,
            isValidatedByExporterBank:false,
            isValidated:false
        });
        //event
        emit CreateAsset(
            asset_id, 
            assetName, 
            shipperName, 
            importerName, 
            exporterPortName, 
            importerPortName, 
            asset[asset_id].assetStatus[asset_id], 
            asset[asset_id].message[asset_id],
            "",
            asset[asset_id].agreementId[asset_id],
            asset[asset_id].createdAt[asset_id],
            exporterName
        );
        // push asset_id to assetList
        assetList.push(asset_id);
        //increment asset_id
        asset_id = asset_id + 1;
    }
    
    /** 
     *  @dev function for updating asset Information
     *  @param assetId asset id
     */
    function updateAssetInfo(
        uint256 assetId,
        address salesContractAddress,
        address rolesContractAddress
        )public{
        address exporter;
        address importer;
        address exporterPort;
        address importerPort;
        SalesContract sales = SalesContract(salesContractAddress);
        (exporter,importer) = sales.getTraderAddressFromAgreement(asset[assetId].agreementId[assetId]);
        
        asset[assetId].exporter[assetId] = exporter;
        asset[assetId].importer[assetId] = importer;
        
        Roles roles = Roles(rolesContractAddress);
        (exporterPort) = roles.getExporterPortAddress(traderInfo[assetId].exporterPortName);
        (importerPort) = roles.getImporterPortAddress(traderInfo[assetId].importerPortName);
        
        asset[assetId].importerPort[assetId] = importerPort;
        asset[assetId].exporterPort[assetId] = exporterPort;
        
       //set assetStatus,location and message
         asset[assetId].assetStatus[assetId] = "Order_Received";
       asset[assetId].message[assetId] = "UPLOAD_DOCS";

      // asset[assetId].assetLocation[assetId] = traderInfo[assetId].exporterName;
      asset[assetId].assetLocation[assetId] = asset[assetId].shipper[assetId];
      
        
        //event
        emit UpdateAssetInfo(asset[assetId].agreementId[assetId],assetId,asset[assetId].assetStatus[assetId],asset[assetId].message[assetId],traderInfo[assetId].shipperName);
    }
     /** 
     *  @dev function for uploading insurance hash, packaging list hash
     *  @param assetId asset id
     *  @param insuranceHash ipfs hash of insurance document
     *  @param packagingListHash ipfs hash of packaging list document
     */
    function documentUploadByShipper(
        uint256 assetId,
        string insuranceHash,
        string packagingListHash,
        address salesContractAddress
        )public{
        
        if(msg.sender != asset[assetId].shipper[assetId]){
            revert("Error. Permission denied");
        }
        // asset[assetId].assetLocation[assetId] = traderInfo[assetId].exporterName;
        SalesContract sales = SalesContract(salesContractAddress);
        (address exporterBank,address importerBank)=sales.getBankAddressByOfferId(asset[assetId].agreementId[assetId]);
        asset[assetId].exporterBank[assetId]=exporterBank;
        asset[assetId].importerBank[assetId]=importerBank;
        assetDocuments[assetId].insuranceHash[assetId] = insuranceHash;
        assetDocuments[assetId].packagingListHash[assetId] = packagingListHash;
       billOfLadingAsset[assetId].ownedBy=traderInfo[assetId].shipperName;
       billOfLadingAsset[assetId].uploadedBy=traderInfo[assetId].shipperName;
       billOfLadingAsset[assetId].createdAt=block.timestamp;

        billOfLadingAsset[assetId].billOfLading[msg.sender]= BillOfLading({billOfLadingId:bill_of_Lading});
        billOfLadingAsset[assetId].billOfLading[asset[assetId].exporter[assetId]]= BillOfLading({billOfLadingId:bill_of_Lading});

             
        // set asset status to ready to ship ---- indicates exporter has uploaded docs and next step will be to confirm shipping of the asset.
        asset[assetId].assetStatus[assetId] = "Ready_To_Ship";
        asset[assetId].message[assetId] = "CONFIRM_SHIPPER"; //earlier confirm_exporter
        
        //event
         emit BOLCreation(assetId,traderInfo[assetId].shipperName,traderInfo[assetId].shipperName);
        emit DocumentUploadByShipper(asset[assetId].agreementId[assetId], assetId, insuranceHash, packagingListHash, asset[assetId].assetStatus[assetId], asset[assetId].message[assetId], traderInfo[assetId].shipperName);
    }
    
    
      /** 
     *  @dev function for confirming shipping of asset to exporter port
     *  @param assetId asset id
     */
    function confirmShippingByShipper(
        uint256 assetId,
        address salesContractAddress
        )public{
        
        if(msg.sender != asset[assetId].shipper[assetId]){
            revert("Error. Permission denied");
        }
        
         SalesContract sales = SalesContract(salesContractAddress);
         (bytes32 exporterBankName,bytes32 importerBankName)=sales.getBankNameByOfferId(asset[assetId].agreementId[assetId]);
        (address exporterBank,address importerBank)=sales.getBankAddressByOfferId(asset[assetId].agreementId[assetId]);

       // insert bill of lading id from shipper to exporterBank structure;
        billOfLadingAsset[assetId].billOfLading[exporterBank]= BillOfLading({billOfLadingId:billOfLadingAsset[assetId].billOfLading[msg.sender].billOfLadingId});

        // billOfLadingAsset[assetId].billOfLading[msg.sender]= BillOfLading({billOfLadingId:bill_of_Lading});

        billOfLadingAsset[assetId].ownedBy=exporterBankName;
        // set asset status to ready to ship ---- indicates exporter has confirmed to ship goods to exporter port.
        //emit BOLTransferToExporterBank(assetId,exporterBankName,traderInfo[assetId].shipperName);

        asset[assetId].assetStatus[assetId] = "Shipped_to_Exporter_Port";
        asset[assetId].message[assetId] = "SHIPPED";
     
        //event
        emit BOLTransferToExporterBank(assetId,exporterBankName,traderInfo[assetId].shipperName,traderInfo[assetId].shipperName);

        emit ConfirmShippingByShipper(asset[assetId].agreementId[assetId], assetId, asset[assetId].assetStatus[assetId], asset[assetId].message[assetId], "to_Exporter_Port",traderInfo[assetId].exporterPortName,traderInfo[assetId].shipperName);
    }
    
    
     /**
     * @dev function for updating asset location on arrivat at importer/ exporterPort/ importerPort
     * @param assetId asset id 
     */
     function updateAssetArrival(
         uint256 assetId
         )public{
        bytes32 assetLocationStatus='';
        //check sender is authorized?
        if(msg.sender == asset[assetId].importer[assetId]
            || msg.sender == asset[assetId].exporterPort[assetId]
            || msg.sender == asset[assetId].importerPort[assetId]){
            
            asset[assetId].assetLocation[assetId] = msg.sender;
            
            if(msg.sender == asset[assetId].exporterPort[assetId]){
                asset[assetId].assetStatus[assetId] = "Arrived_at_Exporter_Port";
                asset[assetId].message[assetId] = "ARRIVED_EXP";
                 assetLocationStatus=traderInfo[assetId].exporterPortName;
                 // event 
            emit UpdateAssetArrival(asset[assetId].agreementId[assetId], assetId, asset[assetId].assetStatus[assetId], asset[assetId].message[assetId], assetLocationStatus);   
            }
            
            if(msg.sender == asset[assetId].importerPort[assetId]){
            asset[assetId].assetStatus[assetId] = "Arrived_at_Importer_Port";
            asset[assetId].message[assetId] = "ARRIVED_IMP";
              assetLocationStatus=traderInfo[assetId].importerPortName;
            emit UpdateAssetArrival(asset[assetId].agreementId[assetId], assetId, asset[assetId].assetStatus[assetId], asset[assetId].message[assetId], assetLocationStatus);   

             }
            
             else{
                if(msg.sender == asset[assetId].importer[assetId]){
                asset[assetId].assetStatus[assetId] = "Arrived_at_Importer";
                asset[assetId].message[assetId] = "ARRIVED_IM";
                assetLocationStatus=traderInfo[assetId].importerName;
            emit UpdateAssetArrival(asset[assetId].agreementId[assetId], assetId, asset[assetId].assetStatus[assetId], asset[assetId].message[assetId], assetLocationStatus);   

                 }
            }
            // event 
        }else{
            revert("Error. Permission denied");
        }
     }
    
    /**
     * @dev function for uploading docs at exporterPort
     * @param customDocsHash ipfs custom document
     */
    function documentUploadByExporterPort(
        uint256 assetId,
        string customDocsHash
        )public{
            
        if(msg.sender != asset[assetId].exporterPort[assetId]){
            revert("Error. Permission denied");
        }
        
        assetDocuments[assetId].customDocs[assetId] = customDocsHash;
        
        // updating asset status to BillofLading_Uploaded. Indicates next step is signing of uploded document. 
         asset[assetId].assetStatus[assetId] = "BillOfLading_Uploaded";
         asset[assetId].message[assetId] = "SIGN_DOC_EXP";
        //event
        emit DocumentUploadByExporterPort(asset[assetId].agreementId[assetId], assetId, customDocsHash,asset[assetId].assetStatus[assetId], asset[assetId].message[assetId],traderInfo[assetId].exporterPortName);
    }
    
     
     
     
     /** 
     * @dev function for Final Validation At ExporterPort
     * @param assetId asset id
     */
     function FinalValidationAtExporterPort(
        uint256 assetId
        )public{
                      
   //           
                asset[assetId].assetStatus[assetId] = "validated_at_exporter_port";
                asset[assetId].message[assetId] = "Shipping_to_Importer_Port";
                //asset[assetId].assetLocation[assetId] = asset[assetId].exporterPort;
                
                //event
                emit ValidateAtExporterPortFinalApproval(
                    asset[assetId].agreementId[assetId], 
                    assetId,
                    asset[assetId].assetStatus[assetId],
                    asset[assetId].message[assetId],
                    "to_importer_port",
                    traderInfo[assetId].exporterPortName
                );
        
            
        }
     
        
        /**
      * @dev function for requesting bill of Lading from exporterBank
      * @param assetId asset id
      */
          function requestBillOfLadingByImporterBank(
               uint256 assetId,
               address salesContractAddress,
               address mtkContract
        )public{
              
            if (importerPortValidation[assetId].isValidated == true){
                revert("Validation already done.");
            }else{
             SalesContract sales = SalesContract(salesContractAddress);
            (uint256 price)=sales.getOfferPrice(asset[assetId].agreementId[assetId]);
            (address exporterBank,address importerBank)=sales.getBankAddressByOfferId(asset[assetId].agreementId[assetId]);
               
             MphasisToken mtkEntity = MphasisToken(mtkContract);
            (bytes32 exporterBankName,bytes32 importerBankName)=sales.getBankNameByOfferId(asset[assetId].agreementId[assetId]);

        //    (bytes32 importerBankName)=sales.getImporterBankByOfferId(asset[assetId].agreementId[assetId]);        
        //    (bytes32 exporterBankName)=sales.getExporterBankByOfferId(asset[assetId].agreementId[assetId]);        

             if(msg.sender == importerBank && importerPortValidation[assetId].isValidatedByImporterBank == false){
        // billOfLading[importerBank].billOfLadingId=billOfLading[exporterBank].billOfLadingId;

       // insert bill of lading id from shipper to exporterBank structure;
        billOfLadingAsset[assetId].billOfLading[importerBank]= BillOfLading({billOfLadingId:billOfLadingAsset[assetId].billOfLading[exporterBank].billOfLadingId});
        billOfLadingAsset[assetId].ownedBy=importerBankName;
          //   billOfLading[assetId].ownedBy=importerBankName;
             
             mtkEntity.increaseApproval(importerBank,exporterBank, price);
              asset[assetId].assetStatus[assetId] = "issued_BOL_to_importer_bank";
              asset[assetId].message[assetId] = "issued_BOL_to_importer_bank";
             emit BOLTransferToImporterBank(assetId,importerBankName,importerBankName,exporterBankName);

               //event
                emit RequestBillOfLadingByImporterBank(
                    asset[assetId].agreementId[assetId], 
                    assetId,
                    asset[assetId].assetStatus[assetId],
                    asset[assetId].message[assetId],
                    importerBankName
                );
             }
            }
        }
        
         
        /**
      * @dev function for validating payment from exporterBank
      * @param assetId asset id
      */
      
      function validatePaymentByExporterBank(
               uint256 assetId,
               address salesContractAddress,
               address mtkContract
        )public{
              
            if (importerPortValidation[assetId].isValidated == true){
                revert("Validation already done.");
            }else{
             SalesContract sales = SalesContract(salesContractAddress);
            (uint256 price)=sales.getOfferPrice(asset[assetId].agreementId[assetId]);
            (address exporterBank,address importerBank)=sales.getBankAddressByOfferId(asset[assetId].agreementId[assetId]);
               
             MphasisToken mtkEntity = MphasisToken(mtkContract);
            (bytes32 exporterBankName)=sales.getExporterBankByOfferId(asset[assetId].agreementId[assetId]);        

             if(msg.sender == exporterBank && importerPortValidation[assetId].isValidatedByExporterBank == false){
  
             mtkEntity.transferFrom(importerBank,exporterBank, price);
             importerPortValidation[assetId].isValidatedByExporterBank=true;
             
              asset[assetId].assetStatus[assetId] = "exporter_bank_approves_payment";
              asset[assetId].message[assetId] = "exporter_bank_approves_payment";
             
               emit ValidatePaymentByExporterBank(
                    asset[assetId].agreementId[assetId], 
                    assetId,
                    asset[assetId].assetStatus[assetId],
                    asset[assetId].message[assetId],
                    traderInfo[assetId].importerPortName,
                    exporterBankName
                );
             }
            }
        }
        
         /**
      * @dev function for requestion bill of lading from importer Bank
      * @param assetId asset id
      */
      
        function requestBillOfLadingByImporter(
               uint256 assetId,
               address salesContractAddress
               )public{
              
            if (importerPortValidation[assetId].isValidated == true){
                revert("Validation already done.");
            }else{
            SalesContract sales = SalesContract(salesContractAddress);
             if(msg.sender == asset[assetId].importer[assetId] && importerPortValidation[assetId].isValidatedByImporterBank == false){
              (address exporterBank,address importerBank)=sales.getBankAddressByOfferId(asset[assetId].agreementId[assetId]);
            (bytes32 importerBankName)=sales.getImporterBankByOfferId(asset[assetId].agreementId[assetId]);        

    //    billOfLading[msg.sender].billOfLadingId=billOfLading[asset[assetId].importerBank[assetId]].billOfLadingId;
        billOfLadingAsset[assetId].billOfLading[msg.sender]= BillOfLading({billOfLadingId:billOfLadingAsset[assetId].billOfLading[importerBank].billOfLadingId});

        billOfLadingAsset[assetId].ownedBy=traderInfo[assetId].importerName;
             importerPortValidation[assetId].isValidatedByImporterBank=true;

               asset[assetId].assetStatus[assetId] = "issued_BOL_to_importer";
              asset[assetId].message[assetId] = "issued_BOL_to_importer";
              //event
              
                emit BOLTransferToImporter(assetId,traderInfo[assetId].importerName,traderInfo[assetId].importerName,importerBankName);

               emit RequestBillOfLadingByImporter(
                    asset[assetId].agreementId[assetId], 
                    assetId,
                    asset[assetId].assetStatus[assetId],
                    asset[assetId].message[assetId],
                    traderInfo[assetId].importerPortName,
                    traderInfo[assetId].importerName
                );
             }
            }
        }
        
          /**
      * @dev function for requestion bill of lading from importer 
      * @param assetId asset id
      */
         function requestBillOfLadingByImporterPort(
               uint256 assetId
               )public{
              
            if (importerPortValidation[assetId].isValidated == true){
                revert("Validation already done.");
            }else{

             if(msg.sender == asset[assetId].importerPort[assetId] && importerPortValidation[assetId].isValidatedByImporterPort == false){
                address importer=asset[assetId].importer[assetId];
             // billOfLading[msg.sender].billOfLadingId=billOfLading[asset[assetId].importer[assetId]].billOfLadingId;
               billOfLadingAsset[assetId].billOfLading[msg.sender]= BillOfLading({billOfLadingId:billOfLadingAsset[assetId].billOfLading[importer].billOfLadingId});

        billOfLadingAsset[assetId].ownedBy=traderInfo[assetId].importerPortName;
             // billOfLading[assetId].ownedBy=traderInfo[assetId].importerPortName;
                asset[assetId].assetStatus[assetId] = "issued_BOL_to_importerPort";
              asset[assetId].message[assetId] = "issued_BOL_to_importerPort";
                 emit BOLTransferToImporterPort(assetId,traderInfo[assetId].importerPortName,traderInfo[assetId].importerPortName,traderInfo[assetId].importerName);

                 emit RequestBillOfLadingByImporterPort(
                    asset[assetId].agreementId[assetId], 
                    assetId,
                    asset[assetId].assetStatus[assetId],
                    asset[assetId].message[assetId],
                    traderInfo[assetId].importerPortName,
                    traderInfo[assetId].importerPortName
                );
             }
            }
        }
      
   
          /**
      * @dev function for final validation at importer port 
      * @param assetId asset id
      */
         function finalValidationAtImporterPort(
               uint256 assetId
               )public{
              
            if (importerPortValidation[assetId].isValidated == true){
                revert("Validation already done.");
            }else{
           
             if(msg.sender == asset[assetId].importerPort[assetId] && importerPortValidation[assetId].isValidatedByImporterPort == false  &&  billOfLadingAsset[assetId].ownedBy == traderInfo[assetId].importerPortName){
  
             
             importerPortValidation[assetId].isValidatedByImporterPort=true;
            importerPortValidation[assetId].isValidated=true;

                asset[assetId].assetStatus[assetId] = "issued_goods_to_importer";
              asset[assetId].message[assetId] = "issued_goods_to_importer";
              
               emit FinalValidationAtImporterPort(
                    asset[assetId].agreementId[assetId], 
                    assetId,
                    asset[assetId].assetStatus[assetId],
                    asset[assetId].message[assetId],
                    "to_importer",
                    traderInfo[assetId].importerPortName
                );
             }
            }
        }
        
     
      /**
     * @dev function for uploading docs at importer
     * @param goodsReceivedHash ipfs hash of  goods Received document
     */
    function documentUploadByImporter(
        uint256 assetId,
        string goodsReceivedHash
        )public{
            
        if(msg.sender != asset[assetId].importer[assetId]){
            revert("Error. Permission denied");
        }
        
        assetDocuments[assetId].goodsReceivedHash[assetId] = goodsReceivedHash;
        
        // updating asset status to BillofLading_Uploaded. Indicates next step is signing of uploded document. 
         asset[assetId].assetStatus[assetId] = "DELIVERED";
         asset[assetId].message[assetId] = "delivered";
        
        //event
        
         
         
        emit DocumentUploadByImporter(asset[assetId].agreementId[assetId], assetId, goodsReceivedHash,asset[assetId].assetStatus[assetId], asset[assetId].message[assetId],traderInfo[assetId].importerName);
    }
    

        

        
         

      
         /**
          * @dev function to get asset details
          * @param assetId asset id
          * @return assetName
          * @return agreementId
          * @return quantity
          * @return units
          * @return assetStatus
          * @return assetLocation
          * @return message
          */
          function getAssetDetails(uint256 assetId)public view returns(
                bytes32,
                uint256,
                uint256,
                bytes32,
                bytes32,
                address,
                bytes32              ){
                return(
                    asset[assetId].assetName,
                    asset[assetId].agreementId[assetId],
                    asset[assetId].quantity,
                    asset[assetId].units,
                    asset[assetId].assetStatus[assetId],
                    asset[assetId].assetLocation[assetId],
                    asset[assetId].message[assetId]
                     
                    );
          }
          
           
         /**
          * @dev function to get asset details
          * @param assetId asset id
         
          */
          function getBillOfLadingDetails(uint256 assetId)public view returns(
                uint256){
                return(
                    billOfLadingAsset[assetId].billOfLading[msg.sender].billOfLadingId
                   // billOfLading[assetId].billOfLadingId[assetId]
       
                
                    );
          }
          
             /**
          * @dev function to get asset details
          * @param assetId asset id
       
          * @return ownedBy
          * @return uploadedBy
          * @return createdAt
          */
        function getBillOfLading(uint256 assetId)public view returns(
                bytes32,
                bytes32,
                uint256){
                return(
          
                    billOfLadingAsset[assetId].ownedBy,
                    billOfLadingAsset[assetId].uploadedBy,
                    billOfLadingAsset[assetId].createdAt
                
                     
                    );
          }
          
          
            /**
          * @dev function to get asset creation time
          * @param assetId asset id
          * @return createdAt
        
          */
          function getAssetTime(uint256 assetId)public view returns(
         
                uint256             ){
                return(
                    asset[assetId].createdAt[assetId]
                   
                     
                    );
          }
          
          
         
         /**
          * @dev function to get trade path
          * @param assetId asset id
          * @return exporter exporter wallet address
          * @return importer importer wallet address
          * @return exporterPort exporterPort wallet address
          * @return importerPort importerPort wallet address
          */
         function getTradePath(uint256 assetId)public view returns(
             bytes32,
             bytes32,
             bytes32,
             bytes32,
             bytes32
             ){
             return(
                 traderInfo[assetId].exporterName,
                 traderInfo[assetId].importerName,
                 traderInfo[assetId].exporterPortName,
                 traderInfo[assetId].importerPortName,
                 traderInfo[assetId].shipperName
                 
                 );       
         }
         
        /**
         * @dev function to get asset documents
         * @param assetId asset id 
         * @return locHash
         * @return insuranceHash
         * @return packagingListHash
         * @return billOfLadingHash
         * @return goodsReceivedHash
         */
         function getAssetDocuments(uint256 assetId)public view returns(
             string,
             string,
             string,
             string,
             string
             ){
                return(
                    assetDocuments[assetId].locHash,
                    assetDocuments[assetId].insuranceHash[assetId],
                    assetDocuments[assetId].packagingListHash[assetId],
                    assetDocuments[assetId].customDocs[assetId],
                    assetDocuments[assetId].goodsReceivedHash[assetId]
                );
         }
         
         
      
        
         
         /**
          * @dev function to get importer port validation status
          * @param assetId asset id 
          * @return isValidatedByExporterBank
          * @return isValidatedByImporterPort
          * @return isValidatedByImporterBank
          */
          function getImporterPortValidationDetails(uint256 assetId)public view returns(
             bool,
             bool,
             bool,
             bool
              ){
                  return(
                      importerPortValidation[assetId].isValidatedByExporterBank,
                      importerPortValidation[assetId].isValidatedByImporterPort,
                      importerPortValidation[assetId].isValidatedByImporterBank,
                      importerPortValidation[assetId].isValidated
                  );
          }
         
         
          function getShipperandAgreementId(uint256 assetId)public view returns(
            
             address,
             bytes32,
             uint256
              ){
                  return(
                      asset[assetId].shipper[assetId],
                      traderInfo[assetId].shipperName,
                      asset[assetId].agreementId[assetId]
                  );
          }
          
           
         /**
          * @dev function to get all Lists
          * @return assetList array of assets
          */
          function getAllAssets()public view returns(
                uint256[]
            ){
            return(assetList);      
          }
}

 
