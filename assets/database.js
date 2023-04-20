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
	update:function(index,newData){
		api.GET(function(response){
			response.data[index]=newData;
			api.PUT(response.data,function(){
				alert('The post has been updated. Please go back to the home page');
			});
		});
	},
	delete:function(index){
		api.GET(function(response){
			response.data.splice(index,1);
			api.PUT(response.data,function(){
				alert('The post has been deleted. Please go back to the home page');
			});
		});
	},
	create:function(newData){
		api.GET(function(response){
			response.data.push(newData);
			api.PUT(response.data,function(){
				alert('The post has been added. Please go back to the home page');
			});
		});
	},
}