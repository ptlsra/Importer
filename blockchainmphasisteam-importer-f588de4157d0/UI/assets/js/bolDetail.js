 $('#bolHistory').click(function(){
		        		
		/*
		var ipAdd=ipAddress();
		var port=portNo();
	*/
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
		
		
		        	
	 $.get("/getBOLHistory?assetId="+assetId, function(responseDataEvent){
		 
		 
		// $("#bolTable").val('');
		 document.getElementById("bolTable").innerHTML='';
			var table = document.getElementById("bolTable");
			
			var row = table.insertRow(0);

	  		var cell1 = row.insertCell(0);
	  		var cell2 = row.insertCell(1);
	  		var cell3 = row.insertCell(2);
	  		var cell4 = row.insertCell(3);
	  		var cell5 = row.insertCell(4);
	  		var cell6 = row.insertCell(5);
	  		var cell7 = row.insertCell(6);
	  		
	  		// Add some text to the new cells:
	  		cell1.innerHTML = "SNo";
	  		cell2.innerHTML = "Current Owner"; 
	  		cell3.innerHTML = "Previous Owner";
	  		cell4.innerHTML = "Block Number";
	  		cell5.innerHTML = "Tx ID";
	  		cell6.innerHTML = "TimeStamp";
	  		cell7.innerHTML = "Executed By";
	  		
			
		
	  		
  		  $.each(responseDataEvent.records, function(i, item) {
  			  
  			
  			  
  			 var timeValue=item.timeStamp.toString();
  			
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

  			var row = table.insertRow(i+1);

  	  		var cell1 = row.insertCell(0);
  	  		var cell2 = row.insertCell(1);
  	  		var cell3 = row.insertCell(2);
  	  		var cell4 = row.insertCell(3);
  	  		var cell5 = row.insertCell(4);
  	  		var cell6 = row.insertCell(5);
  	  		var cell7 = row.insertCell(6);
  	  		
  	  		// Add some text to the new cells:
  	  		cell1.innerHTML = i+1;
  	  		cell2.innerHTML = item.ownedBy; 
  	  		cell3.innerHTML = item.previousOwner;
  	  		cell4.innerHTML = item.blockNumber;
  	  	
  	  		cell5.innerHTML ='<a href=# data-toggle="tooltip" title='+item.txId+'>'+ item.txId.substr(0,20)+'...'+'</a>';
  	  		cell6.innerHTML = convdataTime;
  	  		cell7.innerHTML = item.executedBy;
  	  		
  			  
  		  });
  		  
  		 $("#bolModal").modal();
  		  
	  });
		        
		        });
			 