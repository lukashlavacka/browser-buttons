var browserButtons =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var semver = __webpack_require__(1)
	var uaParser = __webpack_require__(3)
	var browsers = __webpack_require__(5)

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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {exports = module.exports = SemVer;

	// The debug function is excluded entirely from the minified version.
	/* nomin */ var debug;
	/* nomin */ if (typeof process === 'object' &&
	    /* nomin */ process.env &&
	    /* nomin */ process.env.NODE_DEBUG &&
	    /* nomin */ /\bsemver\b/i.test(process.env.NODE_DEBUG))
	  /* nomin */ debug = function() {
	    /* nomin */ var args = Array.prototype.slice.call(arguments, 0);
	    /* nomin */ args.unshift('SEMVER');
	    /* nomin */ console.log.apply(console, args);
	    /* nomin */ };
	/* nomin */ else
	  /* nomin */ debug = function() {};

	// Note: this is the semver.org version of the spec that it implements
	// Not necessarily the package version of this code.
	exports.SEMVER_SPEC_VERSION = '2.0.0';

	var MAX_LENGTH = 256;
	var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

	// The actual regexps go on exports.re
	var re = exports.re = [];
	var src = exports.src = [];
	var R = 0;

	// The following Regular Expressions can be used for tokenizing,
	// validating, and parsing SemVer version strings.

	// ## Numeric Identifier
	// A single `0`, or a non-zero digit followed by zero or more digits.

	var NUMERICIDENTIFIER = R++;
	src[NUMERICIDENTIFIER] = '0|[1-9]\\d*';
	var NUMERICIDENTIFIERLOOSE = R++;
	src[NUMERICIDENTIFIERLOOSE] = '[0-9]+';


	// ## Non-numeric Identifier
	// Zero or more digits, followed by a letter or hyphen, and then zero or
	// more letters, digits, or hyphens.

	var NONNUMERICIDENTIFIER = R++;
	src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';


	// ## Main Version
	// Three dot-separated numeric identifiers.

	var MAINVERSION = R++;
	src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
	                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +
	                   '(' + src[NUMERICIDENTIFIER] + ')';

	var MAINVERSIONLOOSE = R++;
	src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
	                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
	                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')';

	// ## Pre-release Version Identifier
	// A numeric identifier, or a non-numeric identifier.

	var PRERELEASEIDENTIFIER = R++;
	src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
	                            '|' + src[NONNUMERICIDENTIFIER] + ')';

	var PRERELEASEIDENTIFIERLOOSE = R++;
	src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
	                                 '|' + src[NONNUMERICIDENTIFIER] + ')';


	// ## Pre-release Version
	// Hyphen, followed by one or more dot-separated pre-release version
	// identifiers.

	var PRERELEASE = R++;
	src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
	                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))';

	var PRERELEASELOOSE = R++;
	src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
	                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))';

	// ## Build Metadata Identifier
	// Any combination of digits, letters, or hyphens.

	var BUILDIDENTIFIER = R++;
	src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+';

	// ## Build Metadata
	// Plus sign, followed by one or more period-separated build metadata
	// identifiers.

	var BUILD = R++;
	src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
	             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))';


	// ## Full Version String
	// A main version, followed optionally by a pre-release version and
	// build metadata.

	// Note that the only major, minor, patch, and pre-release sections of
	// the version string are capturing groups.  The build metadata is not a
	// capturing group, because it should not ever be used in version
	// comparison.

	var FULL = R++;
	var FULLPLAIN = 'v?' + src[MAINVERSION] +
	                src[PRERELEASE] + '?' +
	                src[BUILD] + '?';

	src[FULL] = '^' + FULLPLAIN + '$';

	// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
	// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
	// common in the npm registry.
	var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
	                 src[PRERELEASELOOSE] + '?' +
	                 src[BUILD] + '?';

	var LOOSE = R++;
	src[LOOSE] = '^' + LOOSEPLAIN + '$';

	var GTLT = R++;
	src[GTLT] = '((?:<|>)?=?)';

	// Something like "2.*" or "1.2.x".
	// Note that "x.x" is a valid xRange identifer, meaning "any version"
	// Only the first item is strictly required.
	var XRANGEIDENTIFIERLOOSE = R++;
	src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';
	var XRANGEIDENTIFIER = R++;
	src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*';

	var XRANGEPLAIN = R++;
	src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
	                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
	                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
	                   '(?:' + src[PRERELEASE] + ')?' +
	                   src[BUILD] + '?' +
	                   ')?)?';

	var XRANGEPLAINLOOSE = R++;
	src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
	                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
	                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
	                        '(?:' + src[PRERELEASELOOSE] + ')?' +
	                        src[BUILD] + '?' +
	                        ')?)?';

	var XRANGE = R++;
	src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$';
	var XRANGELOOSE = R++;
	src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$';

	// Tilde ranges.
	// Meaning is "reasonably at or greater than"
	var LONETILDE = R++;
	src[LONETILDE] = '(?:~>?)';

	var TILDETRIM = R++;
	src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+';
	re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g');
	var tildeTrimReplace = '$1~';

	var TILDE = R++;
	src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$';
	var TILDELOOSE = R++;
	src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$';

	// Caret ranges.
	// Meaning is "at least and backwards compatible with"
	var LONECARET = R++;
	src[LONECARET] = '(?:\\^)';

	var CARETTRIM = R++;
	src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+';
	re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g');
	var caretTrimReplace = '$1^';

	var CARET = R++;
	src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$';
	var CARETLOOSE = R++;
	src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$';

	// A simple gt/lt/eq thing, or just "" to indicate "any version"
	var COMPARATORLOOSE = R++;
	src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$';
	var COMPARATOR = R++;
	src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$';


	// An expression to strip any whitespace between the gtlt and the thing
	// it modifies, so that `> 1.2.3` ==> `>1.2.3`
	var COMPARATORTRIM = R++;
	src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
	                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')';

	// this one has to use the /g flag
	re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g');
	var comparatorTrimReplace = '$1$2$3';


	// Something like `1.2.3 - 1.2.4`
	// Note that these all use the loose form, because they'll be
	// checked against either the strict or loose comparator form
	// later.
	var HYPHENRANGE = R++;
	src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
	                   '\\s+-\\s+' +
	                   '(' + src[XRANGEPLAIN] + ')' +
	                   '\\s*$';

	var HYPHENRANGELOOSE = R++;
	src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
	                        '\\s+-\\s+' +
	                        '(' + src[XRANGEPLAINLOOSE] + ')' +
	                        '\\s*$';

	// Star ranges basically just allow anything at all.
	var STAR = R++;
	src[STAR] = '(<|>)?=?\\s*\\*';

	// Compile to actual regexp objects.
	// All are flag-free, unless they were created above with a flag.
	for (var i = 0; i < R; i++) {
	  debug(i, src[i]);
	  if (!re[i])
	    re[i] = new RegExp(src[i]);
	}

	exports.parse = parse;
	function parse(version, loose) {
	  if (version instanceof SemVer)
	    return version;

	  if (typeof version !== 'string')
	    return null;

	  if (version.length > MAX_LENGTH)
	    return null;

	  var r = loose ? re[LOOSE] : re[FULL];
	  if (!r.test(version))
	    return null;

	  try {
	    return new SemVer(version, loose);
	  } catch (er) {
	    return null;
	  }
	}

	exports.valid = valid;
	function valid(version, loose) {
	  var v = parse(version, loose);
	  return v ? v.version : null;
	}


	exports.clean = clean;
	function clean(version, loose) {
	  var s = parse(version.trim().replace(/^[=v]+/, ''), loose);
	  return s ? s.version : null;
	}

	exports.SemVer = SemVer;

	function SemVer(version, loose) {
	  if (version instanceof SemVer) {
	    if (version.loose === loose)
	      return version;
	    else
	      version = version.version;
	  } else if (typeof version !== 'string') {
	    throw new TypeError('Invalid Version: ' + version);
	  }

	  if (version.length > MAX_LENGTH)
	    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')

	  if (!(this instanceof SemVer))
	    return new SemVer(version, loose);

	  debug('SemVer', version, loose);
	  this.loose = loose;
	  var m = version.trim().match(loose ? re[LOOSE] : re[FULL]);

	  if (!m)
	    throw new TypeError('Invalid Version: ' + version);

	  this.raw = version;

	  // these are actually numbers
	  this.major = +m[1];
	  this.minor = +m[2];
	  this.patch = +m[3];

	  if (this.major > MAX_SAFE_INTEGER || this.major < 0)
	    throw new TypeError('Invalid major version')

	  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0)
	    throw new TypeError('Invalid minor version')

	  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0)
	    throw new TypeError('Invalid patch version')

	  // numberify any prerelease numeric ids
	  if (!m[4])
	    this.prerelease = [];
	  else
	    this.prerelease = m[4].split('.').map(function(id) {
	      if (/^[0-9]+$/.test(id)) {
	        var num = +id;
	        if (num >= 0 && num < MAX_SAFE_INTEGER)
	          return num;
	      }
	      return id;
	    });

	  this.build = m[5] ? m[5].split('.') : [];
	  this.format();
	}

	SemVer.prototype.format = function() {
	  this.version = this.major + '.' + this.minor + '.' + this.patch;
	  if (this.prerelease.length)
	    this.version += '-' + this.prerelease.join('.');
	  return this.version;
	};

	SemVer.prototype.toString = function() {
	  return this.version;
	};

	SemVer.prototype.compare = function(other) {
	  debug('SemVer.compare', this.version, this.loose, other);
	  if (!(other instanceof SemVer))
	    other = new SemVer(other, this.loose);

	  return this.compareMain(other) || this.comparePre(other);
	};

	SemVer.prototype.compareMain = function(other) {
	  if (!(other instanceof SemVer))
	    other = new SemVer(other, this.loose);

	  return compareIdentifiers(this.major, other.major) ||
	         compareIdentifiers(this.minor, other.minor) ||
	         compareIdentifiers(this.patch, other.patch);
	};

	SemVer.prototype.comparePre = function(other) {
	  if (!(other instanceof SemVer))
	    other = new SemVer(other, this.loose);

	  // NOT having a prerelease is > having one
	  if (this.prerelease.length && !other.prerelease.length)
	    return -1;
	  else if (!this.prerelease.length && other.prerelease.length)
	    return 1;
	  else if (!this.prerelease.length && !other.prerelease.length)
	    return 0;

	  var i = 0;
	  do {
	    var a = this.prerelease[i];
	    var b = other.prerelease[i];
	    debug('prerelease compare', i, a, b);
	    if (a === undefined && b === undefined)
	      return 0;
	    else if (b === undefined)
	      return 1;
	    else if (a === undefined)
	      return -1;
	    else if (a === b)
	      continue;
	    else
	      return compareIdentifiers(a, b);
	  } while (++i);
	};

	// preminor will bump the version up to the next minor release, and immediately
	// down to pre-release. premajor and prepatch work the same way.
	SemVer.prototype.inc = function(release, identifier) {
	  switch (release) {
	    case 'premajor':
	      this.prerelease.length = 0;
	      this.patch = 0;
	      this.minor = 0;
	      this.major++;
	      this.inc('pre', identifier);
	      break;
	    case 'preminor':
	      this.prerelease.length = 0;
	      this.patch = 0;
	      this.minor++;
	      this.inc('pre', identifier);
	      break;
	    case 'prepatch':
	      // If this is already a prerelease, it will bump to the next version
	      // drop any prereleases that might already exist, since they are not
	      // relevant at this point.
	      this.prerelease.length = 0;
	      this.inc('patch', identifier);
	      this.inc('pre', identifier);
	      break;
	    // If the input is a non-prerelease version, this acts the same as
	    // prepatch.
	    case 'prerelease':
	      if (this.prerelease.length === 0)
	        this.inc('patch', identifier);
	      this.inc('pre', identifier);
	      break;

	    case 'major':
	      // If this is a pre-major version, bump up to the same major version.
	      // Otherwise increment major.
	      // 1.0.0-5 bumps to 1.0.0
	      // 1.1.0 bumps to 2.0.0
	      if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0)
	        this.major++;
	      this.minor = 0;
	      this.patch = 0;
	      this.prerelease = [];
	      break;
	    case 'minor':
	      // If this is a pre-minor version, bump up to the same minor version.
	      // Otherwise increment minor.
	      // 1.2.0-5 bumps to 1.2.0
	      // 1.2.1 bumps to 1.3.0
	      if (this.patch !== 0 || this.prerelease.length === 0)
	        this.minor++;
	      this.patch = 0;
	      this.prerelease = [];
	      break;
	    case 'patch':
	      // If this is not a pre-release version, it will increment the patch.
	      // If it is a pre-release it will bump up to the same patch version.
	      // 1.2.0-5 patches to 1.2.0
	      // 1.2.0 patches to 1.2.1
	      if (this.prerelease.length === 0)
	        this.patch++;
	      this.prerelease = [];
	      break;
	    // This probably shouldn't be used publicly.
	    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
	    case 'pre':
	      if (this.prerelease.length === 0)
	        this.prerelease = [0];
	      else {
	        var i = this.prerelease.length;
	        while (--i >= 0) {
	          if (typeof this.prerelease[i] === 'number') {
	            this.prerelease[i]++;
	            i = -2;
	          }
	        }
	        if (i === -1) // didn't increment anything
	          this.prerelease.push(0);
	      }
	      if (identifier) {
	        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
	        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
	        if (this.prerelease[0] === identifier) {
	          if (isNaN(this.prerelease[1]))
	            this.prerelease = [identifier, 0];
	        } else
	          this.prerelease = [identifier, 0];
	      }
	      break;

	    default:
	      throw new Error('invalid increment argument: ' + release);
	  }
	  this.format();
	  this.raw = this.version;
	  return this;
	};

	exports.inc = inc;
	function inc(version, release, loose, identifier) {
	  if (typeof(loose) === 'string') {
	    identifier = loose;
	    loose = undefined;
	  }

	  try {
	    return new SemVer(version, loose).inc(release, identifier).version;
	  } catch (er) {
	    return null;
	  }
	}

	exports.diff = diff;
	function diff(version1, version2) {
	  if (eq(version1, version2)) {
	    return null;
	  } else {
	    var v1 = parse(version1);
	    var v2 = parse(version2);
	    if (v1.prerelease.length || v2.prerelease.length) {
	      for (var key in v1) {
	        if (key === 'major' || key === 'minor' || key === 'patch') {
	          if (v1[key] !== v2[key]) {
	            return 'pre'+key;
	          }
	        }
	      }
	      return 'prerelease';
	    }
	    for (var key in v1) {
	      if (key === 'major' || key === 'minor' || key === 'patch') {
	        if (v1[key] !== v2[key]) {
	          return key;
	        }
	      }
	    }
	  }
	}

	exports.compareIdentifiers = compareIdentifiers;

	var numeric = /^[0-9]+$/;
	function compareIdentifiers(a, b) {
	  var anum = numeric.test(a);
	  var bnum = numeric.test(b);

	  if (anum && bnum) {
	    a = +a;
	    b = +b;
	  }

	  return (anum && !bnum) ? -1 :
	         (bnum && !anum) ? 1 :
	         a < b ? -1 :
	         a > b ? 1 :
	         0;
	}

	exports.rcompareIdentifiers = rcompareIdentifiers;
	function rcompareIdentifiers(a, b) {
	  return compareIdentifiers(b, a);
	}

	exports.major = major;
	function major(a, loose) {
	  return new SemVer(a, loose).major;
	}

	exports.minor = minor;
	function minor(a, loose) {
	  return new SemVer(a, loose).minor;
	}

	exports.patch = patch;
	function patch(a, loose) {
	  return new SemVer(a, loose).patch;
	}

	exports.compare = compare;
	function compare(a, b, loose) {
	  return new SemVer(a, loose).compare(b);
	}

	exports.compareLoose = compareLoose;
	function compareLoose(a, b) {
	  return compare(a, b, true);
	}

	exports.rcompare = rcompare;
	function rcompare(a, b, loose) {
	  return compare(b, a, loose);
	}

	exports.sort = sort;
	function sort(list, loose) {
	  return list.sort(function(a, b) {
	    return exports.compare(a, b, loose);
	  });
	}

	exports.rsort = rsort;
	function rsort(list, loose) {
	  return list.sort(function(a, b) {
	    return exports.rcompare(a, b, loose);
	  });
	}

	exports.gt = gt;
	function gt(a, b, loose) {
	  return compare(a, b, loose) > 0;
	}

	exports.lt = lt;
	function lt(a, b, loose) {
	  return compare(a, b, loose) < 0;
	}

	exports.eq = eq;
	function eq(a, b, loose) {
	  return compare(a, b, loose) === 0;
	}

	exports.neq = neq;
	function neq(a, b, loose) {
	  return compare(a, b, loose) !== 0;
	}

	exports.gte = gte;
	function gte(a, b, loose) {
	  return compare(a, b, loose) >= 0;
	}

	exports.lte = lte;
	function lte(a, b, loose) {
	  return compare(a, b, loose) <= 0;
	}

	exports.cmp = cmp;
	function cmp(a, op, b, loose) {
	  var ret;
	  switch (op) {
	    case '===':
	      if (typeof a === 'object') a = a.version;
	      if (typeof b === 'object') b = b.version;
	      ret = a === b;
	      break;
	    case '!==':
	      if (typeof a === 'object') a = a.version;
	      if (typeof b === 'object') b = b.version;
	      ret = a !== b;
	      break;
	    case '': case '=': case '==': ret = eq(a, b, loose); break;
	    case '!=': ret = neq(a, b, loose); break;
	    case '>': ret = gt(a, b, loose); break;
	    case '>=': ret = gte(a, b, loose); break;
	    case '<': ret = lt(a, b, loose); break;
	    case '<=': ret = lte(a, b, loose); break;
	    default: throw new TypeError('Invalid operator: ' + op);
	  }
	  return ret;
	}

	exports.Comparator = Comparator;
	function Comparator(comp, loose) {
	  if (comp instanceof Comparator) {
	    if (comp.loose === loose)
	      return comp;
	    else
	      comp = comp.value;
	  }

	  if (!(this instanceof Comparator))
	    return new Comparator(comp, loose);

	  debug('comparator', comp, loose);
	  this.loose = loose;
	  this.parse(comp);

	  if (this.semver === ANY)
	    this.value = '';
	  else
	    this.value = this.operator + this.semver.version;

	  debug('comp', this);
	}

	var ANY = {};
	Comparator.prototype.parse = function(comp) {
	  var r = this.loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
	  var m = comp.match(r);

	  if (!m)
	    throw new TypeError('Invalid comparator: ' + comp);

	  this.operator = m[1];
	  if (this.operator === '=')
	    this.operator = '';

	  // if it literally is just '>' or '' then allow anything.
	  if (!m[2])
	    this.semver = ANY;
	  else
	    this.semver = new SemVer(m[2], this.loose);
	};

	Comparator.prototype.toString = function() {
	  return this.value;
	};

	Comparator.prototype.test = function(version) {
	  debug('Comparator.test', version, this.loose);

	  if (this.semver === ANY)
	    return true;

	  if (typeof version === 'string')
	    version = new SemVer(version, this.loose);

	  return cmp(version, this.operator, this.semver, this.loose);
	};


	exports.Range = Range;
	function Range(range, loose) {
	  if ((range instanceof Range) && range.loose === loose)
	    return range;

	  if (!(this instanceof Range))
	    return new Range(range, loose);

	  this.loose = loose;

	  // First, split based on boolean or ||
	  this.raw = range;
	  this.set = range.split(/\s*\|\|\s*/).map(function(range) {
	    return this.parseRange(range.trim());
	  }, this).filter(function(c) {
	    // throw out any that are not relevant for whatever reason
	    return c.length;
	  });

	  if (!this.set.length) {
	    throw new TypeError('Invalid SemVer Range: ' + range);
	  }

	  this.format();
	}

	Range.prototype.format = function() {
	  this.range = this.set.map(function(comps) {
	    return comps.join(' ').trim();
	  }).join('||').trim();
	  return this.range;
	};

	Range.prototype.toString = function() {
	  return this.range;
	};

	Range.prototype.parseRange = function(range) {
	  var loose = this.loose;
	  range = range.trim();
	  debug('range', range, loose);
	  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
	  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE];
	  range = range.replace(hr, hyphenReplace);
	  debug('hyphen replace', range);
	  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
	  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);
	  debug('comparator trim', range, re[COMPARATORTRIM]);

	  // `~ 1.2.3` => `~1.2.3`
	  range = range.replace(re[TILDETRIM], tildeTrimReplace);

	  // `^ 1.2.3` => `^1.2.3`
	  range = range.replace(re[CARETTRIM], caretTrimReplace);

	  // normalize spaces
	  range = range.split(/\s+/).join(' ');

	  // At this point, the range is completely trimmed and
	  // ready to be split into comparators.

	  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
	  var set = range.split(' ').map(function(comp) {
	    return parseComparator(comp, loose);
	  }).join(' ').split(/\s+/);
	  if (this.loose) {
	    // in loose mode, throw out any that are not valid comparators
	    set = set.filter(function(comp) {
	      return !!comp.match(compRe);
	    });
	  }
	  set = set.map(function(comp) {
	    return new Comparator(comp, loose);
	  });

	  return set;
	};

	// Mostly just for testing and legacy API reasons
	exports.toComparators = toComparators;
	function toComparators(range, loose) {
	  return new Range(range, loose).set.map(function(comp) {
	    return comp.map(function(c) {
	      return c.value;
	    }).join(' ').trim().split(' ');
	  });
	}

	// comprised of xranges, tildes, stars, and gtlt's at this point.
	// already replaced the hyphen ranges
	// turn into a set of JUST comparators.
	function parseComparator(comp, loose) {
	  debug('comp', comp);
	  comp = replaceCarets(comp, loose);
	  debug('caret', comp);
	  comp = replaceTildes(comp, loose);
	  debug('tildes', comp);
	  comp = replaceXRanges(comp, loose);
	  debug('xrange', comp);
	  comp = replaceStars(comp, loose);
	  debug('stars', comp);
	  return comp;
	}

	function isX(id) {
	  return !id || id.toLowerCase() === 'x' || id === '*';
	}

	// ~, ~> --> * (any, kinda silly)
	// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
	// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
	// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
	// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
	// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
	function replaceTildes(comp, loose) {
	  return comp.trim().split(/\s+/).map(function(comp) {
	    return replaceTilde(comp, loose);
	  }).join(' ');
	}

	function replaceTilde(comp, loose) {
	  var r = loose ? re[TILDELOOSE] : re[TILDE];
	  return comp.replace(r, function(_, M, m, p, pr) {
	    debug('tilde', comp, _, M, m, p, pr);
	    var ret;

	    if (isX(M))
	      ret = '';
	    else if (isX(m))
	      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
	    else if (isX(p))
	      // ~1.2 == >=1.2.0 <1.3.0
	      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
	    else if (pr) {
	      debug('replaceTilde pr', pr);
	      if (pr.charAt(0) !== '-')
	        pr = '-' + pr;
	      ret = '>=' + M + '.' + m + '.' + p + pr +
	            ' <' + M + '.' + (+m + 1) + '.0';
	    } else
	      // ~1.2.3 == >=1.2.3 <1.3.0
	      ret = '>=' + M + '.' + m + '.' + p +
	            ' <' + M + '.' + (+m + 1) + '.0';

	    debug('tilde return', ret);
	    return ret;
	  });
	}

	// ^ --> * (any, kinda silly)
	// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
	// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
	// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
	// ^1.2.3 --> >=1.2.3 <2.0.0
	// ^1.2.0 --> >=1.2.0 <2.0.0
	function replaceCarets(comp, loose) {
	  return comp.trim().split(/\s+/).map(function(comp) {
	    return replaceCaret(comp, loose);
	  }).join(' ');
	}

	function replaceCaret(comp, loose) {
	  debug('caret', comp, loose);
	  var r = loose ? re[CARETLOOSE] : re[CARET];
	  return comp.replace(r, function(_, M, m, p, pr) {
	    debug('caret', comp, _, M, m, p, pr);
	    var ret;

	    if (isX(M))
	      ret = '';
	    else if (isX(m))
	      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
	    else if (isX(p)) {
	      if (M === '0')
	        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
	      else
	        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0';
	    } else if (pr) {
	      debug('replaceCaret pr', pr);
	      if (pr.charAt(0) !== '-')
	        pr = '-' + pr;
	      if (M === '0') {
	        if (m === '0')
	          ret = '>=' + M + '.' + m + '.' + p + pr +
	                ' <' + M + '.' + m + '.' + (+p + 1);
	        else
	          ret = '>=' + M + '.' + m + '.' + p + pr +
	                ' <' + M + '.' + (+m + 1) + '.0';
	      } else
	        ret = '>=' + M + '.' + m + '.' + p + pr +
	              ' <' + (+M + 1) + '.0.0';
	    } else {
	      debug('no pr');
	      if (M === '0') {
	        if (m === '0')
	          ret = '>=' + M + '.' + m + '.' + p +
	                ' <' + M + '.' + m + '.' + (+p + 1);
	        else
	          ret = '>=' + M + '.' + m + '.' + p +
	                ' <' + M + '.' + (+m + 1) + '.0';
	      } else
	        ret = '>=' + M + '.' + m + '.' + p +
	              ' <' + (+M + 1) + '.0.0';
	    }

	    debug('caret return', ret);
	    return ret;
	  });
	}

	function replaceXRanges(comp, loose) {
	  debug('replaceXRanges', comp, loose);
	  return comp.split(/\s+/).map(function(comp) {
	    return replaceXRange(comp, loose);
	  }).join(' ');
	}

	function replaceXRange(comp, loose) {
	  comp = comp.trim();
	  var r = loose ? re[XRANGELOOSE] : re[XRANGE];
	  return comp.replace(r, function(ret, gtlt, M, m, p, pr) {
	    debug('xRange', comp, ret, gtlt, M, m, p, pr);
	    var xM = isX(M);
	    var xm = xM || isX(m);
	    var xp = xm || isX(p);
	    var anyX = xp;

	    if (gtlt === '=' && anyX)
	      gtlt = '';

	    if (xM) {
	      if (gtlt === '>' || gtlt === '<') {
	        // nothing is allowed
	        ret = '<0.0.0';
	      } else {
	        // nothing is forbidden
	        ret = '*';
	      }
	    } else if (gtlt && anyX) {
	      // replace X with 0
	      if (xm)
	        m = 0;
	      if (xp)
	        p = 0;

	      if (gtlt === '>') {
	        // >1 => >=2.0.0
	        // >1.2 => >=1.3.0
	        // >1.2.3 => >= 1.2.4
	        gtlt = '>=';
	        if (xm) {
	          M = +M + 1;
	          m = 0;
	          p = 0;
	        } else if (xp) {
	          m = +m + 1;
	          p = 0;
	        }
	      } else if (gtlt === '<=') {
	        // <=0.7.x is actually <0.8.0, since any 0.7.x should
	        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
	        gtlt = '<';
	        if (xm)
	          M = +M + 1;
	        else
	          m = +m + 1;
	      }

	      ret = gtlt + M + '.' + m + '.' + p;
	    } else if (xm) {
	      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
	    } else if (xp) {
	      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
	    }

	    debug('xRange return', ret);

	    return ret;
	  });
	}

	// Because * is AND-ed with everything else in the comparator,
	// and '' means "any version", just remove the *s entirely.
	function replaceStars(comp, loose) {
	  debug('replaceStars', comp, loose);
	  // Looseness is ignored here.  star is always as loose as it gets!
	  return comp.trim().replace(re[STAR], '');
	}

	// This function is passed to string.replace(re[HYPHENRANGE])
	// M, m, patch, prerelease, build
	// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
	// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
	// 1.2 - 3.4 => >=1.2.0 <3.5.0
	function hyphenReplace($0,
	                       from, fM, fm, fp, fpr, fb,
	                       to, tM, tm, tp, tpr, tb) {

	  if (isX(fM))
	    from = '';
	  else if (isX(fm))
	    from = '>=' + fM + '.0.0';
	  else if (isX(fp))
	    from = '>=' + fM + '.' + fm + '.0';
	  else
	    from = '>=' + from;

	  if (isX(tM))
	    to = '';
	  else if (isX(tm))
	    to = '<' + (+tM + 1) + '.0.0';
	  else if (isX(tp))
	    to = '<' + tM + '.' + (+tm + 1) + '.0';
	  else if (tpr)
	    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;
	  else
	    to = '<=' + to;

	  return (from + ' ' + to).trim();
	}


	// if ANY of the sets match ALL of its comparators, then pass
	Range.prototype.test = function(version) {
	  if (!version)
	    return false;

	  if (typeof version === 'string')
	    version = new SemVer(version, this.loose);

	  for (var i = 0; i < this.set.length; i++) {
	    if (testSet(this.set[i], version))
	      return true;
	  }
	  return false;
	};

	function testSet(set, version) {
	  for (var i = 0; i < set.length; i++) {
	    if (!set[i].test(version))
	      return false;
	  }

	  if (version.prerelease.length) {
	    // Find the set of versions that are allowed to have prereleases
	    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
	    // That should allow `1.2.3-pr.2` to pass.
	    // However, `1.2.4-alpha.notready` should NOT be allowed,
	    // even though it's within the range set by the comparators.
	    for (var i = 0; i < set.length; i++) {
	      debug(set[i].semver);
	      if (set[i].semver === ANY)
	        continue;

	      if (set[i].semver.prerelease.length > 0) {
	        var allowed = set[i].semver;
	        if (allowed.major === version.major &&
	            allowed.minor === version.minor &&
	            allowed.patch === version.patch)
	          return true;
	      }
	    }

	    // Version has a -pre, but it's not one of the ones we like.
	    return false;
	  }

	  return true;
	}

	exports.satisfies = satisfies;
	function satisfies(version, range, loose) {
	  try {
	    range = new Range(range, loose);
	  } catch (er) {
	    return false;
	  }
	  return range.test(version);
	}

	exports.maxSatisfying = maxSatisfying;
	function maxSatisfying(versions, range, loose) {
	  return versions.filter(function(version) {
	    return satisfies(version, range, loose);
	  }).sort(function(a, b) {
	    return rcompare(a, b, loose);
	  })[0] || null;
	}

	exports.minSatisfying = minSatisfying;
	function minSatisfying(versions, range, loose) {
	  return versions.filter(function(version) {
	    return satisfies(version, range, loose);
	  }).sort(function(a, b) {
	    return compare(a, b, loose);
	  })[0] || null;
	}

	exports.validRange = validRange;
	function validRange(range, loose) {
	  try {
	    // Return '*' instead of '' so that truthiness works.
	    // This will throw if it's invalid anyway
	    return new Range(range, loose).range || '*';
	  } catch (er) {
	    return null;
	  }
	}

	// Determine if version is less than all the versions possible in the range
	exports.ltr = ltr;
	function ltr(version, range, loose) {
	  return outside(version, range, '<', loose);
	}

	// Determine if version is greater than all the versions possible in the range.
	exports.gtr = gtr;
	function gtr(version, range, loose) {
	  return outside(version, range, '>', loose);
	}

	exports.outside = outside;
	function outside(version, range, hilo, loose) {
	  version = new SemVer(version, loose);
	  range = new Range(range, loose);

	  var gtfn, ltefn, ltfn, comp, ecomp;
	  switch (hilo) {
	    case '>':
	      gtfn = gt;
	      ltefn = lte;
	      ltfn = lt;
	      comp = '>';
	      ecomp = '>=';
	      break;
	    case '<':
	      gtfn = lt;
	      ltefn = gte;
	      ltfn = gt;
	      comp = '<';
	      ecomp = '<=';
	      break;
	    default:
	      throw new TypeError('Must provide a hilo val of "<" or ">"');
	  }

	  // If it satisifes the range it is not outside
	  if (satisfies(version, range, loose)) {
	    return false;
	  }

	  // From now on, variable terms are as if we're in "gtr" mode.
	  // but note that everything is flipped for the "ltr" function.

	  for (var i = 0; i < range.set.length; ++i) {
	    var comparators = range.set[i];

	    var high = null;
	    var low = null;

	    comparators.forEach(function(comparator) {
	      if (comparator.semver === ANY) {
	        comparator = new Comparator('>=0.0.0')
	      }
	      high = high || comparator;
	      low = low || comparator;
	      if (gtfn(comparator.semver, high.semver, loose)) {
	        high = comparator;
	      } else if (ltfn(comparator.semver, low.semver, loose)) {
	        low = comparator;
	      }
	    });

	    // If the edge version comparator has a operator then our version
	    // isn't outside it
	    if (high.operator === comp || high.operator === ecomp) {
	      return false;
	    }

	    // If the lowest version comparator has an operator and our version
	    // is less than it then it isn't higher than the range
	    if ((!low.operator || low.operator === comp) &&
	        ltefn(version, low.semver)) {
	      return false;
	    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
	      return false;
	    }
	  }
	  return true;
	}

	exports.prerelease = prerelease;
	function prerelease(version, loose) {
	  var parsed = parse(version, loose);
	  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * UAParser.js v0.7.10
	 * Lightweight JavaScript-based User-Agent string parser
	 * https://github.com/faisalman/ua-parser-js
	 *
	 * Copyright © 2012-2015 Faisal Salman <fyzlman@gmail.com>
	 * Dual licensed under GPLv2 & MIT
	 */

	(function (window, undefined) {

	    'use strict';

	    //////////////
	    // Constants
	    /////////////


	    var LIBVERSION  = '0.7.10',
	        EMPTY       = '',
	        UNKNOWN     = '?',
	        FUNC_TYPE   = 'function',
	        UNDEF_TYPE  = 'undefined',
	        OBJ_TYPE    = 'object',
	        STR_TYPE    = 'string',
	        MAJOR       = 'major', // deprecated
	        MODEL       = 'model',
	        NAME        = 'name',
	        TYPE        = 'type',
	        VENDOR      = 'vendor',
	        VERSION     = 'version',
	        ARCHITECTURE= 'architecture',
	        CONSOLE     = 'console',
	        MOBILE      = 'mobile',
	        TABLET      = 'tablet',
	        SMARTTV     = 'smarttv',
	        WEARABLE    = 'wearable',
	        EMBEDDED    = 'embedded';


	    ///////////
	    // Helper
	    //////////


	    var util = {
	        extend : function (regexes, extensions) {
	            for (var i in extensions) {
	                if ("browser cpu device engine os".indexOf(i) !== -1 && extensions[i].length % 2 === 0) {
	                    regexes[i] = extensions[i].concat(regexes[i]);
	                }
	            }
	            return regexes;
	        },
	        has : function (str1, str2) {
	          if (typeof str1 === "string") {
	            return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
	          } else {
	            return false;
	          }
	        },
	        lowerize : function (str) {
	            return str.toLowerCase();
	        },
	        major : function (version) {
	            return typeof(version) === STR_TYPE ? version.split(".")[0] : undefined;
	        }
	    };


	    ///////////////
	    // Map helper
	    //////////////


	    var mapper = {

	        rgx : function () {

	            var result, i = 0, j, k, p, q, matches, match, args = arguments;

	            // loop through all regexes maps
	            while (i < args.length && !matches) {

	                var regex = args[i],       // even sequence (0,2,4,..)
	                    props = args[i + 1];   // odd sequence (1,3,5,..)

	                // construct object barebones
	                if (typeof result === UNDEF_TYPE) {
	                    result = {};
	                    for (p in props) {
	                        if (props.hasOwnProperty(p)){
	                            q = props[p];
	                            if (typeof q === OBJ_TYPE) {
	                                result[q[0]] = undefined;
	                            } else {
	                                result[q] = undefined;
	                            }
	                        }
	                    }
	                }

	                // try matching uastring with regexes
	                j = k = 0;
	                while (j < regex.length && !matches) {
	                    matches = regex[j++].exec(this.getUA());
	                    if (!!matches) {
	                        for (p = 0; p < props.length; p++) {
	                            match = matches[++k];
	                            q = props[p];
	                            // check if given property is actually array
	                            if (typeof q === OBJ_TYPE && q.length > 0) {
	                                if (q.length == 2) {
	                                    if (typeof q[1] == FUNC_TYPE) {
	                                        // assign modified match
	                                        result[q[0]] = q[1].call(this, match);
	                                    } else {
	                                        // assign given value, ignore regex match
	                                        result[q[0]] = q[1];
	                                    }
	                                } else if (q.length == 3) {
	                                    // check whether function or regex
	                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
	                                        // call function (usually string mapper)
	                                        result[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
	                                    } else {
	                                        // sanitize match using given regex
	                                        result[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
	                                    }
	                                } else if (q.length == 4) {
	                                        result[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
	                                }
	                            } else {
	                                result[q] = match ? match : undefined;
	                            }
	                        }
	                    }
	                }
	                i += 2;
	            }
	            return result;
	        },

	        str : function (str, map) {

	            for (var i in map) {
	                // check if array
	                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
	                    for (var j = 0; j < map[i].length; j++) {
	                        if (util.has(map[i][j], str)) {
	                            return (i === UNKNOWN) ? undefined : i;
	                        }
	                    }
	                } else if (util.has(map[i], str)) {
	                    return (i === UNKNOWN) ? undefined : i;
	                }
	            }
	            return str;
	        }
	    };


	    ///////////////
	    // String map
	    //////////////


	    var maps = {

	        browser : {
	            oldsafari : {
	                version : {
	                    '1.0'   : '/8',
	                    '1.2'   : '/1',
	                    '1.3'   : '/3',
	                    '2.0'   : '/412',
	                    '2.0.2' : '/416',
	                    '2.0.3' : '/417',
	                    '2.0.4' : '/419',
	                    '?'     : '/'
	                }
	            }
	        },

	        device : {
	            amazon : {
	                model : {
	                    'Fire Phone' : ['SD', 'KF']
	                }
	            },
	            sprint : {
	                model : {
	                    'Evo Shift 4G' : '7373KT'
	                },
	                vendor : {
	                    'HTC'       : 'APA',
	                    'Sprint'    : 'Sprint'
	                }
	            }
	        },

	        os : {
	            windows : {
	                version : {
	                    'ME'        : '4.90',
	                    'NT 3.11'   : 'NT3.51',
	                    'NT 4.0'    : 'NT4.0',
	                    '2000'      : 'NT 5.0',
	                    'XP'        : ['NT 5.1', 'NT 5.2'],
	                    'Vista'     : 'NT 6.0',
	                    '7'         : 'NT 6.1',
	                    '8'         : 'NT 6.2',
	                    '8.1'       : 'NT 6.3',
	                    '10'        : ['NT 6.4', 'NT 10.0'],
	                    'RT'        : 'ARM'
	                }
	            }
	        }
	    };


	    //////////////
	    // Regex map
	    /////////////


	    var regexes = {

	        browser : [[

	            // Presto based
	            /(opera\smini)\/([\w\.-]+)/i,                                       // Opera Mini
	            /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,                      // Opera Mobi/Tablet
	            /(opera).+version\/([\w\.]+)/i,                                     // Opera > 9.80
	            /(opera)[\/\s]+([\w\.]+)/i                                          // Opera < 9.80

	            ], [NAME, VERSION], [

	            /\s(opr)\/([\w\.]+)/i                                               // Opera Webkit
	            ], [[NAME, 'Opera'], VERSION], [

	            // Mixed
	            /(kindle)\/([\w\.]+)/i,                                             // Kindle
	            /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,
	                                                                                // Lunascape/Maxthon/Netfront/Jasmine/Blazer

	            // Trident based
	            /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
	                                                                                // Avant/IEMobile/SlimBrowser/Baidu
	            /(?:ms|\()(ie)\s([\w\.]+)/i,                                        // Internet Explorer

	            // Webkit/KHTML based
	            /(rekonq)\/([\w\.]+)*/i,                                            // Rekonq
	            /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs)\/([\w\.-]+)/i
	                                                                                // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS
	            ], [NAME, VERSION], [

	            /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i                         // IE11
	            ], [[NAME, 'IE'], VERSION], [

	            /(edge)\/((\d+)?[\w\.]+)/i                                          // Microsoft Edge
	            ], [NAME, VERSION], [

	            /(yabrowser)\/([\w\.]+)/i                                           // Yandex
	            ], [[NAME, 'Yandex'], VERSION], [

	            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
	            ], [[NAME, /_/g, ' '], VERSION], [

	            /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i,
	                                                                                // Chrome/OmniWeb/Arora/Tizen/Nokia
	            /(qqbrowser)[\/\s]?([\w\.]+)/i
	                                                                                // QQBrowser
	            ], [NAME, VERSION], [

	            /(uc\s?browser)[\/\s]?([\w\.]+)/i,
	            /ucweb.+(ucbrowser)[\/\s]?([\w\.]+)/i,
	            /JUC.+(ucweb)[\/\s]?([\w\.]+)/i
	                                                                                // UCBrowser
	            ], [[NAME, 'UCBrowser'], VERSION], [

	            /(dolfin)\/([\w\.]+)/i                                              // Dolphin
	            ], [[NAME, 'Dolphin'], VERSION], [

	            /((?:android.+)crmo|crios)\/([\w\.]+)/i                             // Chrome for Android/iOS
	            ], [[NAME, 'Chrome'], VERSION], [

	            /XiaoMi\/MiuiBrowser\/([\w\.]+)/i                                   // MIUI Browser
	            ], [VERSION, [NAME, 'MIUI Browser']], [

	            /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i         // Android Browser
	            ], [VERSION, [NAME, 'Android Browser']], [

	            /FBAV\/([\w\.]+);/i                                                 // Facebook App for iOS
	            ], [VERSION, [NAME, 'Facebook']], [

	            /fxios\/([\w\.-]+)/i                                                // Firefox for iOS
	            ], [VERSION, [NAME, 'Firefox']], [

	            /version\/([\w\.]+).+?mobile\/\w+\s(safari)/i                       // Mobile Safari
	            ], [VERSION, [NAME, 'Mobile Safari']], [

	            /version\/([\w\.]+).+?(mobile\s?safari|safari)/i                    // Safari & Safari Mobile
	            ], [VERSION, NAME], [

	            /webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i                     // Safari < 3.0
	            ], [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]], [

	            /(konqueror)\/([\w\.]+)/i,                                          // Konqueror
	            /(webkit|khtml)\/([\w\.]+)/i
	            ], [NAME, VERSION], [

	            // Gecko based
	            /(navigator|netscape)\/([\w\.-]+)/i                                 // Netscape
	            ], [[NAME, 'Netscape'], VERSION], [
	            /(swiftfox)/i,                                                      // Swiftfox
	            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
	                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
	            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,
	                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
	            /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,                          // Mozilla

	            // Other
	            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
	                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
	            /(links)\s\(([\w\.]+)/i,                                            // Links
	            /(gobrowser)\/?([\w\.]+)*/i,                                        // GoBrowser
	            /(ice\s?browser)\/v?([\w\._]+)/i,                                   // ICE Browser
	            /(mosaic)[\/\s]([\w\.]+)/i                                          // Mosaic
	            ], [NAME, VERSION]

	            /* /////////////////////
	            // Media players BEGIN
	            ////////////////////////

	            , [

	            /(apple(?:coremedia|))\/((\d+)[\w\._]+)/i,                          // Generic Apple CoreMedia
	            /(coremedia) v((\d+)[\w\._]+)/i
	            ], [NAME, VERSION], [

	            /(aqualung|lyssna|bsplayer)\/((\d+)?[\w\.-]+)/i                     // Aqualung/Lyssna/BSPlayer
	            ], [NAME, VERSION], [

	            /(ares|ossproxy)\s((\d+)[\w\.-]+)/i                                 // Ares/OSSProxy
	            ], [NAME, VERSION], [

	            /(audacious|audimusicstream|amarok|bass|core|dalvik|gnomemplayer|music on console|nsplayer|psp-internetradioplayer|videos)\/((\d+)[\w\.-]+)/i,
	                                                                                // Audacious/AudiMusicStream/Amarok/BASS/OpenCORE/Dalvik/GnomeMplayer/MoC
	                                                                                // NSPlayer/PSP-InternetRadioPlayer/Videos
	            /(clementine|music player daemon)\s((\d+)[\w\.-]+)/i,               // Clementine/MPD
	            /(lg player|nexplayer)\s((\d+)[\d\.]+)/i,
	            /player\/(nexplayer|lg player)\s((\d+)[\w\.-]+)/i                   // NexPlayer/LG Player
	            ], [NAME, VERSION], [
	            /(nexplayer)\s((\d+)[\w\.-]+)/i                                     // Nexplayer
	            ], [NAME, VERSION], [

	            /(flrp)\/((\d+)[\w\.-]+)/i                                          // Flip Player
	            ], [[NAME, 'Flip Player'], VERSION], [

	            /(fstream|nativehost|queryseekspider|ia-archiver|facebookexternalhit)/i
	                                                                                // FStream/NativeHost/QuerySeekSpider/IA Archiver/facebookexternalhit
	            ], [NAME], [

	            /(gstreamer) souphttpsrc (?:\([^\)]+\)){0,1} libsoup\/((\d+)[\w\.-]+)/i
	                                                                                // Gstreamer
	            ], [NAME, VERSION], [

	            /(htc streaming player)\s[\w_]+\s\/\s((\d+)[\d\.]+)/i,              // HTC Streaming Player
	            /(java|python-urllib|python-requests|wget|libcurl)\/((\d+)[\w\.-_]+)/i,
	                                                                                // Java/urllib/requests/wget/cURL
	            /(lavf)((\d+)[\d\.]+)/i                                             // Lavf (FFMPEG)
	            ], [NAME, VERSION], [

	            /(htc_one_s)\/((\d+)[\d\.]+)/i                                      // HTC One S
	            ], [[NAME, /_/g, ' '], VERSION], [

	            /(mplayer)(?:\s|\/)(?:(?:sherpya-){0,1}svn)(?:-|\s)(r\d+(?:-\d+[\w\.-]+){0,1})/i
	                                                                                // MPlayer SVN
	            ], [NAME, VERSION], [

	            /(mplayer)(?:\s|\/|[unkow-]+)((\d+)[\w\.-]+)/i                      // MPlayer
	            ], [NAME, VERSION], [

	            /(mplayer)/i,                                                       // MPlayer (no other info)
	            /(yourmuze)/i,                                                      // YourMuze
	            /(media player classic|nero showtime)/i                             // Media Player Classic/Nero ShowTime
	            ], [NAME], [

	            /(nero (?:home|scout))\/((\d+)[\w\.-]+)/i                           // Nero Home/Nero Scout
	            ], [NAME, VERSION], [

	            /(nokia\d+)\/((\d+)[\w\.-]+)/i                                      // Nokia
	            ], [NAME, VERSION], [

	            /\s(songbird)\/((\d+)[\w\.-]+)/i                                    // Songbird/Philips-Songbird
	            ], [NAME, VERSION], [

	            /(winamp)3 version ((\d+)[\w\.-]+)/i,                               // Winamp
	            /(winamp)\s((\d+)[\w\.-]+)/i,
	            /(winamp)mpeg\/((\d+)[\w\.-]+)/i
	            ], [NAME, VERSION], [

	            /(ocms-bot|tapinradio|tunein radio|unknown|winamp|inlight radio)/i  // OCMS-bot/tap in radio/tunein/unknown/winamp (no other info)
	                                                                                // inlight radio
	            ], [NAME], [

	            /(quicktime|rma|radioapp|radioclientapplication|soundtap|totem|stagefright|streamium)\/((\d+)[\w\.-]+)/i
	                                                                                // QuickTime/RealMedia/RadioApp/RadioClientApplication/
	                                                                                // SoundTap/Totem/Stagefright/Streamium
	            ], [NAME, VERSION], [

	            /(smp)((\d+)[\d\.]+)/i                                              // SMP
	            ], [NAME, VERSION], [

	            /(vlc) media player - version ((\d+)[\w\.]+)/i,                     // VLC Videolan
	            /(vlc)\/((\d+)[\w\.-]+)/i,
	            /(xbmc|gvfs|xine|xmms|irapp)\/((\d+)[\w\.-]+)/i,                    // XBMC/gvfs/Xine/XMMS/irapp
	            /(foobar2000)\/((\d+)[\d\.]+)/i,                                    // Foobar2000
	            /(itunes)\/((\d+)[\d\.]+)/i                                         // iTunes
	            ], [NAME, VERSION], [

	            /(wmplayer)\/((\d+)[\w\.-]+)/i,                                     // Windows Media Player
	            /(windows-media-player)\/((\d+)[\w\.-]+)/i
	            ], [[NAME, /-/g, ' '], VERSION], [

	            /windows\/((\d+)[\w\.-]+) upnp\/[\d\.]+ dlnadoc\/[\d\.]+ (home media server)/i
	                                                                                // Windows Media Server
	            ], [VERSION, [NAME, 'Windows']], [

	            /(com\.riseupradioalarm)\/((\d+)[\d\.]*)/i                          // RiseUP Radio Alarm
	            ], [NAME, VERSION], [

	            /(rad.io)\s((\d+)[\d\.]+)/i,                                        // Rad.io
	            /(radio.(?:de|at|fr))\s((\d+)[\d\.]+)/i
	            ], [[NAME, 'rad.io'], VERSION]

	            //////////////////////
	            // Media players END
	            ////////////////////*/

	        ],

	        cpu : [[

	            /(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i                     // AMD64
	            ], [[ARCHITECTURE, 'amd64']], [

	            /(ia32(?=;))/i                                                      // IA32 (quicktime)
	            ], [[ARCHITECTURE, util.lowerize]], [

	            /((?:i[346]|x)86)[;\)]/i                                            // IA32
	            ], [[ARCHITECTURE, 'ia32']], [

	            // PocketPC mistakenly identified as PowerPC
	            /windows\s(ce|mobile);\sppc;/i
	            ], [[ARCHITECTURE, 'arm']], [

	            /((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i                           // PowerPC
	            ], [[ARCHITECTURE, /ower/, '', util.lowerize]], [

	            /(sun4\w)[;\)]/i                                                    // SPARC
	            ], [[ARCHITECTURE, 'sparc']], [

	            /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i
	                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
	            ], [[ARCHITECTURE, util.lowerize]]
	        ],

	        device : [[

	            /\((ipad|playbook);[\w\s\);-]+(rim|apple)/i                         // iPad/PlayBook
	            ], [MODEL, VENDOR, [TYPE, TABLET]], [

	            /applecoremedia\/[\w\.]+ \((ipad)/                                  // iPad
	            ], [MODEL, [VENDOR, 'Apple'], [TYPE, TABLET]], [

	            /(apple\s{0,1}tv)/i                                                 // Apple TV
	            ], [[MODEL, 'Apple TV'], [VENDOR, 'Apple']], [

	            /(archos)\s(gamepad2?)/i,                                           // Archos
	            /(hp).+(touchpad)/i,                                                // HP TouchPad
	            /(kindle)\/([\w\.]+)/i,                                             // Kindle
	            /\s(nook)[\w\s]+build\/(\w+)/i,                                     // Nook
	            /(dell)\s(strea[kpr\s\d]*[\dko])/i                                  // Dell Streak
	            ], [VENDOR, MODEL, [TYPE, TABLET]], [

	            /(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i                               // Kindle Fire HD
	            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [
	            /(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i                  // Fire Phone
	            ], [[MODEL, mapper.str, maps.device.amazon.model], [VENDOR, 'Amazon'], [TYPE, MOBILE]], [

	            /\((ip[honed|\s\w*]+);.+(apple)/i                                   // iPod/iPhone
	            ], [MODEL, VENDOR, [TYPE, MOBILE]], [
	            /\((ip[honed|\s\w*]+);/i                                            // iPod/iPhone
	            ], [MODEL, [VENDOR, 'Apple'], [TYPE, MOBILE]], [

	            /(blackberry)[\s-]?(\w+)/i,                                         // BlackBerry
	            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i,
	                                                                                // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Huawei/Meizu/Motorola/Polytron
	            /(hp)\s([\w\s]+\w)/i,                                               // HP iPAQ
	            /(asus)-?(\w+)/i                                                    // Asus
	            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
	            /\(bb10;\s(\w+)/i                                                   // BlackBerry 10
	            ], [MODEL, [VENDOR, 'BlackBerry'], [TYPE, MOBILE]], [
	                                                                                // Asus Tablets
	            /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7)/i
	            ], [MODEL, [VENDOR, 'Asus'], [TYPE, TABLET]], [

	            /(sony)\s(tablet\s[ps])\sbuild\//i,                                  // Sony
	            /(sony)?(?:sgp.+)\sbuild\//i
	            ], [[VENDOR, 'Sony'], [MODEL, 'Xperia Tablet'], [TYPE, TABLET]], [
	            /(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i
	            ], [[VENDOR, 'Sony'], [MODEL, 'Xperia Phone'], [TYPE, MOBILE]], [

	            /\s(ouya)\s/i,                                                      // Ouya
	            /(nintendo)\s([wids3u]+)/i                                          // Nintendo
	            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [

	            /android.+;\s(shield)\sbuild/i                                      // Nvidia
	            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [

	            /(playstation\s[34portablevi]+)/i                                   // Playstation
	            ], [MODEL, [VENDOR, 'Sony'], [TYPE, CONSOLE]], [

	            /(sprint\s(\w+))/i                                                  // Sprint Phones
	            ], [[VENDOR, mapper.str, maps.device.sprint.vendor], [MODEL, mapper.str, maps.device.sprint.model], [TYPE, MOBILE]], [

	            /(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i                         // Lenovo tablets
	            ], [VENDOR, MODEL, [TYPE, TABLET]], [

	            /(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,                               // HTC
	            /(zte)-(\w+)*/i,                                                    // ZTE
	            /(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i
	                                                                                // Alcatel/GeeksPhone/Huawei/Lenovo/Nexian/Panasonic/Sony
	            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [
	                
	            /(nexus\s9)/i                                                       // HTC Nexus 9
	            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [

	            /[\s\(;](xbox(?:\sone)?)[\s\);]/i                                   // Microsoft Xbox
	            ], [MODEL, [VENDOR, 'Microsoft'], [TYPE, CONSOLE]], [
	            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
	            ], [[MODEL, /\./g, ' '], [VENDOR, 'Microsoft'], [TYPE, MOBILE]], [

	                                                                                // Motorola
	            /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i,
	            /mot[\s-]?(\w+)*/i,
	            /(XT\d{3,4}) build\//i,
	            /(nexus\s[6])/i
	            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, MOBILE]], [
	            /android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i
	            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, TABLET]], [

	            /android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n8000|sgh-t8[56]9|nexus 10))/i,
	            /((SM-T\w+))/i
	            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, TABLET]], [                  // Samsung
	            /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-n900))/i,
	            /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i,
	            /sec-((sgh\w+))/i
	            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, MOBILE]], [
	            /(samsung);smarttv/i
	            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [

	            /\(dtv[\);].+(aquos)/i                                              // Sharp
	            ], [MODEL, [VENDOR, 'Sharp'], [TYPE, SMARTTV]], [
	            /sie-(\w+)*/i                                                       // Siemens
	            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [

	            /(maemo|nokia).*(n900|lumia\s\d+)/i,                                // Nokia
	            /(nokia)[\s_-]?([\w-]+)*/i
	            ], [[VENDOR, 'Nokia'], MODEL, [TYPE, MOBILE]], [

	            /android\s3\.[\s\w;-]{10}(a\d{3})/i                                 // Acer
	            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

	            /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i                     // LG Tablet
	            ], [[VENDOR, 'LG'], MODEL, [TYPE, TABLET]], [
	            /(lg) netcast\.tv/i                                                 // LG SmartTV
	            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
	            /(nexus\s[45])/i,                                                   // LG
	            /lg[e;\s\/-]+(\w+)*/i
	            ], [MODEL, [VENDOR, 'LG'], [TYPE, MOBILE]], [

	            /android.+(ideatab[a-z0-9\-\s]+)/i                                  // Lenovo
	            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [

	            /linux;.+((jolla));/i                                               // Jolla
	            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

	            /((pebble))app\/[\d\.]+\s/i                                         // Pebble
	            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [

	            /android.+;\s(glass)\s\d/i                                          // Google Glass
	            ], [MODEL, [VENDOR, 'Google'], [TYPE, WEARABLE]], [

	            /android.+(\w+)\s+build\/hm\1/i,                                        // Xiaomi Hongmi 'numeric' models
	            /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,                   // Xiaomi Hongmi
	            /android.+(mi[\s\-_]*(?:one|one[\s_]plus)?[\s_]*(?:\d\w)?)\s+build/i    // Xiaomi Mi
	            ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, MOBILE]], [

	            /\s(tablet)[;\/\s]/i,                                               // Unidentifiable Tablet
	            /\s(mobile)[;\/\s]/i                                                // Unidentifiable Mobile
	            ], [[TYPE, util.lowerize], VENDOR, MODEL]

	            /*//////////////////////////
	            // TODO: move to string map
	            ////////////////////////////

	            /(C6603)/i                                                          // Sony Xperia Z C6603
	            ], [[MODEL, 'Xperia Z C6603'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [
	            /(C6903)/i                                                          // Sony Xperia Z 1
	            ], [[MODEL, 'Xperia Z 1'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [

	            /(SM-G900[F|H])/i                                                   // Samsung Galaxy S5
	            ], [[MODEL, 'Galaxy S5'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
	            /(SM-G7102)/i                                                       // Samsung Galaxy Grand 2
	            ], [[MODEL, 'Galaxy Grand 2'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
	            /(SM-G530H)/i                                                       // Samsung Galaxy Grand Prime
	            ], [[MODEL, 'Galaxy Grand Prime'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
	            /(SM-G313HZ)/i                                                      // Samsung Galaxy V
	            ], [[MODEL, 'Galaxy V'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
	            /(SM-T805)/i                                                        // Samsung Galaxy Tab S 10.5
	            ], [[MODEL, 'Galaxy Tab S 10.5'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [
	            /(SM-G800F)/i                                                       // Samsung Galaxy S5 Mini
	            ], [[MODEL, 'Galaxy S5 Mini'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
	            /(SM-T311)/i                                                        // Samsung Galaxy Tab 3 8.0
	            ], [[MODEL, 'Galaxy Tab 3 8.0'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [

	            /(R1001)/i                                                          // Oppo R1001
	            ], [MODEL, [VENDOR, 'OPPO'], [TYPE, MOBILE]], [
	            /(X9006)/i                                                          // Oppo Find 7a
	            ], [[MODEL, 'Find 7a'], [VENDOR, 'Oppo'], [TYPE, MOBILE]], [
	            /(R2001)/i                                                          // Oppo YOYO R2001
	            ], [[MODEL, 'Yoyo R2001'], [VENDOR, 'Oppo'], [TYPE, MOBILE]], [
	            /(R815)/i                                                           // Oppo Clover R815
	            ], [[MODEL, 'Clover R815'], [VENDOR, 'Oppo'], [TYPE, MOBILE]], [
	             /(U707)/i                                                          // Oppo Find Way S
	            ], [[MODEL, 'Find Way S'], [VENDOR, 'Oppo'], [TYPE, MOBILE]], [

	            /(T3C)/i                                                            // Advan Vandroid T3C
	            ], [MODEL, [VENDOR, 'Advan'], [TYPE, TABLET]], [
	            /(ADVAN T1J\+)/i                                                    // Advan Vandroid T1J+
	            ], [[MODEL, 'Vandroid T1J+'], [VENDOR, 'Advan'], [TYPE, TABLET]], [
	            /(ADVAN S4A)/i                                                      // Advan Vandroid S4A
	            ], [[MODEL, 'Vandroid S4A'], [VENDOR, 'Advan'], [TYPE, MOBILE]], [

	            /(V972M)/i                                                          // ZTE V972M
	            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [

	            /(i-mobile)\s(IQ\s[\d\.]+)/i                                        // i-mobile IQ
	            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
	            /(IQ6.3)/i                                                          // i-mobile IQ IQ 6.3
	            ], [[MODEL, 'IQ 6.3'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [
	            /(i-mobile)\s(i-style\s[\d\.]+)/i                                   // i-mobile i-STYLE
	            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
	            /(i-STYLE2.1)/i                                                     // i-mobile i-STYLE 2.1
	            ], [[MODEL, 'i-STYLE 2.1'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [
	            
	            /(mobiistar touch LAI 512)/i                                        // mobiistar touch LAI 512
	            ], [[MODEL, 'Touch LAI 512'], [VENDOR, 'mobiistar'], [TYPE, MOBILE]], [

	            /////////////
	            // END TODO
	            ///////////*/

	        ],

	        engine : [[

	            /windows.+\sedge\/([\w\.]+)/i                                       // EdgeHTML
	            ], [VERSION, [NAME, 'EdgeHTML']], [

	            /(presto)\/([\w\.]+)/i,                                             // Presto
	            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,     // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m
	            /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,                          // KHTML/Tasman/Links
	            /(icab)[\/\s]([23]\.[\d\.]+)/i                                      // iCab
	            ], [NAME, VERSION], [

	            /rv\:([\w\.]+).*(gecko)/i                                           // Gecko
	            ], [VERSION, NAME]
	        ],

	        os : [[

	            // Windows based
	            /microsoft\s(windows)\s(vista|xp)/i                                 // Windows (iTunes)
	            ], [NAME, VERSION], [
	            /(windows)\snt\s6\.2;\s(arm)/i,                                     // Windows RT
	            /(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i
	            ], [NAME, [VERSION, mapper.str, maps.os.windows.version]], [
	            /(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i
	            ], [[NAME, 'Windows'], [VERSION, mapper.str, maps.os.windows.version]], [

	            // Mobile/Embedded OS
	            /\((bb)(10);/i                                                      // BlackBerry 10
	            ], [[NAME, 'BlackBerry'], VERSION], [
	            /(blackberry)\w*\/?([\w\.]+)*/i,                                    // Blackberry
	            /(tizen)[\/\s]([\w\.]+)/i,                                          // Tizen
	            /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,
	                                                                                // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
	            /linux;.+(sailfish);/i                                              // Sailfish OS
	            ], [NAME, VERSION], [
	            /(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i                 // Symbian
	            ], [[NAME, 'Symbian'], VERSION], [
	            /\((series40);/i                                                    // Series 40
	            ], [NAME], [
	            /mozilla.+\(mobile;.+gecko.+firefox/i                               // Firefox OS
	            ], [[NAME, 'Firefox OS'], VERSION], [

	            // Console
	            /(nintendo|playstation)\s([wids34portablevu]+)/i,                   // Nintendo/Playstation

	            // GNU/Linux based
	            /(mint)[\/\s\(]?(\w+)*/i,                                           // Mint
	            /(mageia|vectorlinux)[;\s]/i,                                       // Mageia/VectorLinux
	            /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i,
	                                                                                // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
	                                                                                // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
	            /(hurd|linux)\s?([\w\.]+)*/i,                                       // Hurd/Linux
	            /(gnu)\s?([\w\.]+)*/i                                               // GNU
	            ], [NAME, VERSION], [

	            /(cros)\s[\w]+\s([\w\.]+\w)/i                                       // Chromium OS
	            ], [[NAME, 'Chromium OS'], VERSION],[

	            // Solaris
	            /(sunos)\s?([\w\.]+\d)*/i                                           // Solaris
	            ], [[NAME, 'Solaris'], VERSION], [

	            // BSD based
	            /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i                   // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
	            ], [NAME, VERSION],[

	            /(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i              // iOS
	            ], [[NAME, 'iOS'], [VERSION, /_/g, '.']], [

	            /(mac\sos\sx)\s?([\w\s\.]+\w)*/i,
	            /(macintosh|mac(?=_powerpc)\s)/i                                    // Mac OS
	            ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [

	            // Other
	            /((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,                            // Solaris
	            /(haiku)\s(\w+)/i,                                                  // Haiku
	            /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,                               // AIX
	            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
	                                                                                // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS
	            /(unix)\s?([\w\.]+)*/i                                              // UNIX
	            ], [NAME, VERSION]
	        ]
	    };


	    /////////////////
	    // Constructor
	    ////////////////


	    var UAParser = function (uastring, extensions) {

	        if (!(this instanceof UAParser)) {
	            return new UAParser(uastring, extensions).getResult();
	        }

	        var ua = uastring || ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : EMPTY);
	        var rgxmap = extensions ? util.extend(regexes, extensions) : regexes;

	        this.getBrowser = function () {
	            var browser = mapper.rgx.apply(this, rgxmap.browser);
	            browser.major = util.major(browser.version);
	            return browser;
	        };
	        this.getCPU = function () {
	            return mapper.rgx.apply(this, rgxmap.cpu);
	        };
	        this.getDevice = function () {
	            return mapper.rgx.apply(this, rgxmap.device);
	        };
	        this.getEngine = function () {
	            return mapper.rgx.apply(this, rgxmap.engine);
	        };
	        this.getOS = function () {
	            return mapper.rgx.apply(this, rgxmap.os);
	        };
	        this.getResult = function() {
	            return {
	                ua      : this.getUA(),
	                browser : this.getBrowser(),
	                engine  : this.getEngine(),
	                os      : this.getOS(),
	                device  : this.getDevice(),
	                cpu     : this.getCPU()
	            };
	        };
	        this.getUA = function () {
	            return ua;
	        };
	        this.setUA = function (uastring) {
	            ua = uastring;
	            return this;
	        };
	        this.setUA(ua);
	        return this;
	    };

	    UAParser.VERSION = LIBVERSION;
	    UAParser.BROWSER = {
	        NAME    : NAME,
	        MAJOR   : MAJOR, // deprecated
	        VERSION : VERSION
	    };
	    UAParser.CPU = {
	        ARCHITECTURE : ARCHITECTURE
	    };
	    UAParser.DEVICE = {
	        MODEL   : MODEL,
	        VENDOR  : VENDOR,
	        TYPE    : TYPE,
	        CONSOLE : CONSOLE,
	        MOBILE  : MOBILE,
	        SMARTTV : SMARTTV,
	        TABLET  : TABLET,
	        WEARABLE: WEARABLE,
	        EMBEDDED: EMBEDDED
	    };
	    UAParser.ENGINE = {
	        NAME    : NAME,
	        VERSION : VERSION
	    };
	    UAParser.OS = {
	        NAME    : NAME,
	        VERSION : VERSION
	    };


	    ///////////
	    // Export
	    //////////


	    // check js environment
	    if (typeof(exports) !== UNDEF_TYPE) {
	        // nodejs env
	        if (typeof module !== UNDEF_TYPE && module.exports) {
	            exports = module.exports = UAParser;
	        }
	        exports.UAParser = UAParser;
	    } else {
	        // requirejs env (optional)
	        if ("function" === FUNC_TYPE && __webpack_require__(4)) {
	            !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	                return UAParser;
	            }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	        } else {
	            // browser env
	            window.UAParser = UAParser;
	        }
	    }

	    // jQuery/Zepto specific (optional)
	    // Note: 
	    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
	    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
	    //   and we should catch that.
	    var $ = window.jQuery || window.Zepto;
	    if (typeof $ !== UNDEF_TYPE) {
	        var parser = new UAParser();
	        $.ua = parser.getResult();
	        $.ua.get = function() {
	            return parser.getUA();
	        };
	        $.ua.set = function (uastring) {
	            parser.setUA(uastring);
	            var result = parser.getResult();
	            for (var prop in result) {
	                $.ua[prop] = result[prop];
	            }
	        };
	    }

	})(typeof window === 'object' ? window : this);


/***/ },
/* 4 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);