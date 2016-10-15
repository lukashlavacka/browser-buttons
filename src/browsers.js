module.exports =
[
	{
		browser: "Chrome",
		version: ">=50",
		buttons: {
			back: 		{ position: function() { return "top: 0; left: 6px; width: 25px"	} },
			forward: 	{ position: function() { return "top: 0; left: 34px; width: 25px"	} },
			reload: 	{ position: function() { return "top: 0; left: 62px; width: 25px"	} },
			info: 		{ position: function() { return "top: 0; left: 100px; width: 14px"	} },
			omnibox: 	{ position: function() { return "top: 0; left: 120px; right: 135px"	} },
			search: 	{ position: function() { return ""									} },
			bookmark: 	{ position: function() { return "top: 0; right: 135px; width: 22px"	} },
			settings: 	{ position: function() { return "top: 0; right: 6px; width: 22px"	} },
		}
	},
	{
		browser: "Firefox",
		version: ">=48",
		buttons: {
			back: 		{ position: function() { return "top: 0; left: 6px; width: 32px"	 } },
			forward: 	{ position: function() { return ""							 		 } },
			reload: 	{ position: function() { return "top: 0; right: 390px; width: 22px"	 } },
			info: 		{ position: function() { return "top: 0; left: 42px; width: 16px"	 } },
			omnibox: 	{ position: function() { return "top: 0; left: 64px; right: 420px"	 } },
			search: 	{
				position: function() {
					if(window.outerWidth < 920)
						return "top: 0; width: 115px; right: 260px";
					var left = (0.00009167 * window.outerWidth * window.outerWidth) + (0.5742 * window.outerWidth ) - (71.00)
					var ret = "top: 0; left: " + left + "px; right: 260px";
					console.log(ret);
					return ret;
				}
			},
			bookmark: 	{ position: function() { return "top: 0; right: 225px; width: 22px"	 } },
			settings: 	{ position: function() { return "top: 0; right: 10px; width: 22px"	 } },
		}
	},
	{
		browser: "Safari",
		version: ">=10",
		buttons: {
			back: 		{ position: function() { return "top: 0; left: 6px; width: 24px"	} },
			forward: 	{ position: function() { return "top: 0; left: 31px; width: 24px"	} },
			reload: 	{ position: function() { return "top: 0; left: 73%; width: 22px"	} },
			info: 		{ position: function() { return ""									} },
			omnibox: 	{ position: function() { return "top: 0; left: 34%; width: 38%"		} },
			search: 	{ position: function() { return ""									} },
			bookmark: 	{ position: function() { return "top: 0; right: 60px; width: 22px"	} },
			settings: 	{ position: function() { return ""									} },
		}
	}
]
