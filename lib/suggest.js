var selenium = require("./selenium-util");
var model = require("./model");
var async = require("async");

var log = require('./logger').Logger;

var config = function() {
  return new model.Config();
}

/*
 *  Main method used to find suggestion based on a Config object
 *
 *  Config       contains all the parameters (see in model.js to get all possibilities)
 *  endCallback  Call when all suggestions are found
 */
function suggestKeywords(config, callback) {

  log.info("Start suggest keywords");
	config.keywordResult.push(config.keyword);
  config.driver.get(config.googleAdress);
  config.searchField = config.driver.findElement(config.webDriver.By.name('q'));
  config.flow = config.webDriver.promise.controlFlow();

  // Get suggestions for the main keyword
  config.searchField.sendKeys(config.keyword);
  extractKeywords(config);

  // Get suggestions based on prefixs

  config.prefixs.forEach(function(prefix){
    extractKeywordsWithPrefix(config.keyword, prefix, config);
  })

  // Get suggestions based on postfixs

  config.postfixs.forEach(function(postfix){
    extractKeywordsWithPostfix(config.keyword, postfix, config);
  })

  // That's the end Folks !
  config.flow.execute(function(){
    callback(config.keywordResult);
  });

}

function extractKeywordsWithPrefix(keyword, prefix, config) {

  config.flow.execute(function(){

      config.searchField.sendKeys(keyword, config.webDriver.Key.ALT,
          config.webDriver.Key.ARROW_LEFT,
          config.webDriver.Key.NULL, prefix);
      extractKeywords(config);

  });

}

function extractKeywordsWithPostfix(keyword, postfix, config) {

  config.flow.execute(function(){

      config.searchField.sendKeys(keyword, postfix);
      extractKeywords(config);

  });

}

function extractKeywords(config) {

    selenium.waitForId(config.xpath, config.webDriver.By.xpath);

    config.driver.findElements(config.webDriver.By.xpath(config.xpath))
                     .then(function(elements) {
                          extractKeyword(config, elements);
                          clear(config);

                      });



}

function extractKeyword(config, elements) {
    elements.forEach(function(element) {
        config.flow.execute(function(){
            element.getText().then(function(text){
                config.keywordResult.push(text);
            });
        });
    });

}


function clear(config) {

    config.flow.execute(function(){
       // element.sendKeys(Keys.chord(Keys.CONTROL, "a"), "55");
      config.searchField.clear();

      /*  config.searchField.sendKeys(config.webDriver.Key.CTRL,
            "a",
            config.webDriver.Key.DELETE); */

    });

}

module.exports.config = config;
module.exports.suggestKeywords = suggestKeywords;
