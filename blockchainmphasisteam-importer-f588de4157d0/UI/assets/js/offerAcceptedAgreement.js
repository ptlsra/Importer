$(document).ready(function(){
	/*
	var ipAdd=ipAddress();
	var port=portNo();
	
	var ipfsIpAdd=ipfsIpAddress();
	var ipfsPort=ipfsPortNo();
	
*/
	
	
	var exporterName=localStorage.getItem("exporterName");
	$('#exporterName').val(exporterName);

	
	
	
	
	
	
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

	var agreementId = getUrlParameter('agreementId');
	
	var status = getUrlParameter('status');
	status=status.replace(/_/g, ' ');
	 document.getElementById('status').innerHTML=status;
	
	document.getElementById('offerPlacedTitle').innerHTML="Agreement Details for agreement ID: "+agreementId;
	document.getElementById('offerIdValue').innerHTML=agreementId;
	
	 $.get("/getOffer?offerId="+agreementId, function(response){
		 // alert(JSON.stringify(response));
	  document.getElementById('price').innerHTML=response.price;
	  document.getElementById('assetName').innerHTML=response.assetName;
	  document.getElementById('assetDescription').innerHTML=response.assetDescription;
	  document.getElementById('quantity').innerHTML=response.quantity;
	  document.getElementById('unit').innerHTML=response.unit;
	  document.getElementById('createdBy').innerHTML=response.exporter;
	  
  });
  
  $.get("/getOfferEntities?offerId="+agreementId, function(responseData){
		 // alert(JSON.stringify(response));
	  document.getElementById('exporterBankName').innerHTML=responseData.exporterBankName;
	  document.getElementById('exporterPortName').innerHTML=responseData.exporterPortName;
	  document.getElementById('importerName').innerHTML=responseData.importerName;
	  document.getElementById('importerBankName').innerHTML=responseData.importerBankName;
	  document.getElementById('importerPortName').innerHTML=responseData.importerPortName;

	  
	  var unixtimestamp = responseData.deliveryDate.toString().slice(0,-3);

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
	  
		 
		 document.getElementById('deliveryDate').innerHTML=convdataTime;
  });
  
  $.get("/getOfferDetails?offerId="+agreementId, function(response2){
		 // alert(JSON.stringify(response));
	  var timeValue=response2.createdAt.toString();
		
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
		// document.getElementById('agreementId').innerHTML=response2.agreementId;
		 
		// var agreementId=response2.agreementId;
		 
		 
			$.get("/getOfferDetails?offerId="+agreementId, function(responseData){
					
				var agreementMessage=responseData.message;
						
				
				
			
				 var assetId=response2.assetId;
					
					

				 if(assetId==null){
					 
				 }
				 else{
							$.get("/getAssetDetailsbyAssetId?assetId="+assetId, function(responseValueNew){

						$.get("/getTradersByAssetID?assetId="+assetId, function(responseDetails){
			 			var status=responseValueNew.assetStatus;
			 				
			 				var exporterName=responseDetails.exporter;
			 				var importerName=responseDetails.importer;
			 				var exporterPortName=responseDetails.exporterPort;
			 				var importerPortName=responseDetails.importerPort;
			 				//var offerId=responseDetails.offerId;
			 				
			 				$.get("/getPortValidationDetailsByAssetId?assetId="+assetId, function(responseData){
			 					var isValidatedByExporter=responseData.isValidatedByExporter;
			 					var isValidatedByExporterPort=responseData.isValidatedByExporterPort;
			 					var isValidatedByImporter=responseData.isValidatedByImporter;
			 					var isValidated=responseData.isValidatedExporterPort;
			 					
			 					var isValidatedByExporterAtImporterPort=responseData.isValidatedByExporterAtImporterPort;
			 					var isValidatedByImporterPort=responseData.isValidatedByImporterPort;
			 					var isValidatedByImporterAtImporterPort=responseData.isValidatedByImporterAtImporterPort;
			 					var isValidatedImporterPort=responseData.isValidatedImporterPort;
			 					
			 				
			 				var statusNew=status.replace(/_/g, ' ');
			 				if(status=="Asset_Created"){
			 					//ref
			 					var messageValue="Asset_Created.";
			 					document.getElementById('assetId').innerHTML='<a href=assetCreated.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 					
			 				}
			 				
			 				if(status=="Order_Received"){
			 					//ref
			 					var messageValue="Waiting_For_Exporter_To_Upload_Packaging_List_And_Insurance_Docs.";
			 					document.getElementById('assetId').innerHTML='<a href=uploadDocs.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 				}
			 				
			 				if(status=="Ready_To_Ship"){
			 					//ref
			 					var messageValue="Waiting_For_Exporter_Confirmation_To_Ship_Goods.";

			 					document.getElementById('assetId').innerHTML='<a href=confirmShipping.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 				}
			 				// dummy
			 				if(status=="Shipped_to_Exporter_Port"){
			 					//ref
			 					var messageValue="Arrival_Pending_At_Exporter_Port.";

			 					document.getElementById('assetId').innerHTML='<a href=confirmShipping.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 				}
			 				if(status=="Arrived_at_Exporter_Port"){
			 					var messageValue="Waiting_For_Exporter_Port_To_Upload_Bill_Of_Lading.";
			 					//dummy

			 					document.getElementById('assetId').innerHTML='<a href=confirmShipping.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 				}
			 				

			 				if(status=="BillOfLading_Uploaded" &&isValidatedByImporter==false){
			 					//ref
			 					
			 					var messageValue="Provide_Initial_Approval.";
			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLading.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 					
			 				}
			 				
			 				if(status=="BillOfLading_Uploaded" &&isValidatedByImporter==true){
			 					//ref
			 					var messageValue="You_have_Approved.Pending_Approval_From_Other_Users.";
			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLadingDone.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 				
			 				}
			 				
			 				if(status=="sign_first_deposit_exp" &&isValidatedByImporter==false && (isValidatedByExporterPort==false || isValidatedByExporter==false)){
			 					//ref
			 					
			 					var messageValue="Provide_Initial_Approval.";
			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLading.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 					
			 				}
			 				
			 				if(status=="sign_first_deposit_exp" &&isValidatedByImporter==true && (isValidatedByExporterPort==false || isValidatedByExporter==false)){
			 					//ref
			 					
			 					var messageValue="You_have_Approved.Pending_Approval_From_Other_Users.";
			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLadingDone.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 				
			 				}
			 				
			 				if(status=="sign_first_deposit_exp" &&isValidatedByImporter==true && (isValidatedByExporterPort==true && isValidatedByExporter==true)){
			 					//ref
			 					
			 					var messageValue="Final_Approval_Pending_From_Exporter_Port.";
			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLadingDone.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 				}
			 				
			 				if(status=="sign_first_deposit_ex" &&isValidatedByImporter==false){
			 					//ref
			 					
			 					var messageValue="Provide_Initial_Approval.";
			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLading.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 					
			 				}
			 				
			 				if(status=="sign_first_deposit_ex" &&isValidatedByImporter==true && (isValidatedByExporterPort==false || isValidatedByExporter==false)){
			 					//ref
			 					
			 					var messageValue="You_have_Approved.Pending_Approval_From_Other_Users.";
			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLadingDone.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 					
			 				}
			 				
			 				if(status=="sign_first_deposit_ex" &&isValidatedByImporter==true && (isValidatedByExporterPort==true && isValidatedByExporter==true)){
			 					//ref
			 					
			 					var messageValue="Final_Approval_Pending_From_Exporter_Port.";
			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLadingDone.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 					
			 				}
			 				
			 				
			 				
			 				if(status=="sign_first_deposit_im" &&isValidatedByImporter==false){
			 					//ref
			 					var messageValue="Provide_Initial_Approval.";

			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLading.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 					
			 				}
			 				
			 				if(status=="sign_first_deposit_im" &&isValidatedByImporter==true && (isValidatedByExporterPort==false || isValidatedByExporter==false)){
			 					//ref
			 					var messageValue="You_have_Approved.Pending_Approval_From_Other_Users.";

			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLadingDone.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 				
			 				}
			 				
			 				if(status=="sign_first_deposit_im" &&isValidatedByImporter==true && (isValidatedByExporterPort==true && isValidatedByExporter==true)){
			 					//ref
			 					var messageValue="Final_Approval_Pending_From_Exporter_Port.";

			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLadingDone.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 					
			 				}
			 				
			 				if(status=="validated_at_exporter_port"){
			 					//ref
			 					var messageValue="Validation_Complete_At_Exporter_Port.Pending_Arrival_At_Importer_Port";
			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLadingDone.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;


			 				
			 				}
			 					
			 					
			 				
			 				

			 				// open for validation 
			 				if(status=="Arrived_at_Importer_Port" && isValidatedByImporterAtImporterPort==false){
			 					//ref
			 					
			 					var messageValue="Provide_Final_Approval.";
			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLadingFinal.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 					
			 				}
			 				
			 				
			 				
			 				if(status=="sign_second_deposit_imp" && isValidatedByImporterAtImporterPort==true && (isValidatedByExporterAtImporterPort==false || isValidatedByImporterPort==false)){
			 					//ref
			 					
			 					var messageValue="You_have_Approved.Pending_Approval_From_Other_Users.";
			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLadingDone.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 					
			 				}
			 				
			 				if(status=="sign_second_deposit_imp" && isValidatedByImporterAtImporterPort==false && (isValidatedByExporterAtImporterPort==true || isValidatedByImporterPort==true)){
			 					//ref
			 					var messageValue="Provide_Final_Approval.";
			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLadingFinal.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 					
			 				}
			 				
			 				if(status=="sign_second_deposit_imp" && isValidatedByImporterAtImporterPort==true && (isValidatedByExporterAtImporterPort==true && isValidatedByImporterPort==true)){
			 					//ref
			 					var messageValue="Final_Approval_Pending_From_Importer_Port.";
			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLadingDone.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 				
			 				}
			 				
			 				

			 				if(status=="sign_second_deposit_ex" && isValidatedByImporterAtImporterPort==true && (isValidatedByExporterAtImporterPort==false || isValidatedByImporterPort==false)){
			 					//ref
			 					var messageValue="You_have_Approved.Pending_Approval_From_Other_Users.";
			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLadingDone.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;


			 					
			 				}
			 				
			 				if(status=="sign_second_deposit_ex" && isValidatedByImporterAtImporterPort==false && (isValidatedByExporterAtImporterPort==true || isValidatedByImporterPort==true)){
			 					//ref
			 					var messageValue="Provide_Final_Approval.";
			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLadingFinal.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;


			 					
			 				}
			 				
			 				if(status=="sign_second_deposit_ex" && isValidatedByImporterAtImporterPort==true && (isValidatedByExporterAtImporterPort==true && isValidatedByImporterPort==true)){
			 					//ref
			 					var messageValue="Final_Approval_Pending_From_Importer_Port.";
			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLadingDone.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;


			 					
			 				}
			 				
			 				
			 				if(status=="sign_second_deposit_im" && isValidatedByImporterAtImporterPort==true && (isValidatedByExporterAtImporterPort==false || isValidatedByImporterPort==false)){
			 					//ref
			 					
			 					var messageValue="You_have_Approved.Pending_Approval_From_Other_Users.";
			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLadingDone.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 					
			 				}
			 				
			 				if(status=="sign_second_deposit_im" && isValidatedByImporterAtImporterPort==false){
			 					//ref
			 					
			 					var messageValue="Provide_Final_Approval.";
			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLadingFinal.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 					
			 				}
			 				
			 				

			 				if(status=="sign_second_deposit_im" && isValidatedByImporterAtImporterPort==true && (isValidatedByExporterAtImporterPort==true && isValidatedByImporterPort==true)){
			 					//ref
			 					var messageValue="Final_Approval_Pending_From_Importer_Port.";

			 					document.getElementById('assetId').innerHTML='<a href=validateBillOfLadingDone.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 				
			 				}
			 				
			 				
			 			// arrival at inporter
			 				
			 				if(status=="validated_at_importer_port"){
			 					//ref
			 					
			 					var messageValue="Confirm_Arrival_Of_Asset.";
			 					document.getElementById('assetId').innerHTML='<a href=confirmArrivalAtImporter.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 				}
			 				
			 				
			 				if(status=="Arrived_at_Importer"){
			 					//ref
			 					var messageValue="Upload_Goods_Recieved_Documents.";
			 					document.getElementById('assetId').innerHTML='<a href=uploadGoodsRecieved.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 				
			 				}
			 				
			 				if(status=="goodsReceived_Uploaded"){
			 					//ref
			 					
			 					var messageValue="Make_Final_Payment_To_Exporter.";
			 					document.getElementById('assetId').innerHTML='<a href=finalValidationInporter.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 					
			 				}
			 				
			 				if(status=="delivered"){
			 					//ref
			 					
			 					var messageValue="Asset_Delivered.";
			 					document.getElementById('assetId').innerHTML='<a href=finalValidationInporterDone.html?assetId='+assetId+'&message='+messageValue+'>'+assetId;

			 				
			 				}
			 				
			 				
			 				
			 				
			 				});
			 				});
			 				
			 				
			 				 });
				 }
			//alert(dataSet);		               
			 			        	
		});
  });
						
					



});

function goBack() {
window.history.back();
}

