(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.muQUnitUtil = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var is = createCommonjsModule(function (module, exports) {
	(function(root, factory) {    // eslint-disable-line no-extra-semi
	    {
	        // Node. Does not work with strict CommonJS, but
	        // only CommonJS-like enviroments that support module.exports,
	        // like Node.
	        module.exports = factory();
	    }
	}(commonjsGlobal, function() {

	    // Baseline
	    /* -------------------------------------------------------------------------- */

	    // define 'is' object and current version
	    var is = {};
	    is.VERSION = '0.8.0';

	    // define interfaces
	    is.not = {};
	    is.all = {};
	    is.any = {};

	    // cache some methods to call later on
	    var toString = Object.prototype.toString;
	    var slice = Array.prototype.slice;
	    var hasOwnProperty = Object.prototype.hasOwnProperty;

	    // helper function which reverses the sense of predicate result
	    function not(func) {
	        return function() {
	            return !func.apply(null, slice.call(arguments));
	        };
	    }

	    // helper function which call predicate function per parameter and return true if all pass
	    function all(func) {
	        return function() {
	            var params = getParams(arguments);
	            var length = params.length;
	            for (var i = 0; i < length; i++) {
	                if (!func.call(null, params[i])) {
	                    return false;
	                }
	            }
	            return true;
	        };
	    }

	    // helper function which call predicate function per parameter and return true if any pass
	    function any(func) {
	        return function() {
	            var params = getParams(arguments);
	            var length = params.length;
	            for (var i = 0; i < length; i++) {
	                if (func.call(null, params[i])) {
	                    return true;
	                }
	            }
	            return false;
	        };
	    }

	    // build a 'comparator' object for various comparison checks
	    var comparator = {
	        '<': function(a, b) { return a < b; },
	        '<=': function(a, b) { return a <= b; },
	        '>': function(a, b) { return a > b; },
	        '>=': function(a, b) { return a >= b; }
	    };

	    // helper function which compares a version to a range
	    function compareVersion(version, range) {
	        var string = (range + '');
	        var n = +(string.match(/\d+/) || NaN);
	        var op = string.match(/^[<>]=?|/)[0];
	        return comparator[op] ? comparator[op](version, n) : (version == n || n !== n);
	    }

	    // helper function which extracts params from arguments
	    function getParams(args) {
	        var params = slice.call(args);
	        var length = params.length;
	        if (length === 1 && is.array(params[0])) {    // support array
	            params = params[0];
	        }
	        return params;
	    }

	    // Type checks
	    /* -------------------------------------------------------------------------- */

	    // is a given value Arguments?
	    is.arguments = function(value) {    // fallback check is for IE
	        return toString.call(value) === '[object Arguments]' ||
	            (value != null && typeof value === 'object' && 'callee' in value);
	    };

	    // is a given value Array?
	    is.array = Array.isArray || function(value) {    // check native isArray first
	        return toString.call(value) === '[object Array]';
	    };

	    // is a given value Boolean?
	    is.boolean = function(value) {
	        return value === true || value === false || toString.call(value) === '[object Boolean]';
	    };

	    // is a given value Char?
	    is.char = function(value) {
	        return is.string(value) && value.length === 1;
	    };

	    // is a given value Date Object?
	    is.date = function(value) {
	        return toString.call(value) === '[object Date]';
	    };

	    // is a given object a DOM node?
	    is.domNode = function(object) {
	        return is.object(object) && object.nodeType > 0;
	    };

	    // is a given value Error object?
	    is.error = function(value) {
	        return toString.call(value) === '[object Error]';
	    };

	    // is a given value function?
	    is['function'] = function(value) {    // fallback check is for IE
	        return toString.call(value) === '[object Function]' || typeof value === 'function';
	    };

	    // is given value a pure JSON object?
	    is.json = function(value) {
	        return toString.call(value) === '[object Object]';
	    };

	    // is a given value NaN?
	    is.nan = function(value) {    // NaN is number :) Also it is the only value which does not equal itself
	        return value !== value;
	    };

	    // is a given value null?
	    is['null'] = function(value) {
	        return value === null;
	    };

	    // is a given value number?
	    is.number = function(value) {
	        return is.not.nan(value) && toString.call(value) === '[object Number]';
	    };

	    // is a given value object?
	    is.object = function(value) {
	        return Object(value) === value;
	    };

	    // is a given value RegExp?
	    is.regexp = function(value) {
	        return toString.call(value) === '[object RegExp]';
	    };

	    // are given values same type?
	    // prevent NaN, Number same type check
	    is.sameType = function(value, other) {
	        var tag = toString.call(value);
	        if (tag !== toString.call(other)) {
	            return false;
	        }
	        if (tag === '[object Number]') {
	            return !is.any.nan(value, other) || is.all.nan(value, other);
	        }
	        return true;
	    };
	    // sameType method does not support 'all' and 'any' interfaces
	    is.sameType.api = ['not'];

	    // is a given value String?
	    is.string = function(value) {
	        return toString.call(value) === '[object String]';
	    };

	    // is a given value undefined?
	    is.undefined = function(value) {
	        return value === void 0;
	    };

	    // is a given value window?
	    // setInterval method is only available for window object
	    is.windowObject = function(value) {
	        return value != null && typeof value === 'object' && 'setInterval' in value;
	    };

	    // Presence checks
	    /* -------------------------------------------------------------------------- */

	    //is a given value empty? Objects, arrays, strings
	    is.empty = function(value) {
	        if (is.object(value)) {
	            var length = Object.getOwnPropertyNames(value).length;
	            if (length === 0 || (length === 1 && is.array(value)) ||
	                    (length === 2 && is.arguments(value))) {
	                return true;
	            }
	            return false;
	        }
	        return value === '';
	    };

	    // is a given value existy?
	    is.existy = function(value) {
	        return value != null;
	    };

	    // is a given value falsy?
	    is.falsy = function(value) {
	        return !value;
	    };

	    // is a given value truthy?
	    is.truthy = not(is.falsy);

	    // Arithmetic checks
	    /* -------------------------------------------------------------------------- */

	    // is a given number above minimum parameter?
	    is.above = function(n, min) {
	        return is.all.number(n, min) && n > min;
	    };
	    // above method does not support 'all' and 'any' interfaces
	    is.above.api = ['not'];

	    // is a given number decimal?
	    is.decimal = function(n) {
	        return is.number(n) && n % 1 !== 0;
	    };

	    // are given values equal? supports numbers, strings, regexes, booleans
	    // TODO: Add object and array support
	    is.equal = function(value, other) {
	        // check 0 and -0 equity with Infinity and -Infinity
	        if (is.all.number(value, other)) {
	            return value === other && 1 / value === 1 / other;
	        }
	        // check regexes as strings too
	        if (is.all.string(value, other) || is.all.regexp(value, other)) {
	            return '' + value === '' + other;
	        }
	        if (is.all.boolean(value, other)) {
	            return value === other;
	        }
	        return false;
	    };
	    // equal method does not support 'all' and 'any' interfaces
	    is.equal.api = ['not'];

	    // is a given number even?
	    is.even = function(n) {
	        return is.number(n) && n % 2 === 0;
	    };

	    // is a given number finite?
	    is.finite = isFinite || function(n) {
	        return is.not.infinite(n) && is.not.nan(n);
	    };

	    // is a given number infinite?
	    is.infinite = function(n) {
	        return n === Infinity || n === -Infinity;
	    };

	    // is a given number integer?
	    is.integer = function(n) {
	        return is.number(n) && n % 1 === 0;
	    };

	    // is a given number negative?
	    is.negative = function(n) {
	        return is.number(n) && n < 0;
	    };

	    // is a given number odd?
	    is.odd = function(n) {
	        return is.number(n) && n % 2 === 1;
	    };

	    // is a given number positive?
	    is.positive = function(n) {
	        return is.number(n) && n > 0;
	    };

	    // is a given number above maximum parameter?
	    is.under = function(n, max) {
	        return is.all.number(n, max) && n < max;
	    };
	    // least method does not support 'all' and 'any' interfaces
	    is.under.api = ['not'];

	    // is a given number within minimum and maximum parameters?
	    is.within = function(n, min, max) {
	        return is.all.number(n, min, max) && n > min && n < max;
	    };
	    // within method does not support 'all' and 'any' interfaces
	    is.within.api = ['not'];

	    // Regexp checks
	    /* -------------------------------------------------------------------------- */
	    // Steven Levithan, Jan Goyvaerts: Regular Expressions Cookbook
	    // Scott Gonzalez: Email address validation

	    // dateString match m/d/yy and mm/dd/yyyy, allowing any combination of one or two digits for the day and month, and two or four digits for the year
	    // eppPhone match extensible provisioning protocol format
	    // nanpPhone match north american number plan format
	    // time match hours, minutes, and seconds, 24-hour clock
	    var regexes = {
	        affirmative: /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/,
	        alphaNumeric: /^[A-Za-z0-9]+$/,
	        caPostalCode: /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z]\s?[0-9][A-Z][0-9]$/,
	        creditCard: /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/,
	        dateString: /^(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])(?:\2)(?:[0-9]{2})?[0-9]{2}$/,
	        email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i, // eslint-disable-line no-control-regex
	        eppPhone: /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/,
	        hexadecimal: /^(?:0x)?[0-9a-fA-F]+$/,
	        hexColor: /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
	        ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
	        ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
	        nanpPhone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
	        socialSecurityNumber: /^(?!000|666)[0-8][0-9]{2}-?(?!00)[0-9]{2}-?(?!0000)[0-9]{4}$/,
	        timeString: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
	        ukPostCode: /^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$/,
	        url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
	        usZipCode: /^[0-9]{5}(?:-[0-9]{4})?$/
	    };

	    function regexpCheck(regexp, regexes) {
	        is[regexp] = function(value) {
	            return regexes[regexp].test(value);
	        };
	    }

	    // create regexp checks methods from 'regexes' object
	    for (var regexp in regexes) {
	        if (regexes.hasOwnProperty(regexp)) {
	            regexpCheck(regexp, regexes);
	        }
	    }

	    // simplify IP checks by calling the regex helpers for IPv4 and IPv6
	    is.ip = function(value) {
	        return is.ipv4(value) || is.ipv6(value);
	    };

	    // String checks
	    /* -------------------------------------------------------------------------- */

	    // is a given string or sentence capitalized?
	    is.capitalized = function(string) {
	        if (is.not.string(string)) {
	            return false;
	        }
	        var words = string.split(' ');
	        for (var i = 0; i < words.length; i++) {
	            var word = words[i];
	            if (word.length) {
	                var chr = word.charAt(0);
	                if (chr !== chr.toUpperCase()) {
	                    return false;
	                }
	            }
	        }
	        return true;
	    };

	    // is string end with a given target parameter?
	    is.endWith = function(string, target) {
	        if (is.not.string(string)) {
	            return false;
	        }
	        target += '';
	        var position = string.length - target.length;
	        return position >= 0 && string.indexOf(target, position) === position;
	    };
	    // endWith method does not support 'all' and 'any' interfaces
	    is.endWith.api = ['not'];

	    // is a given string include parameter target?
	    is.include = function(string, target) {
	        return string.indexOf(target) > -1;
	    };
	    // include method does not support 'all' and 'any' interfaces
	    is.include.api = ['not'];

	    // is a given string all lowercase?
	    is.lowerCase = function(string) {
	        return is.string(string) && string === string.toLowerCase();
	    };

	    // is a given string palindrome?
	    is.palindrome = function(string) {
	        if (is.not.string(string)) {
	            return false;
	        }
	        string = string.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
	        var length = string.length - 1;
	        for (var i = 0, half = Math.floor(length / 2); i <= half; i++) {
	            if (string.charAt(i) !== string.charAt(length - i)) {
	                return false;
	            }
	        }
	        return true;
	    };

	    // is a given value space?
	    // horizantal tab: 9, line feed: 10, vertical tab: 11, form feed: 12, carriage return: 13, space: 32
	    is.space = function(value) {
	        if (is.not.char(value)) {
	            return false;
	        }
	        var charCode = value.charCodeAt(0);
	        return (charCode > 8 && charCode < 14) || charCode === 32;
	    };

	    // is string start with a given target parameter?
	    is.startWith = function(string, target) {
	        return is.string(string) && string.indexOf(target) === 0;
	    };
	    // startWith method does not support 'all' and 'any' interfaces
	    is.startWith.api = ['not'];

	    // is a given string all uppercase?
	    is.upperCase = function(string) {
	        return is.string(string) && string === string.toUpperCase();
	    };

	    // Time checks
	    /* -------------------------------------------------------------------------- */

	    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	    var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

	    // is a given dates day equal given day parameter?
	    is.day = function(date, day) {
	        return is.date(date) && day.toLowerCase() === days[date.getDay()];
	    };
	    // day method does not support 'all' and 'any' interfaces
	    is.day.api = ['not'];

	    // is a given date in daylight saving time?
	    is.dayLightSavingTime = function(date) {
	        var january = new Date(date.getFullYear(), 0, 1);
	        var july = new Date(date.getFullYear(), 6, 1);
	        var stdTimezoneOffset = Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
	        return date.getTimezoneOffset() < stdTimezoneOffset;
	    };

	    // is a given date future?
	    is.future = function(date) {
	        var now = new Date();
	        return is.date(date) && date.getTime() > now.getTime();
	    };

	    // is date within given range?
	    is.inDateRange = function(date, start, end) {
	        if (is.not.date(date) || is.not.date(start) || is.not.date(end)) {
	            return false;
	        }
	        var stamp = date.getTime();
	        return stamp > start.getTime() && stamp < end.getTime();
	    };
	    // inDateRange method does not support 'all' and 'any' interfaces
	    is.inDateRange.api = ['not'];

	    // is a given date in last month range?
	    is.inLastMonth = function(date) {
	        return is.inDateRange(date, new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date());
	    };

	    // is a given date in last week range?
	    is.inLastWeek = function(date) {
	        return is.inDateRange(date, new Date(new Date().setDate(new Date().getDate() - 7)), new Date());
	    };

	    // is a given date in last year range?
	    is.inLastYear = function(date) {
	        return is.inDateRange(date, new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date());
	    };

	    // is a given date in next month range?
	    is.inNextMonth = function(date) {
	        return is.inDateRange(date, new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1)));
	    };

	    // is a given date in next week range?
	    is.inNextWeek = function(date) {
	        return is.inDateRange(date, new Date(), new Date(new Date().setDate(new Date().getDate() + 7)));
	    };

	    // is a given date in next year range?
	    is.inNextYear = function(date) {
	        return is.inDateRange(date, new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
	    };

	    // is the given year a leap year?
	    is.leapYear = function(year) {
	        return is.number(year) && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
	    };

	    // is a given dates month equal given month parameter?
	    is.month = function(date, month) {
	        return is.date(date) && month.toLowerCase() === months[date.getMonth()];
	    };
	    // month method does not support 'all' and 'any' interfaces
	    is.month.api = ['not'];

	    // is a given date past?
	    is.past = function(date) {
	        var now = new Date();
	        return is.date(date) && date.getTime() < now.getTime();
	    };

	    // is a given date in the parameter quarter?
	    is.quarterOfYear = function(date, quarter) {
	        return is.date(date) && is.number(quarter) && quarter === Math.floor((date.getMonth() + 3) / 3);
	    };
	    // quarterOfYear method does not support 'all' and 'any' interfaces
	    is.quarterOfYear.api = ['not'];

	    // is a given date indicate today?
	    is.today = function(date) {
	        var now = new Date();
	        var todayString = now.toDateString();
	        return is.date(date) && date.toDateString() === todayString;
	    };

	    // is a given date indicate tomorrow?
	    is.tomorrow = function(date) {
	        var now = new Date();
	        var tomorrowString = new Date(now.setDate(now.getDate() + 1)).toDateString();
	        return is.date(date) && date.toDateString() === tomorrowString;
	    };

	    // is a given date weekend?
	    // 6: Saturday, 0: Sunday
	    is.weekend = function(date) {
	        return is.date(date) && (date.getDay() === 6 || date.getDay() === 0);
	    };

	    // is a given date weekday?
	    is.weekday = not(is.weekend);

	    // is a given dates year equal given year parameter?
	    is.year = function(date, year) {
	        return is.date(date) && is.number(year) && year === date.getFullYear();
	    };
	    // year method does not support 'all' and 'any' interfaces
	    is.year.api = ['not'];

	    // is a given date indicate yesterday?
	    is.yesterday = function(date) {
	        var now = new Date();
	        var yesterdayString = new Date(now.setDate(now.getDate() - 1)).toDateString();
	        return is.date(date) && date.toDateString() === yesterdayString;
	    };

	    // Environment checks
	    /* -------------------------------------------------------------------------- */

	    var freeGlobal = is.windowObject(typeof commonjsGlobal == 'object' && commonjsGlobal) && commonjsGlobal;
	    var freeSelf = is.windowObject(typeof self == 'object' && self) && self;
	    var thisGlobal = is.windowObject(typeof this == 'object' && this) && this;
	    var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

	    var document = freeSelf && freeSelf.document;
	    var previousIs = root.is;

	    // store navigator properties to use later
	    var navigator = freeSelf && freeSelf.navigator;
	    var appVersion = (navigator && navigator.appVersion || '').toLowerCase();
	    var userAgent = (navigator && navigator.userAgent || '').toLowerCase();
	    var vendor = (navigator && navigator.vendor || '').toLowerCase();

	    // is current device android?
	    is.android = function() {
	        return /android/.test(userAgent);
	    };
	    // android method does not support 'all' and 'any' interfaces
	    is.android.api = ['not'];

	    // is current device android phone?
	    is.androidPhone = function() {
	        return /android/.test(userAgent) && /mobile/.test(userAgent);
	    };
	    // androidPhone method does not support 'all' and 'any' interfaces
	    is.androidPhone.api = ['not'];

	    // is current device android tablet?
	    is.androidTablet = function() {
	        return /android/.test(userAgent) && !/mobile/.test(userAgent);
	    };
	    // androidTablet method does not support 'all' and 'any' interfaces
	    is.androidTablet.api = ['not'];

	    // is current device blackberry?
	    is.blackberry = function() {
	        return /blackberry/.test(userAgent) || /bb10/.test(userAgent);
	    };
	    // blackberry method does not support 'all' and 'any' interfaces
	    is.blackberry.api = ['not'];

	    // is current browser chrome?
	    // parameter is optional
	    is.chrome = function(range) {
	        var match = /google inc/.test(vendor) ? userAgent.match(/(?:chrome|crios)\/(\d+)/) : null;
	        return match !== null && compareVersion(match[1], range);
	    };
	    // chrome method does not support 'all' and 'any' interfaces
	    is.chrome.api = ['not'];

	    // is current device desktop?
	    is.desktop = function() {
	        return is.not.mobile() && is.not.tablet();
	    };
	    // desktop method does not support 'all' and 'any' interfaces
	    is.desktop.api = ['not'];

	    // is current browser edge?
	    // parameter is optional
	    is.edge = function(range) {
	        var match = userAgent.match(/edge\/(\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // edge method does not support 'all' and 'any' interfaces
	    is.edge.api = ['not'];

	    // is current browser firefox?
	    // parameter is optional
	    is.firefox = function(range) {
	        var match = userAgent.match(/(?:firefox|fxios)\/(\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // firefox method does not support 'all' and 'any' interfaces
	    is.firefox.api = ['not'];

	    // is current browser internet explorer?
	    // parameter is optional
	    is.ie = function(range) {
	        var match = userAgent.match(/(?:msie |trident.+?; rv:)(\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // ie method does not support 'all' and 'any' interfaces
	    is.ie.api = ['not'];

	    // is current device ios?
	    is.ios = function() {
	        return is.iphone() || is.ipad() || is.ipod();
	    };
	    // ios method does not support 'all' and 'any' interfaces
	    is.ios.api = ['not'];

	    // is current device ipad?
	    // parameter is optional
	    is.ipad = function(range) {
	        var match = userAgent.match(/ipad.+?os (\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // ipad method does not support 'all' and 'any' interfaces
	    is.ipad.api = ['not'];

	    // is current device iphone?
	    // parameter is optional
	    is.iphone = function(range) {
	        // original iPhone doesn't have the os portion of the UA
	        var match = userAgent.match(/iphone(?:.+?os (\d+))?/);
	        return match !== null && compareVersion(match[1] || 1, range);
	    };
	    // iphone method does not support 'all' and 'any' interfaces
	    is.iphone.api = ['not'];

	    // is current device ipod?
	    // parameter is optional
	    is.ipod = function(range) {
	        var match = userAgent.match(/ipod.+?os (\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // ipod method does not support 'all' and 'any' interfaces
	    is.ipod.api = ['not'];

	    // is current operating system linux?
	    is.linux = function() {
	        return /linux/.test(appVersion);
	    };
	    // linux method does not support 'all' and 'any' interfaces
	    is.linux.api = ['not'];

	    // is current operating system mac?
	    is.mac = function() {
	        return /mac/.test(appVersion);
	    };
	    // mac method does not support 'all' and 'any' interfaces
	    is.mac.api = ['not'];

	    // is current device mobile?
	    is.mobile = function() {
	        return is.iphone() || is.ipod() || is.androidPhone() || is.blackberry() || is.windowsPhone();
	    };
	    // mobile method does not support 'all' and 'any' interfaces
	    is.mobile.api = ['not'];

	    // is current state offline?
	    is.offline = not(is.online);
	    // offline method does not support 'all' and 'any' interfaces
	    is.offline.api = ['not'];

	    // is current state online?
	    is.online = function() {
	        return !navigator || navigator.onLine === true;
	    };
	    // online method does not support 'all' and 'any' interfaces
	    is.online.api = ['not'];

	    // is current browser opera?
	    // parameter is optional
	    is.opera = function(range) {
	        var match = userAgent.match(/(?:^opera.+?version|opr)\/(\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // opera method does not support 'all' and 'any' interfaces
	    is.opera.api = ['not'];

	    // is current browser phantomjs?
	    // parameter is optional
	    is.phantom = function(range) {
	        var match = userAgent.match(/phantomjs\/(\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // phantom method does not support 'all' and 'any' interfaces
	    is.phantom.api = ['not'];

	    // is current browser safari?
	    // parameter is optional
	    is.safari = function(range) {
	        var match = userAgent.match(/version\/(\d+).+?safari/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // safari method does not support 'all' and 'any' interfaces
	    is.safari.api = ['not'];

	    // is current device tablet?
	    is.tablet = function() {
	        return is.ipad() || is.androidTablet() || is.windowsTablet();
	    };
	    // tablet method does not support 'all' and 'any' interfaces
	    is.tablet.api = ['not'];

	    // is current device supports touch?
	    is.touchDevice = function() {
	        return !!document && ('ontouchstart' in freeSelf ||
	            ('DocumentTouch' in freeSelf && document instanceof DocumentTouch));
	    };
	    // touchDevice method does not support 'all' and 'any' interfaces
	    is.touchDevice.api = ['not'];

	    // is current operating system windows?
	    is.windows = function() {
	        return /win/.test(appVersion);
	    };
	    // windows method does not support 'all' and 'any' interfaces
	    is.windows.api = ['not'];

	    // is current device windows phone?
	    is.windowsPhone = function() {
	        return is.windows() && /phone/.test(userAgent);
	    };
	    // windowsPhone method does not support 'all' and 'any' interfaces
	    is.windowsPhone.api = ['not'];

	    // is current device windows tablet?
	    is.windowsTablet = function() {
	        return is.windows() && is.not.windowsPhone() && /touch/.test(userAgent);
	    };
	    // windowsTablet method does not support 'all' and 'any' interfaces
	    is.windowsTablet.api = ['not'];

	    // Object checks
	    /* -------------------------------------------------------------------------- */

	    // has a given object got parameterized count property?
	    is.propertyCount = function(object, count) {
	        if (is.not.object(object) || is.not.number(count)) {
	            return false;
	        }
	        var n = 0;
	        for (var property in object) {
	            if (hasOwnProperty.call(object, property) && ++n > count) {
	                return false;
	            }
	        }
	        return n === count;
	    };
	    // propertyCount method does not support 'all' and 'any' interfaces
	    is.propertyCount.api = ['not'];

	    // is given object has parameterized property?
	    is.propertyDefined = function(object, property) {
	        return is.object(object) && is.string(property) && property in object;
	    };
	    // propertyDefined method does not support 'all' and 'any' interfaces
	    is.propertyDefined.api = ['not'];

	    // Array checks
	    /* -------------------------------------------------------------------------- */

	    // is a given item in an array?
	    is.inArray = function(value, array) {
	        if (is.not.array(array)) {
	            return false;
	        }
	        for (var i = 0; i < array.length; i++) {
	            if (array[i] === value) {
	                return true;
	            }
	        }
	        return false;
	    };
	    // inArray method does not support 'all' and 'any' interfaces
	    is.inArray.api = ['not'];

	    // is a given array sorted?
	    is.sorted = function(array, sign) {
	        if (is.not.array(array)) {
	            return false;
	        }
	        var predicate = comparator[sign] || comparator['>='];
	        for (var i = 1; i < array.length; i++) {
	            if (!predicate(array[i], array[i - 1])) {
	                return false;
	            }
	        }
	        return true;
	    };

	    // API
	    // Set 'not', 'all' and 'any' interfaces to methods based on their api property
	    /* -------------------------------------------------------------------------- */

	    function setInterfaces() {
	        var options = is;
	        for (var option in options) {
	            if (hasOwnProperty.call(options, option) && is['function'](options[option])) {
	                var interfaces = options[option].api || ['not', 'all', 'any'];
	                for (var i = 0; i < interfaces.length; i++) {
	                    if (interfaces[i] === 'not') {
	                        is.not[option] = not(is[option]);
	                    }
	                    if (interfaces[i] === 'all') {
	                        is.all[option] = all(is[option]);
	                    }
	                    if (interfaces[i] === 'any') {
	                        is.any[option] = any(is[option]);
	                    }
	                }
	            }
	        }
	    }
	    setInterfaces();

	    // Configuration methods
	    // Intentionally added after setInterfaces function
	    /* -------------------------------------------------------------------------- */

	    // change namespace of library to prevent name collisions
	    // var preferredName = is.setNamespace();
	    // preferredName.odd(3);
	    // => true
	    is.setNamespace = function() {
	        root.is = previousIs;
	        return this;
	    };

	    // set optional regexes to methods
	    is.setRegexp = function(regexp, name) {
	        for (var r in regexes) {
	            if (hasOwnProperty.call(regexes, r) && (name === r)) {
	                regexes[r] = regexp;
	            }
	        }
	    };

	    return is;
	}));
	});

	/**
	 * The exported namespace.
	 *
	 * All public functions are exported via this namespace.
	 *
	 * @type {Object}
	 * @property {Map<string, Map<string, DummyData>>} allDummyData - The library
	 * of dummy data organised by type and period-separated tag path.
	 * 
	 * This data structure is generated by the {@link refreshDummyData} function.
	 */
	const muQUnitUtil = {
	    /**
	     * The library of dummy data organised by type and period-separated tag
	     * path.
	     *
	     * This data structure is generated by the `refreshDummyData()` function.
	     *
	     * @type {Map<string, Map<string, DummyData>>}
	     * @see {@link refreshDummyData}
	     */
	    allDummyData: {}
	};

	/**
	 * A dummy data definition encapsulating the piece of data itself, a
	 * description, and one or more tags.
	 *
	 * @private
	 */
	class DummyData{
	    
	    /**
	     * @param {string} desc - a description of the piece of data.
	     * @param {string[]} tags - zero or more tags to associate with the data.
	     * @param {*} val - the actual piece of data.
	     * @param {string} [type] - the data's type.
	     * @param {string} [tagPath] - the data's tag path.
	     */
	    constructor(desc, tags, val, type, tagPath){
	        if(!(is.string(desc) && is.not.empty(desc))) throw new TypeError('description must be a non-empty string');
	        if(!(is.array(tags) && is.all.string(tags))) throw new TypeError('tags must be an array of strings');
	        if(is.not.undefined(type) && is.not.string(type)) throw new TypeError('if p, type must be a string');
	        this._description = desc;
	        this._tags = [...tags];
	        this._value = val;
	        this._tagLookup = {};
	        this._type = type;
	        this._tagPath = tagPath;
	        for(const t of this._tags){
	            this._tagLookup[t] = true;
	        }
	    }
	    
	    /*
	     * @type {string}
	     */
	    get description(){
	        return this._description;
	    }
	    
	    /**
	     * @type {string[]}
	     */
	    get tags(){
	        return this._tags;
	    }
	    
	    /**
	     * @type {*}
	     */
	    get value(){
	        return this._value;
	    }
	    
	    /**
	     * @type {string|undefined}
	     */
	    get type(){
	        return this._type;
	    }
	    
	    /**
	     * @type {string|undefined}
	     */
	    get tagPath(){
	        return this._tagPath;
	    }
	    
	    /**
	     * @return {boolean}
	     */
	    hasTag(t){
	        if(is.not.string(t)) throw new TypeError('tag must be a string');
	        return this._tagLookup[t] ? true : false;
	    }
	}

	/**
	 * Refresh the dummy data.
	 *
	 * @alias refreshDummyData
	 * @param {...function(): Map<string, Map<string, Array>>} dataGenerators -
	 * references to zero or more functions that return additional dummy data
	 * beyond the default set. The generators must return a data structure
	 * containing three-element arrays indexed by tag path indexed by type. The
	 * first element in the arrays must be a textual description of the piece
	 * of dummy data, the second a list of additional tags as an array of
	 * strings (the tags that make up the tag path should not be included), and
	 * the dummy data value. E.g.:
	 *
	 * ```
	 * function muDummyDataGen(){
	 *     return {
	 *         number: {
	 *             'mu.studentNumber': ['a student number', ['integer'], 99999999]
	 *         },
	 *         string: {
	 *             'mu.studentNumber': ['a student number string', ['integer', 'numeric'], '99999999']
	 *         }
	 *     };
	 * }
	 * ```
	 */
	function refreshDummyData(...dataGenerators){
	    // The data structure defining the default dummy data - see the relevant
	    // page in the manual section of the docs for details.
	    const rawData = {
	        'boolean': {
	            'true': ['true', ['basic'], true],
	            'false': ['false', ['falsy'], false]
	        },
	        'number': {
	            'zero': ['the number zero', ['integer', 'falsy'], 0],
	            'digit': ['a single-digit number', ['integer'], 7],
	            'integer': ['a positive integer', ['basic'], 12345],
	            'integer.2digit': ['a 2-digit number', [], 42],
	            'integer.3digit': ['a 3-digit number', [], 123],
	            'integer.4digit': ['a 4-digit number', [], 1982],
	            'uts': ['a numeric Unix Time-stamp', ['datetime', 'integer'], 1529660265],
	            'integer.negative': ['a negative integer', [], -12345],
	            'float': ['a positive floating point number', [], 3.14],
	            'float.negative': ['a negative floating point number', [], -3.14]
	        },
	        'string': {
	            'empty': ['an empty string', ['falsy'], ''],
	            'word': ['a single-word string', ['basic'], 'boogers'],
	            'line': ['a single-line string', [], 'boogers and snot'],
	            'multiline': ['a multi-line string', [''], 'boogers\nsnot\nbogeys'],
	            'zero': ['the character 0', ['integer', 'numeric'], '0'],
	            'digit': ['a single-digit string', ['integer', 'numeric'], '7'],
	            'integer': ['a positive integer string', ['numeric'], '12345'],
	            'integer.2digit': ['a 2-digit numeric string', ['numeric'], '42'],
	            'integer.3digit': ['a 3-digit numeric string', ['numeric'], '123'],
	            'integer.4digit': ['a 4-digit numeric string', ['numeric'], '1982'],
	            'uts': ['a Unix Time-stamp string', ['datetime', 'numeric', 'integer'], '1529660265'],
	            'iso8601': ['an ISO8601 date & time string', ['datetime'], '2018-06-22T09:37:45z'],
	            'rfc2822': ['an RFC2822 date & time string', ['datetime'], 'Fri, 22 Jun 2018 09:37:45 +0000'],
	            'jsdate': ['a JavaScript date & time string', ['datetime'], '2018-06-22T09:37:45.000Z'],
	            'integer.negative': ['a negative integer string', ['numeric'], '-12345'],
	            'float': ['a floating point numeric string', ['numeric'], '3.14'],
	            'float.negative': ['a negative floating point numeric string', ['numeric'], '-3.14']
	        },
	        'array': {
	            'empty': ['an empty array', ['object'], []],
	            'basic': ['an array of primitives', ['object', 'basic'], [true, 42, 'boogers']]
	        },
	        'function': {
	            'void': ['a void function', ['object', 'basic'], function(){}]
	        },
	        'error': {
	            'Error': ['a generic error', ['object', 'basic'], new Error('a generic error')],
	            'TypeError': ['a type error', ['object'], new TypeError('a type error')],
	            'RangeError': ['a range error', ['object'], new TypeError('a range error')]
	        },
	        'object': {
	            'null': ['null', ['empty', 'falsy', 'basic'], null],
	            'empty': ['empty object', ['plain'], {}],
	            'plain': ['a plain object', ['basic'], {a: 'b', c: 42, d: true}],
	            'jsdate': ['a date object', ['datetime'], new Date('2018-06-22T09:37:45.000Z')],
	            'jsdate.now': ['a date object', ['datetime'], new Date()]
	        },
	        'other': {
	            "undefined": ['undefined', ['empty', 'falsy', 'basic'], undefined]
	        }
	    };
	    const ans = {};
	    
	    // incorporate the default data
	    for(const t of Object.keys(rawData)){
	        ans[t] = {};
	        for(const tp of Object.keys(rawData[t])){
	            ans[t][tp] = new DummyData(
	                rawData[t][tp][0],
	                [...tp.split('.'), ...rawData[t][tp][1]],
	                rawData[t][tp][2],
	                t,
	                tp
	            );
	        }
	    }
	    
	    // incporporate the data from the generator functions (if any)
	    for(const genFn of dataGenerators){
	        try{
	            const extraData = genFn();
	            if(is.not.object(extraData)) throw new TypeError('generator did not return an object');
	            for(const t of Object.keys(extraData)){
	                if(is.not.object(extraData[t])) throw new TypeError(`generatedData['${t}'] is not an object`);
	                if(is.undefined(ans[t])) ans[t] = {};
	                for(const tp of Object.keys(extraData[t])){
	                    if(is.not.array(extraData[t][tp])) throw new TypeError(`generatedData['${t}']['${tp}'] is not an array`);
	                    if(is.not.string(extraData[t][tp][0])) throw new TypeError(`generatedData['${t}']['${tp}'][0] is not a string`);
	                    if(is.not.array(extraData[t][tp][1]) || !is.all.string(extraData[t][tp][1])) throw new TypeError(`generatedData['${t}']['${tp}'][1] is not an array of strings`);
	                    ans[t][tp] = new DummyData(
	                        extraData[t][tp][0],
	                        [...tp.split('.'), ...extraData[t][tp][1]],
	                        extraData[t][tp][2],
	                        t,
	                        tp
	                    );
	                }
	            }
	        }catch(err){
	            throw new Error(`failed to load additional data from genereator function with error: ${err.message}`);
	        }
	    }
	    
	    // store the new data set
	    muQUnitUtil.allDummyData = ans;
	}
	muQUnitUtil.refreshDummyData = refreshDummyData;

	/**
	 * Returns a single piece of dummy data, or, all the dummy data for a
	 * given type, or all the dummy data.
	 *
	 * To get a single piece of dummy data pass its type and tag path as a
	 * single period-separated string, e.g. `'string.word'` for the dummy data
	 * with type `string` and tag path `word`, or `'number.integer.negative'`
	 * for the dummy data with type `number` and tag path `integer.negative`.
	 *
	 * To get all the dummy data for a given type pass the type as a string,
	 * e.g. `'boolean'` for all dummy boolean data.
	 *
	 * To get all the dummy data, simply pass `'*'`.
	 *
	 * When querying all the dummy data both entire sections and specific tags
	 * can be excluded, and when querying all the dummy data for a sigle type
	 * specific tags can be excluded.
	 *
	 * @param {string} path - a type, or, a type and tag path as a single
	 * period-separated string, or the special value `'*'`.
	 * @param {object} [opts] - an optional options object.
	 * @param {string[]} [opts.excludeTypes] - a list of types to exclude when
	 * requesting all dummy data (`path` is `'*'`).
	 * @param {string[]} [opts.excludeTags] - a list of tags to exclude when
	 * requesting all dummy data, or the dummy data for a given type.
	 * @param {string[]} [opts.excludeDefinitions] - a list of individual data
	 * definitions to exclude as period-separated type and tag path strings.
	 * @return {DummyData[]|DummyData|undefined} Returns all the dummy data
	 * for a given type, or a single piece of dummy data for a type with tag
	 * path. If only a type is passed and that type does not exist an empty
	 * array is returned, if the path has two or more parts and the type or
	 * tag path don't exist, `undefined` is returned.
	 * @throws {TypeError}
	 */
	function dummyData(path, opts){
	    if(!(is.string(path) && is.not.empty(path))) throw new TypeError('path must be a non-empty string');
	    if(is.not.object(opts)) opts = {};
	    const pathParts = path.split('.');
	    const reqType = pathParts[0];
	    
	    // if a single piece of data or a single type is requested, and does not exist, return
	    if(reqType !== '*'){
	        if(is.not.object(muQUnitUtil.allDummyData[reqType])) return pathParts.length === 1 ? [] : undefined;
	    }
	    
	    // deal with requests for a single piece of data
	    if(pathParts.length > 1) return muQUnitUtil.allDummyData[reqType][pathParts.slice(1).join('.')];
	    
	    // deal with requests for data for one or more types
	    
	    // figure out what types to process
	    const typesToFetch = [];
	    if(reqType === '*'){
	        const typeSkipLookup = {};
	        if(is.array(opts.excludeTypes)){
	            for(const t of opts.excludeTypes) typeSkipLookup[t] = true;
	        }
	        for(const t of Object.keys(muQUnitUtil.allDummyData)){
	            if(!typeSkipLookup[t]) typesToFetch.push(t);
	        }
	    }else {
	        typesToFetch.push(reqType);
	    }
	    
	    // figure out which individual definitions to skip
	    const defSkipLookup = {};
	    if(is.array(opts.excludeDefinitions)){
	        for(const dp of opts.excludeDefinitions) defSkipLookup[dp] = true;
	    }
	    
	    // process all the requested types
	    const ans = [];
	    const doCheckTags = is.array(opts.excludeTags);
	    for(const t of typesToFetch){
	        processTypeDummyData:
	        for(const tp of Object.keys(muQUnitUtil.allDummyData[t])){
	            if(doCheckTags){
	                for(const et of opts.excludeTags){
	                    if(muQUnitUtil.allDummyData[t][tp].hasTag(et)) continue processTypeDummyData;
	                }
	            }
	            if(!defSkipLookup[`${t}.${tp}`]) ans.push(muQUnitUtil.allDummyData[t][tp]);
	        }
	    }
	    return ans;
	}
	muQUnitUtil.dummyData = dummyData;

	/**
	 * A function to return all dummy data except those for the given
	 * types and those matching the given tags tags.
	 *
	 * This is a shortcut for:
	 * 
	 * ```
	 * .dummyData(
	 *     '*',
	 *     {
	 *         excludeTypes: arguments[0],
	 *         excludeTags: arguments[1],
	 *         excludeDefinitions: arguments[2]
	 *     }
	 * )
	 * ```
	 *
	 * @param {string[]} [excludeTypes]
	 * @param {string[]} [excludeTags]
	 * @param {string[]} [excludeDefinitions]
	 * @return {DummyData[]}
	 */
	function dummyDataExcept(excludeTypes, excludeTags, excludeDefinitions){
	    if(is.not.array(excludeTypes)) excludeTypes = [];
	    if(is.not.array(excludeTags)) excludeTags = [];
	    if(is.not.array(excludeDefinitions)) excludeDefinitions = [];
	    return dummyData('*', {excludeTypes, excludeTags, excludeDefinitions});
	}
	muQUnitUtil.dummyDataExcept = dummyDataExcept;

	/**
	 * A function to return all basic dummy data, i.e. all dummy data tagged
	 * `basic`.
	 *
	 * This is a shortcut for `dummyDataWithAnyTag('basic')`.
	 *
	 * @return {DummyData[]}
	 */
	function dummyBasicData(){
	    return dummyDataWithAnyTag('basic');
	}
	muQUnitUtil.dummyBasicData = dummyBasicData;

	/**
	 * A function to return all basic dummy data that's not an object, i.e. all
	 * dummy data tagged `basic` that does not have either the type or tag
	 * `object`.
	 *
	 * @return {DummyData[]}
	 */
	function dummyBasicPrimitives(){
	    const ans = [];
	    for(const dd of dummyBasicData()){
	        if(dd.type != 'object' && !dd.hasTag('object')) ans.push(dd);
	    }
	    return ans;
	}
	muQUnitUtil.dummyBasicPrimitives = dummyBasicPrimitives;

	/**
	 * A function to return all basic dummy data except those for zero or more
	 * given types.
	 *
	 * @param {...string} excludeTypes
	 * @return {DummyData[]}
	 */
	function dummyBasicDataExcept(...excludeTypes){
	    const excludeLookup = {};
	    for(const et of excludeTypes) excludeLookup[et] = true;
	    const ans = [];
	    for(const dd of dummyBasicData()){
	        if(!excludeLookup[dd.type]){
	            ans.push(dd);
	        }
	    }
	    return ans;
	}
	muQUnitUtil.dummyBasicDataExcept = dummyBasicDataExcept;

	/**
	 * A function to return all basic dummy primitives except those for zero or
	 * more given types.
	 *
	 * @param {...string} excludeTypes
	 * @return {DummyData[]}
	 */
	function dummyBasicPrimitivesExcept(...excludeTypes){
	    const excludeLookup = {};
	    for(const et of excludeTypes) excludeLookup[et] = true;
	    const ans = [];
	    for(const dd of dummyBasicPrimitives()){
	        if(!excludeLookup[dd.type]){
	            ans.push(dd);
	        }
	    }
	    return ans;
	}
	muQUnitUtil.dummyBasicPrimitivesExcept = dummyBasicPrimitivesExcept;

	/**
	 * Returns the dummy data of one or more types.
	 * 
	 * @param {...string} typeList
	 * @return {DummyData[]}
	 * @throws {TypeError}
	 */
	function dummyDataByType(...typeList){
	    if(!is.all.string(typeList)) throw new TypeError('all specified types must be strings');
	    const ans = [];
	    for(const t of typeList){
	        if(is.object(muQUnitUtil.allDummyData[t])) ans.push(...Object.values(muQUnitUtil.allDummyData[t]));
	    }
	    return ans;
	}
	muQUnitUtil.dummyDataByType = dummyDataByType;

	/**
	 * Returns the dummy data matching **any** of the given tags.
	 *
	 * @param {...string} tagList
	 * @return {DummyData[]}
	 * @throws {TypeError}
	 */
	function dummyDataWithAnyTag(...tagList){
	    if(!is.all.string(tagList)) throw new TypeError('all specified tags must be strings');
	    const ans = [];
	    for(const td of Object.values(muQUnitUtil.allDummyData)){
	        for(const dd of Object.values(td)){
	            // test if any requested tag is present
	            let anyPresent = false;
	            for(const t of tagList){
	                if(dd.hasTag(t)){
	                    anyPresent = true;
	                    break;
	                }
	            }
	            if(anyPresent) ans.push(dd);
	        }
	        
	    }
	    return ans;
	}
	muQUnitUtil.dummyDataWithAnyTag = dummyDataWithAnyTag;

	/**
	 * Returns the dummy data matching **all** of the given tags.
	 * 
	 * @param {...string} tagList
	 * @return {DummyData[]}
	 * @throws {TypeError}
	 */
	function dummyDataWithAllTags(...tagList){
	    if(!is.all.string(tagList)) throw new TypeError('all specified tags must be strings');
	    const ans = [];
	    for(const td of Object.values(muQUnitUtil.allDummyData)){
	        for(const dd of Object.values(td)){
	            // make sure every tag is present
	            let allPresent = true;
	            for(const t of tagList){
	                if(!dd.hasTag(t)){
	                    allPresent = false;
	                    break;
	                }
	            }
	            if(allPresent) ans.push(dd);
	        }
	    }
	    return ans;
	}
	muQUnitUtil.dummyDataWithAllTags = dummyDataWithAllTags;

	// initialise the dummy data
	refreshDummyData();

	return muQUnitUtil;

})));
