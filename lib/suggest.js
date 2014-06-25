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

  log.debug("Start suggest keywords for : " + config.keyword);
	config.keywordResult.push(config.keyword);
  config.driver.get(config.googleAdress);
  config.searchField = config.driver.findElement(config.webDriver.By.name('q'));
  config.flow = config.webDriver.promise.controlFlow();

  // Get suggestions for the main keyword
  config.searchField.sendKeys(config.keyword);
  extractKeywords(config, config.keyword);

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
    if (callback) {
      callback(config.keywordResult);
    }
  });

}

function extractKeywordsWithPrefix(keyword, prefix, config) {

    config.flow.execute(function(){
        log.debug("Search for keyword list for prefix : " + prefix + keyword);
        config.searchField.sendKeys(keyword, config.webDriver.Key.ALT,
            config.webDriver.Key.ARROW_LEFT,
            config.webDriver.Key.NULL, prefix);

        extractKeywords(config, keyword);

    });

}

function extractKeywordsWithPostfix(keyword, postfix, config) {

  config.flow.execute(function(){
      log.debug("Search for keyword list for postfix : " + keyword + postfix);
      config.searchField.sendKeys(keyword, postfix);
      extractKeywords(config, keyword);

  });

}

function extractKeywords(config, keyword) {

    config.driver.isElementPresent(config.webDriver.By.xpath(config.xpath))
         .then(function(isPresent) {
              if (isPresent) {

                  config.driver.findElements(config.webDriver.By.xpath(config.xpath))
                        .then(function(elements) {
                      extractKeyword(config, elements);
                      clearSearchField(config);
                  });
              }
              else {
                log.debug("Elements is not defined for the ajax call for " + keyword);
                clearSearchField(config);
              }
        });
}

function extractKeyword(config, elements) {
    elements.forEach(function(element) {
        config.flow.execute(function(){
          if (element) {
                element.getText().then(
                        function(text){
                            if (config.outputStream) {
                              config.outputStream.write(text + "\n");
                            }
                            config.keywordResult.push(text);
                        },
                        function(error) {
                                // an error can occur
                                // if there is no suggestion for a specific keyword
                                log.debug("Error when extracting keyword :" + error);
                        });
          }
        });
    });

}

function clearSearchField(config) {

    config.flow.execute(function(){
      config.searchField.clear();
    });
}


module.exports.config = config;
module.exports.suggestKeywords = suggestKeywords;
