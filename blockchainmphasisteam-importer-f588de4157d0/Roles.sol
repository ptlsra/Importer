pragma solidity^0.4.19;
import "./MTK.sol";


contract Roles{
    
    /**
     * @title Roles contract
     */

    /** @dev structure to maintain bank info */
    struct Bank{
        address bankAddress;
        bytes32 bankName;
        mapping(address => bool) isRegistered;
        mapping(address => string) street;
        mapping(address => bytes32) city;
        mapping(address => string) state;
        mapping(address => uint256) zipcode;
        mapping(address => bytes32) country;
    }
    
    /** @dev structure to maintain shipping company info */
    struct Shipping{
        address shippingAddress;
        bytes32 shippingName;
         mapping(address => bool) isRegistered;
         mapping(address => string) street;
        mapping(address => bytes32) city;
        mapping(address => string) state;
        mapping(address => uint256) zipcode;
        mapping(address => bytes32) country;
    }
    
    //mappings
    /** @dev map Bank struct to address */
    mapping(address => Bank) public bank;
    
     /** @dev map Shipping Company struct to address */
    mapping(address => Shipping) public shipping;
    
    /** @dev list to maitain banks */
    address[] public bankList;
    
     /** @dev list to maitain shipping comapny */
    address[] public shippingList;
    
    /** @dev list to maintain exporters */
    bytes32[] public exporterList;
    
    /** @dev list to maintain importers */
    bytes32[] public importerList;
    
    /** @dev list to maintain exporter ports */
    bytes32[] public exporterPortList;
    
    /** @dev list to maintain importer ports */
    bytes32[] public importerPortList;

    
     /** @dev map exporterAddress to exporter */
    mapping(bytes32 => address) public exporterAddress;

    /** @dev map importerAddress to importer */
    mapping(bytes32 => address) public importerAddress;
    
    /** @dev map importerPortAddress to importerPort */
    mapping(bytes32 => address) public importerPortAddress;
    
    /** @dev map exporterPortAddress to exporterPort */
    mapping(bytes32 => address) public exporterPortAddress;
    
    /** @dev map bankAddress to exporterAddress */
    mapping(bytes32 => address) public exporterBank;
    
    /** @dev map bankAddress to importerAddress */
    mapping(bytes32 => address) public importerBank;
    
    /** @dev map exporter port address to exporter address */
    mapping(bytes32 => address) public assignedExporterPort;
    
    /** @dev map importer port address to importer address */
    mapping(bytes32 => address) public assignedImporterPort;
    
    mapping(address => bool) public isExporterRegsitered;
    
    mapping(address => bool) public isImporterRegsitered;
    
    mapping(address => bool) public isExporterPortRegsitered;
    
    mapping(address => bool) public isImporterPortRegistered;
    
    mapping(bytes32 => bytes32) public exporterCity;
    
    mapping(bytes32 => bytes32) public importerCity;
    
    mapping(bytes32 => bytes32) public exporterPortCity;
    
    mapping(bytes32 => bytes32) public importerPortCity;
    
    
     /** 
     *  @dev function to bring cashflow 
     *  @param mtkContract token contract address
     */ 
    function cashFlow(
        address mtkContract
        )public{
        

        MphasisToken mtkEntity = MphasisToken(mtkContract);
        mtkEntity.init("MphasisToken", "MTK", 18, 10000000000);
        
      
    }
    
    
    
     /** 
     *  @dev function to register bank 
     *  @param bankName bank name
     */ 
     
    function registerBank(
        bytes32 bankName,
        string street,
        bytes32 city,
        string state,
        uint256 zipcode,
        bytes32 country,
        address mtkContract
        )public{
        
        //return if bank is already registered
        if ( bank[msg.sender].isRegistered[msg.sender] == true){
            revert ("Error. Bank is already registered.");
        }
        MphasisToken mtkEntity = MphasisToken(mtkContract);

        mtkEntity.transfer(msg.sender, 300000000);
           // ( _importer, _isImporterRegistered) = roles.getImporterInfo(importerName);
        //Register bank   
        bank[msg.sender] = Bank({
            bankAddress:msg.sender,
            bankName:bankName
        });
        bank[msg.sender].city[msg.sender] = city;
        bank[msg.sender].street[msg.sender] = street;
        bank[msg.sender].state[msg.sender] = state;
        bank[msg.sender].zipcode[msg.sender] = zipcode;
        bank[msg.sender].country[msg.sender] = country;
        bankList.push(msg.sender);
        
        //set isRegistered = true
        bank[msg.sender].isRegistered[msg.sender] = true;
    }
    
      /** 
     *  @dev function to register shipping comapny 
     *  @param shippingName shipping company name
     *   @param city city name
     */ 
    function registerShippingCompany(
        bytes32 shippingName,
        string street,
        bytes32 city,
        string state,
        uint256 zipcode,
        bytes32 country
        )public{
        
        //return if bank is already registered
        if ( shipping[msg.sender].isRegistered[msg.sender] == true){
            revert ("Error. Shipping Company is already registered.");
        }
     
         
        //Register shipping company   
        shipping[msg.sender] = Shipping({
            shippingAddress:msg.sender,
            shippingName:shippingName
        });
        shipping[msg.sender].city[msg.sender] = city;
        shipping[msg.sender].street[msg.sender] = street;
        shipping[msg.sender].state[msg.sender] = state;
        shipping[msg.sender].zipcode[msg.sender] = zipcode;
        shipping[msg.sender].country[msg.sender] = country;
        shippingList.push(msg.sender);
        
        //set isRegistered = true
        shipping[msg.sender].isRegistered[msg.sender] = true;
    }
    
    /** 
     *  @dev function to register exporter 
     *  @param exporterName exporter name
     *  @param _exporterBankAddress exporter bank address
     *  @param _assignedExporterPort exporter port address
     */
    function registerExporter(
        bytes32 exporterName,
        address _exporterBankAddress,
        address _assignedExporterPort,
        bytes32 city
        )public{
        
        //return if exporter already registered
        if(isExporterRegsitered[msg.sender] == true){
            revert("Error. Exporter already registered");
        }
    
        //push exporter to exporter list    
        exporterList.push(exporterName);
        
        //map exporter address to exporterName
        exporterAddress[exporterName] = msg.sender;
        assignedExporterPort[exporterName] = _assignedExporterPort;
        exporterBank[exporterName] = _exporterBankAddress;
        exporterCity[exporterName] = city;
        //set isExporterRegsitered = true
        isExporterRegsitered[msg.sender] = true;
    }
    
    /** 
     *  @dev function to register importer 
     *  @param importerName importer name
     *  @param _importerBankAddress importer bank address
     *  @param _assignedImporterPort importer port address
     */
    function registerImporter(
        bytes32 importerName,
        address _importerBankAddress,
        address _assignedImporterPort,
        bytes32 city
        )public{
        
        //return if importer already registered
        if(isImporterRegsitered[msg.sender] == true){
            revert("Error. Importer already registered");
        }

        //push importerName to importer list
        importerList.push(importerName);
        
        //map importer address to importer name 
        importerAddress[importerName] = msg.sender;
        assignedImporterPort[importerName] = _assignedImporterPort;
        importerBank[importerName] = _importerBankAddress;
        isImporterRegsitered[msg.sender] = true;
        importerCity[importerName] = city;
    }
    
    /**
     *  @dev function to register exporterPort
     *  @param exporterPortName exporter port name
     */
    function registerExporterPort(
        bytes32 exporterPortName,
        bytes32 city
        )public{
             
        if(isExporterPortRegsitered[msg.sender] == true){
            revert("Error. Exporter port already registered.");
        }
        
        //push exporterPortName to exporterPort list 
        exporterPortList.push(exporterPortName);
        
        //map exporter port address to exporterPort name
        exporterPortAddress[exporterPortName] = msg.sender;
        isExporterPortRegsitered[msg.sender] = true;
        exporterPortCity[exporterPortName] = city;
    }
    
    /**
     *  @dev function to register importerPort
     *  @param importerPortName importer port name
     */
    function registerImporterPort(
        bytes32 importerPortName,
        bytes32 city
        )public{

        if(isImporterPortRegistered[msg.sender] == true){
            revert("Error. Importer port is already registered");
        }

        //push importerPortname to importerPort list
        importerPortList.push(importerPortName);

        //map importer port address to importerPort name
        importerPortAddress[importerPortName] = msg.sender;
        isImporterPortRegistered[msg.sender] = true;
        importerPortCity[importerPortName] = city;
    }
    
    /**
     * @dev function to get bank list
     * @return banklist 
     */
     function getBankList()public view returns(
        address[]
         ){
             return (bankList);
     }
     
     /**
     * @dev function to get shippling list
     * @return shippinglist 
     */
     function getShippingList()public view returns(
        address[]
         ){
             return (shippingList);
     }
    
      /**
         * @dev function to get bank info
         * @return bankAddress
         * @return bankName
         */
         function getBankInfo()public view returns(
             address,
             bytes32,
             bytes32
             ){
            return(
                bank[msg.sender].bankAddress,
                bank[msg.sender].bankName,
                bank[msg.sender].city[msg.sender]
            );
         }
         
           /**
         * @dev function to get bank info
         * @return bankAddress
         * @return bankName
         */
         function getBankInfoByBankAddress(address bankAddress)public view returns(
             address,
             bytes32,
             bytes32
             ){
            return(
                bank[bankAddress].bankAddress,
                bank[bankAddress].bankName,
                bank[bankAddress].city[bankAddress]
            );
         }
         
         /**
         * @dev function to get physical address of bank
         * @return bankAddress
         * @return bankName
         */
         function getPhysicalAddressBankAddress(address bankAddress)public view returns(
             bytes32,
             string,
             string,
             uint256,
             bytes32
             ){
            return(
                bank[bankAddress].city[bankAddress],
                bank[bankAddress].street[bankAddress],
                bank[bankAddress].state[bankAddress],
                bank[bankAddress].zipcode[bankAddress],
                bank[bankAddress].country[bankAddress]
            );
         }
              
         
        
         
          /**
         * @dev function to get shipping company info
         * @param shippingAddress shipping address of shipping company
         * @return shippingName
         * @return city
         */
         function getShippingDetails(address shippingAddress)public view returns(
           
             bytes32,
             string,
             string,
             uint256,
             bytes32
             ){
            return(
                shipping[shippingAddress].city[shippingAddress],
                shipping[shippingAddress].street[shippingAddress],
                shipping[shippingAddress].state[shippingAddress],
                shipping[shippingAddress].zipcode[shippingAddress],
                shipping[shippingAddress].country[shippingAddress]
           
            );
         }
         
         
          /**
         * @dev function to get shipping company info
         * @param shippingAddress shipping address of shipping company
      
         * @return shippingName
      
         */
         function getShipperNameByShippingAddress(address shippingAddress)public view returns(
          
             bytes32
            
             ){
            return(
              
                shipping[shippingAddress].shippingName,
            );
         }
         
         
         /**
          * @dev function to get all exporters
          * @return exporter array of exporters
          */
          function getAllExporters()public view returns(
              bytes32[]
              ){
            return(exporterList);
          }
         
         /**
          * @dev function to get all Importers
          * @return importer array of importers
          */
          function getAllImporters()public view returns(
                bytes32[]
            ){
            return(importerList);      
          }
          
         /**
          * @dev function to get all exporter ports 
          * @return exporterPortList
          */
          function getAllExporterPorts()public view returns(
              bytes32[]
              ){
                  return(exporterPortList);
          }
          
          /**
           * @dev function to get all importer ports 
           * @return importerPortList 
           */
           function getAllImporterPorts()public view returns(
               bytes32[]
               ){
                   return(importerPortList);
           }
          
          /**
           * @dev function to get importer info 
           * @param importerName importer name
           * @return importerAddress
           * @return isImporterRegsitered
           */
          function getImporterInfo(bytes32 importerName)public view returns(
              address,
              bool,
              bytes32
              ){
            
            return (
                importerAddress[importerName],
                isImporterRegsitered[importerAddress[importerName]],
                importerCity[importerName]
            );
          }
    
    
    /**
           * @dev function to get importer info 
           * @param importerName importer name
           * @return importerAddress
           * @return isImporterRegsitered
           */
          function getImporterDetails(bytes32 importerName)public view returns(
              address,
              bool
              ){
            
            return (
                importerAddress[importerName],
                isImporterRegsitered[importerAddress[importerName]]
            );
          }
    
        /**
         * @dev function to get exporter info
         * @param exporterName exporter name
         * @return exporterAddress
         * @return isExporterRegsitered
         */
         function getExporterInfo(bytes32 exporterName)public view returns(
             address,
             bool,
             bytes32
         ){
             
             return (
                exporterAddress[exporterName],
                isExporterRegsitered[exporterAddress[exporterName]],
                exporterCity[exporterName]
             );
         }
         
          /**
         * @dev function to get exporter info
         * @param exporterName exporter name
         * @return exporterAddress
         * @return isExporterRegsitered
         */
         function getExporterDetails(bytes32 exporterName)public view returns(
             address,
             bool         ){
             
             return (
                exporterAddress[exporterName],
                isExporterRegsitered[exporterAddress[exporterName]]             );
         }
         
        /**
         * 
         * @dev function to get importer port info
         * @param importerPortName importer port name 
         * @return importerPortAddress
         * @return isImporterPortRegistered
         */
         function getImporterPortInfo(
            bytes32 importerPortName
            )public view returns(
            address,
            bool,
            bytes32
            ){
            
            return(
                importerPortAddress[importerPortName],
                isImporterPortRegistered[importerPortAddress[importerPortName]],
                importerPortCity[importerPortName]
            );
         }
         
         
         /**
          * 
          * @dev function to get exporter port info 
          * @param exporterPortName exporter port name
          * @return exporterPortAddress
          * @return isExporterPortRegsitered
          */
          function getExporterPortInfo(
              bytes32 exporterPortName
          )public view returns(
            address,
            bool,
            bytes32
            ){
                
                return(
                  exporterPortAddress[exporterPortName],
                  isExporterPortRegsitered[exporterPortAddress[exporterPortName]],
                  exporterPortCity[exporterPortName]
                );
            }
         
         
         
         
          /**
         * 
         * @dev function to get importer port address
         * @param importerPortName importer port name 
         * @return importerPortAddress
         */
         function getImporterPortAddress(
            bytes32 importerPortName
            )public view returns(
            address
            ){
            
            return(
                importerPortAddress[importerPortName]
            );
         }
         
          /**
          * 
          * @dev function to get exporter port address 
          * @param exporterPortName exporter port name
          * @return exporterPortAddress
          */
          function getExporterPortAddress(
              bytes32 exporterPortName
          )public view returns(
            address
            ){
                
                return(
                  exporterPortAddress[exporterPortName]             
                  );
            }
         
}
