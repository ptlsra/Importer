 function check(a){
    	// alert(a);
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
    		a=a.replace(/_/g, ' ');
    	 $.get("/getAssetTxDetails?assetId="+assetId+"&eventName="+a, function(responseDataEvent){
   		  $.each(responseDataEvent.records, function(i, item) {
   			//alert(item.transactionHash);
   			document.getElementById('txIdValTx').innerHTML=item.transactionHash;
   			document.getElementById('eventNameValTx').innerHTML=item.eventName;
   			document.getElementById('blockNumberValTx').innerHTML=item.blockNumber;
   			document.getElementById('executedByTxVal').innerHTML=item.executedBy;
   			
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
		  
   			document.getElementById('timestampTxVal').innerHTML=convdataTime;
   			
   			
   		 $("#txModal").modal();

   			 // alert(item);
   		  });
    	 });
    	// $("#txModal").modal();
		}
     
     
     function check2(eventVal){
     	// alert(a);
     		var ipAdd=ipAddress();
     		var port=portNo();
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
     		eventVal=eventVal.replace(/_/g, ' ');
     		var arrNew=[];
     		if(eventVal=="UpdateAsset1"){
     	 $.get("/getAssetTxDetails?assetId="+assetId+"&eventName=UpdateAssetArrival", function(responseDataEvent){
    		//  $.each(responseDataEvent.records, function(i, item) {
    			//alert(item.transactionHash);
    			//alert(responseDataEvent.records.length);
    	//	var item=responseDataEvent.records[2];
    	var recLength=responseDataEvent.records.length;
    	if(recLength==1){
    		
    		arrNew.push(0);
    		}
		if(recLength==2){
    		
    		arrNew.push(1);
    		}
		if(recLength==3){
    		
    		arrNew.push(2);
    		}
    	var item=responseDataEvent.records[arrNew[0]];
    			document.getElementById('txIdValTx').innerHTML=item.transactionHash;
    			document.getElementById('eventNameValTx').innerHTML=item.eventName;
    			document.getElementById('blockNumberValTx').innerHTML=item.blockNumber;
    			document.getElementById('executedByTxVal').innerHTML=item.executedBy;
    			
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
 		  
    			document.getElementById('timestampTxVal').innerHTML=convdataTime;
    			
    			
    		 $("#txModal").modal();

    			 // alert(item);
    		
     	 });
     		}
     	 
     		if(eventVal=="UpdateAsset2"){
     	     	 $.get("/getAssetTxDetails?assetId="+assetId+"&eventName=UpdateAssetArrival", function(responseDataEvent){
     	    		//  $.each(responseDataEvent.records, function(i, item) {
     	    			//alert(item.transactionHash);
     	     		var recLength=responseDataEvent.records.length;
     	       	
     	   		if(recLength==2){
     	       		
     	       		arrNew.push(0);
     	       		}
     	   		if(recLength==3){
     	       		
     	       		arrNew.push(1);
     	       		}
     	    		var item=responseDataEvent.records[arrNew[0]];
     	    			document.getElementById('txIdValTx').innerHTML=item.transactionHash;
     	    			document.getElementById('eventNameValTx').innerHTML=item.eventName;
     	    			document.getElementById('blockNumberValTx').innerHTML=item.blockNumber;
     	    			document.getElementById('executedByTxVal').innerHTML=item.executedBy;
     	    			
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
     	 		  
     	    			document.getElementById('timestampTxVal').innerHTML=convdataTime;
     	    			
     	    			
     	    		 $("#txModal").modal();

     	    			 // alert(item);
     	    		
     	     	 });
     	     		}
     	     	 
     		if(eventVal=="UpdateAsset3"){
    	     	 $.get("/getAssetTxDetails?assetId="+assetId+"&eventName=UpdateAssetArrival", function(responseDataEvent){
    	    		//  $.each(responseDataEvent.records, function(i, item) {
    	    			//alert(item.transactionHash);
    	    		var item=responseDataEvent.records[0];
    	    			document.getElementById('txIdValTx').innerHTML=item.transactionHash;
    	    			document.getElementById('eventNameValTx').innerHTML=item.eventName;
    	    			document.getElementById('blockNumberValTx').innerHTML=item.blockNumber;
    	    			document.getElementById('executedByTxVal').innerHTML=item.executedBy;
    	    			
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
    	 		  
    	    			document.getElementById('timestampTxVal').innerHTML=convdataTime;
    	    			
    	    			
    	    		 $("#txModal").modal();

    	    			 // alert(item);
    	    		
    	     	 });
    	     		}
     	// $("#txModal").modal();
 		}