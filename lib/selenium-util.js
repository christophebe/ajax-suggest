var fs = require('fs');
var webDriver = require('selenium-webdriver');
var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
var path =  require('path');

var log = require('./logger').Logger;

var MAX_WAIT_TIME = 10000;

var driver = null;



exports.getDriver = function() {
	return driver;
};

exports.initDriver = function() {

	log.info("Init Selenium Driver");
	driver = new webDriver.Builder().withCapabilities(
			//webDriver.Capabilities.chrome()).
			webDriver.Capabilities.htmlunitwithjs()).
			//webDriver.Capabilities.firefox()).
			build();


//var pathToSeleniumJar = path.resolve(__dirname, 'server', 'selenium-server-standalone-2.39.0.jar');

	/*
	log.info("Start server");
	var server = new SeleniumServer("./selenium-server-standalone-2.42.2.jar", {
	  port: 4444
	});

	server.start();

  log.info("Server is starting, init driver");
	driver = new webDriver.Builder().
	    usingServer(server.address()).
	    withCapabilities(webDriver.Capabilities.firefox()).
	    build();
   log.info("driver is init");
	*/

}



exports.getWebDriver = function() {
	return webDriver;
};

/*
 * Generic method to click on any kind of element - elementXPath : xpath used to
 * access to the element
 *
 */
exports.clickOnElement = function(elementXPath) {

	return exports.waitForId(elementXPath, webDriver.By.xpath, config.WAIT_TIME_OUT)
			.then(function() {
				driver.findElement(webDriver.By.xpath(elementXPath)).click();
			});

};

/*
 * Execute a JS click on an element - elementXPath : xpath used to point to the
 * element
 *
 */
exports.clickJSOnElement = function(elementXPath) {

	return exports.waitForId(elementXPath, webDriver.By.xpath, config.WAIT_TIME_OUT)
			.then(function() {
				exports.clickJS(elementXPath);
			});

};

/*
 * Execute an JS click event on a html element like an image Usefull for ExtJS
 * components - xpathElement : xpath used to access to the HTML element
 *
 */
exports.clickJS = function(xpathElement) {

	var magicElement = driver.findElement(webDriver.By.xpath(xpathElement));
	return driver.executeScript("arguments[0].click()", magicElement);

};

/*
 * This method can be used for waiting for the sun aka dynamic HTML elements
 * This function can any kind of Seleniym finder : wedriver.By.id or
 * wedriver.By.name or wedriver.By.xpath - elementRef : Html element id or HTML
 * element name or xpath expression used to access to the element - method :
 * Selenenium method : wedriver.By.id or wedriver.By.name or wedriver.By.xpath -
 * timout : max time used for waiting for the element
 *
 */

exports.waitForId = function(elementRef, method, timeout) {
	timeout = timeout || MAX_WAIT_TIME;
	var deferred = webDriver.promise.defer();

	driver.wait(function() {
		log.debug("waitForId - isElementPresent for" + elementRef);
		return driver.isElementPresent(method(elementRef));
	}, timeout)

	// Not sure that isDisplayed is well supported for ExtJS components
	.then(
			function() {
				return driver.wait(function() {

					var isDiplayed = driver.findElement(method(elementRef))
							.isDisplayed();
					log.debug("waitForId - IsDisplayed for " + elementRef);
					return isDiplayed;

				}, timeout);
			}).then(deferred.fulfill);
	return deferred.promise;

};

/*
 * Wait until a id/text disappear/fades out on the page Eg : wait until a
 * progress bar is still present on the page
 *
 */
exports.waitFadeOut = function(elementRef, method, timeout) {

	// This code has to be review
	timeout = timeout || MAX_WAIT_TIME;
	var deferred = webDriver.promise.defer();

	driver
			.isElementPresent(method(elementRef))
			.then(
					function(isPresent) {
						var pleaseStopToWait = false;
						log.debug("wait Fade out - 1. isElementPresent for "
								+ elementRef + " : " + isPresent);
						if (!isPresent) {
							deferred.fulfill();

						} else {

							driver
									.wait(
											function() {

												// return !
												// driver.isElementPresent(method(elementRef));
												console
														.log("wait Fade out - 2. Check PleaseStopToWait for "
																+ elementRef
																+ " : "
																+ pleaseStopToWait);
												if (pleaseStopToWait) {
													return pleaseStopToWait;
												}

												driver
														.findElement(
																method(elementRef))
														.isDisplayed()
														.then(
																function(
																		isDisplayed) {
																	if (!isDisplayed) {
																		console
																				.log("wait Fade out - 3. Is Element is still displayed ? "
																						+ isDisplayed);
																		pleaseStopToWait = true;
																	}
																});

												return false;
												// log.debug("waitFadeOut -
												// IsDisplay for " + elementRef
												// + ' : ' +
												// webElement.toString());
												// log.debug("wait fade out -
												// Please Stop To Wait : " +
												// pleaseStopToWait);

											}, timeout)
									.then(deferred.fulfill());

						}

					});
	return deferred.promise;

};

/*
 * Wait until a specific text is present on the page
 *
 */
exports.waitForText = function(text, timeout) {
	return exports.waitForId("//*[contains(text(), '" + text + "')]",webDriver.By.xpath, timeout);
};

/*
 * Convert a text file into String. This is not only for the fun. This is
 * usefull for using a script within the selenium method
 * driver.executeScript(...)
 *
 */

exports.readJSScript = function(txtFilePah) {
	// sorry Guys for the sync ;-)
	return fs.readFileSync(txtFilePah).toString();
};
