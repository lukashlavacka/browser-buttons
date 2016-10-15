var semver = require('semver')
var uaParser = require('ua-parser-js')
var browsers = require('./browsers')

module.exports = {
	getButtons: function(userAgent) {
		var parsedUA = uaParser(userAgent);
		for (var i = 0; i < browsers.length; i++) {
			if(
				browsers[i].browser.split(" ").indexOf(parsedUA.browser.name) > -1 &&
				semver.satisfies(parsedUA.browser.major + ".0.0", browsers[i].version, true)
			) {
				return browsers[i].buttons;
			}
		}
	}
}