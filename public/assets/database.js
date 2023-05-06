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
		api.REMOVE(index,function(){
			alert('The post has been deleted.');
			document.location.href = "/templates";
		})
	},
	create:function(newData){
		api.POST(newData,function(){
			alert('The post has been added.');
			document.location.href = "/templates";
		})
	},
}