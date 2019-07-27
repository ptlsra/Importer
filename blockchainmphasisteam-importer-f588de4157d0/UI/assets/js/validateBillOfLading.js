$(document).ready(function(){

	/*
	var ipAdd=ipAddress();
	var port=portNo();
	
	var ipfsIpAdd=ipfsIpAddress();
	var ipfsPort=ipfsPortNo();
	*/
	
	$('#assetId').hide();
	
	
	
	var getUrlParameter = function getUrlParameter(sParam) {
	    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
	        sURLVariables = sPageURL.split('&'),
	        sParameterName,
	        i;

	    for (i = 0; i < sURLVariables.length; i++) {
	        sParameterName = sURLVariables[i].split('=');

	        if (sParameterName[0] === sParam) {
	            return sParameterName[1] === undefined ? true : sParameterName[1];
	        }
	    }
	};

	var assetId = getUrlParameter('assetId');
	$('#assetId').val(assetId);
	
var message = getUrlParameter('message');
	
	
	message=message.replace(/_/g, ' ');
	
	message=message.charAt(0).toUpperCase() + message.slice(1);
	
	document.getElementById('offerPlacedTitle').innerHTML="Details For Asset with asset ID: "+assetId;
	document.getElementById('assetIdValue').innerHTML=assetId;
	
	 $.get("/getAssetTime?assetId="+assetId, function(responseTime){
		  var timeValue=responseTime.createdAt.toString();
			
			 var unixtimestamp = timeValue.slice(0,-9);

			 // Months array
			 var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

			 // Convert timestamp to milliseconds
			 var date = new Date(unixtimestamp*1000);

			 // Year
			 var year = date.getFullYear();

			 // Month
			 var month = months_arr[date.getMonth()];

			 // Day
			 var day = date.getDate();

			 // Hours
			 var hours = date.getHours();

			 // Minutes
			 var minutes = "0" + date.getMinutes();

			 // Seconds
			 var seconds = "0" + date.getSeconds();

			 // Display date time in MM-dd-yyyy h:m:s format
			 var convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
		  
			 document.getElementById('createdAt').innerHTML=convdataTime;
	  });
	
	  $.get("/getAssetDetailsByAssetID?assetId="+assetId, function(response){
		  var offerId=response.offerId;
		  $.get("/getOfferEntitiesCity?offerId="+offerId, function(responseData){
			  
				$.get("/getTradersByAssetID?assetId="+assetId, function(responseDetails){
					
					$.get("/getOffer?offerId="+offerId, function(responseOfferValue){
					
						$.get("/getOfferDetails?offerId="+offerId, function(response2){
					var exporterName=responseDetails.exporter+', '+responseData.exporterCity;
	 				var importerName=responseDetails.importer+' , '+responseData.importerCity;
	 				var exporterPortName=responseDetails.exporterPort+' , '+responseData.exporterPortCity;
	 				var importerPortName=responseDetails.importerPort+' , '+responseData.importerPortCity;
			 // alert(JSON.stringify(response));
		  
			var status=response.assetStatus;
				
				
				var statusNew=status.replace(/_/g, ' ');
		  document.getElementById('assetName').innerHTML=response.assetName;
		  document.getElementById('offerId').innerHTML=response.offerId;
		  document.getElementById('quantity').innerHTML=response.quantity;
		  document.getElementById('unit').innerHTML=response.units;
		  document.getElementById('status').innerHTML=statusNew;
		  document.getElementById('message').innerHTML=message;
		  
		  document.getElementById('exporterName').innerHTML=exporterName;
		  document.getElementById('importerName').innerHTML=importerName;
		  document.getElementById('exporterPortName').innerHTML=exporterPortName;
		  document.getElementById('importerPortName').innerHTML=importerPortName;
		  document.getElementById('price').innerHTML=responseOfferValue.price;
		  
		  
	
			 var agreementId=response2.agreementId;
			  document.getElementById('agreementId').innerHTML=agreementId;
			 
		  
	  });
		  });
		  });
		  });
	  });
	  
		$.get("/getPortValidationDetailsByAssetId?assetId="+assetId, function(responseData){
				var isValidatedByExporter=responseData.isValidatedByExporter;
				var isValidatedByExporterPort=responseData.isValidatedByExporterPort;
				var isValidatedByImporter=responseData.isValidatedByImporter;
				var isValidated=responseData.isValidatedExporterPort;
				
				var isValidatedByExporterAtImporterPort=responseData.isValidatedByExporterAtImporterPort;
				var isValidatedByImporterPort=responseData.isValidatedByImporterPort;
				var isValidatedByImporterAtImporterPort=responseData.isValidatedByImporterAtImporterPort;
				var isValidatedImporterPort=responseData.isValidatedImporterPort;
				
				if(isValidatedByExporter==true){
					 document.getElementById('exporterValidation').innerHTML='<img src=assets/img/iconTick.png height="20px" width="20px">';
				}
				
				if(isValidatedByExporterPort==true){
					 document.getElementById('exporterPortValidation').innerHTML='<img src=assets/img/iconTick.png height="20px" width="20px">';
				}
				
				if(isValidatedByImporter==true){
					 document.getElementById('importerValidation').innerHTML='<img src=assets/img/iconTick.png height="20px" width="20px">';
				}
				
				if(isValidated==true){
					 document.getElementById('initialApprovalStatusValue').innerHTML='<img src=assets/img/iconTick.png height="20px" width="20px">';
				
						if(isValidatedByExporterAtImporterPort==true){
							 document.getElementById('exporterValidationFinal').innerHTML='<img src=assets/img/iconTick.png height="20px" width="20px">';
						}
						
						if(isValidatedByImporterAtImporterPort==true){
							 document.getElementById('importerValidationFinal').innerHTML='<img src=assets/img/iconTick.png height="20px" width="20px">';
						}
						
						if(isValidatedByImporterPort==true){
							 document.getElementById('importerPortValidation').innerHTML='<img src=assets/img/iconTick.png height="20px" width="20px">';
						}
						if(isValidatedImporterPort==true){
							 document.getElementById('finalApprovalStatusValue').innerHTML='<img src=assets/img/iconTick.png height="20px" width="20px">';
						}
						
						
						
				}
				
				
		});
	  // Documents
	  
	
	  $.get("/getAssetDocumentsByAssetID?assetId="+assetId, function(responseDataValue){
			 

		     $('#btnShow').click(function(){
		        		
		        		
		        	
		            $("#dialog").dialog({
		               
		                    maxWidth:600,
		                    maxHeight: 450,
		                    width: 600,
		                    height: 450,
		                    modal: true
		                    
		                });
		            
		            $.get("/ipfs?fileHash=" + responseDataValue.insuranceHash, function (response) {
						$("#frame").attr("src", response.ipfsUrl);
					});
		  //  $("#frame").attr("src", "http://"+ipfsIpAdd+":"+ipfsPort+"/ipfs/"+responseDataValue.insuranceHash);
		        
		        });
		     

		     $('#btnShow2').click(function(){
		        		
		        		
		        	
		            $("#dialog2").dialog({
		               
		                    maxWidth:600,
		                    maxHeight: 450,
		                    width: 600,
		                    height: 450,
		                    modal: true
		                    
		                });
		            
		            $.get("/ipfs?fileHash=" + responseDataValue.packagingListHash, function (response) {
						$("#frame2").attr("src", response.ipfsUrl);
					});
		//    $("#frame2").attr("src", "http://"+ipfsIpAdd+":"+ipfsPort+"/ipfs/"+responseDataValue.packagingListHash);
		        
		        });
		     

		     $('#btnShow3').click(function(){
		        		
		        		
		        	
		            $("#dialog3").dialog({
		               
		                    maxWidth:600,
		                    maxHeight: 450,
		                    width: 600,
		                    height: 450,
		                    modal: true
		                    
		                });
		            
		            $.get("/ipfs?fileHash=" + responseDataValue.billOfLadingHash, function (response) {
						$("#frame3").attr("src", response.ipfsUrl);
					});
		  //  $("#frame3").attr("src", "http://"+ipfsIpAdd+":"+ipfsPort+"/ipfs/"+responseDataValue.billOfLadingHash);
		        
		        });
			 
		 
	  });
	  
	  
	
	
});

function goBack() {
    window.history.back();
}