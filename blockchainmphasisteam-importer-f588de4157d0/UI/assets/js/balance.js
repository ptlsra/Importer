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
	 				var status=item.assetStatus;
	 				var message=item.message;
	 				var assetId=item.assetId;
	 				//alert(assetId);
	 				$.get("/getPortValidationDetailsByAssetId?assetId="+assetId, function(responseData){
	 					
	 					
	 					var isValidatedByExporter=responseData.isValidatedByExporter;
	 					var isValidatedByExporterPort=responseData.isValidatedByExporterPort;
	 					var isValidatedByImporter=responseData.isValidatedByImporter;
	 					var isValidated=responseData.isValidated;
	 					
	 					var isValidatedByExporterAtImporterPort=responseData.isValidatedByExporterAtImporterPort;
	 					var isValidatedByImporterPort=responseData.isValidatedByImporterPort;
	 					var isValidatedByImporterAtImporterPort=responseData.isValidatedByImporterAtImporterPort;
	 					var isValidatedImporterPort=responseData.isValidatedImporterPort;
	 					
	 
	 				message=message.replace(/_/g, ' ');
	 				
	 				var statusNew=status.replace(/_/g, ' ');
	 				
	 				
	 				
	 				
	 				// final validation completed at exporter Port
	 				
	 				if(status=="validated_at_exporter_port"){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Final Validation Complete at Exporter Port ','<a href=checkBalance.html?assetId='+item.assetId+'>Check Balance');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				// final validation completed at importer Port
	 				
	 				// open for validation 
	 				if(status=="Arrived_at_Importer_Port" && isValidatedByImporterPort==false){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Arrived at Importer Port ','<a href=checkBalance.html?assetId='+item.assetId+'>Check Balance');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				
	 				
	 				if(status=="sign_second_deposit_imp" && isValidatedByImporterPort==true && (isValidatedByImporterAtImporterPort==false || isValidatedByExporterAtImporterPort==false)){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Document validated at Importer Port ','<a href=checkBalance.html?assetId='+item.assetId+'>Check Balance');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_second_deposit_imp" && isValidatedByImporterPort==true && (isValidatedByImporterAtImporterPort==true && isValidatedByExporterAtImporterPort==true)){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Document validated at Importer Port ','<a href=checkBalance.html?assetId='+item.assetId+'>Check Balance');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_second_deposit_ex" && isValidatedByImporterPort==false){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Document validated at Exporter ','<a href=checkBalance.html?assetId='+item.assetId+'>Check Balance');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_second_deposit_ex" && isValidatedByImporterPort==true && (isValidatedByImporterAtImporterPort==false || isValidatedByExporterAtImporterPort==false)){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Document validated at Exporter ','<a href=checkBalance.html?assetId='+item.assetId+'>Check Balance');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_second_deposit_ex" && isValidatedByImporterPort==true && (isValidatedByImporterAtImporterPort==true && isValidatedByExporterAtImporterPort==true)){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Document validated at Exporter ','<a href=checkBalance.html?assetId='+item.assetId+'>Check Balance');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				
	 				
	 				if(status=="sign_second_deposit_im" && isValidatedByImporterPort==false){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Document validated at Importer  ','<a href=checkBalance.html?assetId='+item.assetId+'>Check Balance');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_second_deposit_im" && isValidatedByImporterPort==true && (isValidatedByImporterAtImporterPort==false || isValidatedByExporterAtImporterPort==false)){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Document validated at Importer  ','<a href=checkBalance.html?assetId='+item.assetId+'>Check Balance');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_second_deposit_im" && isValidatedByImporterPort==true && (isValidatedByImporterAtImporterPort==true && isValidatedByExporterAtImporterPort==true)){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Document validated at Importer  ','<a href=checkBalance.html?assetId='+item.assetId+'>Check Balance');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				
	 				
	 				
	 				// shipping to importer port
	 				
	 				
	 				if(status=="validated_at_importer_port"){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Final Validation Recieved  ','<a href=checkBalance.html?assetId='+item.assetId+'>Check Balance');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				
	 				
	 				if(status=="Arrived_at_Importer"){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Asset Arrived at Importer  ','<a href=checkBalance.html?assetId='+item.assetId+'>Check Balance');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				// diff
	 				if(status=="goodsReceived_Uploaded"){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Final Validation Pending','<a href=checkBalance.html?assetId='+item.assetId+'>Check Balance');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="delivered"){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Final Validation Complete  ','<a href=checkBalance.html?assetId='+item.assetId+'>Check Balance');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				
	 				
	 				});
	 				
	 				
	 					//alert(dataSet);		               
	 			});
 				setTimeout(function(){

	 			$('#allAssets').dataTable( {
					data: dataSets,
					columns: [
					    { title: "SNo" },
					    { title: "Asset ID" },
					    { title: "Location" },
					    { title: "Status" },
					    { title: "Action" }
					    
					    
					    
					    
					    

					  
					]
		    		} );
	 			
	 			},3500);
	 			
		});
		
	 			
	 			
		
	 
});
      