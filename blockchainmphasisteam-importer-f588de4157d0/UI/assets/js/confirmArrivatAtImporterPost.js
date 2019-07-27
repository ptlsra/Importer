
			$("form#confirmarrivalform").submit(function(e) {
			    e.preventDefault();
			   var assetId= $('#assetId').val();
			
			   $.ajax({
			   	
			       dataType:"json",
			       contentType: 'application/json; charset=UTF-8',
			       url:"/updateAssetArrival?assetId="+assetId,		

			       type:"POST",
			       global:false,
			       async:false, 
			       success: function(result){
			   
			    	   var txId=result.txId;
					   document.getElementById("txHashstatus").innerHTML = txId; 

					   $("#txSuccessModal").modal();
			    		   
			    		   setTimeout(function(){ 
			                   
			    	              window.location.href="assets.html";
			    	              return false;
			    	           }, 2000);
			    		   			
			    	   
			    		   
			    	   }
						
						
						
			           
			         
			    	
			    });
			});
