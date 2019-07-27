


			$("form#registerimporterform").submit(function(e) {
			    e.preventDefault();
			   var importerName= $('#importerName').val();
			   var selectImporterPort= $('#selectImporterPort').val();
			   var importerBank= $('#selectImporterBankList').val();
			   var city= $('#city').val();
			   $.ajax({
			   	
			       dataType:"json",
			       contentType: 'application/json; charset=UTF-8',
			       url:"/registerImporter?importerName="+importerName+"&importerBankAddress="+importerBank+"&assignedImporterPort="+selectImporterPort+"&city="+city,		

			       type:"POST",
			       global:false,
			       async:false, 
			       success: function(result){
			   
			    	   var txId=result.txId;
					   document.getElementById("txHashstatus").innerHTML = txId; 

					   $("#txSuccessModal").modal();
			    		   
			    		   setTimeout(function(){ 
			                   
			    	              window.location.href="login.html";
			    	              return false;
			    	           }, 2000);
			    		   			
			    	   
			    		   
			    	   }
						
						
						
			           
			         
			    	
			    });
			});
