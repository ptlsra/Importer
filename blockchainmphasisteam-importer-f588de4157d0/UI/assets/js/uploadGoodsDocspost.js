	    
$("form#uploadgoodsdocform").submit(function(e) {
    e.preventDefault();

    var formData = new FormData(this);

    $.ajax({
        url: "/documentUploadByImporter",
        type: 'POST',
        data: formData,
        success: function (result) {
       
            document.getElementById("txHashstatus").innerHTML = result.txId;
			  $("#txSuccessModal").modal();

           setTimeout(function(){ 
             
			 window.location.href="assets.html";
			 return false;
      
          }, 1000);
        },
        cache: false,
        contentType: false,
        processData: false
    });
});
