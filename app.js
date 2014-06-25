var suggest = require("./lib/suggest");

if ( process.argv.length != 3 ) {
	console.log('usage: node app.js keyword\n');
	return;
}

var keyword = process.argv[2];

console.log("Start Google Ajax Suggest for : " + keyword );

var config = suggest.config()
										.setKeyword(keyword)
										.setOutputStream(process.stdout)
									  .setPrefixs([ "a ", "b ", "comment a ", "comment b ", "où a ", "où b "])
										.setPostfixs([" a", " b", " c", " d", " e", " f"]);


/**
 *	output the result on the console via the outputstream
 *
 *  You can call this method with a callback, eg. :
 *
 *  <pre><code>
 *	 suggest.suggestKeywords(config, function(result) {
 *
 *			result.forEach(function(suggest) {
 *						console.log(suggest);
 *
 *		});
 *
 *	 });
 *  </code></pre>
 *
 *
 */

suggest.suggestKeywords(config);
