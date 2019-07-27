pragma solidity^0.4.19;
import "./Roles.sol";

contract SalesContract{

      
        uint256 _agreementId = 10001;

    /**
     * @dev structure to maintain offer details
     */
    struct SalesAgreement{
        uint256 agreementId;
        bytes32 assetName;
        bytes32 assetDescription;
        uint256 quantity;
        uint256 price;
        bytes32 unit;
        mapping(uint256 => bytes32) exporter;
        mapping(uint256 => address) exporterAddress;
        bytes32 agreementStatus;
        mapping(uint256 => address) exporterBank;
        mapping(uint256 => bytes32) exporterBankName;
        mapping(uint256 => address) buyer;
        mapping(uint256 => bytes32) importerName;
        mapping(uint256 => bytes32) exporterPortName;
        mapping(uint256 => uint256) deliveryDate;
        mapping(uint256 => address) importerBank;
        mapping(uint256 => bytes32) importerBankName;
        mapping(uint256 => bytes32) importerPortName;
        mapping(uint256 => uint256) createdAt;
        mapping(uint256 => bool) isVerifiedByExporter;
        mapping(uint256 => bool) isVerifiedByImporter;
        mapping(uint256 => bool) isTradeReady;
        mapping(uint256 => bool) isVerifiedByExporterBank;
        mapping(uint256 => bool) isVerifiedByImporterBank;
        mapping(uint256 => string) locDocument;
        mapping(uint256 => string) agreementDocument;
        bytes32 message;// VPFE / VPFI / WFLC/ VPBEB
      
        mapping(uint256 => uint256) assetId;
    }
    
    
  
    
    //mapping
  
    mapping(uint256 => SalesAgreement) salesAgreement;

    /**
     * Events
     * 
     */

     /**
      * @dev createOffer event
      */

    event CreateAgreement(
        uint256 agreementId,
        uint256 createdAt,
        bytes32 assetName,
        bytes32 assetDescription, 
        bytes32 executedBy,
        bytes32 agreementStatus,
        uint256 quantity,
        bytes32 unit
    );
     
        /**
      * @dev updateAgreement event
      */

    event UpdateAgreement(
        uint256 agreementId,
        bytes32 executedBy,
        bytes32 agreementStatus,
        bytes32 importerBankName
    );
     
    /**
     * @dev acceptOffer event 
     */
     
    event AcceptOffer(
        uint256 agreementId,
        address importerAddress,
        bytes32 agreementStatus,
        bytes32 message,
        bytes32 executedBy,
        bytes32 exporterBankName

    );
    
    /**
     * @dev approveRequest event 
     */
     event ApproveRequest(
        uint256 agreementId,
        bytes32 executedBy,
        bytes32 importer,
        bytes32 agreementStatus,
        bytes32 agreementMessage
     );
     
     
     
    /**
     * @dev rejectRequest event 
     */
     event RejectRequest(
         uint256 agreementId,
         address exporterAddress,
         bytes32 agreementStatus,
         bytes32 agreementMessage,
         bytes32 executedBy
         
     );
    
    
    /**
     * 
     * @dev validateAgreement event
     */
     event ValidateAgreement(
         uint256 agreementId,
         bytes32 agreementStatus,
         bytes32 agreementMessage,
         string agreementDocumentHash,
         bytes32 executedBy
     );
    
    /**
     * @dev uploadLocDocument event 
     * 
     */
     event UploadLocDocument(
        uint256 agreementId,
         string locDocumentHash,
         bytes32 agreementStatus,
         bytes32 agreementMessage,
         bytes32 executedBy
     );
    
    
    /**
     * @dev validateLOCDocument event 
     */
     event ValidateLOCDocument(
     
         uint256 agreementId,
         bytes32 agreementMessage,
         bytes32 agreementStatus,
         bytes32 executedBy
     );
     
     /**
     * @dev ValidateLOCDraft event 
     */
     event ValidateLOCDraft(
     
         uint256 agreementId,
         bytes32 agreementMessage,
         bytes32 agreementStatus,
         bytes32 executedBy
     );
     
     
    
   
    /**
     * @dev function to create an offer
     * @param assetName name of the asset
     * @param assetDescription asset description
     * @param quantity asset quantity 
     * @param unit units
     
    
     */
    function createAgreement(
         bytes32 assetName, 
         bytes32 assetDescription, 
         uint256 quantity,
         bytes32 unit,
         uint256 price,
         bytes32 importer,
         bytes32 exporter,
         address rolesContractAddress
        // address importerBankAddress,
         //bytes32 importerBankName,
         //bytes32 importerPortName
       
         )public{
        
        address _importerAddress;
        bool _isImporterRegistered;

        //Check msg.sender is exporter
        Roles roles = Roles(rolesContractAddress);
        ( _importerAddress, _isImporterRegistered) = roles.getImporterDetails(importer);
        //( _exporterAddress, _isExporterRegistered) = roles.getExporterDetails(exporter);
        
        if(_isImporterRegistered == false){
            revert("Error! Unauthorized access");
        }
        

        salesAgreement[_agreementId] = SalesAgreement({
            agreementId:_agreementId,
            assetName:assetName,
            assetDescription:assetDescription,
            quantity:quantity,
            price:price,
            unit:unit,
            agreementStatus:"Created",
            message:""
        });
        
         salesAgreement[_agreementId].importerName[_agreementId] = importer;
         salesAgreement[_agreementId].exporter[_agreementId] = exporter;
         salesAgreement[_agreementId].buyer[_agreementId] = _importerAddress;
        salesAgreement[_agreementId].createdAt[_agreementId] = block.timestamp;

        //event
        emit CreateAgreement(
            _agreementId, 
            salesAgreement[_agreementId].createdAt[_agreementId],
            assetName,
            assetDescription,
            importer, // change
            salesAgreement[_agreementId].agreementStatus,
            quantity,
            unit
        );
        
        //increment _offerId
        _agreementId=_agreementId+1;
    }
    
     /**
     * @dev function to update agreement
   
     */
    function updateAgreement(
         uint256 agreementId, 
          address rolesContractAddress,
         address importerBankAddress,
         bytes32 importerBankName,
         bytes32 importerPortName,
         uint256 deliveryDate
       
         )public{
        
        address _importerAddress;
        bool _isImporterRegistered;

  //check validator is importer
             if (msg.sender != salesAgreement[agreementId].buyer[agreementId]){
                 revert("Error ! Permision denied");
             }
        Roles roles = Roles(rolesContractAddress);
        ( _importerAddress, _isImporterRegistered) = roles.getImporterDetails(salesAgreement[agreementId].importerName[agreementId]);

        if(_isImporterRegistered == false){
            revert("Error! Unauthorized access");
        }
        
        salesAgreement[agreementId].importerBank[agreementId] = importerBankAddress;

        
        
        salesAgreement[agreementId].importerBank[agreementId] = importerBankAddress;
        salesAgreement[agreementId].importerBankName[agreementId] = importerBankName;
        salesAgreement[agreementId].importerPortName[agreementId] = importerPortName;
        salesAgreement[agreementId].deliveryDate[agreementId]=deliveryDate;

        //event
        emit UpdateAgreement(
            agreementId, 
            salesAgreement[agreementId].importerName[agreementId], // change
             salesAgreement[agreementId].agreementStatus = "Available",
             importerBankName
        );
        
        
       
    }
    
     
  
     
    
    /**
     * @dev function to add assetId to offer structure
     * @param agreementId agreement id 
     * @param assetId asset id 
     */
     function addAssetId(
         uint256 agreementId,
         uint256 assetId
         )public{
             
             salesAgreement[agreementId].assetId[agreementId] = assetId;
         }
     
     
    /**
     * @dev function to accept offer
     * @param agreementId agreement id
     * @param rolesContractAddress roles contract address 
     */
     function acceptOffer(
         uint256 agreementId,
         address rolesContractAddress,
         bytes32 exporterName,
         address exporterBankAddress,
         bytes32 exporterBankName,
         bytes32 exporterPortName
         )public{

            // check offer exist 
            if( salesAgreement[agreementId].agreementId == 0){
                revert("Error! Invalid offerId");
            }
            
            // check sender is importer 
            address _exporter;
            bool _isExporterRegistered;

            Roles roles = Roles(rolesContractAddress);
            ( _exporter, _isExporterRegistered) = roles.getExporterDetails(exporterName);
            
            if(_isExporterRegistered == false ){
                revert ("Error! Importer not registered");
            }
            
            if(_exporter != msg.sender){
                revert ("Error ! Importer not registered");
            }
            
          
            
          
            salesAgreement[agreementId].exporter[agreementId] = exporterName;
      
            salesAgreement[agreementId].exporterBank[agreementId] = exporterBankAddress;
            salesAgreement[agreementId].exporterBankName[agreementId] = exporterBankName;
            salesAgreement[agreementId].exporterPortName[agreementId] = exporterPortName;
            salesAgreement[agreementId].exporterAddress[agreementId] = msg.sender;
            salesAgreement[agreementId].agreementStatus = "Pending Approval";
            salesAgreement[agreementId].message = "WFA";

        //event 
        emit AcceptOffer(
            agreementId,
            msg.sender,
            salesAgreement[agreementId].agreementStatus,
            salesAgreement[agreementId].message,
            exporterName,
            exporterBankName
        );
     }
     
     
    
    
    
    
    /**
     * @dev function to reject importer/buyer request
     * @param agreementId agreement id 
     */
     function rejectRequest(
         uint256 agreementId
         )public{

        //check approver is exporter?
         if (msg.sender != salesAgreement[agreementId].exporterAddress[agreementId]){
             revert("Error! Permission denied");
         }
         
         salesAgreement[agreementId].agreementStatus = "Available";
         salesAgreement[agreementId].message = "";

         //event 
         emit RejectRequest(
             agreementId,
             msg.sender,
             salesAgreement[agreementId].agreementStatus,
             salesAgreement[agreementId].message,
             salesAgreement[agreementId].exporter[agreementId]
         );

     }
    
    
    /**
     * @dev function to validate agreement by importer/buyer 
     * @param agreementId agreement id 
     * @param agreementDocumentHash agreement document
   
     */
     function validateAgreement(
         uint256 agreementId,
         string agreementDocumentHash
    
         )public{
           
             //check validator is importer
             if (msg.sender != salesAgreement[agreementId].buyer[agreementId]){
                 revert("Error ! Permision denied");
             }

             salesAgreement[agreementId].agreementStatus = "Contract Accepted";
             salesAgreement[agreementId].message = "WFLOC";
             salesAgreement[agreementId].agreementDocument[agreementId] = agreementDocumentHash;
             salesAgreement[agreementId].isVerifiedByImporter[agreementId] = true;
             

        //ValidateAgreement 
        emit ValidateAgreement(
            agreementId,
            salesAgreement[agreementId].agreementStatus,
            salesAgreement[agreementId].message,
            salesAgreement[agreementId].agreementDocument[agreementId],
            salesAgreement[agreementId].importerName[agreementId]
        );
     }
     
       /**
     * @dev function to validate locDraft
     * @param agreementId agreement id 
     */
     function validateLOCDraft(
         uint256 agreementId
         )public{
          
             if(msg.sender != salesAgreement[agreementId].exporterAddress[agreementId]){
                 revert("Error ! Permission denied");
             }

             salesAgreement[agreementId].message = "LDVE";
       salesAgreement[agreementId].agreementStatus = "Draft Approved By Exporter";
           
        
        //event
        emit ValidateLOCDraft(
             agreementId,
            salesAgreement[agreementId].message,
            salesAgreement[agreementId].agreementStatus,
             salesAgreement[agreementId].exporter[agreementId]
        );
     }
     
    /**
     * @dev function to give loc
     * @param agreementId agreement id 
     * @param locHash loc document hash
     */
     function uploadLocDocument(
         uint256 agreementId,
         string locHash
     )public{
         
         if (msg.sender != salesAgreement[agreementId].importerBank[agreementId]){
             revert("Error! Permission denied");
             
         }
         
         salesAgreement[agreementId].locDocument[agreementId] = locHash;
         salesAgreement[agreementId].agreementStatus = "LOC Issued";
         salesAgreement[agreementId].message = "VPFEB";
         salesAgreement[agreementId].isVerifiedByImporterBank[agreementId] = true;
       
         
         //event 
         
         emit UploadLocDocument(
         
             agreementId,
             salesAgreement[agreementId].locDocument[agreementId],
             salesAgreement[agreementId].agreementStatus,
             salesAgreement[agreementId].message,
             salesAgreement[agreementId].importerBankName[agreementId]
             
         );
     }
     
     
    /**
     * @dev function to validate locDocument
     * @param agreementId agreement id 
     */
     function validateLOCDocument(
         uint256 agreementId
         )public{
             if(msg.sender != salesAgreement[agreementId].exporterBank[agreementId]){
                 revert("Error ! Permission denied");
             }

             salesAgreement[agreementId].message = "RTT";
             salesAgreement[agreementId].isVerifiedByExporterBank[agreementId] = true;
             salesAgreement[agreementId].isTradeReady[agreementId] = true;
             salesAgreement[agreementId].agreementStatus = "Ready To Trade";
        //event
        emit ValidateLOCDocument(
             agreementId,
            salesAgreement[agreementId].message,
            salesAgreement[agreementId].agreementStatus,
            salesAgreement[agreementId].exporterBankName[agreementId]
        );
     }
    
    /**
     * 
     * @dev function to get offer details 
     * @param agreementId agrrement id 
     */
     function getOffer(
         uint256 agreementId 
         )public view returns(
            bytes32,
            bytes32,
            uint256,
            uint256,
            bytes32,
            bytes32,
            address
            ){
         
            return(
                salesAgreement[agreementId].assetName,
                salesAgreement[agreementId].assetDescription,
                salesAgreement[agreementId].quantity,
                salesAgreement[agreementId].price,
                salesAgreement[agreementId].unit,
                salesAgreement[agreementId].exporter[agreementId],
                salesAgreement[agreementId].exporterAddress[agreementId]
            );
     }

     /**
     * 
     * @dev function to get offer price 
     * @param agreementId agreement id 
     */
     function getOfferPrice(
         uint256 agreementId 
         )public view returns(
            uint256
            ){

            return(
                salesAgreement[agreementId].price
            );
     }

     /**
      * 
      * @dev function to get offer status 
      * @param agreementId agreement id 
      */
      function getOfferStatus(
          uint256 agreementId 
          )public view returns(
            bytes32,
            bytes32,
            uint256,
            uint256,
            uint256
              ){
                return(
                    salesAgreement[agreementId].message,
                    salesAgreement[agreementId].agreementStatus,
                    salesAgreement[agreementId].createdAt[agreementId],
                    salesAgreement[agreementId].agreementId,
                    salesAgreement[agreementId].assetId[agreementId]
                );
      }
      
      
      /**
      * 
      * @dev function to get offer details 
      * @param agreementId agreement id 
      */
      function getOfferEntities(
          uint256 agreementId 
          )public view returns(
            bytes32,
            bytes32,
            bytes32,
            uint256,
            bytes32,
            bytes32
              ){
                return(
                    salesAgreement[agreementId].exporterBankName[agreementId],
                    salesAgreement[agreementId].importerName[agreementId],
                    salesAgreement[agreementId].exporterPortName[agreementId],
                    salesAgreement[agreementId].deliveryDate[agreementId],
                    salesAgreement[agreementId].importerBankName[agreementId],
                    salesAgreement[agreementId].importerPortName[agreementId]
                );
      }
      
    
        
        
          
     /**
      * 
      * @dev function to get sales agreement bank details
      * @param agreementId agreement id 
      */
      function getSalesAgreementBankDetails(
          uint256 agreementId
          )public view returns(
            address, 
            address, 
            bytes32,
            bytes32
         
            ){
                
                return(
                   
                    salesAgreement[agreementId].exporterBank[agreementId],
                    salesAgreement[agreementId].importerBank[agreementId],
                     salesAgreement[agreementId].exporterBankName[agreementId],
                    salesAgreement[agreementId].importerBankName[agreementId]

                    
                );
        }
        
        
         
        
         
     /**
      * 
      * @dev function to get getBankAddressByOfferId  
      * @param agreementId agreement id 
      */
      function getBankAddressByOfferId(
          uint256 agreementId
          )public view returns(
          
            address,
            address
            ){
                
                return(
                   salesAgreement[agreementId].exporterBank[agreementId],
                    salesAgreement[agreementId].importerBank[agreementId]
                 
                );
        }
        
        
         /**
      * 
      * @dev function to get getBankNameByOfferId  
      * @param agreementId offer id 
      */
      function getBankNameByOfferId(
          uint256 agreementId
          )public view returns(
          
            bytes32,
            bytes32
            ){
                
                return(
                   salesAgreement[agreementId].exporterBankName[agreementId],
                    salesAgreement[agreementId].importerBankName[agreementId]
                 
                );
        }
        
            /**
      * 
      * @dev function to get getImporterBankByOfferId  
      * @param agreementId agreement id 
      */
      function getImporterBankByOfferId(
          uint256 agreementId
          )public view returns(
          
            bytes32
            ){
                
                return(
                    salesAgreement[agreementId].importerBankName[agreementId]
                 
                );
        }
        
          /**
      * 
      * @dev function to get getExporterBankByOfferId  
      * @param agreementId agreement id 
      */
      function getExporterBankByOfferId(
          uint256 agreementId
          )public view returns(
          
            bytes32
            ){
                
                return(
                    salesAgreement[agreementId].exporterBankName[agreementId]
                 
                );
        }
        
        
        
     /**
      * 
      * @dev function to get sales agreement details 
      * @param agreementID agreement id 
      */
      function getSalesAgreementDetails(
          uint256 agreementID
          )public view returns(
            bool,
            bool,
            bool,
            bool,
            bool,
            string,
            string
            ){
                
                return(
                    salesAgreement[agreementID].isVerifiedByExporter[agreementID],
                    salesAgreement[agreementID].isVerifiedByImporter[agreementID],
                    salesAgreement[agreementID].isTradeReady[agreementID],
                    salesAgreement[agreementID].isVerifiedByExporterBank[agreementID],
                    salesAgreement[agreementID].isVerifiedByImporterBank[agreementID],
                    salesAgreement[agreementID].agreementDocument[agreementID],
                    salesAgreement[agreementID].locDocument[agreementID]
                );
                
      }
      
      
      
      
    /**
      * 
      * @dev function get traders involved in sales agreement 
      * @param agreementId agreement id 
      * @return exporterName 
      * @return importerName
      * @return exporterPortName
      * @return importerPortName
      */
      function getTradersFromAgreement(
          uint256 agreementId
          )public view returns(
              bytes32,
              bytes32,
              bytes32,
              bytes32
              ){
        return(
            salesAgreement[agreementId].exporter[agreementId],
            salesAgreement[agreementId].importerName[agreementId],
            salesAgreement[agreementId].exporterPortName[agreementId],
            salesAgreement[agreementId].importerPortName[agreementId]
        );
      }
      
        /**
      * 
      * @dev function get exporter and importer address involved in sales agreement 
      * @param agreementId agreement id 
      * @return exporterAddress 
      * @return importerAddress
      */
      function getTraderAddressFromAgreement(
          uint256 agreementId
          )public view returns(
              address,
              address
              ){
        return(
           salesAgreement[agreementId].exporterAddress[agreementId],
           salesAgreement[agreementId].buyer[agreementId]
          
        );
      }
}

