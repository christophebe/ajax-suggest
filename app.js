var suggest = require("./lib/suggest");

if ( process.argv.length != 3 ) {
	console.log('usage: node app.js [keyword1]\n');
	return;
}

var keyword = process.argv.slice(2);

console.log("Start Google Ajax Suggest for : " + keyword );

var config = suggest.config()
										.setKeyword(keyword)
										.setPrefixs(["a ", "b ", "c ", "d ", "comment a ", "comment b ", "où a ", "où b "]);


// output the result on the console
suggest.suggestKeywords(config, function(result) {


	//console.log("Result : " + result);
	result.forEach(function(suggest) {
				console.log(suggest);

  });


});
