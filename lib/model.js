 var selenium = require("./selenium-util");

 Config  = function () {

  this.xpath = "//div[@class='gsq_a']/table/tbody/tr/td/span";
  this.googleAdress = "http://www.google.com";
  this.keyword = null;
  this.keywordResult = [];
  this.prefixs = [];
  this.postfixs = [];
  this.outputStream = null;

  selenium.initDriver();
  this.webDriver = selenium.getWebDriver();
  this.driver = selenium.getDriver();

  this.setGoogleAdress = function(googleAdress) {
    this.googleAdress = googleAdress;
    return this;
  }

  this.setKeyword = function(keyword) {
    this.keyword = keyword;
    return this;
  }

  this.setPrefixs = function(prefixs) {
    this.prefixs = prefixs;
    return this;
  }

  this.setPostfixs = function(postfixs) {
    this.postfixs = postfixs;
    return this;
  }

  this.setXpath = function(xpath) {
    this.xpath = xpath;
    return this;
  }

  this.setOutputStream = function(out) {
    this.outputStream = out;
    return this;
  }

}

module.exports.Config = Config;
