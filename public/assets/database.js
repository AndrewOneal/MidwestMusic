const database={
	index:function(callback){
		api.GET(function(response){
			callback(response.data);
		});
	},
	detail:function(index,callback){
		api.GET(function(response){
			callback(response.data[index]);
		});
	},
	update:function(documentID,newData){
		api.PUT(newData, documentID, function() {
			alert("The post has been edited.");
			document.location.href = "/templates";
		});
	},
	delete:function(index){
		// api.GET(function(response){
		// 	response.data.splice(index,1);
		// 	api.PUT(response.data,function(){
		// 		alert('The post has been deleted. Please go back to the home page');
		// 	});
		// });
		api.REMOVE(index,function(){
			alert('The post has been deleted.');
			document.location.href = "/templates";
		})
	},
	create:function(newData){
		// api.GET(function(response){
		// 	response.data.push(newData);
		// 	api.PUT(response.data,function(){
		// 		alert('The post has been added. Please go back to the home page');
		// 	});
		// });
		api.POST(newData,function(){
			alert('The post has been added.');
			document.location.href = "/templates";
		})
	},
}