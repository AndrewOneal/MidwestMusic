const api={
	endpoint:"http://localhost:3000/post",
	GET:function(callback){
		axios.get(`${api.endpoint}`,{}).then(function(response){
			callback(response);
		}).catch(function(error){
			console.log(error);
		});
	},
	PUT:function(data,callback){
		axios.put(`${api.endpoint}`,data).then(function(response){
			callback(response);
		}).catch(function(error){
			console.log(error);
		});
	}
}