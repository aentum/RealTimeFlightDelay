#!/usr/bin/env node

console.log("start"); 

promised = new Promise(function(resolve, reject) {
var x = 10;
		setTimeout(function(){
		resolve(x);
		}, 1000); 
}); 

var square = function (i){ 
		console.log(i*i);
}; 
promised.then((square)(i
			));  
