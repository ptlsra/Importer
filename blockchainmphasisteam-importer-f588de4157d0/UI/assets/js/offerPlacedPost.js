	
	   
			$("form#acceptoffernewform").submit(function(e) {
			    e.preventDefault();
			   var agreementId= $('#agreementId').val();
			   var importerName= $('#importerName').val();
			   var importerBankAddress= $('#importerBankAddress').val();
			   var importerPortName= $('#importerPortName').val();
			   var importerBankName= $('#importerBankName').val();
			   var deliveryDate= $('#deliveryDate').val();
			   var timeStampValue=(new Date(deliveryDate)).getTime();
			   timeStampValue=String(timeStampValue);
			   $.ajax({
			   	
			       dataType:"json",
			       contentType: 'application/json; charset=UTF-8',
			       url:"/updateAgreement?agreementId="+agreementId+"&deliveryDate="+timeStampValue+"&importerBankAddress="+importerBankAddress+"&importerBankName="+importerBankName+"&importerPortName="+importerPortName,		

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
