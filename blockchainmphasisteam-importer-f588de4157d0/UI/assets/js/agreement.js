$(document).ready(function(){
	
	/*
	var ipAdd=ipAddress();
	var port=portNo();
*/
		 var tempLists=[];
		 var dataSets=[];
		
		// alert(ipAdd);
		 $.get("/getAllAgreements", function(response){

	 			$.each(response.records, function(i, item) {
	 				var agreementMessage=item.agreementMessage
	 				
	$.get("/getOfferDetails?offerId="+item.offerId, function(responseData){
	 					
	 					$.get("/getOffer?offerId="+item.offerId, function(responseDataNew){
	 				
	 						$.get("/getOfferEntities?offerId="+item.offerId, function(responseDataVale){
	 						var assetName=responseDataNew.assetName;
	 						var quantity=responseDataNew.quantity+' '+responseDataNew.unit;
	 						var createdBy=responseDataNew.exporter;
	 						
	 						var buyer=responseDataVale.importerName;
	 				var unixtimestamp = responseData.createdAt.toString().slice(0,-9);
	 			

	 				if(agreementMessage=="VPFI"){
	 					tempLists.push(i+1,item.agreementId,item.offerId,assetName,quantity,createdBy,buyer,'Agreement Created','<a href=offerAccepted.html?offerId='+item.offerId+'&agreementId='+item.agreementId+'>Pending Validation','<a href=agreementHistory.html?agreement='+item.agreementId+'&offerId='+item.offerId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				if(agreementMessage=="WFLOC"){
	 					//tempLists.push(i+1,item.agreementId,item.offerId,assetName,quantity,createdBy,buyer,'<a href=contractAccepted.html?offerId='+item.offerId+'&agreementId='+item.agreementId+'>Contract Accepted.Waiting For LOC','');
	 					tempLists.push(i+1,item.agreementId,item.offerId,assetName,quantity,createdBy,buyer,'<a href=contractAcceptedExporter.html?offerId='+item.offerId+'&agreementId='+item.agreementId+'>LOC Draft Pending Validation from Exporter.','','<a href=agreementHistory.html?agreement='+item.agreementId+'&offerId='+item.offerId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				if(agreementMessage=="LDVE"){
	 					tempLists.push(i+1,item.agreementId,item.offerId,assetName,quantity,createdBy,buyer,'<a href=contractAccepted.html?offerId='+item.offerId+'&agreementId='+item.agreementId+'>Contract Accepted.Waiting For LOC','','<a href=agreementHistory.html?agreement='+item.agreementId+'&offerId='+item.offerId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				if(agreementMessage=="VPFEB"){
	 					var statusValue="Pending_LOC_Validation_from_Exporter_Bank";
	 					tempLists.push(i+1,item.agreementId,item.offerId,assetName,quantity,createdBy,buyer,'<a href=locIssued.html?offerId='+item.offerId+'&agreementId='+item.agreementId+'&status='+statusValue+'>LOC Issued ','','<a href=agreementHistory.html?agreement='+item.agreementId+'&offerId='+item.offerId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				// dummy
	 				if(agreementMessage=="RTT"){
	 					var statusValue="Offer_Ready_To_Trade";
	 					tempLists.push(i+1,item.agreementId,item.offerId,assetName,quantity,createdBy,buyer,'<a href=locIssued.html?offerId='+item.offerId+'&agreementId='+item.agreementId+'&status='+statusValue+'>Offer Ready For Trade ','','<a href=agreementHistory.html?agreement='+item.agreementId+'&offerId='+item.offerId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}

					//alert(dataSet);		               
					 			        	
				});
	 						
	 					 } );
	  } );
	  });
					//$('#res').dataTable();

	 						setTimeout(function(){
	 							$('#allAgreement').DataTable( {
	 								data: dataSets,
	 								columns: [
	 								    { title: "SNo" },
	 								    { title: "Agreement ID" },
	 								    { title: "OfferID" },
	 								    { title: "Asset Name" },
	 								    { title: "Quantity" },
	 								    { title: "Seller" },
	 								    { title: "Buyer" },
	 								    { title: "Status" },
	 								    { title: "Action" },
	 								   { title: "History" }
	 								    
	 								    
	 								    
	 								    
	 								    

	 								  
	 								]
	 					    		} );
	 					 					},1500);
	 					        } );
	 					 			
//	 					}
	 					
	 						 
	 				});


	 				      