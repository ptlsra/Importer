$(document).ready(function(){
	
	/*
	var ipAdd=ipAddress();
	var port=portNo();
	*/
	 var tempLists=[];
	 var dataSets=[];
	
	 var importerName=localStorage.getItem("importerName");

		$('#importerName').val(importerName);
	  
		
	$('#co').on("click",function() {
	
		var importerName=localStorage.getItem("importerName");

		$('#importerName').val(importerName);
		
	
		
		
		
		

		 $('#selectExporter').append($('<option>', { 
		        value: 'None',
		        text : 'None' 
		    }
		    
		    ));
		 
		$.getJSON("/getAllExporters", function(response){

		$.each(response.exporter_list, function (i, item) {
		    $('#selectExporter').append($('<option>', { 
		        value: item.exporter,
		        text : item.exporter 
		    }
		    
		    ));
		});
			});
		
		
		
		
	
	
		// $('#link').attr('value', exporterName);
		 
		
	});
	
	//var active = $( "." ).tabs( "option", "active" );
	
	 // alert($('#ao').hasClass("active"));
		
	//$('#ao').on("click", function(){
		
	$('#commonFooter').hide();
	
		
	//	$.get("http://"+ipAdd+":"+port+"/getOfferDetailsForOrder", function(response){
	$.get("/getAllOffers", function(response){
			 // alert(JSON.stringify(response));
	 			$.each(response.records, function(i, item) {
	 				var status=item.agreementStatus;
	 		//alert(status);
	 				//$.get("http://"+ipAdd+":"+port+"/getOfferDetails?offerId="+item.agreementId, function(responseData){
	 					
	 				//	$.get("http://"+ipAdd+":"+port+"/getOffer?offerId="+item.agreementId, function(responseDataNew){
	 				
	 						var assetName=item.assetName;
	 						var quantity=item.quantity+' '+item.unit;
	 						var createdBy=item.importer;
	 				var unixtimestamp = item.createdAt.toString().slice(0,-9);
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

					if(status=="Created"){
	 					tempLists.push(i+1,item.agreementId,assetName,quantity,convdataTime,createdBy,'Purchase Order Created.','<a href=offerPlaced.html?agreementId='+item.agreementId+'>Update Details','<a href=agreementHistory.html?agreementId='+item.agreementId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				if(status=="Available"){
	 					tempLists.push(i+1,item.agreementId,assetName,quantity,convdataTime,createdBy,"Purchase Order Placed",'<a href=placedOffer.html?offerId='+item.agreementId+'>Awaiting Exporter Approval','<a href=agreementHistory.html?agreementId='+item.agreementId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				if(status=="Pending Approval"){
	 					//tempLists.push(i+1,item.agreementId,assetName,quantity,convdataTime,createdBy,"Offer Request Recieved",'<a href=placedOffer.html?offerId='+item.offerId+'>View Details','<a href=offerHistory.html?offerId='+item.offerId+'>View History');
	 					tempLists.push(i+1,item.agreementId,assetName,quantity,convdataTime,createdBy,'Purchase Order Accepted','<a href=offerAccepted.html?agreementId='+item.agreementId+'>Pending Validation','<a href=agreementHistory.html?agreementId='+item.agreementId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				if(status=="Contract Accepted"){
	 					tempLists.push(i+1,item.agreementId,assetName,quantity,convdataTime,createdBy,'<a href=contractAcceptedExporter.html?agreementId='+item.agreementId+'>LOC Draft Pending Validation from Exporter.','','<a href=agreementHistory.html?agreementId='+item.agreementId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
/*
	 				if(status=="Booked"){
	 					var statusValue="Agreement_Pending_Approval_By_Importer.";
	 					tempLists.push(i+1,item.agreementId,assetName,quantity,convdataTime,createdBy,'<a href=offerAcceptedAgreement.html?agreementId='+item.agreementId+'&status='+statusValue+'>Offer Accepted.','','<a href=agreementHistory.html?agreementId='+item.agreementId+'>View History');

					dataSets.push(tempLists);
					tempLists=[];
	 				}*/
	 				
	 				
	 				if(status=="Agreement Accepted"){
	 					var statusValue="Agreement_Accepted_By_Importer.";
	 					tempLists.push(i+1,item.agreementId,assetName,quantity,convdataTime,createdBy,'<a href=contractAccepted.html?agreementId='+item.agreementId+'&status='+statusValue+'>Agreement On Offer accepted By Importer.','','<a href=agreementHistory.html?agreementId='+item.agreementId+'>View History');

					dataSets.push(tempLists);
					tempLists=[];
	 				}
	 				if(status=="Draft Approved By Exporter"){
	 					var statusValue="Draft_Approved_By_Exporter.";
	 					tempLists.push(i+1,item.agreementId,assetName,quantity,convdataTime,createdBy,'<a href=contractAccepted.html?agreementId='+item.agreementId+'&status='+statusValue+'>Waiting For LOC from Importer Bank.','','<a href=agreementHistory.html?agreementId='+item.agreementId+'>View History');

					dataSets.push(tempLists);
					tempLists=[];
	 				}
	 				
	 				if(status=="LOC Issued"){
	 					var statusValue="LOC_Issued_By_Importer_Bank.Validation_Pending_From_Exporter_Bank.";
	 					tempLists.push(i+1,item.agreementId,assetName,quantity,convdataTime,createdBy,'<a href=locIssued.html?agreementId='+item.agreementId+'&status='+statusValue+'>LOC Issued.','','<a href=agreementHistory.html?agreementId='+item.agreementId+'>View History');

					dataSets.push(tempLists);
					tempLists=[];
	 				}
	 			
	 				
	 				if(status=="Ready To Trade"){
	 					var statusValue="Offer_is_Ready_To_Trade.";
	 					tempLists.push(i+1,item.agreementId,assetName,quantity,convdataTime,createdBy,'<a href=offerReady.html?agreementId='+item.agreementId+'&status='+statusValue+'>Offer Ready To Trade.','','<a href=agreementHistory.html?agreementId='+item.agreementId+'>View History');

					dataSets.push(tempLists);
					tempLists=[];
	 				}
	 				
	 				
					//alert(dataSet);		               
					 			        	
			//	});
	 				// } );
	 			} );
	 			if (typeof oTable == 'undefined') {
	 				setTimeout(function(){
	 					$('#hol').hide();
	 					$('#prel').hide();
	 					$('#commonFooter').show();
	 				oTable = 	$('#allOffers').dataTable( {
						data: dataSets,
						columns: [
						    { title: "SNo" },
						    { title: "Offer ID" },
						    { title: "Asset Name" },
						    { title: "Quantity" },
						    { title: "Created At" },
						    { title: "Created By" },
						    { title: "Status" },
						    { title: "Action" },
						    { title: "History" }
						    
						    
						    
						    
						    

						  
						]
			    		} );
	 				},1500);
	 			}
	 			else
	 			{
	 				//oTable.fnClearTable( 0 );
	 				//oTable.fnDraw();
	 				
	 			}
	 		
		       
		
		  });
	  });
					//$('#res').dataTable();

			//alert(dataSet);
		
	 
//});
      