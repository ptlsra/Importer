$(document).ready(function(){
	/*
	var ipAdd=ipAddress();
	var port=portNo();
	
	var ipfsIpAdd=ipfsIpAddress();
	var ipfsPort=ipfsPortNo();
	
*/
	$("#agreementId").hide();
	$("#importerName").hide();
	
	var importerName=localStorage.getItem("importerName");
	$("#importerName").val(importerName);
	$("#importerBankName").hide();
	
//	alert($("#importerName").val());
	
	
		 $('#importerPortName').append($('<option>', { 
	        value: 'None',
	        text : 'None' 
	    }
	    
	    ));
	 
	$.getJSON("/getAllImporterPorts", function(response){

	$.each(response.importer_port_list, function (i, item) {
	    $('#importerPortName').append($('<option>', { 
	        value: item.importerPort,
	        text : item.importerPort 
	    }
	    
	    ));
	});
		});
	
	
	 $('#importerBankAddress').append($('<option>', { 
	        value: 'None',
	        text : 'None' 
	    }
	    
	    ));
	 
	$.getJSON("/getAllBanks", function(response){
	$.each(response.bank_list, function (i, item) {
	    $('#importerBankAddress').append($('<option>', { 
	        value: item.bankAddress,
	        text : item.bankName 
	    }
	    
	    ));
	});
		});
	
	$('select[name=importerBankAddress]').change(function() { 
		($(this).val());
		var bankName=($("#importerBankAddress :selected").text());
		
		$('#importerBankName').val(bankName);
	});
	
	$('#deliveryDate').change(function() { 
		($(this).val());
		var dateVal=($("#deliveryDate").val());
		
		//alert(dateVal);
	});
	
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

	var agreementId = getUrlParameter('agreementId');
	$("#agreementId").val(agreementId)
	document.getElementById('offerPlacedTitle').innerHTML="Details For Offer with Offer ID: "+agreementId;
	document.getElementById('offerIdValue').innerHTML=agreementId;
	
	  $.get("/getOffer?offerId="+agreementId, function(response){
			 // alert(JSON.stringify(response));
		  document.getElementById('price').innerHTML=response.price;
		  document.getElementById('assetName').innerHTML=response.assetName;
		  document.getElementById('assetDescription').innerHTML=response.assetDescription;
		  document.getElementById('quantity').innerHTML=response.quantity;
		  document.getElementById('unit').innerHTML=response.unit;
		 // document.getElementById('createdBy').innerHTML=response.exporter;
		  document.getElementById('exporterName').innerHTML=response.exporter;
		  
	  });
	  $.get("/getTradersFromAgreement?offerId="+agreementId, function(responseVal){
		  document.getElementById('createdBy').innerHTML=responseVal.importerName;
	  });
	  
	  $.get("/getOfferEntities?offerId="+agreementId, function(responseData){
			 // alert(JSON.stringify(response));
		  document.getElementById('exporterBankName').innerHTML=responseData.exporterBankName;
		  document.getElementById('exporterPortName').innerHTML=responseData.exporterPortName;
	
		  
	  });
	  
	  $.get("/getOfferDetails?offerId="+agreementId, function(response2){
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