define([
	'{pro}/lib/nej/util/ajax/rest.js'
],function(rest){

	var wrappedRest ={};

	wrappedRest.request = function(url,options,callback){

		var called =false;
		try {
			rest._$request(url,{
				data:options.data,
				method:options.method,
				onload:function(data){
					callback(null,data);
					called =true;
				},
				onerror:function(err){
					callback(err,null);
					called = true;
				}

			});
		}catch(e){
			if(!called) {
				callback(e,null);
				called =true;
			}
		}

	};

	return wrappedRest;
})