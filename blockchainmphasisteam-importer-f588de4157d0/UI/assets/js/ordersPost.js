   
		
			


			$("form#createOfferTab").submit(function(e) {
			    e.preventDefault();
			   var assetName= $('#assetName').val();
			   var assetDescription= $('#assetDescription').val();
			   var quantity= $('#quantity').val();
			   var unit= $('#unit').val();
			   var price= $('#price').val();
			   var importer= $('#importerName').val();
			   var exporter= $('#selectExporter').val();
			   assetDescription= assetDescription.split(" ").join("_");
			   assetDescription=assetDescription.toLowerCase();s
			   $.ajax({
			   	
			       dataType:"json",
			       contentType: 'application/json; charset=UTF-8',
			       url:"/createAgreement?assetName="+assetName+"&assetDescription="+assetDescription+"&quantity="+quantity+"&unit="+unit+"&importer="+importer+"&price="+price+"&exporter="+exporter,		

			       type:"POST",
			       global:false,
			       async:false, 
			       success: function(result){
			   
			    	   var txId=result.txId;
					   document.getElementById("txHashstatus").innerHTML = txId; 

					   $("#txSuccessModal").modal();
			    		   
			    		   setTimeout(function(){ 
			                   
			    	              window.location.href="orders.html";
			    	              return false;
			    	           }, 2000);
			    		   			
			    	   
			    		   
			    	   }
						
						
						
			           
			         
			    	
			    });
			});
