
var webdriver = require('selenium-webdriver')


var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
var pathToSeleniumJar = "./lib/selenium-server-standalone-2.41.0.jar";

var server = new SeleniumServer(pathToSeleniumJar, {
  port: 4444
});

server.start();

var driver = new webdriver.Builder().
    usingServer(server.address()).
    withCapabilities(webdriver.Capabilities.firefox()).
    build();




driver.get("http://www.google.be");
driver.findElement(webdriver.By.name("q")).sendKeys("comment");
driver.findElement(webdriver.By.name("btnG")).click().then(function(){
    console.log(driver.getTitle());
});

//assertEquals("webdriver - Google Search", driver.getTitle());
