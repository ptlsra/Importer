$(document).ready(function(){
	/*
	var ipAdd=ipAddress();
	var port=portNo();
*/
	
	
	 var tempLists=[];
	 var dataSets=[];
	
	
	  
	
	
		
		$.get("/getAllAssets", function(response){
			 // alert(JSON.stringify(response));
	 			$.each(response.records, function(i, item) {
	 			var assetId=item.assetId;
	 		//	$.get("http://"+ipAdd+":"+port+"/getAssetTime?assetId="+assetId, function(assetTime){
 					var createdAt=item.createdAt;
 					var unixtimestamp = createdAt.toString().slice(0,-9);
					//var unixtimestamp = item.timeStamp;
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

	 			//	$.get("http://"+ipAdd+":"+port+"/getTradersByAssetID?assetId="+assetId, function(responseDetails){
		 				var status=item.assetStatus;
		 				var message=item.message;
		 				var exporterName=item.exporterName;
		 				var importerName=item.importerName;
		 				var exporterPortName=item.exporterPortName;
		 				var importerPortName=item.importerPortName;
		 				var shipper=item.shipper;
	 		/*		$.get("http://"+ipAdd+":"+port+"/getPortValidationDetailsByAssetId?assetId="+assetId, function(responseData){
	 					var isValidatedByExporter=responseData.isValidatedByExporter;
	 					var isValidatedByExporterPort=responseData.isValidatedByExporterPort;
	 					var isValidatedByImporter=responseData.isValidatedByImporter;
	 					var isValidated=responseData.isValidated;
	 					
	 					var isValidatedByExporterAtImporterPort=responseData.isValidatedByExporterAtImporterPort;
	 					var isValidatedByImporterPort=responseData.isValidatedByImporterPort;
	 					var isValidatedByImporterAtImporterPort=responseData.isValidatedByImporterAtImporterPort;
	 					var isValidatedImporterPort=responseData.isValidatedImporterPort;
	 			*/
	 				message=message.replace(/_/g, ' ');
	 				
	 				var statusNew=status.replace(/_/g, ' ');
	 				if(status=="Asset_Created"){
	 					var messageValue="Pending_Updation_From_Exporter.";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,shipper+'<img src="assets/img/location.png" width="12px" height="12px">',exporterPortName,importerPortName,importerName,'Asset Created.Pending Updation From Exporter','<a href=assetCreated.html?assetId='+item.assetId+'&message='+messageValue+'>View Details','','<a href=history.html?assetId='+item.assetId+'>View');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				if(status=="Order_Received"){
	 					//ref
	 					var messageValue="Waiting_For_Shipper_To_Upload_Packaging_List_And_Insurance_Docs.";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,shipper+'<img src="assets/img/location.png" width="12px" height="12px">',exporterPortName,importerPortName,importerName,'Waiting For Shipper To Upload Docs.','<a href=uploadDocs.html?assetId='+item.assetId+'&message='+messageValue+'>View Details','<a href=history.html?assetId='+item.assetId+'>View');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				if(status=="Ready_To_Ship"){
	 					//ref
	 					var messageValue="Waiting_For_Shipper_Confirmation_To_Ship_Goods.";

	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,shipper+'<img src="assets/img/location.png" width="12px" height="12px">',exporterPortName,importerPortName,importerName,'<a href=confirmShipping.html?assetId='+item.assetId+'&message='+messageValue+'>Waiting For Shipper to Release Goods','','<a href=history.html?assetId='+item.assetId+'>View');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				// dummy
	 				if(status=="Shipped_to_Exporter_Port"){
	 					//ref
	 					var messageValue="Arrival_Pending_At_Exporter_Port.";

	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,shipper+'<img src="assets/img/transitnew.gif" width="20px" height="12px">',importerName,exporterPortName,importerPortName,'<a href=confirmShippingDone.html?assetId='+item.assetId+'&message='+messageValue+'>Goods Released To Exporter Port.Pending Arrival.','','<a href=history.html?assetId='+item.assetId+'>View');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				if(status=="Arrived_at_Exporter_Port"){
	 					//dummy
	 					var messageValue="Waiting_For_Exporter_Port_To_Upload_Documents.";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,shipper,exporterPortName+'<img src="assets/img/location.png" width="12px" height="12px">',importerPortName,importerName,'<a href=confirmShippingDone.html?assetId='+item.assetId+'&message='+messageValue+'>Goods Arrived At Exporter Port.Pending Upload of Custom Docs','','<a href=history.html?assetId='+item.assetId+'>View');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				if(status=="BillOfLading_Uploaded"){
	 					//dummy
	 					var messageValue="Custom_Docs_Uploaded.Final_Approval_Pending_From_Exporter_Port";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,shipper,exporterPortName+'<img src="assets/img/location.png" width="12px" height="12px">',importerPortName,importerName,'<a href=generic.html?assetId='+item.assetId+'&message='+messageValue+'>Custom Docs Uploaded.Final Validation Pending.','','<a href=history.html?assetId='+item.assetId+'>View');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				if(status=="validated_at_exporter_port"){
	 					//dummy
	 					var messageValue="Goods_Released_To_Importer_Port.Pending_Arrival.";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,shipper,exporterPortName+'<img src="assets/img/transitnew.gif" width="20px" height="15px">',importerPortName,importerName,'<a href=generic.html?assetId='+item.assetId+'&message='+messageValue+'>Goods Released To Exporter Port.Pending Arrival.','','<a href=history.html?assetId='+item.assetId+'>View');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				if(status=="Arrived_at_Importer_Port"){
	 					//dummy
	 					var messageValue="Goods_Arrived_At_Importer_Port.";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,shipper,exporterPortName,importerPortName+'<img src="assets/img/location.png" width="12px" height="12px">',importerName,'<a href=generic.html?assetId='+item.assetId+'&message='+messageValue+'>Goods Arrived at Importer Port.Pending Approval From Importer Bank','','<a href=history.html?assetId='+item.assetId+'>View');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				if(status=="issued_BOL_to_importer_bank"){
	 					//dummy
	 					var messageValue="Bill_Of_Lading_Issued_To_Importer_Bank.";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,shipper,exporterPortName,importerPortName+'<img src="assets/img/location.png" width="12px" height="12px">',importerName,'<a href=generic.html?assetId='+item.assetId+'&message='+messageValue+'>BOL Issued to Importer Bank.Pending Approval From Exporter Bank','','<a href=history.html?assetId='+item.assetId+'>View');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				if(status=="exporter_bank_approves_payment"){
	 					//dummy
	 					var messageValue="Exporter_Bank_Approves_Payment.Pending_Importer_Approval";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,shipper,exporterPortName,importerPortName+'<img src="assets/img/location.png" width="12px" height="12px">',importerName,'ExporterBank Approval Received.Request BOL','<a href=requestBOL.html?assetId='+item.assetId+'&message='+messageValue+'>View Details','<a href=history.html?assetId='+item.assetId+'>View');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				if(status=="issued_BOL_to_importer"){
	 					//dummy
	 					var messageValue="BOL_Recieved.";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,shipper,exporterPortName,importerPortName+'<img src="assets/img/location.png" width="12px" height="12px">',importerName,'<a href=generic2.html?assetId='+item.assetId+'&message='+messageValue+'>BOL Recieved.View Details','','<a href=history.html?assetId='+item.assetId+'>View');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				if(status=="issued_BOL_to_importerPort"){
	 					//dummy
	 					var messageValue="BOL_Issued_To_Importer_Port.Pending_Final_Approval.";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,shipper,exporterPortName,importerPortName+'<img src="assets/img/transitnew.gif" width="20px" height="15px">',importerName,'<a href=generic2.html?assetId='+item.assetId+'&message='+messageValue+'>BOL Issued To Importer Port.Final Validation Pending','','<a href=history.html?assetId='+item.assetId+'>View');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				if(status=="issued_goods_to_importer"){
	 					//dummy
	 					var messageValue="Goods_Released.Update_Arrival.";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,shipper,exporterPortName,importerPortName,importerName+'<img src="assets/img/location.png" width="12px" height="12px">','Goods Released. Update Arrival','<a href=confirmArrivalAtImporter.html?assetId='+item.assetId+'&message='+messageValue+'>View Details','<a href=history.html?assetId='+item.assetId+'>View');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				if(status=="Arrived_at_Importer"){
	 					//dummy
	 					var messageValue="Goods_Arrived.Upload_Goods_Recieved_Docs.";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,shipper,exporterPortName,importerPortName,importerName+'<img src="assets/img/location.png" width="12px" height="12px">','Goods Arrived at Importer. Upload Documents','<a href=uploadGoodsRecieved.html?assetId='+item.assetId+'&message='+messageValue+'>View Details','<a href=history.html?assetId='+item.assetId+'>View');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				if(status=="DELIVERED"){
	 					//dummy
	 					var messageValue="Asset_Delivered.";
	 					//var messageValue="Goods_Arrived.Upload_Goods_Recieved_Docs.";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,shipper,exporterPortName,importerPortName,importerName+'<img src="assets/img/location.png" width="12px" height="12px">','<a href=finalValidationInporterDone.html?assetId='+item.assetId+'&message='+messageValue+'>Asset Delivered.','','<a href=history.html?assetId='+item.assetId+'>View');

						dataSets.push(tempLists);
						tempLists=[];
	 				}

	 				
	 				
/*
	 				if(status=="BillOfLading_Uploaded" &&isValidatedByImporter==false){
	 					//ref
	 					
	 					var messageValue="Provide_Initial_Approval.";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName+'<img src="assets/img/location.png" width="12px" height="12px">',importerPortName,statusNew,'Validation Pending','<a href=validateBillOfLading.html?assetId='+item.assetId+'&message='+messageValue+'>View and Validate ','<a href=history.html?assetId='+item.assetId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				if(status=="BillOfLading_Uploaded" &&isValidatedByImporter==true){
	 					//ref
	 					var messageValue="You_have_Approved.Pending_Approval_From_Other_Users.";

	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName+'<img src="assets/img/location.png" width="12px" height="12px">',importerPortName,'<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'&message='+messageValue+'>Pending Validation From other users','','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_first_deposit_exp" &&isValidatedByImporter==false && (isValidatedByExporterPort==false || isValidatedByExporter==false)){
	 					//ref
	 					
	 					var messageValue="Provide_Initial_Approval.";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName+'<img src="assets/img/location.png" width="12px" height="12px">',importerPortName,'Bill of Lading validated by exporter Port','Validation Pending','<a href=validateBillOfLading.html?assetId='+item.assetId+'&message='+messageValue+'>View and Validate','<a href=history.html?assetId='+item.assetId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				if(status=="sign_first_deposit_exp" &&isValidatedByImporter==true && (isValidatedByExporterPort==false || isValidatedByExporter==false)){
	 					//ref
	 					
	 					var messageValue="You_have_Approved.Pending_Approval_From_Other_Users.";

	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName+'<img src="assets/img/location.png" width="12px" height="12px">',importerPortName,'Bill of Lading validated by exporter Port','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'&message='+messageValue+'>Pending Validation From other users','','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_first_deposit_exp" &&isValidatedByImporter==true && (isValidatedByExporterPort==true && isValidatedByExporter==true)){
	 					//ref
	 					
	 					var messageValue="Final_Approval_Pending_From_Exporter_Port.";

	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName+'<img src="assets/img/location.png" width="12px" height="12px">',importerPortName,'Bill of Lading validated by exporter Port','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'&message='+messageValue+'>Pending Validation Final Validation','','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_first_deposit_ex" &&isValidatedByImporter==false){
	 					//ref
	 					
	 					var messageValue="Provide_Initial_Approval.";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName+'<img src="assets/img/location.png" width="12px" height="12px">',importerPortName,'Bill of Lading validated by exporter ','Validation Pending','<a href=validateBillOfLading.html?assetId='+item.assetId+'&message='+messageValue+'>View and Validate ','<a href=history.html?assetId='+item.assetId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				if(status=="sign_first_deposit_ex" &&isValidatedByImporter==true && (isValidatedByExporterPort==false || isValidatedByExporter==false)){
	 					//ref
	 					
	 					var messageValue="You_have_Approved.Pending_Approval_From_Other_Users.";

	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName+'<img src="assets/img/location.png" width="12px" height="12px">',importerPortName,'Bill of Lading validated by exporter ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'&message='+messageValue+'>Pending Validation From other users','','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_first_deposit_ex" &&isValidatedByImporter==true && (isValidatedByExporterPort==true && isValidatedByExporter==true)){
	 					//ref
	 					
	 					var messageValue="Final_Approval_Pending_From_Exporter_Port.";

	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName+'<img src="assets/img/location.png" width="12px" height="12px">',importerPortName,'Bill of Lading validated by exporter ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'&message='+messageValue+'>Pending Final Validation','','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				
	 				
	 				if(status=="sign_first_deposit_im" &&isValidatedByImporter==false){
	 					//ref
	 					var messageValue="Provide_Initial_Approval.";


	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName+'<img src="assets/img/location.png" width="12px" height="12px">',importerPortName,'Bill of Lading validated by Importer ','Validation Pending','<a href=validateBillOfLading.html?assetId='+item.assetId+'&message='+messageValue+'>View and Validate ','<a href=history.html?assetId='+item.assetId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				if(status=="sign_first_deposit_im" &&isValidatedByImporter==true && (isValidatedByExporterPort==false || isValidatedByExporter==false)){
	 					//ref
	 					var messageValue="You_have_Approved.Pending_Approval_From_Other_Users.";


	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName+'<img src="assets/img/location.png" width="12px" height="12px">',importerPortName,'Bill of Lading validated by Importer ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'&message='+messageValue+'>Pending Validation From other users','','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_first_deposit_im" &&isValidatedByImporter==true && (isValidatedByExporterPort==true && isValidatedByExporter==true)){
	 					//ref
	 					var messageValue="Final_Approval_Pending_From_Exporter_Port.";


	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName+'<img src="assets/img/location.png" width="12px" height="12px">',importerPortName,'Bill of Lading validated by Importer ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'&message='+messageValue+'>Pending Final Validation','','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="validated_at_exporter_port"){
	 					//ref
	 					var messageValue="Validation_Complete_At_Exporter_Port.Pending_Arrival_At_Importer_Port";


	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName+'<img src="assets/img/location.png" width="12px" height="12px">',importerPortName,'Bill of Lading validated by Importer ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'&message='+messageValue+'>Pending Arrival at Importer Port','','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 					
	 					
	 				
	 				

	 				// open for validation 
	 				if(status=="Arrived_at_Importer_Port" && isValidatedByImporterAtImporterPort==false){
	 					//ref
	 					
	 					var messageValue="Provide_Final_Approval.";

	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName,importerPortName+'<img src="assets/img/location.png" width="12px" height="12px">','Arrived at Importer Port ','Validate Document','<a href=validateBillOfLadingFinal.html?assetId='+item.assetId+'&message='+messageValue+'>View and Validate','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				
	 				
	 				if(status=="sign_second_deposit_imp" && isValidatedByImporterAtImporterPort==true && (isValidatedByExporterAtImporterPort==false || isValidatedByImporterPort==false)){
	 					//ref
	 					
	 					var messageValue="You_have_Approved.Pending_Approval_From_Other_Users.";

	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName,importerPortName+'<img src="assets/img/location.png" width="12px" height="12px">','Document validated at Importer Port ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'&message='+messageValue+'>Pending Validation From Other Users','','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_second_deposit_imp" && isValidatedByImporterAtImporterPort==false && (isValidatedByExporterAtImporterPort==true || isValidatedByImporterPort==true)){
	 					//ref
	 					var messageValue="Provide_Final_Approval.";

	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName,importerPortName+'<img src="assets/img/location.png" width="12px" height="12px">','Document validated at Importer Port ','Validate Document','<a href=validateBillOfLadingFinal.html?assetId='+item.assetId+'&message='+messageValue+'>View and Validate','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_second_deposit_imp" && isValidatedByImporterAtImporterPort==true && (isValidatedByExporterAtImporterPort==true && isValidatedByImporterPort==true)){
	 					//ref
	 					var messageValue="Final_Approval_Pending_From_Importer_Port.";

	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName,importerPortName+'<img src="assets/img/location.png" width="12px" height="12px">','Document validated at Importer Port ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'&message='+messageValue+'>Final Validation Pending','','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				

	 				if(status=="sign_second_deposit_ex" && isValidatedByImporterAtImporterPort==true && (isValidatedByExporterAtImporterPort==false || isValidatedByImporterPort==false)){
	 					//ref
	 					var messageValue="You_have_Approved.Pending_Approval_From_Other_Users.";


	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName,importerPortName+'<img src="assets/img/location.png" width="12px" height="12px">','Document validated at Exporter ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'&message='+messageValue+'>Pending Validation From Other Users','','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_second_deposit_ex" && isValidatedByImporterAtImporterPort==false && (isValidatedByExporterAtImporterPort==true || isValidatedByImporterPort==true)){
	 					//ref
	 					var messageValue="Provide_Final_Approval.";


	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName,importerPortName+'<img src="assets/img/location.png" width="12px" height="12px">','Document validated at Exporter ','Validate Document','<a href=validateBillOfLadingFinal.html?assetId='+item.assetId+'&message='+messageValue+'>View and Validate','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_second_deposit_ex" && isValidatedByImporterAtImporterPort==true && (isValidatedByExporterAtImporterPort==true && isValidatedByImporterPort==true)){
	 					//ref
	 					var messageValue="Final_Approval_Pending_From_Importer_Port.";


	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName,importerPortName+'<img src="assets/img/location.png" width="12px" height="12px">','Document validated at Exporter ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'&message='+messageValue+'>Final Validation Pending','','<a href=history.html?assetId='+item.assetId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				
	 				if(status=="sign_second_deposit_im" && isValidatedByImporterAtImporterPort==true && (isValidatedByExporterAtImporterPort==false || isValidatedByImporterPort==false)){
	 					//ref
	 					
	 					var messageValue="You_have_Approved.Pending_Approval_From_Other_Users.";

	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName,importerPortName+'<img src="assets/img/location.png" width="12px" height="12px">','Document validated at Importer ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'&message='+messageValue+'>Pending Validation From Other Users','','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_second_deposit_im" && isValidatedByImporterAtImporterPort==false){
	 					//ref
	 					
	 					var messageValue="Provide_Final_Approval.";

	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName,importerPortName+'<img src="assets/img/location.png" width="12px" height="12px">','Document validated at Importer ','Validate Document','<a href=validateBillOfLadingFinal.html?assetId='+item.assetId+'&message='+messageValue+'>View and Validate','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				

	 				if(status=="sign_second_deposit_im" && isValidatedByImporterAtImporterPort==true && (isValidatedByExporterAtImporterPort==true && isValidatedByImporterPort==true)){
	 					//ref
	 					var messageValue="Final_Approval_Pending_From_Importer_Port.";


	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName,importerPortName+'<img src="assets/img/location.png" width="12px" height="12px">','Document validated at Importer ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'&message='+messageValue+'>Final Validation Pending','','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				
	 			// arrival at inporter
	 				
	 				if(status=="validated_at_importer_port"){
	 					//ref
	 					
	 					var messageValue="Confirm_Arrival_Of_Asset.";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName,exporterPortName,importerPortName+'<img src="assets/img/location.png" width="12px" height="12px">','Final Validation Recieved  ','Shipping to Importer','<a href=confirmArrivalAtImporter.html?assetId='+item.assetId+'&message='+messageValue+'>ConfirmArrival','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				
	 				if(status=="Arrived_at_Importer"){
	 					//ref
	 					var messageValue="Upload_Goods_Recieved_Documents.";

	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName+'<img src="assets/img/location.png" width="12px" height="12px">',exporterPortName,importerPortName,'Asset Arrived at Importer  ','Upload Goods Recieved Documents','<a href=uploadGoodsRecieved.html?assetId='+item.assetId+'&message='+messageValue+'>Upload Docs','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="goodsReceived_Uploaded"){
	 					//ref
	 					
	 					var messageValue="Make_Final_Payment_To_Exporter.";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,importerName+'<img src="assets/img/location.png" width="12px" height="12px">',exporterPortName,importerPortName,'Goods Recieved Document Uploaded  ','Final Validation Pending','<a href=finalValidationInporter.html?assetId='+item.assetId+'&message='+messageValue+'>View and Validate','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 			
	 				if(status=="delivered"){
	 					//ref
	 					
	 					var messageValue="Asset_Delivered.";
	 					tempLists.push(i+1,item.assetId,convdataTime,exporterName,shipper,importerName+'<img src="assets/img/location.png" width="12px" height="12px">',exporterPortName,importerPortName,'Final Validation Complete  ','<a href=finalValidationInporterDone.html?assetId='+item.assetId+'&message='+messageValue+'>Asset Delivered','','<a href=history.html?assetId='+item.assetId+'>View History');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				*/
	 				
	 				
	 				
	 			//	});
	 				});
	 	//		 });
	 				
	 				 });
					//alert(dataSet);		               
					 			        	
	 		
	 			
	 			
	 			setTimeout(function(){
	 				oTable = 	$('#allAssets').dataTable( {
						data: dataSets,
						columns: [
						    { title: "SNo" },
						    { title: "ID" },
						    { title: "Created At" },
						    { title: "Exporter" },
						    { title: "Shipper" },
						    { title: "Exporter Port" },
						    { title: "Importer Port" },
						    { title: "Importer " },

						    { title: "Status" },
						   
						    { title: "Action" },
						    { title: "History" }
						    
						    
						    
						    
						    
						    

						  
						]
			    		} );
	 				},1200);
	 			
	 		
		
		 
	//});
					//$('#res').dataTable();

			//alert(dataSet);
		
	 
});
      