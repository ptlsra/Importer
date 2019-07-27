
	/*
	 * 
	 * View Details Of Request.
	 * 
	 */

/*
    $('#lengths').hide();
    $('#policyValidity').hide();
    $('#walletAddress').hide();
    $('#requestId').hide();
    $('#userNames').hide();
    $('#schemes').hide();
    $('#tenures').hide();
    $('#sumInsureds').hide();
    
    */
    
    /*
    var ipAddress=ipAddress();
	var portNo=portNo();
	*/
	/*
	 *	Set Insurance Company Value in #selectInsCompany drop down.
	 */
	
	 $('#selectImporterPort').append($('<option>', { 
	        value: 'None',
	        text : 'None' 
	    }
	    
	    ));
	 
	$.getJSON("/getAllImporterPorts", function(response){

	$.each(response.importer_port_list, function (i, item) {
	    $('#selectImporterPort').append($('<option>', { 
	        value: item.importerPortAddress,
	        text : item.importerPort 
	    }
	    
	    ));
	});
		});
	
	
	
	
	
	
	 $('#selectImporterBankList').append($('<option>', { 
	        value: 'None',
	        text : 'None' 
	    }
	    
	    ));
	 
	$.getJSON("/getAllBanks", function(response){

	$.each(response.bank_list, function (i, item) {
	    $('#selectImporterBankList').append($('<option>', { 
	        value: item.bankAddress,
	        text : item.bankName 
	    }
	    
	    ));
	});
		});
	
	
	
	
    
   

	
	
   	
   	
   
 


	