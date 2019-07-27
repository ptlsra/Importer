$(document).ready(function(){
	/*
	var ipAdd=ipAddress();
	var port=portNo();
*/

	var tempLists=[];
	var dataSets=[];


	$.get("/getAllTransactions", function(response){
		// alert(JSON.stringify(response));
		var index = 1;
		$.each(response.records, function(i, itemNew) {

			$.each(itemNew, function(j, item) {
				//alert(JSON.stringify(item));

				//item.timeStamp;
				var unixtimestamp = item.timeStamp.toString().slice(0,-9);
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
				var txHash=item.transactionHash.toString();

				tempLists.push(index,'<a href="#" data-toggle="tooltip" title='+item.transactionHash+'>'+item.transactionHash.substr(0,20)+'...',item.blockNumber,item.eventName,item.executedBy,convdataTime);
				index++;
				dataSets.push(tempLists);
				tempLists=[];
				//alert(dataSet);
			});
		});

		$('#allTx').dataTable( {
			"order": [],
			aaSorting: [[6, 'desc']],
			data: dataSets,
			columns: [
				{ title: "SNo" },
				{ title: "Tx ID" },
				{ title: "BlockNumber" },
				{ title: "Action" },
				{ title: "Executed By" },
				{ title: "TimeStamp" },
				]
		} );
	} );
});
