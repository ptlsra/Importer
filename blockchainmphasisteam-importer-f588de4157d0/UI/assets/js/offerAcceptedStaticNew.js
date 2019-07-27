$(document).ready(function(){
	/*
	var ipAdd=ipAddress();
	var port=portNo();
	
	var ipfsIpAdd=ipfsIpAddress();
	var ipfsPort=ipfsPortNo();
	
*/
//	alert($("#importerName").val());
	$('#agreementId').hide();
	$('#importerName').hide();
	
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

	var offerId = getUrlParameter('offerId');
	var agreementId = getUrlParameter('agreementId');
	var status = getUrlParameter('status');
		var statusVal=status.replace(/_/g,' ');

	 document.getElementById('status').innerHTML=statusVal;
	$("#agreementId").val(agreementId);
	var importerName=localStorage.getItem('importerName');
	
	$("#importerName").val(importerName);
	
	document.getElementById('offerPlacedTitle').innerHTML="Details For Offer with Offer ID: "+offerId;
	document.getElementById('offerIdValue').innerHTML=offerId;
	 $.get("/getOffer?offerId="+offerId, function(response){
		 // alert(JSON.stringify(response));
	  document.getElementById('price').innerHTML=response.price;
	  document.getElementById('assetName').innerHTML=response.assetName;
	  document.getElementById('assetDescription').innerHTML=response.assetDescription;
	  document.getElementById('quantity').innerHTML=response.quantity;
	  document.getElementById('unit').innerHTML=response.unit;
	  document.getElementById('createdBy').innerHTML=response.exporter;
	  
  });
  
  $.get("/getOfferEntities?offerId="+offerId, function(responseData){
		 // alert(JSON.stringify(response));
	  document.getElementById('exporterBankName').innerHTML=responseData.exporterBankName;
	  document.getElementById('exporterPortName').innerHTML=responseData.exporterPortName;
	  document.getElementById('importerNameValue').innerHTML=responseData.importerName;
	  document.getElementById('importerBankName').innerHTML=responseData.importerBankName;
	  document.getElementById('importerPortName').innerHTML=responseData.importerPortName;

	  
	  var unixtimestamp = responseData.deliveryDate.toString().slice(0,-3);

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
	  
		 
		 document.getElementById('deliveryDate').innerHTML=convdataTime;
  });
  
  $.get("/getOfferDetails?offerId="+offerId, function(response2){
		 // alert(JSON.stringify(response));
	  var timeValue=response2.createdAt.toString();
		
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
	  
		 document.getElementById('createdAt').innerHTML=convdataTime;
	 
	  
  });



});

function goBack() {
window.history.back();
}