
$(document).ready(function(){
	
	/*
	var ipAdd=ipAddress();
	var port=portNo();
	
	var ipfsIpAdd=ipfsIpAddress();
	var ipfsPort=ipfsPortNo();
	
	*/
	$('#assetId').hide();
	$('#importerNameValue').hide();

	
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
	var importerName=localStorage.getItem("importerName");
	//document.getElementById('importerNameValue').innerHTML=importerName;
	$('#importerNameValue').val(importerName);

	
	document.getElementById('offerPlacedTitle').innerHTML="Details For Asset with asset ID: "+assetId;
	document.getElementById('assetIdValue').innerHTML=assetId;
	
	
var message = getUrlParameter('message');
	
	
	message=message.replace(/_/g, ' ');
	
	message=message.charAt(0).toUpperCase() + message.slice(1);
	
	document.getElementById('message').innerHTML=message;

	document.getElementById('offerPlacedTitle').innerHTML="Details For Asset with asset ID: "+assetId;
	document.getElementById('assetIdValue').innerHTML=assetId;
	
	$.get("/getAssetTx?assetId="+assetId, function(responseDataEvent){
		  $.each(responseDataEvent.records, function(i, item) {
			  var eventName=item.eventName;
			  var prevrec=i+1;
			  var lengthofrec=responseDataEvent.records.length;
			//  alert(lengthofrec);
			  //alert(prevrec);
			  if (i==0){
			  var prevRecordEventName=responseDataEvent.records[prevrec].eventName;
			 // alert(prevRecordEventName)
			  
			 
			 
			  if(eventName=='UpdateAssetArrival' && prevRecordEventName=='FinalValidationAtImporterPort'){
				  document.getElementById('uploadDoc').innerHTML=  ' <img src="assets/img/tick3.png" width="12px" height="12px" style="margin-bottom:1px;"><a class="blck" href="#" onclick=check("Documents_Uploaded_By_Shipper")>Upload Document</a><p><img src="assets/img/tick3.png" width="12px" height="12px"><a class="blck" href="#" onclick=check("ConfirmShippingByShipper")>Ship to Exporter Port</a>';
					document.getElementById('exporterPortTab').innerHTML=  ' <img src="assets/img/tick3.png" width="12px" height="12px" style="margin-bottom:1px;"><a class="blck" href="#"  onclick=check2("UpdateAsset1")>Confirm Arrival</a><p><img src="assets/img/tick3.png" width="12px" height="12px"><a class="blck" href="#" onclick=check("DocumentUploadByExporterPort")>Upload Documents</a><br><img src="assets/img/tick3.png" width="12px" height="12px"><a class="blck" href="#" onclick=check("ValidateAtExporterPortFinalApproval")>Final Validation</a>';

					document.getElementById('importerPortTab').innerHTML= ' <img src="assets/img/tick3.png" width="12px" height="12px" style="margin-bottom:1px;"><a class="blck" href="#" onclick=check2("UpdateAsset2")>Confirm Arrival</a><p><img src="assets/img/tick3.png" width="12px" height="12px"><a class="blck" href="#"  onclick=check("RequestBillOfLadingByImporterBank")>BOL->Importer Bank</a><br><img src="assets/img/tick3.png" width="12px" height="12px"><a class="blck" href="#" onclick=check("ValidatePaymentByExporterBank")>ExporterBank Approval</a><br><img src="assets/img/tick3.png" width="12px" height="12px"><a class="blck" href="#" onclick=check("RequestBillOfLadingByImporter")>BOL->Importer</a><br><img src="assets/img/tick3.png" width="12px" height="12px"><a class="blck" href="#" onclick=check("RequestBillOfLadingByImporterPort")>BOL->Importer Port</a><br><img src="assets/img/tick3.png" width="12px" height="12px"><a class="blck" href="#" onclick=check("FinalValidationAtImporterPort")>Final Validation</a>';
					document.getElementById('importerTab').innerHTML= ' <img src="assets/img/tick3.png" width="12px" height="12px" style="margin-bottom:1px;"><a class="blck" href="#" onclick=check2("UpdateAsset3")>Confirm Arrival</a><p><img src="assets/img/pendingnew.png" width="15px" height="15px"><a class="blck" href="#" data-toggle="tooltip" title="Pending..!">Upload Documents -> Asset Delivered</a>';
						  }
			  
			  }
			  
			  
			  if(i=lengthofrec){
				  
			  }
			  
			  });
	  });
	
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
		  document.getElementById('assetNameVal').innerHTML=response.assetName;
		  
		 // document.getElementById('offerId').innerHTML=response.offerId;
		  document.getElementById('quantity').innerHTML=response.quantity;
		  document.getElementById('unit').innerHTML=response.units;
		  document.getElementById('quantityVal').innerHTML=response.quantity;
		  document.getElementById('unitVal').innerHTML=response.units;
		  document.getElementById('status').innerHTML=statusNew;
		
		  
		  document.getElementById('exporterName').innerHTML=exporterName;
		  document.getElementById('importerName').innerHTML=importerName;
		  document.getElementById('exporterPortName').innerHTML=exporterPortName;
		  document.getElementById('importerPortName').innerHTML=importerPortName;
		  document.getElementById('price').innerHTML=responseOfferValue.price;
		  document.getElementById('priceVal').innerHTML=responseOfferValue.price;
		  
		  
		 
			 
			
			  document.getElementById('agreementId').innerHTML=response.offerId;
			 
		  
	  });
		  });
		  });
		  });
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
		        
		    $('#dialog').show();
			
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
		  //  $("#frame2").attr("src", "http://"+ipfsIpAdd+":"+ipfsPort+"/ipfs/"+responseDataValue.packagingListHash);
		        
		        });
		     

		     $('#btnShow3').click(function(){
		        		
		        		
		        	
		            $("#dialog3").dialog({
		               
		                    maxWidth:600,
		                    maxHeight: 450,
		                    width: 600,
		                    height: 450,
		                    modal: true
		                    
		                });
		            
		            $.get("/ipfs?fileHash=" + responseDataValue.customDocsHash, function (response) {
						$("#frame3").attr("src", response.ipfsUrl);
					});
		   // $("#frame3").attr("src", "http://"+ipfsIpAdd+":"+ipfsPort+"/ipfs/"+responseDataValue.customDocsHash);
		        
		        });
			 
		 
	  });
	
	  
	  $.get("/getBillOfLading?assetId="+assetId, function(billofladingresponse){
		  document.getElementById('billOfLadingId').innerHTML=billofladingresponse.billOfLadingId;
		  document.getElementById('assetVal').innerHTML=billofladingresponse.assetId;
		  
	  });
	  
	  $.get("/getBillOfLadingDetails?assetId="+assetId, function(bolr){
		  //alert(JSON.stringify(bolr));
		  document.getElementById('bolownerBy').innerHTML=bolr.ownedBy;
		  document.getElementById('currentownerBol').innerHTML=bolr.ownedBy;
		  
		  var timeValue=bolr.createdAt.toString();
			
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
		  document.getElementById('bolcreation').innerHTML=convdataTime;
		  document.getElementById('creationTimeVal').innerHTML=convdataTime;
		  
	  });
	  
	  $.get("/getShipperandBank?assetId="+assetId, function(shipperresponse){
		  var shipperAddress=shipperresponse.shipperAddress;
		  var importerBankAddress=shipperresponse.importerBankAddress;
		  $.get("/getShipperAddress?shipperAddress="+shipperAddress, function(shipperDetails){
			 // shipperDetails
			  var city=shipperDetails.city;
			  var street=shipperDetails.street;
			  street=street.replace(/_/g, ' ');
			  
			  
			  var state=shipperDetails.state;
			  var zipcode=shipperDetails.zipcode;
			  var country=shipperDetails.country;
			  
			  document.getElementById('shipperStreet').innerHTML=street;
			  document.getElementById('shipperCity').innerHTML=city;
			  document.getElementById('shippeState').innerHTML=state;
			  document.getElementById('shippeZip').innerHTML=zipcode;
			  document.getElementById('shipperCountry').innerHTML=country;
			  
		  });
		  
		  $.get("/getBankAddress?bankAddress="+importerBankAddress, function(importerBankDetails){
			  var city=importerBankDetails.city;
			  var street=importerBankDetails.street;
			  street=street.replace(/_/g, ' ');
			  
			  
			  var state=importerBankDetails.state;
			  var zipcode=importerBankDetails.zipcode;
			  var country=importerBankDetails.country;
			  
			  document.getElementById('bankStreet').innerHTML=street;
			  document.getElementById('bankCity').innerHTML=city;
			  document.getElementById('bankState').innerHTML=state;
			  document.getElementById('bankZip').innerHTML=zipcode;
			  document.getElementById('bankCountry').innerHTML=country;
		  });
	  });
});

function goBack() {
    window.history.back();
}
