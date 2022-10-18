var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getAugmentedNamespace(n) {
  var f = n.default;
	if (typeof f == "function") {
		var a = function () {
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

var global$1 = (typeof global !== "undefined" ? global :
  typeof self !== "undefined" ? self :
  typeof window !== "undefined" ? window : {});

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
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
    var timeout = runTimeout(cleanUpNextTick);
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
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding$1(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var browser$1 = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding$1,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init () {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray (b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3F];
    output += lookup[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

function read (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString = {}.toString;

var isArray$2 = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
  ? global$1.TYPED_ARRAY_SUPPORT
  : true;

/*
 * Export kMaxLength after typed array support is determined.
 */
kMaxLength();

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr
};

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray$2(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}
Buffer.isBuffer = isBuffer;
function internalIsBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer.concat = function concat (list, length) {
  if (!isArray$2(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer.prototype.equals = function equals (b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf)
  } else {
    return fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes (str) {
  return toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
}

function isFastBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
}

function commonjsRequire(path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var pdf$1 = {exports: {}};

var domain;

// This constructor is used to store event handlers. Instantiating this is
// faster than explicitly calling `Object.create(null)` to get a "clean" empty
// object (tested with v8 v4.9).
function EventHandlers() {}
EventHandlers.prototype = Object.create(null);

function EventEmitter() {
  EventEmitter.init.call(this);
}

// nodejs oddity
// require('events') === require('events').EventEmitter
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.usingDomains = false;

EventEmitter.prototype.domain = undefined;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

EventEmitter.init = function() {
  this.domain = null;
  if (EventEmitter.usingDomains) {
    // if there is an active domain, then attach to it.
    if (domain.active ) ;
  }

  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = new EventHandlers();
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events, domain;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  domain = this.domain;

  // If there is no 'error' event listener then throw.
  if (doError) {
    er = arguments[1];
    if (domain) {
      if (!er)
        er = new Error('Uncaught, unspecified "error" event');
      er.domainEmitter = this;
      er.domain = domain;
      er.domainThrown = false;
      domain.emit('error', er);
    } else if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
    // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
    // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] :
                                          [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
                            existing.length + ' ' + type + ' listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        emitWarning(w);
      }
    }
  }

  return target;
}
function emitWarning(e) {
  typeof console.warn === 'function' ? console.warn(e) : console.log(e);
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function _onceWrap(target, type, listener) {
  var fired = false;
  function g() {
    target.removeListener(type, g);
    if (!fired) {
      fired = true;
      listener.apply(target, arguments);
    }
  }
  g.listener = listener;
  return g;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || (list.listener && list.listener === listener)) {
        if (--this._eventsCount === 0)
          this._events = new EventHandlers();
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length; i-- > 0;) {
          if (list[i] === listener ||
              (list[i].listener && list[i].listener === listener)) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (list.length === 1) {
          list[0] = undefined;
          if (--this._eventsCount === 0) {
            this._events = new EventHandlers();
            return this;
          } else {
            delete events[type];
          }
        } else {
          spliceOne(list, position);
        }

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };
    
// Alias for removeListener added in NodeJS 10.0
// https://nodejs.org/api/events.html#events_emitter_off_eventname_listener
EventEmitter.prototype.off = function(type, listener){
    return this.removeListener(type, listener);
};

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = new EventHandlers();
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        for (var i = 0, key; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = new EventHandlers();
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        do {
          this.removeListener(type, listeners[listeners.length - 1]);
        } while (listeners[0]);
      }

      return this;
    };

EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;

  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === 'function')
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }

  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount$1.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount$1;
function listenerCount$1(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, i) {
  var copy = new Array(i);
  while (i--)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

var inherits;
if (typeof Object.create === 'function'){
  inherits = function inherits(ctor, superCtor) {
    // implementation from standard node.js 'util' module
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  inherits = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}
var inherits$1 = inherits;

var formatRegExp = /%[sdj%]/g;
function format$1(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
}

// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
function deprecate(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global$1.process)) {
    return function() {
      return deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (browser$1.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (browser$1.throwDeprecation) {
        throw new Error(msg);
      } else if (browser$1.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

var debugs = {};
var debugEnviron;
function debuglog(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = browser$1.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = 0;
      debugs[set] = function() {
        var msg = format$1.apply(null, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
}

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    _extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction$1(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction$1(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray$1(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction$1(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty$1(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty$1(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var length = output.reduce(function(prev, cur) {
    if (cur.indexOf('\n') >= 0) ;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray$1(ar) {
  return Array.isArray(ar);
}

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

function isNull(arg) {
  return arg === null;
}

function isNullOrUndefined(arg) {
  return arg == null;
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isString(arg) {
  return typeof arg === 'string';
}

function isUndefined(arg) {
  return arg === void 0;
}

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}

function isFunction$1(arg) {
  return typeof arg === 'function';
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function _extend(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
}
function hasOwnProperty$1(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function BufferList() {
  this.head = null;
  this.tail = null;
  this.length = 0;
}

BufferList.prototype.push = function (v) {
  var entry = { data: v, next: null };
  if (this.length > 0) this.tail.next = entry;else this.head = entry;
  this.tail = entry;
  ++this.length;
};

BufferList.prototype.unshift = function (v) {
  var entry = { data: v, next: this.head };
  if (this.length === 0) this.tail = entry;
  this.head = entry;
  ++this.length;
};

BufferList.prototype.shift = function () {
  if (this.length === 0) return;
  var ret = this.head.data;
  if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
  --this.length;
  return ret;
};

BufferList.prototype.clear = function () {
  this.head = this.tail = null;
  this.length = 0;
};

BufferList.prototype.join = function (s) {
  if (this.length === 0) return '';
  var p = this.head;
  var ret = '' + p.data;
  while (p = p.next) {
    ret += s + p.data;
  }return ret;
};

BufferList.prototype.concat = function (n) {
  if (this.length === 0) return Buffer.alloc(0);
  if (this.length === 1) return this.head.data;
  var ret = Buffer.allocUnsafe(n >>> 0);
  var p = this.head;
  var i = 0;
  while (p) {
    p.data.copy(ret, i);
    i += p.data.length;
    p = p.next;
  }
  return ret;
};

// Copyright Joyent, Inc. and other Node contributors.
var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     };


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
function StringDecoder(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
}

// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

Readable.ReadableState = ReadableState;

var debug = debuglog('stream');
inherits$1(Readable, EventEmitter);

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') {
    return emitter.prependListener(event, fn);
  } else {
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event])
      emitter.on(event, fn);
    else if (Array.isArray(emitter._events[event]))
      emitter._events[event].unshift(fn);
    else
      emitter._events[event] = [fn, emitter._events[event]];
  }
}
function listenerCount (emitter, type) {
  return emitter.listeners(type).length;
}
function ReadableState(options, stream) {

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~ ~this.highWaterMark;

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}
function Readable(options) {

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options && typeof options.read === 'function') this._read = options.read;

  EventEmitter.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;

  if (!state.objectMode && typeof chunk === 'string') {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = Buffer.from(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var _e = new Error('stream.unshift() after end event');
      stream.emit('error', _e);
    } else {
      var skipAdd;
      if (state.decoder && !addToFront && !encoding) {
        chunk = state.decoder.write(chunk);
        skipAdd = !state.objectMode && chunk.length === 0;
      }

      if (!addToFront) state.reading = false;

      // Don't add to the buffer if we've decoded to an empty string chunk and
      // we're not in object mode
      if (!skipAdd) {
        // if we want the data now, just emit it.
        if (state.flowing && state.length === 0 && !state.sync) {
          stream.emit('data', chunk);
          stream.read(0);
        } else {
          // update the buffer info.
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

          if (state.needReadable) emitReadable(stream);
        }
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) nextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false);

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted) nextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (listenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && src.listeners('data').length) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var _i = 0; _i < len; _i++) {
      dests[_i].emit('unpipe', this);
    }return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1) return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = EventEmitter.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        nextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function (ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

// A bit simpler than readable streams.
Writable.WritableState = WritableState;
inherits$1(Writable, EventEmitter);

function nop() {}

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

function WritableState(options, stream) {
  Object.defineProperty(this, 'buffer', {
    get: deprecate(function () {
      return this.getBuffer();
    }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
  });
  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~ ~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function writableStateGetBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};
function Writable(options) {

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex)) return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;
  }

  EventEmitter.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  nextTick(cb, er);
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;
  // Always throw error if a null is written
  // if we are not in object mode then throw
  // if it is not a buffer, string, or undefined.
  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    nextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk)) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);

  if (Buffer.isBuffer(chunk)) encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync) nextTick(cb, er);else cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
        nextTick(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
        afterWrite(stream, state, finished, cb);
      }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    while (entry) {
      buffer[count] = entry;
      entry = entry.next;
      count += 1;
    }

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else {
      prefinish(stream, state);
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) nextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function (err) {
    var entry = _this.entry;
    _this.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    if (state.corkedRequestsFree) {
      state.corkedRequestsFree.next = _this;
    } else {
      state.corkedRequestsFree = _this;
    }
  };
}

inherits$1(Duplex, Readable);

var keys = Object.keys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}
function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

// a transform stream is a readable/writable stream where you do
inherits$1(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}
function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er) {
      done(stream, er);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('Not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

function done(stream, er) {
  if (er) return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}

inherits$1(PassThrough, Transform);
function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

inherits$1(Stream, EventEmitter);
Stream.Readable = Readable;
Stream.Writable = Writable;
Stream.Duplex = Duplex;
Stream.Transform = Transform;
Stream.PassThrough = PassThrough;

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;

// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EventEmitter.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EventEmitter.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

var msg = {
  2:      'need dictionary',     /* Z_NEED_DICT       2  */
  1:      'stream end',          /* Z_STREAM_END      1  */
  0:      '',                    /* Z_OK              0  */
  '-1':   'file error',          /* Z_ERRNO         (-1) */
  '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
  '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
  '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
  '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
  '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
};

function ZStream() {
  /* next input byte */
  this.input = null; // JS specific, because we have no pointers
  this.next_in = 0;
  /* number of bytes available at input */
  this.avail_in = 0;
  /* total number of input bytes read so far */
  this.total_in = 0;
  /* next output byte should be put there */
  this.output = null; // JS specific, because we have no pointers
  this.next_out = 0;
  /* remaining free space at output */
  this.avail_out = 0;
  /* total number of bytes output so far */
  this.total_out = 0;
  /* last error message, NULL if no error */
  this.msg = ''/*Z_NULL*/;
  /* not visible by applications */
  this.state = null;
  /* best guess about the data type: binary or text */
  this.data_type = 2/*Z_UNKNOWN*/;
  /* adler32 value of the uncompressed data */
  this.adler = 0;
}

function arraySet(dest, src, src_offs, len, dest_offs) {
  if (src.subarray && dest.subarray) {
    dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
    return;
  }
  // Fallback to ordinary array
  for (var i = 0; i < len; i++) {
    dest[dest_offs + i] = src[src_offs + i];
  }
}


var Buf8 = Uint8Array;
var Buf16 = Uint16Array;
var Buf32 = Int32Array;
// Enable/Disable typed arrays use, for testing
//

/* Public constants ==========================================================*/
/* ===========================================================================*/


//var Z_FILTERED          = 1;
//var Z_HUFFMAN_ONLY      = 2;
//var Z_RLE               = 3;
var Z_FIXED$2 = 4;
//var Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */
var Z_BINARY$1 = 0;
var Z_TEXT$1 = 1;
//var Z_ASCII             = 1; // = Z_TEXT
var Z_UNKNOWN$2 = 2;

/*============================================================================*/


function zero$1(buf) {
  var len = buf.length;
  while (--len >= 0) {
    buf[len] = 0;
  }
}

// From zutil.h

var STORED_BLOCK = 0;
var STATIC_TREES = 1;
var DYN_TREES = 2;
/* The three kinds of block type */

var MIN_MATCH$1 = 3;
var MAX_MATCH$1 = 258;
/* The minimum and maximum match lengths */

// From deflate.h
/* ===========================================================================
 * Internal compression state.
 */

var LENGTH_CODES$1 = 29;
/* number of length codes, not counting the special END_BLOCK code */

var LITERALS$1 = 256;
/* number of literal bytes 0..255 */

var L_CODES$1 = LITERALS$1 + 1 + LENGTH_CODES$1;
/* number of Literal or Length codes, including the END_BLOCK code */

var D_CODES$1 = 30;
/* number of distance codes */

var BL_CODES$1 = 19;
/* number of codes used to transfer the bit lengths */

var HEAP_SIZE$1 = 2 * L_CODES$1 + 1;
/* maximum heap size */

var MAX_BITS$1 = 15;
/* All codes must not exceed MAX_BITS bits */

var Buf_size = 16;
/* size of bit buffer in bi_buf */


/* ===========================================================================
 * Constants
 */

var MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */

var END_BLOCK = 256;
/* end of block literal code */

var REP_3_6 = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

var REPZ_3_10 = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

var REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

/* eslint-disable comma-spacing,array-bracket-spacing */
var extra_lbits = /* extra bits for each length code */ [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];

var extra_dbits = /* extra bits for each distance code */ [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];

var extra_blbits = /* extra bits for each bit length code */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];

var bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
/* eslint-enable comma-spacing,array-bracket-spacing */

/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */

// We pre-fill arrays with 0 to avoid uninitialized gaps

var DIST_CODE_LEN = 512; /* see definition of array dist_code below */

// !!!! Use flat array insdead of structure, Freq = i*2, Len = i*2+1
var static_ltree = new Array((L_CODES$1 + 2) * 2);
zero$1(static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

var static_dtree = new Array(D_CODES$1 * 2);
zero$1(static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

var _dist_code = new Array(DIST_CODE_LEN);
zero$1(_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

var _length_code = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
zero$1(_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */

var base_length = new Array(LENGTH_CODES$1);
zero$1(base_length);
/* First normalized length for each code (0 = MIN_MATCH) */

var base_dist = new Array(D_CODES$1);
zero$1(base_dist);
/* First normalized distance for each code (0 = distance of 1) */


function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

  this.static_tree = static_tree; /* static tree or NULL */
  this.extra_bits = extra_bits; /* extra bits for each code or NULL */
  this.extra_base = extra_base; /* base index for extra_bits */
  this.elems = elems; /* max number of elements in the tree */
  this.max_length = max_length; /* max bit length for the codes */

  // show if `static_tree` has data or dummy - needed for monomorphic objects
  this.has_stree = static_tree && static_tree.length;
}


var static_l_desc;
var static_d_desc;
var static_bl_desc;


function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree; /* the dynamic tree */
  this.max_code = 0; /* largest code with non zero frequency */
  this.stat_desc = stat_desc; /* the corresponding static tree */
}



function d_code(dist) {
  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
}


/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
function put_short(s, w) {
  //    put_byte(s, (uch)((w) & 0xff));
  //    put_byte(s, (uch)((ush)(w) >> 8));
  s.pending_buf[s.pending++] = (w) & 0xff;
  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
}


/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
function send_bits(s, value, length) {
  if (s.bi_valid > (Buf_size - length)) {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> (Buf_size - s.bi_valid);
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    s.bi_valid += length;
  }
}


function send_code(s, c, tree) {
  send_bits(s, tree[c * 2] /*.Code*/ , tree[c * 2 + 1] /*.Len*/ );
}


/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
function bi_reverse(code, len) {
  var res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
}


/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
function bi_flush(s) {
  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;

  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
}


/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
function gen_bitlen(s, desc) {
//    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */
  var tree = desc.dyn_tree;
  var max_code = desc.max_code;
  var stree = desc.stat_desc.static_tree;
  var has_stree = desc.stat_desc.has_stree;
  var extra = desc.stat_desc.extra_bits;
  var base = desc.stat_desc.extra_base;
  var max_length = desc.stat_desc.max_length;
  var h; /* heap index */
  var n, m; /* iterate over the tree elements */
  var bits; /* bit length */
  var xbits; /* extra bits */
  var f; /* frequency */
  var overflow = 0; /* number of elements with bit length too large */

  for (bits = 0; bits <= MAX_BITS$1; bits++) {
    s.bl_count[bits] = 0;
  }

  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
  tree[s.heap[s.heap_max] * 2 + 1] /*.Len*/ = 0; /* root of the heap */

  for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {
    n = s.heap[h];
    bits = tree[tree[n * 2 + 1] /*.Dad*/ * 2 + 1] /*.Len*/ + 1;
    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n * 2 + 1] /*.Len*/ = bits;
    /* We overwrite tree[n].Dad which is no longer needed */

    if (n > max_code) {
      continue;
    } /* not a leaf node */

    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) {
      xbits = extra[n - base];
    }
    f = tree[n * 2] /*.Freq*/ ;
    s.opt_len += f * (bits + xbits);
    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1] /*.Len*/ + xbits);
    }
  }
  if (overflow === 0) {
    return;
  }

  // Trace((stderr,"\nbit length overflow\n"));
  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */
  do {
    bits = max_length - 1;
    while (s.bl_count[bits] === 0) {
      bits--;
    }
    s.bl_count[bits]--; /* move one leaf down the tree */
    s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
    s.bl_count[max_length]--;
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
    overflow -= 2;
  } while (overflow > 0);

  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      m = s.heap[--h];
      if (m > max_code) {
        continue;
      }
      if (tree[m * 2 + 1] /*.Len*/ !== bits) {
        // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
        s.opt_len += (bits - tree[m * 2 + 1] /*.Len*/ ) * tree[m * 2] /*.Freq*/ ;
        tree[m * 2 + 1] /*.Len*/ = bits;
      }
      n--;
    }
  }
}


/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
function gen_codes(tree, max_code, bl_count) {
//    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */

  var next_code = new Array(MAX_BITS$1 + 1); /* next code value for each bit length */
  var code = 0; /* running code value */
  var bits; /* bit index */
  var n; /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
  for (bits = 1; bits <= MAX_BITS$1; bits++) {
    next_code[bits] = code = (code + bl_count[bits - 1]) << 1;
  }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

  for (n = 0; n <= max_code; n++) {
    var len = tree[n * 2 + 1] /*.Len*/ ;
    if (len === 0) {
      continue;
    }
    /* Now reverse the bits */
    tree[n * 2] /*.Code*/ = bi_reverse(next_code[len]++, len);

    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
  }
}


/* ===========================================================================
 * Initialize the various 'constant' tables.
 */
function tr_static_init() {
  var n; /* iterates over tree elements */
  var bits; /* bit counter */
  var length; /* length value */
  var code; /* code value */
  var dist; /* distance index */
  var bl_count = new Array(MAX_BITS$1 + 1);
  /* number of codes at each bit length for an optimal tree */

  // do check in _tr_init()
  //if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */
  /*#ifdef NO_INIT_GLOBAL_POINTERS
    static_l_desc.static_tree = static_ltree;
    static_l_desc.extra_bits = extra_lbits;
    static_d_desc.static_tree = static_dtree;
    static_d_desc.extra_bits = extra_dbits;
    static_bl_desc.extra_bits = extra_blbits;
  #endif*/

  /* Initialize the mapping length (0..255) -> length code (0..28) */
  length = 0;
  for (code = 0; code < LENGTH_CODES$1 - 1; code++) {
    base_length[code] = length;
    for (n = 0; n < (1 << extra_lbits[code]); n++) {
      _length_code[length++] = code;
    }
  }
  //Assert (length == 256, "tr_static_init: length != 256");
  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
  _length_code[length - 1] = code;

  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
  dist = 0;
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < (1 << extra_dbits[code]); n++) {
      _dist_code[dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: dist != 256");
  dist >>= 7; /* from now on, all distances are divided by 128 */
  for (; code < D_CODES$1; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
      _dist_code[256 + dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */
  for (bits = 0; bits <= MAX_BITS$1; bits++) {
    bl_count[bits] = 0;
  }

  n = 0;
  while (n <= 143) {
    static_ltree[n * 2 + 1] /*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1] /*.Len*/ = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1] /*.Len*/ = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1] /*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
  gen_codes(static_ltree, L_CODES$1 + 1, bl_count);

  /* The static distance tree is trivial: */
  for (n = 0; n < D_CODES$1; n++) {
    static_dtree[n * 2 + 1] /*.Len*/ = 5;
    static_dtree[n * 2] /*.Code*/ = bi_reverse(n, 5);
  }

  // Now data ready and we can init static trees
  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES$1, MAX_BITS$1);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES$1, MAX_BL_BITS);

  //static_init_done = true;
}


/* ===========================================================================
 * Initialize a new block.
 */
function init_block(s) {
  var n; /* iterates over tree elements */

  /* Initialize the trees. */
  for (n = 0; n < L_CODES$1; n++) {
    s.dyn_ltree[n * 2] /*.Freq*/ = 0;
  }
  for (n = 0; n < D_CODES$1; n++) {
    s.dyn_dtree[n * 2] /*.Freq*/ = 0;
  }
  for (n = 0; n < BL_CODES$1; n++) {
    s.bl_tree[n * 2] /*.Freq*/ = 0;
  }

  s.dyn_ltree[END_BLOCK * 2] /*.Freq*/ = 1;
  s.opt_len = s.static_len = 0;
  s.last_lit = s.matches = 0;
}


/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
function bi_windup(s) {
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
  }
  s.bi_buf = 0;
  s.bi_valid = 0;
}

/* ===========================================================================
 * Copy a stored block, storing first the length and its
 * one's complement if requested.
 */
function copy_block(s, buf, len, header) {
//DeflateState *s;
//charf    *buf;    /* the input data */
//unsigned len;     /* its length */
//int      header;  /* true if block header must be written */

  bi_windup(s); /* align on byte boundary */

  if (header) {
    put_short(s, len);
    put_short(s, ~len);
  }
  //  while (len--) {
  //    put_byte(s, *buf++);
  //  }
  arraySet(s.pending_buf, s.window, buf, len, s.pending);
  s.pending += len;
}

/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
function smaller(tree, n, m, depth) {
  var _n2 = n * 2;
  var _m2 = m * 2;
  return (tree[_n2] /*.Freq*/ < tree[_m2] /*.Freq*/ ||
    (tree[_n2] /*.Freq*/ === tree[_m2] /*.Freq*/ && depth[n] <= depth[m]));
}

/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
function pqdownheap(s, tree, k)
//    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */
{
  var v = s.heap[k];
  var j = k << 1; /* left son of k */
  while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
    if (j < s.heap_len &&
      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++;
    }
    /* Exit if v is smaller than both sons */
    if (smaller(tree, v, s.heap[j], s.depth)) {
      break;
    }

    /* Exchange v with the smallest son */
    s.heap[k] = s.heap[j];
    k = j;

    /* And continue down the tree, setting j to the left son of k */
    j <<= 1;
  }
  s.heap[k] = v;
}


// inlined manually
// var SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
function compress_block(s, ltree, dtree)
//    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */
{
  var dist; /* distance of matched string */
  var lc; /* match length or unmatched char (if dist == 0) */
  var lx = 0; /* running index in l_buf */
  var code; /* the code to send */
  var extra; /* number of extra bits to send */

  if (s.last_lit !== 0) {
    do {
      dist = (s.pending_buf[s.d_buf + lx * 2] << 8) | (s.pending_buf[s.d_buf + lx * 2 + 1]);
      lc = s.pending_buf[s.l_buf + lx];
      lx++;

      if (dist === 0) {
        send_code(s, lc, ltree); /* send a literal byte */
        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        /* Here, lc is the match length - MIN_MATCH */
        code = _length_code[lc];
        send_code(s, code + LITERALS$1 + 1, ltree); /* send the length code */
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra); /* send the extra length bits */
        }
        dist--; /* dist is now the match distance - 1 */
        code = d_code(dist);
        //Assert (code < D_CODES, "bad d_code");

        send_code(s, code, dtree); /* send the distance code */
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra); /* send the extra distance bits */
        }
      } /* literal or match pair ? */

      /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
      //Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
      //       "pendingBuf overflow");

    } while (lx < s.last_lit);
  }

  send_code(s, END_BLOCK, ltree);
}


/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
function build_tree(s, desc)
//    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */
{
  var tree = desc.dyn_tree;
  var stree = desc.stat_desc.static_tree;
  var has_stree = desc.stat_desc.has_stree;
  var elems = desc.stat_desc.elems;
  var n, m; /* iterate over heap elements */
  var max_code = -1; /* largest code with non zero frequency */
  var node; /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
  s.heap_len = 0;
  s.heap_max = HEAP_SIZE$1;

  for (n = 0; n < elems; n++) {
    if (tree[n * 2] /*.Freq*/ !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;

    } else {
      tree[n * 2 + 1] /*.Len*/ = 0;
    }
  }

  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
    tree[node * 2] /*.Freq*/ = 1;
    s.depth[node] = 0;
    s.opt_len--;

    if (has_stree) {
      s.static_len -= stree[node * 2 + 1] /*.Len*/ ;
    }
    /* node is 0 or 1 so it does not have extra bits */
  }
  desc.max_code = max_code;

  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
  for (n = (s.heap_len >> 1 /*int /2*/ ); n >= 1; n--) {
    pqdownheap(s, tree, n);
  }

  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
  node = elems; /* next internal node of the tree */
  do {
    //pqremove(s, tree, n);  /* n = node of least frequency */
    /*** pqremove ***/
    n = s.heap[1 /*SMALLEST*/ ];
    s.heap[1 /*SMALLEST*/ ] = s.heap[s.heap_len--];
    pqdownheap(s, tree, 1 /*SMALLEST*/ );
    /***/

    m = s.heap[1 /*SMALLEST*/ ]; /* m = node of next least frequency */

    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
    s.heap[--s.heap_max] = m;

    /* Create a new node father of n and m */
    tree[node * 2] /*.Freq*/ = tree[n * 2] /*.Freq*/ + tree[m * 2] /*.Freq*/ ;
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1] /*.Dad*/ = tree[m * 2 + 1] /*.Dad*/ = node;

    /* and insert the new node in the heap */
    s.heap[1 /*SMALLEST*/ ] = node++;
    pqdownheap(s, tree, 1 /*SMALLEST*/ );

  } while (s.heap_len >= 2);

  s.heap[--s.heap_max] = s.heap[1 /*SMALLEST*/ ];

  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
  gen_bitlen(s, desc);

  /* The field len is now set, we can generate the bit codes */
  gen_codes(tree, max_code, s.bl_count);
}


/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
function scan_tree(s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */
{
  var n; /* iterates over all tree elements */
  var prevlen = -1; /* last emitted length */
  var curlen; /* length of current code */

  var nextlen = tree[0 * 2 + 1] /*.Len*/ ; /* length of next code */

  var count = 0; /* repeat count of the current code */
  var max_count = 7; /* max repeat count */
  var min_count = 4; /* min repeat count */

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code + 1) * 2 + 1] /*.Len*/ = 0xffff; /* guard */

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1] /*.Len*/ ;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      s.bl_tree[curlen * 2] /*.Freq*/ += count;

    } else if (curlen !== 0) {

      if (curlen !== prevlen) {
        s.bl_tree[curlen * 2] /*.Freq*/ ++;
      }
      s.bl_tree[REP_3_6 * 2] /*.Freq*/ ++;

    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2] /*.Freq*/ ++;

    } else {
      s.bl_tree[REPZ_11_138 * 2] /*.Freq*/ ++;
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}


/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
function send_tree(s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */
{
  var n; /* iterates over all tree elements */
  var prevlen = -1; /* last emitted length */
  var curlen; /* length of current code */

  var nextlen = tree[0 * 2 + 1] /*.Len*/ ; /* length of next code */

  var count = 0; /* repeat count of the current code */
  var max_count = 7; /* max repeat count */
  var min_count = 4; /* min repeat count */

  /* tree[max_code+1].Len = -1; */
  /* guard already set */
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1] /*.Len*/ ;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      do {
        send_code(s, curlen, s.bl_tree);
      } while (--count !== 0);

    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      //Assert(count >= 3 && count <= 6, " 3_6?");
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);

    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);

    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }

    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}


/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
function build_bl_tree(s) {
  var max_blindex; /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

  /* Build the bit length tree: */
  build_tree(s, s.bl_desc);
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
  for (max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1] /*.Len*/ !== 0) {
      break;
    }
  }
  /* Update opt_len to include the bit length tree and counts */
  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

  return max_blindex;
}


/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
function send_all_trees(s, lcodes, dcodes, blcodes)
//    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */
{
  var rank; /* index in bl_order */

  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  //Tracev((stderr, "\nbl counts: "));
  send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
  send_bits(s, dcodes - 1, 5);
  send_bits(s, blcodes - 4, 4); /* not -3 as stated in appnote.txt */
  for (rank = 0; rank < blcodes; rank++) {
    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1] /*.Len*/ , 3);
  }
  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
}


/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "black list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
function detect_data_type(s) {
  /* black_mask is the bit mask of black-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
  var black_mask = 0xf3ffc07f;
  var n;

  /* Check for non-textual ("black-listed") bytes. */
  for (n = 0; n <= 31; n++, black_mask >>>= 1) {
    if ((black_mask & 1) && (s.dyn_ltree[n * 2] /*.Freq*/ !== 0)) {
      return Z_BINARY$1;
    }
  }

  /* Check for textual ("white-listed") bytes. */
  if (s.dyn_ltree[9 * 2] /*.Freq*/ !== 0 || s.dyn_ltree[10 * 2] /*.Freq*/ !== 0 ||
    s.dyn_ltree[13 * 2] /*.Freq*/ !== 0) {
    return Z_TEXT$1;
  }
  for (n = 32; n < LITERALS$1; n++) {
    if (s.dyn_ltree[n * 2] /*.Freq*/ !== 0) {
      return Z_TEXT$1;
    }
  }

  /* There are no "black-listed" or "white-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
  return Z_BINARY$1;
}


var static_init_done = false;

/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
function _tr_init(s) {

  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }

  s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

  s.bi_buf = 0;
  s.bi_valid = 0;

  /* Initialize the first block of the first file: */
  init_block(s);
}


/* ===========================================================================
 * Send a stored block
 */
function _tr_stored_block(s, buf, stored_len, last)
//DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3); /* send block type */
  copy_block(s, buf, stored_len, true); /* with header */
}


/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
function _tr_align(s) {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
}


/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and output the encoded block to the zip file.
 */
function _tr_flush_block(s, buf, stored_len, last)
//DeflateState *s;
//charf *buf;       /* input block, or NULL if too old */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  var opt_lenb, static_lenb; /* opt_len and static_len in bytes */
  var max_blindex = 0; /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */
  if (s.level > 0) {

    /* Check if the file is binary or text */
    if (s.strm.data_type === Z_UNKNOWN$2) {
      s.strm.data_type = detect_data_type(s);
    }

    /* Construct the literal and distance trees */
    build_tree(s, s.l_desc);
    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    build_tree(s, s.d_desc);
    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));
    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
    max_blindex = build_bl_tree(s);

    /* Determine the best encoding. Compute the block lengths in bytes. */
    opt_lenb = (s.opt_len + 3 + 7) >>> 3;
    static_lenb = (s.static_len + 3 + 7) >>> 3;

    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->last_lit));

    if (static_lenb <= opt_lenb) {
      opt_lenb = static_lenb;
    }

  } else {
    // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
  }

  if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
    _tr_stored_block(s, buf, stored_len, last);

  } else if (s.strategy === Z_FIXED$2 || static_lenb === opt_lenb) {

    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);

  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
  init_block(s);

  if (last) {
    bi_windup(s);
  }
  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));
}

/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
function _tr_tally(s, dist, lc)
//    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
{
  //var out_length, in_length, dcode;

  s.pending_buf[s.d_buf + s.last_lit * 2] = (dist >>> 8) & 0xff;
  s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;

  s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
  s.last_lit++;

  if (dist === 0) {
    /* lc is the unmatched char */
    s.dyn_ltree[lc * 2] /*.Freq*/ ++;
  } else {
    s.matches++;
    /* Here, lc is the match length - MIN_MATCH */
    dist--; /* dist = match distance - 1 */
    //Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

    s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2] /*.Freq*/ ++;
    s.dyn_dtree[d_code(dist) * 2] /*.Freq*/ ++;
  }

  // (!) This block is disabled in zlib defailts,
  // don't enable it for binary compatibility

  //#ifdef TRUNCATE_BLOCK
  //  /* Try to guess if it is profitable to stop the current block here */
  //  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
  //    /* Compute an upper bound for the compressed length */
  //    out_length = s.last_lit*8;
  //    in_length = s.strstart - s.block_start;
  //
  //    for (dcode = 0; dcode < D_CODES; dcode++) {
  //      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
  //    }
  //    out_length >>>= 3;
  //    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
  //    //       s->last_lit, in_length, out_length,
  //    //       100L - out_length*100L/in_length));
  //    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
  //      return true;
  //    }
  //  }
  //#endif

  return (s.last_lit === s.lit_bufsize - 1);
  /* We avoid equality with lit_bufsize because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */
}

// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It doesn't worth to make additional optimizationa as in original.
// Small size is preferable.

function adler32(adler, buf, len, pos) {
  var s1 = (adler & 0xffff) |0,
      s2 = ((adler >>> 16) & 0xffff) |0,
      n = 0;

  while (len !== 0) {
    // Set limit ~ twice less than 5552, to keep
    // s2 in 31-bits, because we force signed ints.
    // in other case %= will fail.
    n = len > 2000 ? 2000 : len;
    len -= n;

    do {
      s1 = (s1 + buf[pos++]) |0;
      s2 = (s2 + s1) |0;
    } while (--n);

    s1 %= 65521;
    s2 %= 65521;
  }

  return (s1 | (s2 << 16)) |0;
}

// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.


// Use ordinary array, since untyped makes no boost here
function makeTable() {
  var c, table = [];

  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }

  return table;
}

// Create table on load. Just 255 signed longs. Not a problem.
var crcTable = makeTable();


function crc32(crc, buf, len, pos) {
  var t = crcTable,
      end = pos + len;

  crc ^= -1;

  for (var i = pos; i < end; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return (crc ^ (-1)); // >>> 0;
}

/* Public constants ==========================================================*/
/* ===========================================================================*/


/* Allowed flush values; see deflate() and inflate() below for details */
var Z_NO_FLUSH$1 = 0;
var Z_PARTIAL_FLUSH$1 = 1;
//var Z_SYNC_FLUSH    = 2;
var Z_FULL_FLUSH$1 = 3;
var Z_FINISH$2 = 4;
var Z_BLOCK$2 = 5;
//var Z_TREES         = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var Z_OK$2 = 0;
var Z_STREAM_END$2 = 1;
//var Z_NEED_DICT     = 2;
//var Z_ERRNO         = -1;
var Z_STREAM_ERROR$2 = -2;
var Z_DATA_ERROR$2 = -3;
//var Z_MEM_ERROR     = -4;
var Z_BUF_ERROR$2 = -5;
//var Z_VERSION_ERROR = -6;


/* compression levels */
//var Z_NO_COMPRESSION      = 0;
//var Z_BEST_SPEED          = 1;
//var Z_BEST_COMPRESSION    = 9;
var Z_DEFAULT_COMPRESSION$1 = -1;


var Z_FILTERED$1 = 1;
var Z_HUFFMAN_ONLY$1 = 2;
var Z_RLE$1 = 3;
var Z_FIXED$1 = 4;

/* Possible values of the data_type field (though see inflate()) */
//var Z_BINARY              = 0;
//var Z_TEXT                = 1;
//var Z_ASCII               = 1; // = Z_TEXT
var Z_UNKNOWN$1 = 2;


/* The deflate compression method */
var Z_DEFLATED$2 = 8;

/*============================================================================*/


var MAX_MEM_LEVEL = 9;


var LENGTH_CODES = 29;
/* number of length codes, not counting the special END_BLOCK code */
var LITERALS = 256;
/* number of literal bytes 0..255 */
var L_CODES = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */
var D_CODES = 30;
/* number of distance codes */
var BL_CODES = 19;
/* number of codes used to transfer the bit lengths */
var HEAP_SIZE = 2 * L_CODES + 1;
/* maximum heap size */
var MAX_BITS = 15;
/* All codes must not exceed MAX_BITS bits */

var MIN_MATCH = 3;
var MAX_MATCH = 258;
var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

var PRESET_DICT = 0x20;

var INIT_STATE = 42;
var EXTRA_STATE = 69;
var NAME_STATE = 73;
var COMMENT_STATE = 91;
var HCRC_STATE = 103;
var BUSY_STATE = 113;
var FINISH_STATE = 666;

var BS_NEED_MORE = 1; /* block not completed, need more input or more output */
var BS_BLOCK_DONE = 2; /* block flush performed */
var BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
var BS_FINISH_DONE = 4; /* finish done, accept no more input or output */

var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

function err(strm, errorCode) {
  strm.msg = msg[errorCode];
  return errorCode;
}

function rank(f) {
  return ((f) << 1) - ((f) > 4 ? 9 : 0);
}

function zero(buf) {
  var len = buf.length;
  while (--len >= 0) {
    buf[len] = 0;
  }
}


/* =========================================================================
 * Flush as much pending output as possible. All deflate() output goes
 * through this function so some applications may wish to modify it
 * to avoid allocating a large strm->output buffer and copying into it.
 * (See also read_buf()).
 */
function flush_pending(strm) {
  var s = strm.state;

  //_tr_flush_bits(s);
  var len = s.pending;
  if (len > strm.avail_out) {
    len = strm.avail_out;
  }
  if (len === 0) {
    return;
  }

  arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
  strm.next_out += len;
  s.pending_out += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
}


function flush_block_only(s, last) {
  _tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
}


function put_byte(s, b) {
  s.pending_buf[s.pending++] = b;
}


/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */
function putShortMSB(s, b) {
  //  put_byte(s, (Byte)(b >> 8));
  //  put_byte(s, (Byte)(b & 0xff));
  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
  s.pending_buf[s.pending++] = b & 0xff;
}


/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
function read_buf(strm, buf, start, size) {
  var len = strm.avail_in;

  if (len > size) {
    len = size;
  }
  if (len === 0) {
    return 0;
  }

  strm.avail_in -= len;

  // zmemcpy(buf, strm->next_in, len);
  arraySet(buf, strm.input, strm.next_in, len, start);
  if (strm.state.wrap === 1) {
    strm.adler = adler32(strm.adler, buf, len, start);
  } else if (strm.state.wrap === 2) {
    strm.adler = crc32(strm.adler, buf, len, start);
  }

  strm.next_in += len;
  strm.total_in += len;

  return len;
}


/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */
function longest_match(s, cur_match) {
  var chain_length = s.max_chain_length; /* max hash chain length */
  var scan = s.strstart; /* current string */
  var match; /* matched string */
  var len; /* length of current match */
  var best_len = s.prev_length; /* best match length so far */
  var nice_match = s.nice_match; /* stop if match long enough */
  var limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
    s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0 /*NIL*/ ;

  var _win = s.window; // shortcut

  var wmask = s.w_mask;
  var prev = s.prev;

  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

  var strend = s.strstart + MAX_MATCH;
  var scan_end1 = _win[scan + best_len - 1];
  var scan_end = _win[scan + best_len];

  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */
  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
  if (nice_match > s.lookahead) {
    nice_match = s.lookahead;
  }

  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

  do {
    // Assert(cur_match < s->strstart, "no future");
    match = cur_match;

    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

    if (_win[match + best_len] !== scan_end ||
      _win[match + best_len - 1] !== scan_end1 ||
      _win[match] !== _win[scan] ||
      _win[++match] !== _win[scan + 1]) {
      continue;
    }

    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
    scan += 2;
    match++;
    // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */
    do {
      /*jshint noempty:false*/
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
      _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
      _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
      _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
      scan < strend);

    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1 = _win[scan + best_len - 1];
      scan_end = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

  if (best_len <= s.lookahead) {
    return best_len;
  }
  return s.lookahead;
}


/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
function fill_window(s) {
  var _w_size = s.w_size;
  var p, n, m, more, str;

  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

  do {
    more = s.window_size - s.lookahead - s.strstart;

    // JS ints have 32 bit, block below not needed
    /* Deal with !@#$% 64K limit: */
    //if (sizeof(int) <= 2) {
    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    //}


    /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

      arraySet(s.window, s.window, _w_size, _w_size, 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      /* we now have strstart >= MAX_DIST */
      s.block_start -= _w_size;

      /* Slide the hash table (could be avoided with 32 bit values
       at the expense of memory usage). We slide even when level == 0
       to keep the hash table consistent if we switch back to level > 0
       later. (Using level 0 permanently is not an optimal usage of
       zlib, so we don't care about this pathological case.)
       */

      n = s.hash_size;
      p = n;
      do {
        m = s.head[--p];
        s.head[p] = (m >= _w_size ? m - _w_size : 0);
      } while (--n);

      n = _w_size;
      p = n;
      do {
        m = s.prev[--p];
        s.prev[p] = (m >= _w_size ? m - _w_size : 0);
        /* If n is not on any hash chain, prev[n] is garbage but
         * its value will never be used.
         */
      } while (--n);

      more += _w_size;
    }
    if (s.strm.avail_in === 0) {
      break;
    }

    /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    //Assert(more >= 2, "more < 2");
    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;

    /* Initialize the hash value now that we have some input: */
    if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];

      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + 1]) & s.hash_mask;
      //#if MIN_MATCH != 3
      //        Call update_hash() MIN_MATCH-3 more times
      //#endif
      while (s.insert) {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */

  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
  //  if (s.high_water < s.window_size) {
  //    var curr = s.strstart + s.lookahead;
  //    var init = 0;
  //
  //    if (s.high_water < curr) {
  //      /* Previous high water mark below current data -- zero WIN_INIT
  //       * bytes or up to end of window, whichever is less.
  //       */
  //      init = s.window_size - curr;
  //      if (init > WIN_INIT)
  //        init = WIN_INIT;
  //      zmemzero(s->window + curr, (unsigned)init);
  //      s->high_water = curr + init;
  //    }
  //    else if (s->high_water < (ulg)curr + WIN_INIT) {
  //      /* High water mark at or above current data, but below current data
  //       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
  //       * to end of window, whichever is less.
  //       */
  //      init = (ulg)curr + WIN_INIT - s->high_water;
  //      if (init > s->window_size - s->high_water)
  //        init = s->window_size - s->high_water;
  //      zmemzero(s->window + s->high_water, (unsigned)init);
  //      s->high_water += init;
  //    }
  //  }
  //
  //  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
  //    "not enough room for search");
}

/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 * This function does not insert new strings in the dictionary since
 * uncompressible data is probably not useful. This function is used
 * only for the level=0 compression option.
 * NOTE: this function should be optimized to avoid extra copying from
 * window to pending_buf.
 */
function deflate_stored(s, flush) {
  /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
   * to pending_buf_size, and each stored block has a 5 byte header:
   */
  var max_block_size = 0xffff;

  if (max_block_size > s.pending_buf_size - 5) {
    max_block_size = s.pending_buf_size - 5;
  }

  /* Copy as much as possible from input to output: */
  for (;;) {
    /* Fill the window as much as possible: */
    if (s.lookahead <= 1) {

      //Assert(s->strstart < s->w_size+MAX_DIST(s) ||
      //  s->block_start >= (long)s->w_size, "slide too late");
      //      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
      //        s.block_start >= s.w_size)) {
      //        throw  new Error("slide too late");
      //      }

      fill_window(s);
      if (s.lookahead === 0 && flush === Z_NO_FLUSH$1) {
        return BS_NEED_MORE;
      }

      if (s.lookahead === 0) {
        break;
      }
      /* flush the current block */
    }
    //Assert(s->block_start >= 0L, "block gone");
    //    if (s.block_start < 0) throw new Error("block gone");

    s.strstart += s.lookahead;
    s.lookahead = 0;

    /* Emit a stored block if pending_buf will be full: */
    var max_start = s.block_start + max_block_size;

    if (s.strstart === 0 || s.strstart >= max_start) {
      /* strstart == 0 is possible when wraparound on 16-bit machine */
      s.lookahead = s.strstart - max_start;
      s.strstart = max_start;
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/


    }
    /* Flush if we may have to slide, otherwise block_start may become
     * negative and the data will be gone:
     */
    if (s.strstart - s.block_start >= (s.w_size - MIN_LOOKAHEAD)) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }

  s.insert = 0;

  if (flush === Z_FINISH$2) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }

  if (s.strstart > s.block_start) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_NEED_MORE;
}

/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
function deflate_fast(s, flush) {
  var hash_head; /* head of the hash chain */
  var bflush; /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$1) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break; /* flush the current block */
      }
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0 /*NIL*/ ;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */
    if (hash_head !== 0 /*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */
    }
    if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

      /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
      bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;

      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
      if (s.match_length <= s.max_lazy_match /*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
        s.match_length--; /* string at strstart already in table */
        do {
          s.strstart++;
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
        } while (--s.match_length !== 0);
        s.strstart++;
      } else {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 1]) & s.hash_mask;

        //#if MIN_MATCH != 3
        //                Call UPDATE_HASH() MIN_MATCH-3 more times
        //#endif
        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
      }
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s.window[s.strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1);
  if (flush === Z_FINISH$2) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
function deflate_slow(s, flush) {
  var hash_head; /* head of hash chain */
  var bflush; /* set if current block must be flushed */

  var max_insert;

  /* Process the input block. */
  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$1) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break;
      } /* flush the current block */
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0 /*NIL*/ ;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     */
    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH - 1;

    if (hash_head !== 0 /*NIL*/ && s.prev_length < s.max_lazy_match &&
      s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD) /*MAX_DIST(s)*/ ) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */

      if (s.match_length <= 5 &&
        (s.strategy === Z_FILTERED$1 || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096 /*TOO_FAR*/ ))) {

        /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
        s.match_length = MIN_MATCH - 1;
      }
    }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;
      /* Do not insert strings in hash table beyond this. */

      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/
      bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
      /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */
      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
        }
      } while (--s.prev_length !== 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH - 1;
      s.strstart++;

      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }

    } else if (s.match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);

      if (bflush) {
        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
        flush_block_only(s, false);
        /***/
      }
      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  //Assert (flush != Z_NO_FLUSH, "no flush?");
  if (s.match_available) {
    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
    bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);

    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH$2) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_BLOCK_DONE;
}


/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */
function deflate_rle(s, flush) {
  var bflush; /* set if current block must be flushed */
  var prev; /* byte at distance one to match */
  var scan, strend; /* scan goes up to strend for length of run */

  var _win = s.window;

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH$1) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break;
      } /* flush the current block */
    }

    /* See how many times the previous byte repeats */
    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH;
        do {
          /*jshint noempty:false*/
        } while (prev === _win[++scan] && prev === _win[++scan] &&
          prev === _win[++scan] && prev === _win[++scan] &&
          prev === _win[++scan] && prev === _win[++scan] &&
          prev === _win[++scan] && prev === _win[++scan] &&
          scan < strend);
        s.match_length = MAX_MATCH - (strend - scan);
        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      }
      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
    }

    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
    if (s.match_length >= MIN_MATCH) {
      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
      bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s->window[s->strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH$2) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
function deflate_huff(s, flush) {
  var bflush; /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we have a literal to write. */
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH$1) {
          return BS_NEED_MORE;
        }
        break; /* flush the current block */
      }
    }

    /* Output a literal byte */
    s.match_length = 0;
    //Tracevv((stderr,"%c", s->window[s->strstart]));
    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
    bflush = _tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH$2) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
function Config(good_length, max_lazy, nice_length, max_chain, func) {
  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}

var configuration_table;

configuration_table = [
  /*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflate_stored), /* 0 store only */
  new Config(4, 4, 8, 4, deflate_fast), /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflate_fast), /* 2 */
  new Config(4, 6, 32, 32, deflate_fast), /* 3 */

  new Config(4, 4, 16, 16, deflate_slow), /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflate_slow), /* 5 */
  new Config(8, 16, 128, 128, deflate_slow), /* 6 */
  new Config(8, 32, 128, 256, deflate_slow), /* 7 */
  new Config(32, 128, 258, 1024, deflate_slow), /* 8 */
  new Config(32, 258, 258, 4096, deflate_slow) /* 9 max compression */
];


/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
function lm_init(s) {
  s.window_size = 2 * s.w_size;

  /*** CLEAR_HASH(s); ***/
  zero(s.head); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
}


function DeflateState() {
  this.strm = null; /* pointer back to this zlib stream */
  this.status = 0; /* as the name implies */
  this.pending_buf = null; /* output still pending */
  this.pending_buf_size = 0; /* size of pending_buf */
  this.pending_out = 0; /* next pending byte to output to the stream */
  this.pending = 0; /* nb of bytes in the pending buffer */
  this.wrap = 0; /* bit 0 true for zlib, bit 1 true for gzip */
  this.gzhead = null; /* gzip header information to write */
  this.gzindex = 0; /* where in extra, name, or comment */
  this.method = Z_DEFLATED$2; /* can only be DEFLATED */
  this.last_flush = -1; /* value of flush param for previous deflate call */

  this.w_size = 0; /* LZ77 window size (32K by default) */
  this.w_bits = 0; /* log2(w_size)  (8..16) */
  this.w_mask = 0; /* w_size - 1 */

  this.window = null;
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  this.window_size = 0;
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

  this.prev = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

  this.head = null; /* Heads of the hash chains or NIL. */

  this.ins_h = 0; /* hash index of string to be inserted */
  this.hash_size = 0; /* number of elements in hash table */
  this.hash_bits = 0; /* log2(hash_size) */
  this.hash_mask = 0; /* hash_size-1 */

  this.hash_shift = 0;
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  this.block_start = 0;
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

  this.match_length = 0; /* length of best match */
  this.prev_match = 0; /* previous match */
  this.match_available = 0; /* set if previous match exists */
  this.strstart = 0; /* start of string to insert */
  this.match_start = 0; /* start of matching string */
  this.lookahead = 0; /* number of valid bytes ahead in window */

  this.prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  this.max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  this.max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  //this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  this.level = 0; /* compression level (1..9) */
  this.strategy = 0; /* favor or force Huffman coding*/

  this.good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  this.nice_match = 0; /* Stop searching when current match exceeds this */

  /* used by c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
  this.dyn_ltree = new Buf16(HEAP_SIZE * 2);
  this.dyn_dtree = new Buf16((2 * D_CODES + 1) * 2);
  this.bl_tree = new Buf16((2 * BL_CODES + 1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);

  this.l_desc = null; /* desc. for literal tree */
  this.d_desc = null; /* desc. for distance tree */
  this.bl_desc = null; /* desc. for bit length tree */

  //ush bl_count[MAX_BITS+1];
  this.bl_count = new Buf16(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
  this.heap = new Buf16(2 * L_CODES + 1); /* heap used to build the Huffman trees */
  zero(this.heap);

  this.heap_len = 0; /* number of elements in the heap */
  this.heap_max = 0; /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all
   */

  this.depth = new Buf16(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
  zero(this.depth);
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  this.l_buf = 0; /* buffer index for literals or lengths */

  this.lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  this.last_lit = 0; /* running index in l_buf */

  this.d_buf = 0;
  /* Buffer index for distances. To simplify the code, d_buf and l_buf have
   * the same number of elements. To use different lengths, an extra flag
   * array would be necessary.
   */

  this.opt_len = 0; /* bit length of current block with optimal trees */
  this.static_len = 0; /* bit length of current block with static trees */
  this.matches = 0; /* number of string matches in current block */
  this.insert = 0; /* bytes at end of window left to insert */


  this.bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
  this.bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  //this.high_water = 0;
  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
}


function deflateResetKeep(strm) {
  var s;

  if (!strm || !strm.state) {
    return err(strm, Z_STREAM_ERROR$2);
  }

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN$1;

  s = strm.state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., Z_FINISH); */
  }
  s.status = (s.wrap ? INIT_STATE : BUSY_STATE);
  strm.adler = (s.wrap === 2) ?
    0 // crc32(0, Z_NULL, 0)
    :
    1; // adler32(0, Z_NULL, 0)
  s.last_flush = Z_NO_FLUSH$1;
  _tr_init(s);
  return Z_OK$2;
}


function deflateReset(strm) {
  var ret = deflateResetKeep(strm);
  if (ret === Z_OK$2) {
    lm_init(strm.state);
  }
  return ret;
}


function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
  if (!strm) { // === Z_NULL
    return Z_STREAM_ERROR$2;
  }
  var wrap = 1;

  if (level === Z_DEFAULT_COMPRESSION$1) {
    level = 6;
  }

  if (windowBits < 0) { /* suppress zlib wrapper */
    wrap = 0;
    windowBits = -windowBits;
  } else if (windowBits > 15) {
    wrap = 2; /* write gzip wrapper instead */
    windowBits -= 16;
  }


  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$2 ||
    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
    strategy < 0 || strategy > Z_FIXED$1) {
    return err(strm, Z_STREAM_ERROR$2);
  }


  if (windowBits === 8) {
    windowBits = 9;
  }
  /* until 256-byte window bug fixed */

  var s = new DeflateState();

  strm.state = s;
  s.strm = strm;

  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;

  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  s.window = new Buf8(s.w_size * 2);
  s.head = new Buf16(s.hash_size);
  s.prev = new Buf16(s.w_size);

  // Don't need mem init magic for JS.
  //s.high_water = 0;  /* nothing written to s->window yet */

  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

  s.pending_buf_size = s.lit_bufsize * 4;

  //overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);
  //s->pending_buf = (uchf *) overlay;
  s.pending_buf = new Buf8(s.pending_buf_size);

  // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
  //s->d_buf = overlay + s->lit_bufsize/sizeof(ush);
  s.d_buf = 1 * s.lit_bufsize;

  //s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;
  s.l_buf = (1 + 2) * s.lit_bufsize;

  s.level = level;
  s.strategy = strategy;
  s.method = method;

  return deflateReset(strm);
}


function deflate$1(strm, flush) {
  var old_flush, s;
  var beg, val; // for gzip header write only

  if (!strm || !strm.state ||
    flush > Z_BLOCK$2 || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR$2) : Z_STREAM_ERROR$2;
  }

  s = strm.state;

  if (!strm.output ||
    (!strm.input && strm.avail_in !== 0) ||
    (s.status === FINISH_STATE && flush !== Z_FINISH$2)) {
    return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR$2 : Z_STREAM_ERROR$2);
  }

  s.strm = strm; /* just in case */
  old_flush = s.last_flush;
  s.last_flush = flush;

  /* Write the header */
  if (s.status === INIT_STATE) {
    if (s.wrap === 2) {
      // GZIP header
      strm.adler = 0; //crc32(0L, Z_NULL, 0);
      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);
      if (!s.gzhead) { // s->gzhead == Z_NULL
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 :
          (s.strategy >= Z_HUFFMAN_ONLY$1 || s.level < 2 ?
            4 : 0));
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;
      } else {
        put_byte(s, (s.gzhead.text ? 1 : 0) +
          (s.gzhead.hcrc ? 2 : 0) +
          (!s.gzhead.extra ? 0 : 4) +
          (!s.gzhead.name ? 0 : 8) +
          (!s.gzhead.comment ? 0 : 16)
        );
        put_byte(s, s.gzhead.time & 0xff);
        put_byte(s, (s.gzhead.time >> 8) & 0xff);
        put_byte(s, (s.gzhead.time >> 16) & 0xff);
        put_byte(s, (s.gzhead.time >> 24) & 0xff);
        put_byte(s, s.level === 9 ? 2 :
          (s.strategy >= Z_HUFFMAN_ONLY$1 || s.level < 2 ?
            4 : 0));
        put_byte(s, s.gzhead.os & 0xff);
        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 0xff);
          put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
        }
        if (s.gzhead.hcrc) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
        }
        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    } else // DEFLATE header
    {
      var header = (Z_DEFLATED$2 + ((s.w_bits - 8) << 4)) << 8;
      var level_flags = -1;

      if (s.strategy >= Z_HUFFMAN_ONLY$1 || s.level < 2) {
        level_flags = 0;
      } else if (s.level < 6) {
        level_flags = 1;
      } else if (s.level === 6) {
        level_flags = 2;
      } else {
        level_flags = 3;
      }
      header |= (level_flags << 6);
      if (s.strstart !== 0) {
        header |= PRESET_DICT;
      }
      header += 31 - (header % 31);

      s.status = BUSY_STATE;
      putShortMSB(s, header);

      /* Save the adler32 of the preset dictionary: */
      if (s.strstart !== 0) {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 0xffff);
      }
      strm.adler = 1; // adler32(0L, Z_NULL, 0);
    }
  }

  //#ifdef GZIP
  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra /* != Z_NULL*/ ) {
      beg = s.pending; /* start of bytes to update crc */

      while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            break;
          }
        }
        put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);
        s.gzindex++;
      }
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (s.gzindex === s.gzhead.extra.length) {
        s.gzindex = 0;
        s.status = NAME_STATE;
      }
    } else {
      s.status = NAME_STATE;
    }
  }
  if (s.status === NAME_STATE) {
    if (s.gzhead.name /* != Z_NULL*/ ) {
      beg = s.pending; /* start of bytes to update crc */
      //int val;

      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.name.length) {
          val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);

      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (val === 0) {
        s.gzindex = 0;
        s.status = COMMENT_STATE;
      }
    } else {
      s.status = COMMENT_STATE;
    }
  }
  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment /* != Z_NULL*/ ) {
      beg = s.pending; /* start of bytes to update crc */
      //int val;

      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.comment.length) {
          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);

      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (val === 0) {
        s.status = HCRC_STATE;
      }
    } else {
      s.status = HCRC_STATE;
    }
  }
  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
      }
      if (s.pending + 2 <= s.pending_buf_size) {
        put_byte(s, strm.adler & 0xff);
        put_byte(s, (strm.adler >> 8) & 0xff);
        strm.adler = 0; //crc32(0L, Z_NULL, 0);
        s.status = BUSY_STATE;
      }
    } else {
      s.status = BUSY_STATE;
    }
  }
  //#endif

  /* Flush as much pending output as possible */
  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
      s.last_flush = -1;
      return Z_OK$2;
    }

    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
    flush !== Z_FINISH$2) {
    return err(strm, Z_BUF_ERROR$2);
  }

  /* User must not provide more input after the first FINISH: */
  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR$2);
  }

  /* Start a new block or continue the current one.
   */
  if (strm.avail_in !== 0 || s.lookahead !== 0 ||
    (flush !== Z_NO_FLUSH$1 && s.status !== FINISH_STATE)) {
    var bstate = (s.strategy === Z_HUFFMAN_ONLY$1) ? deflate_huff(s, flush) :
      (s.strategy === Z_RLE$1 ? deflate_rle(s, flush) :
        configuration_table[s.level].func(s, flush));

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        /* avoid BUF_ERROR next call, see above */
      }
      return Z_OK$2;
      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH$1) {
        _tr_align(s);
      } else if (flush !== Z_BLOCK$2) { /* FULL_FLUSH or SYNC_FLUSH */

        _tr_stored_block(s, 0, 0, false);
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
        if (flush === Z_FULL_FLUSH$1) {
          /*** CLEAR_HASH(s); ***/
          /* forget history */
          zero(s.head); // Fill with NIL (= 0);

          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
        return Z_OK$2;
      }
    }
  }
  //Assert(strm->avail_out > 0, "bug2");
  //if (strm.avail_out <= 0) { throw new Error("bug2");}

  if (flush !== Z_FINISH$2) {
    return Z_OK$2;
  }
  if (s.wrap <= 0) {
    return Z_STREAM_END$2;
  }

  /* Write the trailer */
  if (s.wrap === 2) {
    put_byte(s, strm.adler & 0xff);
    put_byte(s, (strm.adler >> 8) & 0xff);
    put_byte(s, (strm.adler >> 16) & 0xff);
    put_byte(s, (strm.adler >> 24) & 0xff);
    put_byte(s, strm.total_in & 0xff);
    put_byte(s, (strm.total_in >> 8) & 0xff);
    put_byte(s, (strm.total_in >> 16) & 0xff);
    put_byte(s, (strm.total_in >> 24) & 0xff);
  } else {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 0xffff);
  }

  flush_pending(strm);
  /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
  if (s.wrap > 0) {
    s.wrap = -s.wrap;
  }
  /* write the trailer only once! */
  return s.pending !== 0 ? Z_OK$2 : Z_STREAM_END$2;
}

function deflateEnd(strm) {
  var status;

  if (!strm /*== Z_NULL*/ || !strm.state /*== Z_NULL*/ ) {
    return Z_STREAM_ERROR$2;
  }

  status = strm.state.status;
  if (status !== INIT_STATE &&
    status !== EXTRA_STATE &&
    status !== NAME_STATE &&
    status !== COMMENT_STATE &&
    status !== HCRC_STATE &&
    status !== BUSY_STATE &&
    status !== FINISH_STATE
  ) {
    return err(strm, Z_STREAM_ERROR$2);
  }

  strm.state = null;

  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR$2) : Z_OK$2;
}

/* Not implemented
exports.deflateBound = deflateBound;
exports.deflateCopy = deflateCopy;
exports.deflateParams = deflateParams;
exports.deflatePending = deflatePending;
exports.deflatePrime = deflatePrime;
exports.deflateTune = deflateTune;
*/

// See state defs from inflate.js
var BAD$1 = 30;       /* got a data error -- remain here until reset */
var TYPE$1 = 12;      /* i: waiting for type bits, including last-flag bit */

/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */
function inflate_fast(strm, start) {
  var state;
  var _in;                    /* local strm.input */
  var last;                   /* have enough input while in < last */
  var _out;                   /* local strm.output */
  var beg;                    /* inflate()'s initial strm.output */
  var end;                    /* while out < end, enough space available */
//#ifdef INFLATE_STRICT
  var dmax;                   /* maximum distance from zlib header */
//#endif
  var wsize;                  /* window size or zero if not using window */
  var whave;                  /* valid bytes in the window */
  var wnext;                  /* window write index */
  // Use `s_window` instead `window`, avoid conflict with instrumentation tools
  var s_window;               /* allocated sliding window, if wsize != 0 */
  var hold;                   /* local strm.hold */
  var bits;                   /* local strm.bits */
  var lcode;                  /* local strm.lencode */
  var dcode;                  /* local strm.distcode */
  var lmask;                  /* mask for first level of length codes */
  var dmask;                  /* mask for first level of distance codes */
  var here;                   /* retrieved table entry */
  var op;                     /* code bits, operation, extra bits, or */
                              /*  window position, window bytes to copy */
  var len;                    /* match length, unused bytes */
  var dist;                   /* match distance */
  var from;                   /* where to copy match from */
  var from_source;


  var input, output; // JS specific, because we have no pointers

  /* copy state to local variables */
  state = strm.state;
  //here = state.here;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
//#ifdef INFLATE_STRICT
  dmax = state.dmax;
//#endif
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;


  /* decode literals and length/distances until end-of-block or not enough
     input data or output space */

  top:
  do {
    if (bits < 15) {
      hold += input[_in++] << bits;
      bits += 8;
      hold += input[_in++] << bits;
      bits += 8;
    }

    here = lcode[hold & lmask];

    dolen:
    for (;;) { // Goto emulation
      op = here >>> 24/*here.bits*/;
      hold >>>= op;
      bits -= op;
      op = (here >>> 16) & 0xff/*here.op*/;
      if (op === 0) {                          /* literal */
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        output[_out++] = here & 0xffff/*here.val*/;
      }
      else if (op & 16) {                     /* length base */
        len = here & 0xffff/*here.val*/;
        op &= 15;                           /* number of extra bits */
        if (op) {
          if (bits < op) {
            hold += input[_in++] << bits;
            bits += 8;
          }
          len += hold & ((1 << op) - 1);
          hold >>>= op;
          bits -= op;
        }
        //Tracevv((stderr, "inflate:         length %u\n", len));
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = dcode[hold & dmask];

        dodist:
        for (;;) { // goto emulation
          op = here >>> 24/*here.bits*/;
          hold >>>= op;
          bits -= op;
          op = (here >>> 16) & 0xff/*here.op*/;

          if (op & 16) {                      /* distance base */
            dist = here & 0xffff/*here.val*/;
            op &= 15;                       /* number of extra bits */
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
            }
            dist += hold & ((1 << op) - 1);
//#ifdef INFLATE_STRICT
            if (dist > dmax) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD$1;
              break top;
            }
//#endif
            hold >>>= op;
            bits -= op;
            //Tracevv((stderr, "inflate:         distance %u\n", dist));
            op = _out - beg;                /* max distance in output */
            if (dist > op) {                /* see if copy from window */
              op = dist - op;               /* distance back in window */
              if (op > whave) {
                if (state.sane) {
                  strm.msg = 'invalid distance too far back';
                  state.mode = BAD$1;
                  break top;
                }

// (!) This block is disabled in zlib defailts,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//                if (len <= op - whave) {
//                  do {
//                    output[_out++] = 0;
//                  } while (--len);
//                  continue top;
//                }
//                len -= op - whave;
//                do {
//                  output[_out++] = 0;
//                } while (--op > whave);
//                if (op === 0) {
//                  from = _out - dist;
//                  do {
//                    output[_out++] = output[from++];
//                  } while (--len);
//                  continue top;
//                }
//#endif
              }
              from = 0; // window index
              from_source = s_window;
              if (wnext === 0) {           /* very common case */
                from += wsize - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              else if (wnext < op) {      /* wrap around window */
                from += wsize + wnext - op;
                op -= wnext;
                if (op < len) {         /* some from end of window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = 0;
                  if (wnext < len) {  /* some from start of window */
                    op = wnext;
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;      /* rest from output */
                    from_source = output;
                  }
                }
              }
              else {                      /* contiguous in window */
                from += wnext - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              while (len > 2) {
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                len -= 3;
              }
              if (len) {
                output[_out++] = from_source[from++];
                if (len > 1) {
                  output[_out++] = from_source[from++];
                }
              }
            }
            else {
              from = _out - dist;          /* copy direct from output */
              do {                        /* minimum length is three */
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                len -= 3;
              } while (len > 2);
              if (len) {
                output[_out++] = output[from++];
                if (len > 1) {
                  output[_out++] = output[from++];
                }
              }
            }
          }
          else if ((op & 64) === 0) {          /* 2nd level distance code */
            here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
            continue dodist;
          }
          else {
            strm.msg = 'invalid distance code';
            state.mode = BAD$1;
            break top;
          }

          break; // need to emulate goto via "continue"
        }
      }
      else if ((op & 64) === 0) {              /* 2nd level length code */
        here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
        continue dolen;
      }
      else if (op & 32) {                     /* end-of-block */
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.mode = TYPE$1;
        break top;
      }
      else {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD$1;
        break top;
      }

      break; // need to emulate goto via "continue"
    }
  } while (_in < last && _out < end);

  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;

  /* update state and return */
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
  strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
  state.hold = hold;
  state.bits = bits;
  return;
}

var MAXBITS = 15;
var ENOUGH_LENS$1 = 852;
var ENOUGH_DISTS$1 = 592;
//var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

var CODES$1 = 0;
var LENS$1 = 1;
var DISTS$1 = 2;

var lbase = [ /* Length codes 257..285 base */
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
];

var lext = [ /* Length codes 257..285 extra */
  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
  19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
];

var dbase = [ /* Distance codes 0..29 base */
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
  8193, 12289, 16385, 24577, 0, 0
];

var dext = [ /* Distance codes 0..29 extra */
  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
  23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
  28, 28, 29, 29, 64, 64
];

function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
  var bits = opts.bits;
  //here = opts.here; /* table entry for duplication */

  var len = 0; /* a code's length in bits */
  var sym = 0; /* index of code symbols */
  var min = 0,
    max = 0; /* minimum and maximum code lengths */
  var root = 0; /* number of index bits for root table */
  var curr = 0; /* number of index bits for current table */
  var drop = 0; /* code bits to drop for sub-table */
  var left = 0; /* number of prefix codes available */
  var used = 0; /* code entries in table used */
  var huff = 0; /* Huffman code */
  var incr; /* for incrementing code, index */
  var fill; /* index for replicating entries */
  var low; /* low bits for current root entry */
  var mask; /* mask for low root bits */
  var next; /* next available space in table */
  var base = null; /* base value table to use */
  var base_index = 0;
  //  var shoextra;    /* extra bits table to use */
  var end; /* use base and extra for symbol > end */
  var count = new Buf16(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
  var offs = new Buf16(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
  var extra = null;
  var extra_index = 0;

  var here_bits, here_op, here_val;

  /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }

  /* bound code lengths, force root to be within code lengths */
  root = bits;
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) {
      break;
    }
  }
  if (root > max) {
    root = max;
  }
  if (max === 0) { /* no symbols to code at all */
    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;


    //table.op[opts.table_index] = 64;
    //table.bits[opts.table_index] = 1;
    //table.val[opts.table_index++] = 0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;

    opts.bits = 1;
    return 0; /* no symbols, but wait for decoding to report error */
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) {
      break;
    }
  }
  if (root < min) {
    root = min;
  }

  /* check for an over-subscribed or incomplete set of lengths */
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    } /* over-subscribed */
  }
  if (left > 0 && (type === CODES$1 || max !== 1)) {
    return -1; /* incomplete set */
  }

  /* generate offsets into symbol table for each length for sorting */
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }

  /* sort symbols by length, by symbol order within each length */
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }

  /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

  /* set up for code type */
  // poor man optimization - use if-else instead of switch,
  // to avoid deopts in old v8
  if (type === CODES$1) {
    base = extra = work; /* dummy value--not used */
    end = 19;

  } else if (type === LENS$1) {
    base = lbase;
    base_index -= 257;
    extra = lext;
    extra_index -= 257;
    end = 256;

  } else { /* DISTS */
    base = dbase;
    extra = dext;
    end = -1;
  }

  /* initialize opts for loop */
  huff = 0; /* starting code */
  sym = 0; /* starting code symbol */
  len = min; /* starting code length */
  next = table_index; /* current table to fill in */
  curr = root; /* current table index bits */
  drop = 0; /* current bits to drop from code for index */
  low = -1; /* trigger new sub-table when len > root */
  used = 1 << root; /* use root table entries */
  mask = used - 1; /* mask for comparing low */

  /* check available table space */
  if ((type === LENS$1 && used > ENOUGH_LENS$1) ||
    (type === DISTS$1 && used > ENOUGH_DISTS$1)) {
    return 1;
  }
  /* process all codes and make table entries */
  for (;;) {
    /* create table entry */
    here_bits = len - drop;
    if (work[sym] < end) {
      here_op = 0;
      here_val = work[sym];
    } else if (work[sym] > end) {
      here_op = extra[extra_index + work[sym]];
      here_val = base[base_index + work[sym]];
    } else {
      here_op = 32 + 64; /* end of block */
      here_val = 0;
    }

    /* replicate for those indices with low len bits equal to huff */
    incr = 1 << (len - drop);
    fill = 1 << curr;
    min = fill; /* save offset to next table */
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val | 0;
    } while (fill !== 0);

    /* backwards increment the len-bit code huff */
    incr = 1 << (len - 1);
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }

    /* go to next symbol, update count, len */
    sym++;
    if (--count[len] === 0) {
      if (len === max) {
        break;
      }
      len = lens[lens_index + work[sym]];
    }

    /* create new sub-table if needed */
    if (len > root && (huff & mask) !== low) {
      /* if first time, transition to sub-tables */
      if (drop === 0) {
        drop = root;
      }

      /* increment past last table */
      next += min; /* here min is 1 << curr */

      /* determine length of next table */
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max) {
        left -= count[curr + drop];
        if (left <= 0) {
          break;
        }
        curr++;
        left <<= 1;
      }

      /* check for enough space */
      used += 1 << curr;
      if ((type === LENS$1 && used > ENOUGH_LENS$1) ||
        (type === DISTS$1 && used > ENOUGH_DISTS$1)) {
        return 1;
      }

      /* point entry in root table to sub-table */
      low = huff & mask;
      /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/
      table[low] = (root << 24) | (curr << 16) | (next - table_index) | 0;
    }
  }

  /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */
  if (huff !== 0) {
    //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = ((len - drop) << 24) | (64 << 16) | 0;
  }

  /* set return parameters */
  //opts.table_index += used;
  opts.bits = root;
  return 0;
}

var CODES = 0;
var LENS = 1;
var DISTS = 2;

/* Public constants ==========================================================*/
/* ===========================================================================*/


/* Allowed flush values; see deflate() and inflate() below for details */
//var Z_NO_FLUSH      = 0;
//var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
//var Z_FULL_FLUSH    = 3;
var Z_FINISH$1 = 4;
var Z_BLOCK$1 = 5;
var Z_TREES$1 = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var Z_OK$1 = 0;
var Z_STREAM_END$1 = 1;
var Z_NEED_DICT$1 = 2;
//var Z_ERRNO         = -1;
var Z_STREAM_ERROR$1 = -2;
var Z_DATA_ERROR$1 = -3;
var Z_MEM_ERROR = -4;
var Z_BUF_ERROR$1 = -5;
//var Z_VERSION_ERROR = -6;

/* The deflate compression method */
var Z_DEFLATED$1 = 8;


/* STATES ====================================================================*/
/* ===========================================================================*/


var HEAD = 1; /* i: waiting for magic header */
var FLAGS = 2; /* i: waiting for method and flags (gzip) */
var TIME = 3; /* i: waiting for modification time (gzip) */
var OS = 4; /* i: waiting for extra flags and operating system (gzip) */
var EXLEN = 5; /* i: waiting for extra length (gzip) */
var EXTRA = 6; /* i: waiting for extra bytes (gzip) */
var NAME = 7; /* i: waiting for end of file name (gzip) */
var COMMENT = 8; /* i: waiting for end of comment (gzip) */
var HCRC = 9; /* i: waiting for header crc (gzip) */
var DICTID = 10; /* i: waiting for dictionary check value */
var DICT = 11; /* waiting for inflateSetDictionary() call */
var TYPE = 12; /* i: waiting for type bits, including last-flag bit */
var TYPEDO = 13; /* i: same, but skip check to exit inflate on new block */
var STORED = 14; /* i: waiting for stored size (length and complement) */
var COPY_ = 15; /* i/o: same as COPY below, but only first time in */
var COPY = 16; /* i/o: waiting for input or output to copy stored block */
var TABLE = 17; /* i: waiting for dynamic block table lengths */
var LENLENS = 18; /* i: waiting for code length code lengths */
var CODELENS = 19; /* i: waiting for length/lit and distance code lengths */
var LEN_ = 20; /* i: same as LEN below, but only first time in */
var LEN = 21; /* i: waiting for length/lit/eob code */
var LENEXT = 22; /* i: waiting for length extra bits */
var DIST = 23; /* i: waiting for distance code */
var DISTEXT = 24; /* i: waiting for distance extra bits */
var MATCH = 25; /* o: waiting for output space to copy string */
var LIT = 26; /* o: waiting for output space to write literal */
var CHECK = 27; /* i: waiting for 32-bit check value */
var LENGTH = 28; /* i: waiting for 32-bit length (gzip) */
var DONE = 29; /* finished check, done -- remain here until reset */
var BAD = 30; /* got a data error -- remain here until reset */
var MEM = 31; /* got an inflate() memory error -- remain here until reset */
var SYNC = 32; /* looking for synchronization bytes to restart inflate() */

/* ===========================================================================*/



var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;


function zswap32(q) {
  return (((q >>> 24) & 0xff) +
    ((q >>> 8) & 0xff00) +
    ((q & 0xff00) << 8) +
    ((q & 0xff) << 24));
}


function InflateState() {
  this.mode = 0; /* current inflate mode */
  this.last = false; /* true if processing last block */
  this.wrap = 0; /* bit 0 true for zlib, bit 1 true for gzip */
  this.havedict = false; /* true if dictionary provided */
  this.flags = 0; /* gzip header method and flags (0 if zlib) */
  this.dmax = 0; /* zlib header max distance (INFLATE_STRICT) */
  this.check = 0; /* protected copy of check value */
  this.total = 0; /* protected copy of output count */
  // TODO: may be {}
  this.head = null; /* where to save gzip header information */

  /* sliding window */
  this.wbits = 0; /* log base 2 of requested window size */
  this.wsize = 0; /* window size or zero if not using window */
  this.whave = 0; /* valid bytes in the window */
  this.wnext = 0; /* window write index */
  this.window = null; /* allocated sliding window, if needed */

  /* bit accumulator */
  this.hold = 0; /* input bit accumulator */
  this.bits = 0; /* number of bits in "in" */

  /* for string and stored block copying */
  this.length = 0; /* literal or length of data to copy */
  this.offset = 0; /* distance back to copy string from */

  /* for table and code decoding */
  this.extra = 0; /* extra bits needed */

  /* fixed and dynamic code tables */
  this.lencode = null; /* starting table for length/literal codes */
  this.distcode = null; /* starting table for distance codes */
  this.lenbits = 0; /* index bits for lencode */
  this.distbits = 0; /* index bits for distcode */

  /* dynamic table building */
  this.ncode = 0; /* number of code length code lengths */
  this.nlen = 0; /* number of length code lengths */
  this.ndist = 0; /* number of distance code lengths */
  this.have = 0; /* number of code lengths in lens[] */
  this.next = null; /* next available space in codes[] */

  this.lens = new Buf16(320); /* temporary storage for code lengths */
  this.work = new Buf16(288); /* work area for code table building */

  /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
  //this.codes = new Buf32(ENOUGH);       /* space for code tables */
  this.lendyn = null; /* dynamic table for length/literal codes (JS specific) */
  this.distdyn = null; /* dynamic table for distance codes (JS specific) */
  this.sane = 0; /* if false, allow invalid distance too far */
  this.back = 0; /* bits back of last unprocessed length/lit */
  this.was = 0; /* initial length of match */
}

function inflateResetKeep(strm) {
  var state;

  if (!strm || !strm.state) {
    return Z_STREAM_ERROR$1;
  }
  state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = ''; /*Z_NULL*/
  if (state.wrap) { /* to support ill-conceived Java test suite */
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.dmax = 32768;
  state.head = null /*Z_NULL*/ ;
  state.hold = 0;
  state.bits = 0;
  //state.lencode = state.distcode = state.next = state.codes;
  state.lencode = state.lendyn = new Buf32(ENOUGH_LENS);
  state.distcode = state.distdyn = new Buf32(ENOUGH_DISTS);

  state.sane = 1;
  state.back = -1;
  //Tracev((stderr, "inflate: reset\n"));
  return Z_OK$1;
}

function inflateReset(strm) {
  var state;

  if (!strm || !strm.state) {
    return Z_STREAM_ERROR$1;
  }
  state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);

}

function inflateReset2(strm, windowBits) {
  var wrap;
  var state;

  /* get the state */
  if (!strm || !strm.state) {
    return Z_STREAM_ERROR$1;
  }
  state = strm.state;

  /* extract wrap request from windowBits parameter */
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  } else {
    wrap = (windowBits >> 4) + 1;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }

  /* set number of window bits, free window if different */
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR$1;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }

  /* update state and reset the rest of it */
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
}

function inflateInit2(strm, windowBits) {
  var ret;
  var state;

  if (!strm) {
    return Z_STREAM_ERROR$1;
  }
  //strm.msg = Z_NULL;                 /* in case we return an error */

  state = new InflateState();

  //if (state === Z_NULL) return Z_MEM_ERROR;
  //Tracev((stderr, "inflate: allocated\n"));
  strm.state = state;
  state.window = null /*Z_NULL*/ ;
  ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK$1) {
    strm.state = null /*Z_NULL*/ ;
  }
  return ret;
}


/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */
var virgin = true;

var lenfix, distfix; // We have no pointers in JS, so keep tables separate

function fixedtables(state) {
  /* build fixed huffman tables if first call (may not be thread safe) */
  if (virgin) {
    var sym;

    lenfix = new Buf32(512);
    distfix = new Buf32(32);

    /* literal/length table */
    sym = 0;
    while (sym < 144) {
      state.lens[sym++] = 8;
    }
    while (sym < 256) {
      state.lens[sym++] = 9;
    }
    while (sym < 280) {
      state.lens[sym++] = 7;
    }
    while (sym < 288) {
      state.lens[sym++] = 8;
    }

    inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, {
      bits: 9
    });

    /* distance table */
    sym = 0;
    while (sym < 32) {
      state.lens[sym++] = 5;
    }

    inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, {
      bits: 5
    });

    /* do this just once */
    virgin = false;
  }

  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
}


/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */
function updatewindow(strm, src, end, copy) {
  var dist;
  var state = strm.state;

  /* if it hasn't been done already, allocate space for the window */
  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;

    state.window = new Buf8(state.wsize);
  }

  /* copy state->wsize or less output bytes into the circular window */
  if (copy >= state.wsize) {
    arraySet(state.window, src, end - state.wsize, state.wsize, 0);
    state.wnext = 0;
    state.whave = state.wsize;
  } else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    //zmemcpy(state->window + state->wnext, end - copy, dist);
    arraySet(state.window, src, end - copy, dist, state.wnext);
    copy -= dist;
    if (copy) {
      //zmemcpy(state->window, end - copy, copy);
      arraySet(state.window, src, end - copy, copy, 0);
      state.wnext = copy;
      state.whave = state.wsize;
    } else {
      state.wnext += dist;
      if (state.wnext === state.wsize) {
        state.wnext = 0;
      }
      if (state.whave < state.wsize) {
        state.whave += dist;
      }
    }
  }
  return 0;
}

function inflate$1(strm, flush) {
  var state;
  var input, output; // input/output buffers
  var next; /* next input INDEX */
  var put; /* next output INDEX */
  var have, left; /* available input and output */
  var hold; /* bit buffer */
  var bits; /* bits in bit buffer */
  var _in, _out; /* save starting available input and output */
  var copy; /* number of stored or match bytes to copy */
  var from; /* where to copy match bytes from */
  var from_source;
  var here = 0; /* current decoding table entry */
  var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
  //var last;                   /* parent table entry */
  var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
  var len; /* length to copy for repeats, bits to drop */
  var ret; /* return code */
  var hbuf = new Buf8(4); /* buffer for gzip header crc calculation */
  var opts;

  var n; // temporary var for NEED_BITS

  var order = /* permutation of code lengths */ [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];


  if (!strm || !strm.state || !strm.output ||
    (!strm.input && strm.avail_in !== 0)) {
    return Z_STREAM_ERROR$1;
  }

  state = strm.state;
  if (state.mode === TYPE) {
    state.mode = TYPEDO;
  } /* skip check */


  //--- LOAD() ---
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  //---

  _in = have;
  _out = left;
  ret = Z_OK$1;

  inf_leave: // goto emulation
    for (;;) {
      switch (state.mode) {
      case HEAD:
        if (state.wrap === 0) {
          state.mode = TYPEDO;
          break;
        }
        //=== NEEDBITS(16);
        while (bits < 16) {
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((state.wrap & 2) && hold === 0x8b1f) { /* gzip header */
          state.check = 0 /*crc32(0L, Z_NULL, 0)*/ ;
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//

          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = FLAGS;
          break;
        }
        state.flags = 0; /* expect zlib header */
        if (state.head) {
          state.head.done = false;
        }
        if (!(state.wrap & 1) || /* check if zlib header allowed */
          (((hold & 0xff) /*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
          strm.msg = 'incorrect header check';
          state.mode = BAD;
          break;
        }
        if ((hold & 0x0f) /*BITS(4)*/ !== Z_DEFLATED$1) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
        len = (hold & 0x0f) /*BITS(4)*/ + 8;
        if (state.wbits === 0) {
          state.wbits = len;
        } else if (len > state.wbits) {
          strm.msg = 'invalid window size';
          state.mode = BAD;
          break;
        }
        state.dmax = 1 << len;
        //Tracev((stderr, "inflate:   zlib header ok\n"));
        strm.adler = state.check = 1 /*adler32(0L, Z_NULL, 0)*/ ;
        state.mode = hold & 0x200 ? DICTID : TYPE;
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        break;
      case FLAGS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.flags = hold;
        if ((state.flags & 0xff) !== Z_DEFLATED$1) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        if (state.flags & 0xe000) {
          strm.msg = 'unknown header flags set';
          state.mode = BAD;
          break;
        }
        if (state.head) {
          state.head.text = ((hold >> 8) & 1);
        }
        if (state.flags & 0x0200) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = TIME;
        /* falls through */
      case TIME:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.time = hold;
        }
        if (state.flags & 0x0200) {
          //=== CRC4(state.check, hold)
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          hbuf[2] = (hold >>> 16) & 0xff;
          hbuf[3] = (hold >>> 24) & 0xff;
          state.check = crc32(state.check, hbuf, 4, 0);
          //===
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = OS;
        /* falls through */
      case OS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.xflags = (hold & 0xff);
          state.head.os = (hold >> 8);
        }
        if (state.flags & 0x0200) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = EXLEN;
        /* falls through */
      case EXLEN:
        if (state.flags & 0x0400) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length = hold;
          if (state.head) {
            state.head.extra_len = hold;
          }
          if (state.flags & 0x0200) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        } else if (state.head) {
          state.head.extra = null /*Z_NULL*/ ;
        }
        state.mode = EXTRA;
        /* falls through */
      case EXTRA:
        if (state.flags & 0x0400) {
          copy = state.length;
          if (copy > have) {
            copy = have;
          }
          if (copy) {
            if (state.head) {
              len = state.head.extra_len - state.length;
              if (!state.head.extra) {
                // Use untyped array for more conveniend processing later
                state.head.extra = new Array(state.head.extra_len);
              }
              arraySet(
                state.head.extra,
                input,
                next,
                // extra field is limited to 65536 bytes
                // - no need for additional size check
                copy,
                /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                len
              );
              //zmemcpy(state.head.extra + len, next,
              //        len + copy > state.head.extra_max ?
              //        state.head.extra_max - len : copy);
            }
            if (state.flags & 0x0200) {
              state.check = crc32(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            state.length -= copy;
          }
          if (state.length) {
            break inf_leave;
          }
        }
        state.length = 0;
        state.mode = NAME;
        /* falls through */
      case NAME:
        if (state.flags & 0x0800) {
          if (have === 0) {
            break inf_leave;
          }
          copy = 0;
          do {
            // TODO: 2 or 1 bytes?
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
              (state.length < 65536 /*state.head.name_max*/ )) {
              state.head.name += String.fromCharCode(len);
            }
          } while (len && copy < have);

          if (state.flags & 0x0200) {
            state.check = crc32(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) {
            break inf_leave;
          }
        } else if (state.head) {
          state.head.name = null;
        }
        state.length = 0;
        state.mode = COMMENT;
        /* falls through */
      case COMMENT:
        if (state.flags & 0x1000) {
          if (have === 0) {
            break inf_leave;
          }
          copy = 0;
          do {
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
              (state.length < 65536 /*state.head.comm_max*/ )) {
              state.head.comment += String.fromCharCode(len);
            }
          } while (len && copy < have);
          if (state.flags & 0x0200) {
            state.check = crc32(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) {
            break inf_leave;
          }
        } else if (state.head) {
          state.head.comment = null;
        }
        state.mode = HCRC;
        /* falls through */
      case HCRC:
        if (state.flags & 0x0200) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (hold !== (state.check & 0xffff)) {
            strm.msg = 'header crc mismatch';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        if (state.head) {
          state.head.hcrc = ((state.flags >> 9) & 1);
          state.head.done = true;
        }
        strm.adler = state.check = 0;
        state.mode = TYPE;
        break;
      case DICTID:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        strm.adler = state.check = zswap32(hold);
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = DICT;
        /* falls through */
      case DICT:
        if (state.havedict === 0) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          return Z_NEED_DICT$1;
        }
        strm.adler = state.check = 1 /*adler32(0L, Z_NULL, 0)*/ ;
        state.mode = TYPE;
        /* falls through */
      case TYPE:
        if (flush === Z_BLOCK$1 || flush === Z_TREES$1) {
          break inf_leave;
        }
        /* falls through */
      case TYPEDO:
        if (state.last) {
          //--- BYTEBITS() ---//
          hold >>>= bits & 7;
          bits -= bits & 7;
          //---//
          state.mode = CHECK;
          break;
        }
        //=== NEEDBITS(3); */
        while (bits < 3) {
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.last = (hold & 0x01) /*BITS(1)*/ ;
        //--- DROPBITS(1) ---//
        hold >>>= 1;
        bits -= 1;
        //---//

        switch ((hold & 0x03) /*BITS(2)*/ ) {
        case 0:
          /* stored block */
          //Tracev((stderr, "inflate:     stored block%s\n",
          //        state.last ? " (last)" : ""));
          state.mode = STORED;
          break;
        case 1:
          /* fixed block */
          fixedtables(state);
          //Tracev((stderr, "inflate:     fixed codes block%s\n",
          //        state.last ? " (last)" : ""));
          state.mode = LEN_; /* decode codes */
          if (flush === Z_TREES$1) {
            //--- DROPBITS(2) ---//
            hold >>>= 2;
            bits -= 2;
            //---//
            break inf_leave;
          }
          break;
        case 2:
          /* dynamic block */
          //Tracev((stderr, "inflate:     dynamic codes block%s\n",
          //        state.last ? " (last)" : ""));
          state.mode = TABLE;
          break;
        case 3:
          strm.msg = 'invalid block type';
          state.mode = BAD;
        }
        //--- DROPBITS(2) ---//
        hold >>>= 2;
        bits -= 2;
        //---//
        break;
      case STORED:
        //--- BYTEBITS() ---// /* go to byte boundary */
        hold >>>= bits & 7;
        bits -= bits & 7;
        //---//
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
          strm.msg = 'invalid stored block lengths';
          state.mode = BAD;
          break;
        }
        state.length = hold & 0xffff;
        //Tracev((stderr, "inflate:       stored length %u\n",
        //        state.length));
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = COPY_;
        if (flush === Z_TREES$1) {
          break inf_leave;
        }
        /* falls through */
      case COPY_:
        state.mode = COPY;
        /* falls through */
      case COPY:
        copy = state.length;
        if (copy) {
          if (copy > have) {
            copy = have;
          }
          if (copy > left) {
            copy = left;
          }
          if (copy === 0) {
            break inf_leave;
          }
          //--- zmemcpy(put, next, copy); ---
          arraySet(output, input, next, copy, put);
          //---//
          have -= copy;
          next += copy;
          left -= copy;
          put += copy;
          state.length -= copy;
          break;
        }
        //Tracev((stderr, "inflate:       stored end\n"));
        state.mode = TYPE;
        break;
      case TABLE:
        //=== NEEDBITS(14); */
        while (bits < 14) {
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.nlen = (hold & 0x1f) /*BITS(5)*/ + 257;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ndist = (hold & 0x1f) /*BITS(5)*/ + 1;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ncode = (hold & 0x0f) /*BITS(4)*/ + 4;
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
        //#ifndef PKZIP_BUG_WORKAROUND
        if (state.nlen > 286 || state.ndist > 30) {
          strm.msg = 'too many length or distance symbols';
          state.mode = BAD;
          break;
        }
        //#endif
        //Tracev((stderr, "inflate:       table sizes ok\n"));
        state.have = 0;
        state.mode = LENLENS;
        /* falls through */
      case LENLENS:
        while (state.have < state.ncode) {
          //=== NEEDBITS(3);
          while (bits < 3) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.lens[order[state.have++]] = (hold & 0x07); //BITS(3);
          //--- DROPBITS(3) ---//
          hold >>>= 3;
          bits -= 3;
          //---//
        }
        while (state.have < 19) {
          state.lens[order[state.have++]] = 0;
        }
        // We have separate tables & no pointers. 2 commented lines below not needed.
        //state.next = state.codes;
        //state.lencode = state.next;
        // Switch to use dynamic table
        state.lencode = state.lendyn;
        state.lenbits = 7;

        opts = {
          bits: state.lenbits
        };
        ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
        state.lenbits = opts.bits;

        if (ret) {
          strm.msg = 'invalid code lengths set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, "inflate:       code lengths ok\n"));
        state.have = 0;
        state.mode = CODELENS;
        /* falls through */
      case CODELENS:
        while (state.have < state.nlen + state.ndist) {
          for (;;) {
            here = state.lencode[hold & ((1 << state.lenbits) - 1)]; /*BITS(state.lenbits)*/
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((here_bits) <= bits) {
              break;
            }
            //--- PULLBYTE() ---//
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if (here_val < 16) {
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            state.lens[state.have++] = here_val;
          } else {
            if (here_val === 16) {
              //=== NEEDBITS(here.bits + 2);
              n = here_bits + 2;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              if (state.have === 0) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD;
                break;
              }
              len = state.lens[state.have - 1];
              copy = 3 + (hold & 0x03); //BITS(2);
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
            } else if (here_val === 17) {
              //=== NEEDBITS(here.bits + 3);
              n = here_bits + 3;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 3 + (hold & 0x07); //BITS(3);
              //--- DROPBITS(3) ---//
              hold >>>= 3;
              bits -= 3;
              //---//
            } else {
              //=== NEEDBITS(here.bits + 7);
              n = here_bits + 7;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 11 + (hold & 0x7f); //BITS(7);
              //--- DROPBITS(7) ---//
              hold >>>= 7;
              bits -= 7;
              //---//
            }
            if (state.have + copy > state.nlen + state.ndist) {
              strm.msg = 'invalid bit length repeat';
              state.mode = BAD;
              break;
            }
            while (copy--) {
              state.lens[state.have++] = len;
            }
          }
        }

        /* handle error breaks in while */
        if (state.mode === BAD) {
          break;
        }

        /* check for end-of-block code (better have one) */
        if (state.lens[256] === 0) {
          strm.msg = 'invalid code -- missing end-of-block';
          state.mode = BAD;
          break;
        }

        /* build code tables -- note: do not change the lenbits or distbits
           values here (9 and 6) without reading the comments in inftrees.h
           concerning the ENOUGH constants, which depend on those values */
        state.lenbits = 9;

        opts = {
          bits: state.lenbits
        };
        ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.lenbits = opts.bits;
        // state.lencode = state.next;

        if (ret) {
          strm.msg = 'invalid literal/lengths set';
          state.mode = BAD;
          break;
        }

        state.distbits = 6;
        //state.distcode.copy(state.codes);
        // Switch to use dynamic table
        state.distcode = state.distdyn;
        opts = {
          bits: state.distbits
        };
        ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.distbits = opts.bits;
        // state.distcode = state.next;

        if (ret) {
          strm.msg = 'invalid distances set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, 'inflate:       codes ok\n'));
        state.mode = LEN_;
        if (flush === Z_TREES$1) {
          break inf_leave;
        }
        /* falls through */
      case LEN_:
        state.mode = LEN;
        /* falls through */
      case LEN:
        if (have >= 6 && left >= 258) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          inflate_fast(strm, _out);
          //--- LOAD() ---
          put = strm.next_out;
          output = strm.output;
          left = strm.avail_out;
          next = strm.next_in;
          input = strm.input;
          have = strm.avail_in;
          hold = state.hold;
          bits = state.bits;
          //---

          if (state.mode === TYPE) {
            state.back = -1;
          }
          break;
        }
        state.back = 0;
        for (;;) {
          here = state.lencode[hold & ((1 << state.lenbits) - 1)]; /*BITS(state.lenbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if (here_bits <= bits) {
            break;
          }
          //--- PULLBYTE() ---//
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if (here_op && (here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.lencode[last_val +
              ((hold & ((1 << (last_bits + last_op)) - 1)) /*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) {
              break;
            }
            //--- PULLBYTE() ---//
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        state.length = here_val;
        if (here_op === 0) {
          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
          //        "inflate:         literal '%c'\n" :
          //        "inflate:         literal 0x%02x\n", here.val));
          state.mode = LIT;
          break;
        }
        if (here_op & 32) {
          //Tracevv((stderr, "inflate:         end of block\n"));
          state.back = -1;
          state.mode = TYPE;
          break;
        }
        if (here_op & 64) {
          strm.msg = 'invalid literal/length code';
          state.mode = BAD;
          break;
        }
        state.extra = here_op & 15;
        state.mode = LENEXT;
        /* falls through */
      case LENEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length += hold & ((1 << state.extra) - 1) /*BITS(state.extra)*/ ;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
        //Tracevv((stderr, "inflate:         length %u\n", state.length));
        state.was = state.length;
        state.mode = DIST;
        /* falls through */
      case DIST:
        for (;;) {
          here = state.distcode[hold & ((1 << state.distbits) - 1)]; /*BITS(state.distbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((here_bits) <= bits) {
            break;
          }
          //--- PULLBYTE() ---//
          if (have === 0) {
            break inf_leave;
          }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if ((here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.distcode[last_val +
              ((hold & ((1 << (last_bits + last_op)) - 1)) /*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) {
              break;
            }
            //--- PULLBYTE() ---//
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        if (here_op & 64) {
          strm.msg = 'invalid distance code';
          state.mode = BAD;
          break;
        }
        state.offset = here_val;
        state.extra = (here_op) & 15;
        state.mode = DISTEXT;
        /* falls through */
      case DISTEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.offset += hold & ((1 << state.extra) - 1) /*BITS(state.extra)*/ ;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
        //#ifdef INFLATE_STRICT
        if (state.offset > state.dmax) {
          strm.msg = 'invalid distance too far back';
          state.mode = BAD;
          break;
        }
        //#endif
        //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
        state.mode = MATCH;
        /* falls through */
      case MATCH:
        if (left === 0) {
          break inf_leave;
        }
        copy = _out - left;
        if (state.offset > copy) { /* copy from window */
          copy = state.offset - copy;
          if (copy > state.whave) {
            if (state.sane) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break;
            }
            // (!) This block is disabled in zlib defailts,
            // don't enable it for binary compatibility
            //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
            //          Trace((stderr, "inflate.c too far\n"));
            //          copy -= state.whave;
            //          if (copy > state.length) { copy = state.length; }
            //          if (copy > left) { copy = left; }
            //          left -= copy;
            //          state.length -= copy;
            //          do {
            //            output[put++] = 0;
            //          } while (--copy);
            //          if (state.length === 0) { state.mode = LEN; }
            //          break;
            //#endif
          }
          if (copy > state.wnext) {
            copy -= state.wnext;
            from = state.wsize - copy;
          } else {
            from = state.wnext - copy;
          }
          if (copy > state.length) {
            copy = state.length;
          }
          from_source = state.window;
        } else { /* copy from output */
          from_source = output;
          from = put - state.offset;
          copy = state.length;
        }
        if (copy > left) {
          copy = left;
        }
        left -= copy;
        state.length -= copy;
        do {
          output[put++] = from_source[from++];
        } while (--copy);
        if (state.length === 0) {
          state.mode = LEN;
        }
        break;
      case LIT:
        if (left === 0) {
          break inf_leave;
        }
        output[put++] = state.length;
        left--;
        state.mode = LEN;
        break;
      case CHECK:
        if (state.wrap) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            // Use '|' insdead of '+' to make sure that result is signed
            hold |= input[next++] << bits;
            bits += 8;
          }
          //===//
          _out -= left;
          strm.total_out += _out;
          state.total += _out;
          if (_out) {
            strm.adler = state.check =
              /*UPDATE(state.check, put - _out, _out);*/
              (state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out));

          }
          _out = left;
          // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
          if ((state.flags ? hold : zswap32(hold)) !== state.check) {
            strm.msg = 'incorrect data check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   check matches trailer\n"));
        }
        state.mode = LENGTH;
        /* falls through */
      case LENGTH:
        if (state.wrap && state.flags) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (hold !== (state.total & 0xffffffff)) {
            strm.msg = 'incorrect length check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   length matches trailer\n"));
        }
        state.mode = DONE;
        /* falls through */
      case DONE:
        ret = Z_STREAM_END$1;
        break inf_leave;
      case BAD:
        ret = Z_DATA_ERROR$1;
        break inf_leave;
      case MEM:
        return Z_MEM_ERROR;
      case SYNC:
        /* falls through */
      default:
        return Z_STREAM_ERROR$1;
      }
    }

  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

  /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */

  //--- RESTORE() ---
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  //---

  if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
      (state.mode < CHECK || flush !== Z_FINISH$1))) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if (state.wrap && _out) {
    strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
      (state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out));
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) +
    (state.mode === TYPE ? 128 : 0) +
    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if (((_in === 0 && _out === 0) || flush === Z_FINISH$1) && ret === Z_OK$1) {
    ret = Z_BUF_ERROR$1;
  }
  return ret;
}

function inflateEnd(strm) {

  if (!strm || !strm.state /*|| strm->zfree == (free_func)0*/ ) {
    return Z_STREAM_ERROR$1;
  }

  var state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK$1;
}

/* Not implemented
exports.inflateCopy = inflateCopy;
exports.inflateGetDictionary = inflateGetDictionary;
exports.inflateMark = inflateMark;
exports.inflatePrime = inflatePrime;
exports.inflateSync = inflateSync;
exports.inflateSyncPoint = inflateSyncPoint;
exports.inflateUndermine = inflateUndermine;
*/

// import constants from './constants';


// zlib modes
var NONE = 0;
var DEFLATE = 1;
var INFLATE = 2;
var GZIP = 3;
var GUNZIP = 4;
var DEFLATERAW = 5;
var INFLATERAW = 6;
var UNZIP = 7;
var Z_NO_FLUSH=         0,
  Z_PARTIAL_FLUSH=    1,
  Z_SYNC_FLUSH=    2,
  Z_FULL_FLUSH=       3,
  Z_FINISH=       4,
  Z_BLOCK=           5,
  Z_TREES=            6,

  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK=               0,
  Z_STREAM_END=       1,
  Z_NEED_DICT=      2,
  Z_ERRNO=       -1,
  Z_STREAM_ERROR=   -2,
  Z_DATA_ERROR=    -3,
  //Z_MEM_ERROR:     -4,
  Z_BUF_ERROR=    -5,
  //Z_VERSION_ERROR: -6,

  /* compression levels */
  Z_NO_COMPRESSION=         0,
  Z_BEST_SPEED=             1,
  Z_BEST_COMPRESSION=       9,
  Z_DEFAULT_COMPRESSION=   -1,


  Z_FILTERED=               1,
  Z_HUFFMAN_ONLY=           2,
  Z_RLE=                    3,
  Z_FIXED=                  4,
  Z_DEFAULT_STRATEGY=       0,

  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY=                 0,
  Z_TEXT=                   1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN=                2,

  /* The deflate compression method */
  Z_DEFLATED=               8;
function Zlib$1(mode) {
  if (mode < DEFLATE || mode > UNZIP)
    throw new TypeError('Bad argument');

  this.mode = mode;
  this.init_done = false;
  this.write_in_progress = false;
  this.pending_close = false;
  this.windowBits = 0;
  this.level = 0;
  this.memLevel = 0;
  this.strategy = 0;
  this.dictionary = null;
}

Zlib$1.prototype.init = function(windowBits, level, memLevel, strategy, dictionary) {
  this.windowBits = windowBits;
  this.level = level;
  this.memLevel = memLevel;
  this.strategy = strategy;
  // dictionary not supported.

  if (this.mode === GZIP || this.mode === GUNZIP)
    this.windowBits += 16;

  if (this.mode === UNZIP)
    this.windowBits += 32;

  if (this.mode === DEFLATERAW || this.mode === INFLATERAW)
    this.windowBits = -this.windowBits;

  this.strm = new ZStream();
  var status;
  switch (this.mode) {
  case DEFLATE:
  case GZIP:
  case DEFLATERAW:
    status = deflateInit2(
      this.strm,
      this.level,
      Z_DEFLATED,
      this.windowBits,
      this.memLevel,
      this.strategy
    );
    break;
  case INFLATE:
  case GUNZIP:
  case INFLATERAW:
  case UNZIP:
    status  = inflateInit2(
      this.strm,
      this.windowBits
    );
    break;
  default:
    throw new Error('Unknown mode ' + this.mode);
  }

  if (status !== Z_OK) {
    this._error(status);
    return;
  }

  this.write_in_progress = false;
  this.init_done = true;
};

Zlib$1.prototype.params = function() {
  throw new Error('deflateParams Not supported');
};

Zlib$1.prototype._writeCheck = function() {
  if (!this.init_done)
    throw new Error('write before init');

  if (this.mode === NONE)
    throw new Error('already finalized');

  if (this.write_in_progress)
    throw new Error('write already in progress');

  if (this.pending_close)
    throw new Error('close is pending');
};

Zlib$1.prototype.write = function(flush, input, in_off, in_len, out, out_off, out_len) {
  this._writeCheck();
  this.write_in_progress = true;

  var self = this;
  browser$1.nextTick(function() {
    self.write_in_progress = false;
    var res = self._write(flush, input, in_off, in_len, out, out_off, out_len);
    self.callback(res[0], res[1]);

    if (self.pending_close)
      self.close();
  });

  return this;
};

// set method for Node buffers, used by pako
function bufferSet(data, offset) {
  for (var i = 0; i < data.length; i++) {
    this[offset + i] = data[i];
  }
}

Zlib$1.prototype.writeSync = function(flush, input, in_off, in_len, out, out_off, out_len) {
  this._writeCheck();
  return this._write(flush, input, in_off, in_len, out, out_off, out_len);
};

Zlib$1.prototype._write = function(flush, input, in_off, in_len, out, out_off, out_len) {
  this.write_in_progress = true;

  if (flush !== Z_NO_FLUSH &&
      flush !== Z_PARTIAL_FLUSH &&
      flush !== Z_SYNC_FLUSH &&
      flush !== Z_FULL_FLUSH &&
      flush !== Z_FINISH &&
      flush !== Z_BLOCK) {
    throw new Error('Invalid flush value');
  }

  if (input == null) {
    input = new Buffer(0);
    in_len = 0;
    in_off = 0;
  }

  if (out._set)
    out.set = out._set;
  else
    out.set = bufferSet;

  var strm = this.strm;
  strm.avail_in = in_len;
  strm.input = input;
  strm.next_in = in_off;
  strm.avail_out = out_len;
  strm.output = out;
  strm.next_out = out_off;
  var status;
  switch (this.mode) {
  case DEFLATE:
  case GZIP:
  case DEFLATERAW:
    status = deflate$1(strm, flush);
    break;
  case UNZIP:
  case INFLATE:
  case GUNZIP:
  case INFLATERAW:
    status = inflate$1(strm, flush);
    break;
  default:
    throw new Error('Unknown mode ' + this.mode);
  }

  if (status !== Z_STREAM_END && status !== Z_OK) {
    this._error(status);
  }

  this.write_in_progress = false;
  return [strm.avail_in, strm.avail_out];
};

Zlib$1.prototype.close = function() {
  if (this.write_in_progress) {
    this.pending_close = true;
    return;
  }

  this.pending_close = false;

  if (this.mode === DEFLATE || this.mode === GZIP || this.mode === DEFLATERAW) {
    deflateEnd(this.strm);
  } else {
    inflateEnd(this.strm);
  }

  this.mode = NONE;
};
var status;
Zlib$1.prototype.reset = function() {
  switch (this.mode) {
  case DEFLATE:
  case DEFLATERAW:
    status = deflateReset(this.strm);
    break;
  case INFLATE:
  case INFLATERAW:
    status = inflateReset(this.strm);
    break;
  }

  if (status !== Z_OK) {
    this._error(status);
  }
};

Zlib$1.prototype._error = function(status) {
  this.onerror(msg[status] + ': ' + this.strm.msg, status);

  this.write_in_progress = false;
  if (this.pending_close)
    this.close();
};

var _binding = /*#__PURE__*/Object.freeze({
	__proto__: null,
	NONE: NONE,
	DEFLATE: DEFLATE,
	INFLATE: INFLATE,
	GZIP: GZIP,
	GUNZIP: GUNZIP,
	DEFLATERAW: DEFLATERAW,
	INFLATERAW: INFLATERAW,
	UNZIP: UNZIP,
	Z_NO_FLUSH: Z_NO_FLUSH,
	Z_PARTIAL_FLUSH: Z_PARTIAL_FLUSH,
	Z_SYNC_FLUSH: Z_SYNC_FLUSH,
	Z_FULL_FLUSH: Z_FULL_FLUSH,
	Z_FINISH: Z_FINISH,
	Z_BLOCK: Z_BLOCK,
	Z_TREES: Z_TREES,
	Z_OK: Z_OK,
	Z_STREAM_END: Z_STREAM_END,
	Z_NEED_DICT: Z_NEED_DICT,
	Z_ERRNO: Z_ERRNO,
	Z_STREAM_ERROR: Z_STREAM_ERROR,
	Z_DATA_ERROR: Z_DATA_ERROR,
	Z_BUF_ERROR: Z_BUF_ERROR,
	Z_NO_COMPRESSION: Z_NO_COMPRESSION,
	Z_BEST_SPEED: Z_BEST_SPEED,
	Z_BEST_COMPRESSION: Z_BEST_COMPRESSION,
	Z_DEFAULT_COMPRESSION: Z_DEFAULT_COMPRESSION,
	Z_FILTERED: Z_FILTERED,
	Z_HUFFMAN_ONLY: Z_HUFFMAN_ONLY,
	Z_RLE: Z_RLE,
	Z_FIXED: Z_FIXED,
	Z_DEFAULT_STRATEGY: Z_DEFAULT_STRATEGY,
	Z_BINARY: Z_BINARY,
	Z_TEXT: Z_TEXT,
	Z_UNKNOWN: Z_UNKNOWN,
	Z_DEFLATED: Z_DEFLATED,
	Zlib: Zlib$1
});

function assert (a, msg) {
  if (!a) {
    throw new Error(msg);
  }
}
var binding = {};
Object.keys(_binding).forEach(function (key) {
  binding[key] = _binding[key];
});
// zlib doesn't provide these, so kludge them in following the same
// const naming scheme zlib uses.
binding.Z_MIN_WINDOWBITS = 8;
binding.Z_MAX_WINDOWBITS = 15;
binding.Z_DEFAULT_WINDOWBITS = 15;

// fewer than 64 bytes per chunk is stupid.
// technically it could work with as few as 8, but even 64 bytes
// is absurdly low.  Usually a MB or more is best.
binding.Z_MIN_CHUNK = 64;
binding.Z_MAX_CHUNK = Infinity;
binding.Z_DEFAULT_CHUNK = (16 * 1024);

binding.Z_MIN_MEMLEVEL = 1;
binding.Z_MAX_MEMLEVEL = 9;
binding.Z_DEFAULT_MEMLEVEL = 8;

binding.Z_MIN_LEVEL = -1;
binding.Z_MAX_LEVEL = 9;
binding.Z_DEFAULT_LEVEL = binding.Z_DEFAULT_COMPRESSION;


// translation table for return codes.
var codes = {
  Z_OK: binding.Z_OK,
  Z_STREAM_END: binding.Z_STREAM_END,
  Z_NEED_DICT: binding.Z_NEED_DICT,
  Z_ERRNO: binding.Z_ERRNO,
  Z_STREAM_ERROR: binding.Z_STREAM_ERROR,
  Z_DATA_ERROR: binding.Z_DATA_ERROR,
  Z_MEM_ERROR: binding.Z_MEM_ERROR,
  Z_BUF_ERROR: binding.Z_BUF_ERROR,
  Z_VERSION_ERROR: binding.Z_VERSION_ERROR
};

Object.keys(codes).forEach(function(k) {
  codes[codes[k]] = k;
});

function createDeflate(o) {
  return new Deflate(o);
}

function createInflate(o) {
  return new Inflate(o);
}

function createDeflateRaw(o) {
  return new DeflateRaw(o);
}

function createInflateRaw(o) {
  return new InflateRaw(o);
}

function createGzip(o) {
  return new Gzip(o);
}

function createGunzip(o) {
  return new Gunzip(o);
}

function createUnzip(o) {
  return new Unzip(o);
}


// Convenience methods.
// compress/decompress a string or buffer in one step.
function deflate(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Deflate(opts), buffer, callback);
}

function deflateSync(buffer, opts) {
  return zlibBufferSync(new Deflate(opts), buffer);
}

function gzip(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Gzip(opts), buffer, callback);
}

function gzipSync(buffer, opts) {
  return zlibBufferSync(new Gzip(opts), buffer);
}

function deflateRaw(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new DeflateRaw(opts), buffer, callback);
}

function deflateRawSync(buffer, opts) {
  return zlibBufferSync(new DeflateRaw(opts), buffer);
}

function unzip(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Unzip(opts), buffer, callback);
}

function unzipSync(buffer, opts) {
  return zlibBufferSync(new Unzip(opts), buffer);
}

function inflate(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Inflate(opts), buffer, callback);
}

function inflateSync(buffer, opts) {
  return zlibBufferSync(new Inflate(opts), buffer);
}

function gunzip(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Gunzip(opts), buffer, callback);
}

function gunzipSync(buffer, opts) {
  return zlibBufferSync(new Gunzip(opts), buffer);
}

function inflateRaw(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new InflateRaw(opts), buffer, callback);
}

function inflateRawSync(buffer, opts) {
  return zlibBufferSync(new InflateRaw(opts), buffer);
}

function zlibBuffer(engine, buffer, callback) {
  var buffers = [];
  var nread = 0;

  engine.on('error', onError);
  engine.on('end', onEnd);

  engine.end(buffer);
  flow();

  function flow() {
    var chunk;
    while (null !== (chunk = engine.read())) {
      buffers.push(chunk);
      nread += chunk.length;
    }
    engine.once('readable', flow);
  }

  function onError(err) {
    engine.removeListener('end', onEnd);
    engine.removeListener('readable', flow);
    callback(err);
  }

  function onEnd() {
    var buf = Buffer.concat(buffers, nread);
    buffers = [];
    callback(null, buf);
    engine.close();
  }
}

function zlibBufferSync(engine, buffer) {
  if (typeof buffer === 'string')
    buffer = new Buffer(buffer);
  if (!Buffer.isBuffer(buffer))
    throw new TypeError('Not a string or buffer');

  var flushFlag = binding.Z_FINISH;

  return engine._processChunk(buffer, flushFlag);
}

// generic zlib
// minimal 2-byte header
function Deflate(opts) {
  if (!(this instanceof Deflate)) return new Deflate(opts);
  Zlib.call(this, opts, binding.DEFLATE);
}

function Inflate(opts) {
  if (!(this instanceof Inflate)) return new Inflate(opts);
  Zlib.call(this, opts, binding.INFLATE);
}



// gzip - bigger header, same deflate compression
function Gzip(opts) {
  if (!(this instanceof Gzip)) return new Gzip(opts);
  Zlib.call(this, opts, binding.GZIP);
}

function Gunzip(opts) {
  if (!(this instanceof Gunzip)) return new Gunzip(opts);
  Zlib.call(this, opts, binding.GUNZIP);
}



// raw - no header
function DeflateRaw(opts) {
  if (!(this instanceof DeflateRaw)) return new DeflateRaw(opts);
  Zlib.call(this, opts, binding.DEFLATERAW);
}

function InflateRaw(opts) {
  if (!(this instanceof InflateRaw)) return new InflateRaw(opts);
  Zlib.call(this, opts, binding.INFLATERAW);
}


// auto-detect header.
function Unzip(opts) {
  if (!(this instanceof Unzip)) return new Unzip(opts);
  Zlib.call(this, opts, binding.UNZIP);
}


// the Zlib class they all inherit from
// This thing manages the queue of requests, and returns
// true or false if there is anything in the queue when
// you call the .write() method.

function Zlib(opts, mode) {
  this._opts = opts = opts || {};
  this._chunkSize = opts.chunkSize || binding.Z_DEFAULT_CHUNK;

  Transform.call(this, opts);

  if (opts.flush) {
    if (opts.flush !== binding.Z_NO_FLUSH &&
        opts.flush !== binding.Z_PARTIAL_FLUSH &&
        opts.flush !== binding.Z_SYNC_FLUSH &&
        opts.flush !== binding.Z_FULL_FLUSH &&
        opts.flush !== binding.Z_FINISH &&
        opts.flush !== binding.Z_BLOCK) {
      throw new Error('Invalid flush flag: ' + opts.flush);
    }
  }
  this._flushFlag = opts.flush || binding.Z_NO_FLUSH;

  if (opts.chunkSize) {
    if (opts.chunkSize < binding.Z_MIN_CHUNK ||
        opts.chunkSize > binding.Z_MAX_CHUNK) {
      throw new Error('Invalid chunk size: ' + opts.chunkSize);
    }
  }

  if (opts.windowBits) {
    if (opts.windowBits < binding.Z_MIN_WINDOWBITS ||
        opts.windowBits > binding.Z_MAX_WINDOWBITS) {
      throw new Error('Invalid windowBits: ' + opts.windowBits);
    }
  }

  if (opts.level) {
    if (opts.level < binding.Z_MIN_LEVEL ||
        opts.level > binding.Z_MAX_LEVEL) {
      throw new Error('Invalid compression level: ' + opts.level);
    }
  }

  if (opts.memLevel) {
    if (opts.memLevel < binding.Z_MIN_MEMLEVEL ||
        opts.memLevel > binding.Z_MAX_MEMLEVEL) {
      throw new Error('Invalid memLevel: ' + opts.memLevel);
    }
  }

  if (opts.strategy) {
    if (opts.strategy != binding.Z_FILTERED &&
        opts.strategy != binding.Z_HUFFMAN_ONLY &&
        opts.strategy != binding.Z_RLE &&
        opts.strategy != binding.Z_FIXED &&
        opts.strategy != binding.Z_DEFAULT_STRATEGY) {
      throw new Error('Invalid strategy: ' + opts.strategy);
    }
  }

  if (opts.dictionary) {
    if (!Buffer.isBuffer(opts.dictionary)) {
      throw new Error('Invalid dictionary: it should be a Buffer instance');
    }
  }

  this._binding = new binding.Zlib(mode);

  var self = this;
  this._hadError = false;
  this._binding.onerror = function(message, errno) {
    // there is no way to cleanly recover.
    // continuing only obscures problems.
    self._binding = null;
    self._hadError = true;

    var error = new Error(message);
    error.errno = errno;
    error.code = binding.codes[errno];
    self.emit('error', error);
  };

  var level = binding.Z_DEFAULT_COMPRESSION;
  if (typeof opts.level === 'number') level = opts.level;

  var strategy = binding.Z_DEFAULT_STRATEGY;
  if (typeof opts.strategy === 'number') strategy = opts.strategy;

  this._binding.init(opts.windowBits || binding.Z_DEFAULT_WINDOWBITS,
                     level,
                     opts.memLevel || binding.Z_DEFAULT_MEMLEVEL,
                     strategy,
                     opts.dictionary);

  this._buffer = new Buffer(this._chunkSize);
  this._offset = 0;
  this._closed = false;
  this._level = level;
  this._strategy = strategy;

  this.once('end', this.close);
}

inherits$1(Zlib, Transform);

Zlib.prototype.params = function(level, strategy, callback) {
  if (level < binding.Z_MIN_LEVEL ||
      level > binding.Z_MAX_LEVEL) {
    throw new RangeError('Invalid compression level: ' + level);
  }
  if (strategy != binding.Z_FILTERED &&
      strategy != binding.Z_HUFFMAN_ONLY &&
      strategy != binding.Z_RLE &&
      strategy != binding.Z_FIXED &&
      strategy != binding.Z_DEFAULT_STRATEGY) {
    throw new TypeError('Invalid strategy: ' + strategy);
  }

  if (this._level !== level || this._strategy !== strategy) {
    var self = this;
    this.flush(binding.Z_SYNC_FLUSH, function() {
      self._binding.params(level, strategy);
      if (!self._hadError) {
        self._level = level;
        self._strategy = strategy;
        if (callback) callback();
      }
    });
  } else {
    browser$1.nextTick(callback);
  }
};

Zlib.prototype.reset = function() {
  return this._binding.reset();
};

// This is the _flush function called by the transform class,
// internally, when the last chunk has been written.
Zlib.prototype._flush = function(callback) {
  this._transform(new Buffer(0), '', callback);
};

Zlib.prototype.flush = function(kind, callback) {
  var ws = this._writableState;

  if (typeof kind === 'function' || (kind === void 0 && !callback)) {
    callback = kind;
    kind = binding.Z_FULL_FLUSH;
  }

  if (ws.ended) {
    if (callback)
      browser$1.nextTick(callback);
  } else if (ws.ending) {
    if (callback)
      this.once('end', callback);
  } else if (ws.needDrain) {
    var self = this;
    this.once('drain', function() {
      self.flush(callback);
    });
  } else {
    this._flushFlag = kind;
    this.write(new Buffer(0), '', callback);
  }
};

Zlib.prototype.close = function(callback) {
  if (callback)
    browser$1.nextTick(callback);

  if (this._closed)
    return;

  this._closed = true;

  this._binding.close();

  var self = this;
  browser$1.nextTick(function() {
    self.emit('close');
  });
};

Zlib.prototype._transform = function(chunk, encoding, cb) {
  var flushFlag;
  var ws = this._writableState;
  var ending = ws.ending || ws.ended;
  var last = ending && (!chunk || ws.length === chunk.length);

  if (!chunk === null && !Buffer.isBuffer(chunk))
    return cb(new Error('invalid input'));

  // If it's the last chunk, or a final flush, we use the Z_FINISH flush flag.
  // If it's explicitly flushing at some other time, then we use
  // Z_FULL_FLUSH. Otherwise, use Z_NO_FLUSH for maximum compression
  // goodness.
  if (last)
    flushFlag = binding.Z_FINISH;
  else {
    flushFlag = this._flushFlag;
    // once we've flushed the last of the queue, stop flushing and
    // go back to the normal behavior.
    if (chunk.length >= ws.length) {
      this._flushFlag = this._opts.flush || binding.Z_NO_FLUSH;
    }
  }

  this._processChunk(chunk, flushFlag, cb);
};

Zlib.prototype._processChunk = function(chunk, flushFlag, cb) {
  var availInBefore = chunk && chunk.length;
  var availOutBefore = this._chunkSize - this._offset;
  var inOff = 0;

  var self = this;

  var async = typeof cb === 'function';

  if (!async) {
    var buffers = [];
    var nread = 0;

    var error;
    this.on('error', function(er) {
      error = er;
    });

    do {
      var res = this._binding.writeSync(flushFlag,
                                        chunk, // in
                                        inOff, // in_off
                                        availInBefore, // in_len
                                        this._buffer, // out
                                        this._offset, //out_off
                                        availOutBefore); // out_len
    } while (!this._hadError && callback(res[0], res[1]));

    if (this._hadError) {
      throw error;
    }

    var buf = Buffer.concat(buffers, nread);
    this.close();

    return buf;
  }

  var req = this._binding.write(flushFlag,
                                chunk, // in
                                inOff, // in_off
                                availInBefore, // in_len
                                this._buffer, // out
                                this._offset, //out_off
                                availOutBefore); // out_len

  req.buffer = chunk;
  req.callback = callback;

  function callback(availInAfter, availOutAfter) {
    if (self._hadError)
      return;

    var have = availOutBefore - availOutAfter;
    assert(have >= 0, 'have should not go down');

    if (have > 0) {
      var out = self._buffer.slice(self._offset, self._offset + have);
      self._offset += have;
      // serve some output to the consumer.
      if (async) {
        self.push(out);
      } else {
        buffers.push(out);
        nread += out.length;
      }
    }

    // exhausted the output buffer, or used all the input create a new one.
    if (availOutAfter === 0 || self._offset >= self._chunkSize) {
      availOutBefore = self._chunkSize;
      self._offset = 0;
      self._buffer = new Buffer(self._chunkSize);
    }

    if (availOutAfter === 0) {
      // Not actually done.  Need to reprocess.
      // Also, update the availInBefore to the availInAfter value,
      // so that if we have to hit it a third (fourth, etc.) time,
      // it'll have the correct byte counts.
      inOff += (availInBefore - availInAfter);
      availInBefore = availInAfter;

      if (!async)
        return true;

      var newReq = self._binding.write(flushFlag,
                                       chunk,
                                       inOff,
                                       availInBefore,
                                       self._buffer,
                                       self._offset,
                                       self._chunkSize);
      newReq.callback = callback; // this same function
      newReq.buffer = chunk;
      return;
    }

    if (!async)
      return false;

    // finished with the chunk.
    cb();
  }
};

inherits$1(Deflate, Zlib);
inherits$1(Inflate, Zlib);
inherits$1(Gzip, Zlib);
inherits$1(Gunzip, Zlib);
inherits$1(DeflateRaw, Zlib);
inherits$1(InflateRaw, Zlib);
inherits$1(Unzip, Zlib);
var _polyfillNode_zlib = {
  codes: codes,
  createDeflate: createDeflate,
  createInflate: createInflate,
  createDeflateRaw: createDeflateRaw,
  createInflateRaw: createInflateRaw,
  createGzip: createGzip,
  createGunzip: createGunzip,
  createUnzip: createUnzip,
  deflate: deflate,
  deflateSync: deflateSync,
  gzip: gzip,
  gzipSync: gzipSync,
  deflateRaw: deflateRaw,
  deflateRawSync: deflateRawSync,
  unzip: unzip,
  unzipSync: unzipSync,
  inflate: inflate,
  inflateSync: inflateSync,
  gunzip: gunzip,
  gunzipSync: gunzipSync,
  inflateRaw: inflateRaw,
  inflateRawSync: inflateRawSync,
  Deflate: Deflate,
  Inflate: Inflate,
  Gzip: Gzip,
  Gunzip: Gunzip,
  DeflateRaw: DeflateRaw,
  InflateRaw: InflateRaw,
  Unzip: Unzip,
  Zlib: Zlib
};

var _polyfillNode_zlib$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	codes: codes,
	createDeflate: createDeflate,
	createInflate: createInflate,
	createDeflateRaw: createDeflateRaw,
	createInflateRaw: createInflateRaw,
	createGzip: createGzip,
	createGunzip: createGunzip,
	createUnzip: createUnzip,
	deflate: deflate,
	deflateSync: deflateSync,
	gzip: gzip,
	gzipSync: gzipSync,
	deflateRaw: deflateRaw,
	deflateRawSync: deflateRawSync,
	unzip: unzip,
	unzipSync: unzipSync,
	inflate: inflate,
	inflateSync: inflateSync,
	gunzip: gunzip,
	gunzipSync: gunzipSync,
	inflateRaw: inflateRaw,
	inflateRawSync: inflateRawSync,
	Deflate: Deflate,
	Inflate: Inflate,
	Gzip: Gzip,
	Gunzip: Gunzip,
	DeflateRaw: DeflateRaw,
	InflateRaw: InflateRaw,
	Unzip: Unzip,
	Zlib: Zlib,
	default: _polyfillNode_zlib
});

var require$$0 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_zlib$1);

var _polyfillNode_fs = {};

var _polyfillNode_fs$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	default: _polyfillNode_fs
});

var require$$1 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_fs$1);

var hasFetch = isFunction(global$1.fetch) && isFunction(global$1.ReadableStream);

var _blobConstructor;
function blobConstructor() {
  if (typeof _blobConstructor !== 'undefined') {
    return _blobConstructor;
  }
  try {
    new global$1.Blob([new ArrayBuffer(1)]);
    _blobConstructor = true;
  } catch (e) {
    _blobConstructor = false;
  }
  return _blobConstructor
}
var xhr;

function checkTypeSupport(type) {
  if (!xhr) {
    xhr = new global$1.XMLHttpRequest();
    // If location.host is empty, e.g. if this page/worker was loaded
    // from a Blob, then use example.com to avoid an error
    xhr.open('GET', global$1.location.host ? '/' : 'https://example.com');
  }
  try {
    xhr.responseType = type;
    return xhr.responseType === type
  } catch (e) {
    return false
  }

}

// For some strange reason, Safari 7.0 reports typeof global.ArrayBuffer === 'object'.
// Safari 7.1 appears to have fixed this bug.
var haveArrayBuffer = typeof global$1.ArrayBuffer !== 'undefined';
var haveSlice = haveArrayBuffer && isFunction(global$1.ArrayBuffer.prototype.slice);

var arraybuffer = haveArrayBuffer && checkTypeSupport('arraybuffer');
  // These next two tests unavoidably show warnings in Chrome. Since fetch will always
  // be used if it's available, just return false for these to avoid the warnings.
var msstream = !hasFetch && haveSlice && checkTypeSupport('ms-stream');
var mozchunkedarraybuffer = !hasFetch && haveArrayBuffer &&
  checkTypeSupport('moz-chunked-arraybuffer');
var overrideMimeType = isFunction(xhr.overrideMimeType);
var vbArray = isFunction(global$1.VBArray);

function isFunction(value) {
  return typeof value === 'function'
}

xhr = null; // Help gc

var rStates = {
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
};
function IncomingMessage(xhr, response, mode) {
  var self = this;
  Readable.call(self);

  self._mode = mode;
  self.headers = {};
  self.rawHeaders = [];
  self.trailers = {};
  self.rawTrailers = [];

  // Fake the 'close' event, but only once 'end' fires
  self.on('end', function() {
    // The nextTick is necessary to prevent the 'request' module from causing an infinite loop
    browser$1.nextTick(function() {
      self.emit('close');
    });
  });
  var read;
  if (mode === 'fetch') {
    self._fetchResponse = response;

    self.url = response.url;
    self.statusCode = response.status;
    self.statusMessage = response.statusText;
      // backwards compatible version of for (<item> of <iterable>):
      // for (var <item>,_i,_it = <iterable>[Symbol.iterator](); <item> = (_i = _it.next()).value,!_i.done;)
    for (var header, _i, _it = response.headers[Symbol.iterator](); header = (_i = _it.next()).value, !_i.done;) {
      self.headers[header[0].toLowerCase()] = header[1];
      self.rawHeaders.push(header[0], header[1]);
    }

    // TODO: this doesn't respect backpressure. Once WritableStream is available, this can be fixed
    var reader = response.body.getReader();

    read = function () {
      reader.read().then(function(result) {
        if (self._destroyed)
          return
        if (result.done) {
          self.push(null);
          return
        }
        self.push(new Buffer(result.value));
        read();
      });
    };
    read();

  } else {
    self._xhr = xhr;
    self._pos = 0;

    self.url = xhr.responseURL;
    self.statusCode = xhr.status;
    self.statusMessage = xhr.statusText;
    var headers = xhr.getAllResponseHeaders().split(/\r?\n/);
    headers.forEach(function(header) {
      var matches = header.match(/^([^:]+):\s*(.*)/);
      if (matches) {
        var key = matches[1].toLowerCase();
        if (key === 'set-cookie') {
          if (self.headers[key] === undefined) {
            self.headers[key] = [];
          }
          self.headers[key].push(matches[2]);
        } else if (self.headers[key] !== undefined) {
          self.headers[key] += ', ' + matches[2];
        } else {
          self.headers[key] = matches[2];
        }
        self.rawHeaders.push(matches[1], matches[2]);
      }
    });

    self._charset = 'x-user-defined';
    if (!overrideMimeType) {
      var mimeType = self.rawHeaders['mime-type'];
      if (mimeType) {
        var charsetMatch = mimeType.match(/;\s*charset=([^;])(;|$)/);
        if (charsetMatch) {
          self._charset = charsetMatch[1].toLowerCase();
        }
      }
      if (!self._charset)
        self._charset = 'utf-8'; // best guess
    }
  }
}

inherits$1(IncomingMessage, Readable);

IncomingMessage.prototype._read = function() {};

IncomingMessage.prototype._onXHRProgress = function() {
  var self = this;

  var xhr = self._xhr;

  var response = null;
  switch (self._mode) {
  case 'text:vbarray': // For IE9
    if (xhr.readyState !== rStates.DONE)
      break
    try {
      // This fails in IE8
      response = new global$1.VBArray(xhr.responseBody).toArray();
    } catch (e) {
      // pass
    }
    if (response !== null) {
      self.push(new Buffer(response));
      break
    }
    // Falls through in IE8
  case 'text':
    try { // This will fail when readyState = 3 in IE9. Switch mode and wait for readyState = 4
      response = xhr.responseText;
    } catch (e) {
      self._mode = 'text:vbarray';
      break
    }
    if (response.length > self._pos) {
      var newData = response.substr(self._pos);
      if (self._charset === 'x-user-defined') {
        var buffer = new Buffer(newData.length);
        for (var i = 0; i < newData.length; i++)
          buffer[i] = newData.charCodeAt(i) & 0xff;

        self.push(buffer);
      } else {
        self.push(newData, self._charset);
      }
      self._pos = response.length;
    }
    break
  case 'arraybuffer':
    if (xhr.readyState !== rStates.DONE || !xhr.response)
      break
    response = xhr.response;
    self.push(new Buffer(new Uint8Array(response)));
    break
  case 'moz-chunked-arraybuffer': // take whole
    response = xhr.response;
    if (xhr.readyState !== rStates.LOADING || !response)
      break
    self.push(new Buffer(new Uint8Array(response)));
    break
  case 'ms-stream':
    response = xhr.response;
    if (xhr.readyState !== rStates.LOADING)
      break
    var reader = new global$1.MSStreamReader();
    reader.onprogress = function() {
      if (reader.result.byteLength > self._pos) {
        self.push(new Buffer(new Uint8Array(reader.result.slice(self._pos))));
        self._pos = reader.result.byteLength;
      }
    };
    reader.onload = function() {
      self.push(null);
    };
      // reader.onerror = ??? // TODO: this
    reader.readAsArrayBuffer(response);
    break
  }

  // The ms-stream case handles end separately in reader.onload()
  if (self._xhr.readyState === rStates.DONE && self._mode !== 'ms-stream') {
    self.push(null);
  }
};

// from https://github.com/jhiesey/to-arraybuffer/blob/6502d9850e70ba7935a7df4ad86b358fc216f9f0/index.js
function toArrayBuffer (buf) {
  // If the buffer is backed by a Uint8Array, a faster version will work
  if (buf instanceof Uint8Array) {
    // If the buffer isn't a subarray, return the underlying ArrayBuffer
    if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) {
      return buf.buffer
    } else if (typeof buf.buffer.slice === 'function') {
      // Otherwise we need to get a proper copy
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
    }
  }

  if (isBuffer(buf)) {
    // This is the slow version that will work with any Buffer
    // implementation (even in old browsers)
    var arrayCopy = new Uint8Array(buf.length);
    var len = buf.length;
    for (var i = 0; i < len; i++) {
      arrayCopy[i] = buf[i];
    }
    return arrayCopy.buffer
  } else {
    throw new Error('Argument must be a Buffer')
  }
}

function decideMode(preferBinary, useFetch) {
  if (hasFetch && useFetch) {
    return 'fetch'
  } else if (mozchunkedarraybuffer) {
    return 'moz-chunked-arraybuffer'
  } else if (msstream) {
    return 'ms-stream'
  } else if (arraybuffer && preferBinary) {
    return 'arraybuffer'
  } else if (vbArray && preferBinary) {
    return 'text:vbarray'
  } else {
    return 'text'
  }
}

function ClientRequest(opts) {
  var self = this;
  Writable.call(self);

  self._opts = opts;
  self._body = [];
  self._headers = {};
  if (opts.auth)
    self.setHeader('Authorization', 'Basic ' + new Buffer(opts.auth).toString('base64'));
  Object.keys(opts.headers).forEach(function(name) {
    self.setHeader(name, opts.headers[name]);
  });

  var preferBinary;
  var useFetch = true;
  if (opts.mode === 'disable-fetch') {
    // If the use of XHR should be preferred and includes preserving the 'content-type' header
    useFetch = false;
    preferBinary = true;
  } else if (opts.mode === 'prefer-streaming') {
    // If streaming is a high priority but binary compatibility and
    // the accuracy of the 'content-type' header aren't
    preferBinary = false;
  } else if (opts.mode === 'allow-wrong-content-type') {
    // If streaming is more important than preserving the 'content-type' header
    preferBinary = !overrideMimeType;
  } else if (!opts.mode || opts.mode === 'default' || opts.mode === 'prefer-fast') {
    // Use binary if text streaming may corrupt data or the content-type header, or for speed
    preferBinary = true;
  } else {
    throw new Error('Invalid value for opts.mode')
  }
  self._mode = decideMode(preferBinary, useFetch);

  self.on('finish', function() {
    self._onFinish();
  });
}

inherits$1(ClientRequest, Writable);
// Taken from http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader%28%29-method
var unsafeHeaders = [
  'accept-charset',
  'accept-encoding',
  'access-control-request-headers',
  'access-control-request-method',
  'connection',
  'content-length',
  'cookie',
  'cookie2',
  'date',
  'dnt',
  'expect',
  'host',
  'keep-alive',
  'origin',
  'referer',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'user-agent',
  'via'
];
ClientRequest.prototype.setHeader = function(name, value) {
  var self = this;
  var lowerName = name.toLowerCase();
    // This check is not necessary, but it prevents warnings from browsers about setting unsafe
    // headers. To be honest I'm not entirely sure hiding these warnings is a good thing, but
    // http-browserify did it, so I will too.
  if (unsafeHeaders.indexOf(lowerName) !== -1)
    return

  self._headers[lowerName] = {
    name: name,
    value: value
  };
};

ClientRequest.prototype.getHeader = function(name) {
  var self = this;
  return self._headers[name.toLowerCase()].value
};

ClientRequest.prototype.removeHeader = function(name) {
  var self = this;
  delete self._headers[name.toLowerCase()];
};

ClientRequest.prototype._onFinish = function() {
  var self = this;

  if (self._destroyed)
    return
  var opts = self._opts;

  var headersObj = self._headers;
  var body;
  if (opts.method === 'POST' || opts.method === 'PUT' || opts.method === 'PATCH') {
    if (blobConstructor()) {
      body = new global$1.Blob(self._body.map(function(buffer) {
        return toArrayBuffer(buffer)
      }), {
        type: (headersObj['content-type'] || {}).value || ''
      });
    } else {
      // get utf8 string
      body = Buffer.concat(self._body).toString();
    }
  }

  if (self._mode === 'fetch') {
    var headers = Object.keys(headersObj).map(function(name) {
      return [headersObj[name].name, headersObj[name].value]
    });

    global$1.fetch(self._opts.url, {
      method: self._opts.method,
      headers: headers,
      body: body,
      mode: 'cors',
      credentials: opts.withCredentials ? 'include' : 'same-origin'
    }).then(function(response) {
      self._fetchResponse = response;
      self._connect();
    }, function(reason) {
      self.emit('error', reason);
    });
  } else {
    var xhr = self._xhr = new global$1.XMLHttpRequest();
    try {
      xhr.open(self._opts.method, self._opts.url, true);
    } catch (err) {
      browser$1.nextTick(function() {
        self.emit('error', err);
      });
      return
    }

    // Can't set responseType on really old browsers
    if ('responseType' in xhr)
      xhr.responseType = self._mode.split(':')[0];

    if ('withCredentials' in xhr)
      xhr.withCredentials = !!opts.withCredentials;

    if (self._mode === 'text' && 'overrideMimeType' in xhr)
      xhr.overrideMimeType('text/plain; charset=x-user-defined');

    Object.keys(headersObj).forEach(function(name) {
      xhr.setRequestHeader(headersObj[name].name, headersObj[name].value);
    });

    self._response = null;
    xhr.onreadystatechange = function() {
      switch (xhr.readyState) {
      case rStates.LOADING:
      case rStates.DONE:
        self._onXHRProgress();
        break
      }
    };
      // Necessary for streaming in Firefox, since xhr.response is ONLY defined
      // in onprogress, not in onreadystatechange with xhr.readyState = 3
    if (self._mode === 'moz-chunked-arraybuffer') {
      xhr.onprogress = function() {
        self._onXHRProgress();
      };
    }

    xhr.onerror = function() {
      if (self._destroyed)
        return
      self.emit('error', new Error('XHR error'));
    };

    try {
      xhr.send(body);
    } catch (err) {
      browser$1.nextTick(function() {
        self.emit('error', err);
      });
      return
    }
  }
};

/**
 * Checks if xhr.status is readable and non-zero, indicating no error.
 * Even though the spec says it should be available in readyState 3,
 * accessing it throws an exception in IE8
 */
function statusValid(xhr) {
  try {
    var status = xhr.status;
    return (status !== null && status !== 0)
  } catch (e) {
    return false
  }
}

ClientRequest.prototype._onXHRProgress = function() {
  var self = this;

  if (!statusValid(self._xhr) || self._destroyed)
    return

  if (!self._response)
    self._connect();

  self._response._onXHRProgress();
};

ClientRequest.prototype._connect = function() {
  var self = this;

  if (self._destroyed)
    return

  self._response = new IncomingMessage(self._xhr, self._fetchResponse, self._mode);
  self.emit('response', self._response);
};

ClientRequest.prototype._write = function(chunk, encoding, cb) {
  var self = this;

  self._body.push(chunk);
  cb();
};

ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function() {
  var self = this;
  self._destroyed = true;
  if (self._response)
    self._response._destroyed = true;
  if (self._xhr)
    self._xhr.abort();
    // Currently, there isn't a way to truly abort a fetch.
    // If you like bikeshedding, see https://github.com/whatwg/fetch/issues/27
};

ClientRequest.prototype.end = function(data, encoding, cb) {
  var self = this;
  if (typeof data === 'function') {
    cb = data;
    data = undefined;
  }

  Writable.prototype.end.call(self, data, encoding, cb);
};

ClientRequest.prototype.flushHeaders = function() {};
ClientRequest.prototype.setTimeout = function() {};
ClientRequest.prototype.setNoDelay = function() {};
ClientRequest.prototype.setSocketKeepAlive = function() {};

/*! https://mths.be/punycode v1.4.1 by @mathias */


/** Highest positive signed 32-bit float value */
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

/** Bootstring parameters */
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\x20-\x7E]/; // unprintable ASCII chars + non-ASCII chars
var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

/** Error messages */
var errors = {
  'overflow': 'Overflow: input needs wider integers to process',
  'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
  'invalid-input': 'Invalid input'
};

/** Convenience shortcuts */
var baseMinusTMin = base - tMin;
var floor = Math.floor;
var stringFromCharCode = String.fromCharCode;

/*--------------------------------------------------------------------------*/

/**
 * A generic error utility function.
 * @private
 * @param {String} type The error type.
 * @returns {Error} Throws a `RangeError` with the applicable error message.
 */
function error(type) {
  throw new RangeError(errors[type]);
}

/**
 * A generic `Array#map` utility function.
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} callback The function that gets called for every array
 * item.
 * @returns {Array} A new array of values returned by the callback function.
 */
function map$1(array, fn) {
  var length = array.length;
  var result = [];
  while (length--) {
    result[length] = fn(array[length]);
  }
  return result;
}

/**
 * A simple `Array#map`-like wrapper to work with domain name strings or email
 * addresses.
 * @private
 * @param {String} domain The domain name or email address.
 * @param {Function} callback The function that gets called for every
 * character.
 * @returns {Array} A new string of characters returned by the callback
 * function.
 */
function mapDomain(string, fn) {
  var parts = string.split('@');
  var result = '';
  if (parts.length > 1) {
    // In email addresses, only the domain name should be punycoded. Leave
    // the local part (i.e. everything up to `@`) intact.
    result = parts[0] + '@';
    string = parts[1];
  }
  // Avoid `split(regex)` for IE8 compatibility. See #17.
  string = string.replace(regexSeparators, '\x2E');
  var labels = string.split('.');
  var encoded = map$1(labels, fn).join('.');
  return result + encoded;
}

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 * @see `punycode.ucs2.encode`
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode.ucs2
 * @name decode
 * @param {String} string The Unicode input string (UCS-2).
 * @returns {Array} The new array of code points.
 */
function ucs2decode(string) {
  var output = [],
    counter = 0,
    length = string.length,
    value,
    extra;
  while (counter < length) {
    value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // high surrogate, and there is a next character
      extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) == 0xDC00) { // low surrogate
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // unmatched surrogate; only append this code unit, in case the next
        // code unit is the high surrogate of a surrogate pair
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
}

/**
 * Converts a digit/integer into a basic code point.
 * @see `basicToDigit()`
 * @private
 * @param {Number} digit The numeric value of a basic code point.
 * @returns {Number} The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */
function digitToBasic(digit, flag) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
}

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 * @private
 */
function adapt(delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  for ( /* no initialization */ ; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor(delta / baseMinusTMin);
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
}

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 * @memberOf punycode
 * @param {String} input The string of Unicode symbols.
 * @returns {String} The resulting Punycode string of ASCII-only symbols.
 */
function encode(input) {
  var n,
    delta,
    handledCPCount,
    basicLength,
    bias,
    j,
    m,
    q,
    k,
    t,
    currentValue,
    output = [],
    /** `inputLength` will hold the number of code points in `input`. */
    inputLength,
    /** Cached calculation results */
    handledCPCountPlusOne,
    baseMinusT,
    qMinusT;

  // Convert the input in UCS-2 to Unicode
  input = ucs2decode(input);

  // Cache the length
  inputLength = input.length;

  // Initialize the state
  n = initialN;
  delta = 0;
  bias = initialBias;

  // Handle the basic code points
  for (j = 0; j < inputLength; ++j) {
    currentValue = input[j];
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  handledCPCount = basicLength = output.length;

  // `handledCPCount` is the number of code points that have been handled;
  // `basicLength` is the number of basic code points.

  // Finish the basic string - if it is not empty - with a delimiter
  if (basicLength) {
    output.push(delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {

    // All non-basic code points < n have been handled already. Find the next
    // larger one:
    for (m = maxInt, j = 0; j < inputLength; ++j) {
      currentValue = input[j];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
    // but guard against overflow
    handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      error('overflow');
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (j = 0; j < inputLength; ++j) {
      currentValue = input[j];

      if (currentValue < n && ++delta > maxInt) {
        error('overflow');
      }

      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer
        for (q = delta, k = base; /* no condition */ ; k += base) {
          t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) {
            break;
          }
          qMinusT = q - t;
          baseMinusT = base - t;
          output.push(
            stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
          );
          q = floor(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q, 0)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;

  }
  return output.join('');
}

/**
 * Converts a Unicode string representing a domain name or an email address to
 * Punycode. Only the non-ASCII parts of the domain name will be converted,
 * i.e. it doesn't matter if you call it with a domain that's already in
 * ASCII.
 * @memberOf punycode
 * @param {String} input The domain name or email address to convert, as a
 * Unicode string.
 * @returns {String} The Punycode representation of the given domain name or
 * email address.
 */
function toASCII(input) {
  return mapDomain(input, function(string) {
    return regexNonASCII.test(string) ?
      'xn--' + encode(string) :
      string;
  });
}

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};
function stringifyPrimitive(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
}

function stringify (obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
}
function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

function parse$1(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
}

// Copyright Joyent, Inc. and other Node contributors.
var _polyfillNode_url = {
  parse: urlParse,
  resolve: urlResolve,
  resolveObject: urlResolveObject,
  fileURLToPath: urlFileURLToPath,
  format: urlFormat,
  Url: Url
};
function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
  portPattern = /:[0-9]*$/,

  // Special case for a simple path URL
  simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

  // RFC 2396: characters reserved for delimiting URLs.
  // We actually just auto-escape these.
  delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

  // RFC 2396: characters not allowed for various reasons.
  unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

  // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
  autoEscape = ['\''].concat(unwise),
  // Characters that are never ever allowed in a hostname.
  // Note that any invalid chars are also handled, but these
  // are the ones that are *expected* to be seen, so we fast-path
  // them.
  nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
  hostEndingChars = ['/', '?', '#'],
  hostnameMaxLen = 255,
  hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
  hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
  // protocols that can allow "unsafe" and "unwise" chars.
  unsafeProtocol = {
    'javascript': true,
    'javascript:': true
  },
  // protocols that never have a hostname.
  hostlessProtocol = {
    'javascript': true,
    'javascript:': true
  },
  // protocols that always contain a // bit.
  slashedProtocol = {
    'http': true,
    'https': true,
    'ftp': true,
    'gopher': true,
    'file': true,
    'http:': true,
    'https:': true,
    'ftp:': true,
    'gopher:': true,
    'file:': true
  };

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}
Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  return parse(this, url, parseQueryString, slashesDenoteHost);
};

function parse(self, url, parseQueryString, slashesDenoteHost) {
  if (!isString(url)) {
    throw new TypeError('Parameter \'url\' must be a string, not ' + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
    splitter =
    (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
    uSplit = url.split(splitter),
    slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      self.path = rest;
      self.href = rest;
      self.pathname = simplePath[1];
      if (simplePath[2]) {
        self.search = simplePath[2];
        if (parseQueryString) {
          self.query = parse$1(self.search.substr(1));
        } else {
          self.query = self.search.substr(1);
        }
      } else if (parseQueryString) {
        self.search = '';
        self.query = {};
      }
      return self;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    self.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      self.slashes = true;
    }
  }
  var i, hec, l, p;
  if (!hostlessProtocol[proto] &&
    (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (i = 0; i < hostEndingChars.length; i++) {
      hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      self.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (i = 0; i < nonHostChars.length; i++) {
      hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    self.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    parseHost(self);

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    self.hostname = self.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = self.hostname[0] === '[' &&
      self.hostname[self.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = self.hostname.split(/\./);
      for (i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            self.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (self.hostname.length > hostnameMaxLen) {
      self.hostname = '';
    } else {
      // hostnames are always lower case.
      self.hostname = self.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      self.hostname = toASCII(self.hostname);
    }

    p = self.port ? ':' + self.port : '';
    var h = self.hostname || '';
    self.host = h + p;
    self.href += self.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      self.hostname = self.hostname.substr(1, self.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    self.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    self.search = rest.substr(qm);
    self.query = rest.substr(qm + 1);
    if (parseQueryString) {
      self.query = parse$1(self.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    self.search = '';
    self.query = {};
  }
  if (rest) self.pathname = rest;
  if (slashedProtocol[lowerProto] &&
    self.hostname && !self.pathname) {
    self.pathname = '/';
  }

  //to support http.request
  if (self.pathname || self.search) {
    p = self.pathname || '';
    var s = self.search || '';
    self.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  self.href = format(self);
  return self;
}

function urlFileURLToPath(path) {
  if (typeof path === 'string')
    path = new Url().parse(path);
  else if (!(path instanceof Url))
    throw new TypeError('The "path" argument must be of type string or an instance of URL. Received type ' + (typeof path) + String(path));
  if (path.protocol !== 'file:')
    throw new TypeError('The URL must be of scheme file');
  return getPathFromURLPosix(path);
}

function getPathFromURLPosix(url) {
  const pathname = url.pathname;
  for (let n = 0; n < pathname.length; n++) {
    if (pathname[n] === '%') {
      const third = pathname.codePointAt(n + 2) | 0x20;
      if (pathname[n + 1] === '2' && third === 102) {
        throw new TypeError(
          'must not include encoded / characters'
        );
      }
    }
  }
  return decodeURIComponent(pathname);
}

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (isString(obj)) obj = parse({}, obj);
  return format(obj);
}

function format(self) {
  var auth = self.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = self.protocol || '',
    pathname = self.pathname || '',
    hash = self.hash || '',
    host = false,
    query = '';

  if (self.host) {
    host = auth + self.host;
  } else if (self.hostname) {
    host = auth + (self.hostname.indexOf(':') === -1 ?
      self.hostname :
      '[' + this.hostname + ']');
    if (self.port) {
      host += ':' + self.port;
    }
  }

  if (self.query &&
    isObject(self.query) &&
    Object.keys(self.query).length) {
    query = stringify(self.query);
  }

  var search = self.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (self.slashes ||
    (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
}

Url.prototype.format = function() {
  return format(this);
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
      result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }
  var relPath;
  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
    isRelAbs = (
      relative.host ||
      relative.pathname && relative.pathname.charAt(0) === '/'
    ),
    mustEndAbs = (isRelAbs || isSourceAbs ||
      (result.host && relative.pathname)),
    removeAllDots = mustEndAbs,
    srcPath = result.pathname && result.pathname.split('/') || [],
    psychotic = result.protocol && !slashedProtocol[result.protocol];
  relPath = relative.pathname && relative.pathname.split('/') || [];
  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }
  var authInHost;
  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
      relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      authInHost = result.host && result.host.indexOf('@') > 0 ?
        result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!isNull(result.pathname) || !isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
        (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
    (result.host || relative.host || srcPath.length > 1) &&
    (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
    (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
    (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
      srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    authInHost = result.host && result.host.indexOf('@') > 0 ?
      result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!isNull(result.pathname) || !isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
      (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  return parseHost(this);
};

function parseHost(self) {
  var host = self.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      self.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) self.hostname = host;
}

var _polyfillNode_url$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	parse: urlParse,
	resolve: urlResolve,
	resolveObject: urlResolveObject,
	fileURLToPath: urlFileURLToPath,
	format: urlFormat,
	default: _polyfillNode_url,
	Url: Url
});

function request$1(opts, cb) {
  if (typeof opts === 'string')
    opts = urlParse(opts);


  // Normally, the page is loaded from http or https, so not specifying a protocol
  // will result in a (valid) protocol-relative url. However, this won't work if
  // the protocol is something else, like 'file:'
  var defaultProtocol = global$1.location.protocol.search(/^https?:$/) === -1 ? 'http:' : '';

  var protocol = opts.protocol || defaultProtocol;
  var host = opts.hostname || opts.host;
  var port = opts.port;
  var path = opts.path || '/';

  // Necessary for IPv6 addresses
  if (host && host.indexOf(':') !== -1)
    host = '[' + host + ']';

  // This may be a relative url. The browser should always be able to interpret it correctly.
  opts.url = (host ? (protocol + '//' + host) : '') + (port ? ':' + port : '') + path;
  opts.method = (opts.method || 'GET').toUpperCase();
  opts.headers = opts.headers || {};

  // Also valid opts.auth, opts.mode

  var req = new ClientRequest(opts);
  if (cb)
    req.on('response', cb);
  return req
}

function get$1(opts, cb) {
  var req = request$1(opts, cb);
  req.end();
  return req
}

function Agent$1() {}
Agent$1.defaultMaxSockets = 4;

var METHODS$1 = [
  'CHECKOUT',
  'CONNECT',
  'COPY',
  'DELETE',
  'GET',
  'HEAD',
  'LOCK',
  'M-SEARCH',
  'MERGE',
  'MKACTIVITY',
  'MKCOL',
  'MOVE',
  'NOTIFY',
  'OPTIONS',
  'PATCH',
  'POST',
  'PROPFIND',
  'PROPPATCH',
  'PURGE',
  'PUT',
  'REPORT',
  'SEARCH',
  'SUBSCRIBE',
  'TRACE',
  'UNLOCK',
  'UNSUBSCRIBE'
];
var STATUS_CODES$1 = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing', // RFC 2518, obsoleted by RFC 4918
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status', // RFC 4918
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Moved Temporarily',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Time-out',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Request Entity Too Large',
  414: 'Request-URI Too Large',
  415: 'Unsupported Media Type',
  416: 'Requested Range Not Satisfiable',
  417: 'Expectation Failed',
  418: 'I\'m a teapot', // RFC 2324
  422: 'Unprocessable Entity', // RFC 4918
  423: 'Locked', // RFC 4918
  424: 'Failed Dependency', // RFC 4918
  425: 'Unordered Collection', // RFC 4918
  426: 'Upgrade Required', // RFC 2817
  428: 'Precondition Required', // RFC 6585
  429: 'Too Many Requests', // RFC 6585
  431: 'Request Header Fields Too Large', // RFC 6585
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Time-out',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates', // RFC 2295
  507: 'Insufficient Storage', // RFC 4918
  509: 'Bandwidth Limit Exceeded',
  510: 'Not Extended', // RFC 2774
  511: 'Network Authentication Required' // RFC 6585
};

var _polyfillNode_http = {
  request: request$1,
  get: get$1,
  Agent: Agent$1,
  METHODS: METHODS$1,
  STATUS_CODES: STATUS_CODES$1
};

var _polyfillNode_http$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	request: request$1,
	get: get$1,
	Agent: Agent$1,
	METHODS: METHODS$1,
	STATUS_CODES: STATUS_CODES$1,
	default: _polyfillNode_http
});

var require$$2 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_http$1);

function request(opts, cb) {
  if (typeof opts === 'string')
    opts = urlParse(opts);


  // Normally, the page is loaded from http or https, so not specifying a protocol
  // will result in a (valid) protocol-relative url. However, this won't work if
  // the protocol is something else, like 'file:'
  var defaultProtocol = global$1.location.protocol.search(/^https?:$/) === -1 ? 'http:' : '';

  var protocol = opts.protocol || defaultProtocol;
  var host = opts.hostname || opts.host;
  var port = opts.port;
  var path = opts.path || '/';

  // Necessary for IPv6 addresses
  if (host && host.indexOf(':') !== -1)
    host = '[' + host + ']';

  // This may be a relative url. The browser should always be able to interpret it correctly.
  opts.url = (host ? (protocol + '//' + host) : '') + (port ? ':' + port : '') + path;
  opts.method = (opts.method || 'GET').toUpperCase();
  opts.headers = opts.headers || {};

  // Also valid opts.auth, opts.mode

  var req = new ClientRequest(opts);
  if (cb)
    req.on('response', cb);
  return req
}

function get(opts, cb) {
  var req = request(opts, cb);
  req.end();
  return req
}

function Agent() {}
Agent.defaultMaxSockets = 4;

var METHODS = [
  'CHECKOUT',
  'CONNECT',
  'COPY',
  'DELETE',
  'GET',
  'HEAD',
  'LOCK',
  'M-SEARCH',
  'MERGE',
  'MKACTIVITY',
  'MKCOL',
  'MOVE',
  'NOTIFY',
  'OPTIONS',
  'PATCH',
  'POST',
  'PROPFIND',
  'PROPPATCH',
  'PURGE',
  'PUT',
  'REPORT',
  'SEARCH',
  'SUBSCRIBE',
  'TRACE',
  'UNLOCK',
  'UNSUBSCRIBE'
];
var STATUS_CODES = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing', // RFC 2518, obsoleted by RFC 4918
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status', // RFC 4918
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Moved Temporarily',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Time-out',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Request Entity Too Large',
  414: 'Request-URI Too Large',
  415: 'Unsupported Media Type',
  416: 'Requested Range Not Satisfiable',
  417: 'Expectation Failed',
  418: 'I\'m a teapot', // RFC 2324
  422: 'Unprocessable Entity', // RFC 4918
  423: 'Locked', // RFC 4918
  424: 'Failed Dependency', // RFC 4918
  425: 'Unordered Collection', // RFC 4918
  426: 'Upgrade Required', // RFC 2817
  428: 'Precondition Required', // RFC 6585
  429: 'Too Many Requests', // RFC 6585
  431: 'Request Header Fields Too Large', // RFC 6585
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Time-out',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates', // RFC 2295
  507: 'Insufficient Storage', // RFC 4918
  509: 'Bandwidth Limit Exceeded',
  510: 'Not Extended', // RFC 2774
  511: 'Network Authentication Required' // RFC 6585
};

var _polyfillNode_https = {
  request,
  get,
  Agent,
  METHODS,
  STATUS_CODES
};

var _polyfillNode_https$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	request: request,
	get: get,
	Agent: Agent,
	METHODS: METHODS,
	STATUS_CODES: STATUS_CODES,
	default: _polyfillNode_https
});

var require$$3 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_https$1);

var require$$4 = /*@__PURE__*/getAugmentedNamespace(_polyfillNode_url$1);

(function (module, exports) {
	(function webpackUniversalModuleDefinition(root, factory) {
		module.exports = factory();
	})(commonjsGlobal, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __w_pdfjs_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId]) {
	/******/ 			return installedModules[moduleId].exports;
	/******/ 		}
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			i: moduleId,
	/******/ 			l: false,
	/******/ 			exports: {}
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __w_pdfjs_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.l = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__w_pdfjs_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__w_pdfjs_require__.c = installedModules;
	/******/
	/******/ 	// define getter function for harmony exports
	/******/ 	__w_pdfjs_require__.d = function(exports, name, getter) {
	/******/ 		if(!__w_pdfjs_require__.o(exports, name)) {
	/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
	/******/ 		}
	/******/ 	};
	/******/
	/******/ 	// define __esModule on exports
	/******/ 	__w_pdfjs_require__.r = function(exports) {
	/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
	/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	/******/ 		}
	/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
	/******/ 	};
	/******/
	/******/ 	// create a fake namespace object
	/******/ 	// mode & 1: value is a module id, require it
	/******/ 	// mode & 2: merge all properties of value into the ns
	/******/ 	// mode & 4: return value when already ns object
	/******/ 	// mode & 8|1: behave like require
	/******/ 	__w_pdfjs_require__.t = function(value, mode) {
	/******/ 		if(mode & 1) value = __w_pdfjs_require__(value);
	/******/ 		if(mode & 8) return value;
	/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
	/******/ 		var ns = Object.create(null);
	/******/ 		__w_pdfjs_require__.r(ns);
	/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
	/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __w_pdfjs_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
	/******/ 		return ns;
	/******/ 	};
	/******/
	/******/ 	// getDefaultExport function for compatibility with non-harmony modules
	/******/ 	__w_pdfjs_require__.n = function(module) {
	/******/ 		var getter = module && module.__esModule ?
	/******/ 			function getDefault() { return module['default']; } :
	/******/ 			function getModuleExports() { return module; };
	/******/ 		__w_pdfjs_require__.d(getter, 'a', getter);
	/******/ 		return getter;
	/******/ 	};
	/******/
	/******/ 	// Object.prototype.hasOwnProperty.call
	/******/ 	__w_pdfjs_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__w_pdfjs_require__.p = "";
	/******/
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __w_pdfjs_require__(__w_pdfjs_require__.s = 0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	Object.defineProperty(exports, "addLinkAttributes", {
	  enumerable: true,
	  get: function () {
	    return _display_utils.addLinkAttributes;
	  }
	});
	Object.defineProperty(exports, "getFilenameFromUrl", {
	  enumerable: true,
	  get: function () {
	    return _display_utils.getFilenameFromUrl;
	  }
	});
	Object.defineProperty(exports, "LinkTarget", {
	  enumerable: true,
	  get: function () {
	    return _display_utils.LinkTarget;
	  }
	});
	Object.defineProperty(exports, "loadScript", {
	  enumerable: true,
	  get: function () {
	    return _display_utils.loadScript;
	  }
	});
	Object.defineProperty(exports, "PDFDateString", {
	  enumerable: true,
	  get: function () {
	    return _display_utils.PDFDateString;
	  }
	});
	Object.defineProperty(exports, "RenderingCancelledException", {
	  enumerable: true,
	  get: function () {
	    return _display_utils.RenderingCancelledException;
	  }
	});
	Object.defineProperty(exports, "build", {
	  enumerable: true,
	  get: function () {
	    return _api.build;
	  }
	});
	Object.defineProperty(exports, "getDocument", {
	  enumerable: true,
	  get: function () {
	    return _api.getDocument;
	  }
	});
	Object.defineProperty(exports, "LoopbackPort", {
	  enumerable: true,
	  get: function () {
	    return _api.LoopbackPort;
	  }
	});
	Object.defineProperty(exports, "PDFDataRangeTransport", {
	  enumerable: true,
	  get: function () {
	    return _api.PDFDataRangeTransport;
	  }
	});
	Object.defineProperty(exports, "PDFWorker", {
	  enumerable: true,
	  get: function () {
	    return _api.PDFWorker;
	  }
	});
	Object.defineProperty(exports, "version", {
	  enumerable: true,
	  get: function () {
	    return _api.version;
	  }
	});
	Object.defineProperty(exports, "CMapCompressionType", {
	  enumerable: true,
	  get: function () {
	    return _util.CMapCompressionType;
	  }
	});
	Object.defineProperty(exports, "createObjectURL", {
	  enumerable: true,
	  get: function () {
	    return _util.createObjectURL;
	  }
	});
	Object.defineProperty(exports, "createPromiseCapability", {
	  enumerable: true,
	  get: function () {
	    return _util.createPromiseCapability;
	  }
	});
	Object.defineProperty(exports, "createValidAbsoluteUrl", {
	  enumerable: true,
	  get: function () {
	    return _util.createValidAbsoluteUrl;
	  }
	});
	Object.defineProperty(exports, "InvalidPDFException", {
	  enumerable: true,
	  get: function () {
	    return _util.InvalidPDFException;
	  }
	});
	Object.defineProperty(exports, "MissingPDFException", {
	  enumerable: true,
	  get: function () {
	    return _util.MissingPDFException;
	  }
	});
	Object.defineProperty(exports, "OPS", {
	  enumerable: true,
	  get: function () {
	    return _util.OPS;
	  }
	});
	Object.defineProperty(exports, "PasswordResponses", {
	  enumerable: true,
	  get: function () {
	    return _util.PasswordResponses;
	  }
	});
	Object.defineProperty(exports, "PermissionFlag", {
	  enumerable: true,
	  get: function () {
	    return _util.PermissionFlag;
	  }
	});
	Object.defineProperty(exports, "removeNullCharacters", {
	  enumerable: true,
	  get: function () {
	    return _util.removeNullCharacters;
	  }
	});
	Object.defineProperty(exports, "shadow", {
	  enumerable: true,
	  get: function () {
	    return _util.shadow;
	  }
	});
	Object.defineProperty(exports, "UnexpectedResponseException", {
	  enumerable: true,
	  get: function () {
	    return _util.UnexpectedResponseException;
	  }
	});
	Object.defineProperty(exports, "UNSUPPORTED_FEATURES", {
	  enumerable: true,
	  get: function () {
	    return _util.UNSUPPORTED_FEATURES;
	  }
	});
	Object.defineProperty(exports, "Util", {
	  enumerable: true,
	  get: function () {
	    return _util.Util;
	  }
	});
	Object.defineProperty(exports, "VerbosityLevel", {
	  enumerable: true,
	  get: function () {
	    return _util.VerbosityLevel;
	  }
	});
	Object.defineProperty(exports, "AnnotationLayer", {
	  enumerable: true,
	  get: function () {
	    return _annotation_layer.AnnotationLayer;
	  }
	});
	Object.defineProperty(exports, "apiCompatibilityParams", {
	  enumerable: true,
	  get: function () {
	    return _api_compatibility.apiCompatibilityParams;
	  }
	});
	Object.defineProperty(exports, "GlobalWorkerOptions", {
	  enumerable: true,
	  get: function () {
	    return _worker_options.GlobalWorkerOptions;
	  }
	});
	Object.defineProperty(exports, "renderTextLayer", {
	  enumerable: true,
	  get: function () {
	    return _text_layer.renderTextLayer;
	  }
	});
	Object.defineProperty(exports, "SVGGraphics", {
	  enumerable: true,
	  get: function () {
	    return _svg.SVGGraphics;
	  }
	});

	var _display_utils = __w_pdfjs_require__(1);

	var _api = __w_pdfjs_require__(5);

	var _util = __w_pdfjs_require__(2);

	var _annotation_layer = __w_pdfjs_require__(16);

	var _api_compatibility = __w_pdfjs_require__(7);

	var _worker_options = __w_pdfjs_require__(10);

	var _text_layer = __w_pdfjs_require__(17);

	var _svg = __w_pdfjs_require__(18);
	{
	  const {
	    isNodeJS
	  } = __w_pdfjs_require__(4);

	  if (isNodeJS) {
	    const PDFNodeStream = __w_pdfjs_require__(19).PDFNodeStream;

	    (0, _api.setPDFNetworkStreamFactory)(params => {
	      return new PDFNodeStream(params);
	    });
	  } else {
	    const PDFNetworkStream = __w_pdfjs_require__(22).PDFNetworkStream;

	    let PDFFetchStream;

	    if ((0, _display_utils.isFetchSupported)()) {
	      PDFFetchStream = __w_pdfjs_require__(23).PDFFetchStream;
	    }

	    (0, _api.setPDFNetworkStreamFactory)(params => {
	      if (PDFFetchStream && (0, _display_utils.isValidFetchUrl)(params.url)) {
	        return new PDFFetchStream(params);
	      }

	      return new PDFNetworkStream(params);
	    });
	  }
	}

	/***/ }),
	/* 1 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.addLinkAttributes = addLinkAttributes;
	exports.getFilenameFromUrl = getFilenameFromUrl;
	exports.isFetchSupported = isFetchSupported;
	exports.isValidFetchUrl = isValidFetchUrl;
	exports.loadScript = loadScript;
	exports.deprecated = deprecated;
	exports.PDFDateString = exports.StatTimer = exports.DOMSVGFactory = exports.DOMCMapReaderFactory = exports.DOMCanvasFactory = exports.DEFAULT_LINK_REL = exports.LinkTarget = exports.RenderingCancelledException = exports.PageViewport = void 0;

	var _util = __w_pdfjs_require__(2);

	const DEFAULT_LINK_REL = "noopener noreferrer nofollow";
	exports.DEFAULT_LINK_REL = DEFAULT_LINK_REL;
	const SVG_NS = "http://www.w3.org/2000/svg";

	class DOMCanvasFactory {
	  create(width, height) {
	    if (width <= 0 || height <= 0) {
	      throw new Error("Invalid canvas size");
	    }

	    const canvas = document.createElement("canvas");
	    const context = canvas.getContext("2d");
	    canvas.width = width;
	    canvas.height = height;
	    return {
	      canvas,
	      context
	    };
	  }

	  reset(canvasAndContext, width, height) {
	    if (!canvasAndContext.canvas) {
	      throw new Error("Canvas is not specified");
	    }

	    if (width <= 0 || height <= 0) {
	      throw new Error("Invalid canvas size");
	    }

	    canvasAndContext.canvas.width = width;
	    canvasAndContext.canvas.height = height;
	  }

	  destroy(canvasAndContext) {
	    if (!canvasAndContext.canvas) {
	      throw new Error("Canvas is not specified");
	    }

	    canvasAndContext.canvas.width = 0;
	    canvasAndContext.canvas.height = 0;
	    canvasAndContext.canvas = null;
	    canvasAndContext.context = null;
	  }

	}

	exports.DOMCanvasFactory = DOMCanvasFactory;

	class DOMCMapReaderFactory {
	  constructor({
	    baseUrl = null,
	    isCompressed = false
	  }) {
	    this.baseUrl = baseUrl;
	    this.isCompressed = isCompressed;
	  }

	  async fetch({
	    name
	  }) {
	    if (!this.baseUrl) {
	      throw new Error('The CMap "baseUrl" parameter must be specified, ensure that ' + 'the "cMapUrl" and "cMapPacked" API parameters are provided.');
	    }

	    if (!name) {
	      throw new Error("CMap name must be specified.");
	    }

	    const url = this.baseUrl + name + (this.isCompressed ? ".bcmap" : "");
	    const compressionType = this.isCompressed ? _util.CMapCompressionType.BINARY : _util.CMapCompressionType.NONE;

	    if (isFetchSupported() && isValidFetchUrl(url, document.baseURI)) {
	      return fetch(url).then(async response => {
	        if (!response.ok) {
	          throw new Error(response.statusText);
	        }

	        let cMapData;

	        if (this.isCompressed) {
	          cMapData = new Uint8Array(await response.arrayBuffer());
	        } else {
	          cMapData = (0, _util.stringToBytes)(await response.text());
	        }

	        return {
	          cMapData,
	          compressionType
	        };
	      }).catch(reason => {
	        throw new Error(`Unable to load ${this.isCompressed ? "binary " : ""}` + `CMap at: ${url}`);
	      });
	    }

	    return new Promise((resolve, reject) => {
	      const request = new XMLHttpRequest();
	      request.open("GET", url, true);

	      if (this.isCompressed) {
	        request.responseType = "arraybuffer";
	      }

	      request.onreadystatechange = () => {
	        if (request.readyState !== XMLHttpRequest.DONE) {
	          return;
	        }

	        if (request.status === 200 || request.status === 0) {
	          let cMapData;

	          if (this.isCompressed && request.response) {
	            cMapData = new Uint8Array(request.response);
	          } else if (!this.isCompressed && request.responseText) {
	            cMapData = (0, _util.stringToBytes)(request.responseText);
	          }

	          if (cMapData) {
	            resolve({
	              cMapData,
	              compressionType
	            });
	            return;
	          }
	        }

	        reject(new Error(request.statusText));
	      };

	      request.send(null);
	    }).catch(reason => {
	      throw new Error(`Unable to load ${this.isCompressed ? "binary " : ""}` + `CMap at: ${url}`);
	    });
	  }

	}

	exports.DOMCMapReaderFactory = DOMCMapReaderFactory;

	class DOMSVGFactory {
	  create(width, height) {
	    (0, _util.assert)(width > 0 && height > 0, "Invalid SVG dimensions");
	    const svg = document.createElementNS(SVG_NS, "svg:svg");
	    svg.setAttribute("version", "1.1");
	    svg.setAttribute("width", width + "px");
	    svg.setAttribute("height", height + "px");
	    svg.setAttribute("preserveAspectRatio", "none");
	    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
	    return svg;
	  }

	  createElement(type) {
	    (0, _util.assert)(typeof type === "string", "Invalid SVG element type");
	    return document.createElementNS(SVG_NS, type);
	  }

	}

	exports.DOMSVGFactory = DOMSVGFactory;

	class PageViewport {
	  constructor({
	    viewBox,
	    scale,
	    rotation,
	    offsetX = 0,
	    offsetY = 0,
	    dontFlip = false
	  }) {
	    this.viewBox = viewBox;
	    this.scale = scale;
	    this.rotation = rotation;
	    this.offsetX = offsetX;
	    this.offsetY = offsetY;
	    const centerX = (viewBox[2] + viewBox[0]) / 2;
	    const centerY = (viewBox[3] + viewBox[1]) / 2;
	    let rotateA, rotateB, rotateC, rotateD;
	    rotation = rotation % 360;
	    rotation = rotation < 0 ? rotation + 360 : rotation;

	    switch (rotation) {
	      case 180:
	        rotateA = -1;
	        rotateB = 0;
	        rotateC = 0;
	        rotateD = 1;
	        break;

	      case 90:
	        rotateA = 0;
	        rotateB = 1;
	        rotateC = 1;
	        rotateD = 0;
	        break;

	      case 270:
	        rotateA = 0;
	        rotateB = -1;
	        rotateC = -1;
	        rotateD = 0;
	        break;

	      case 0:
	        rotateA = 1;
	        rotateB = 0;
	        rotateC = 0;
	        rotateD = -1;
	        break;

	      default:
	        throw new Error("PageViewport: Invalid rotation, must be a multiple of 90 degrees.");
	    }

	    if (dontFlip) {
	      rotateC = -rotateC;
	      rotateD = -rotateD;
	    }

	    let offsetCanvasX, offsetCanvasY;
	    let width, height;

	    if (rotateA === 0) {
	      offsetCanvasX = Math.abs(centerY - viewBox[1]) * scale + offsetX;
	      offsetCanvasY = Math.abs(centerX - viewBox[0]) * scale + offsetY;
	      width = Math.abs(viewBox[3] - viewBox[1]) * scale;
	      height = Math.abs(viewBox[2] - viewBox[0]) * scale;
	    } else {
	      offsetCanvasX = Math.abs(centerX - viewBox[0]) * scale + offsetX;
	      offsetCanvasY = Math.abs(centerY - viewBox[1]) * scale + offsetY;
	      width = Math.abs(viewBox[2] - viewBox[0]) * scale;
	      height = Math.abs(viewBox[3] - viewBox[1]) * scale;
	    }

	    this.transform = [rotateA * scale, rotateB * scale, rotateC * scale, rotateD * scale, offsetCanvasX - rotateA * scale * centerX - rotateC * scale * centerY, offsetCanvasY - rotateB * scale * centerX - rotateD * scale * centerY];
	    this.width = width;
	    this.height = height;
	  }

	  clone({
	    scale = this.scale,
	    rotation = this.rotation,
	    offsetX = this.offsetX,
	    offsetY = this.offsetY,
	    dontFlip = false
	  } = {}) {
	    return new PageViewport({
	      viewBox: this.viewBox.slice(),
	      scale,
	      rotation,
	      offsetX,
	      offsetY,
	      dontFlip
	    });
	  }

	  convertToViewportPoint(x, y) {
	    return _util.Util.applyTransform([x, y], this.transform);
	  }

	  convertToViewportRectangle(rect) {
	    const topLeft = _util.Util.applyTransform([rect[0], rect[1]], this.transform);

	    const bottomRight = _util.Util.applyTransform([rect[2], rect[3]], this.transform);

	    return [topLeft[0], topLeft[1], bottomRight[0], bottomRight[1]];
	  }

	  convertToPdfPoint(x, y) {
	    return _util.Util.applyInverseTransform([x, y], this.transform);
	  }

	}

	exports.PageViewport = PageViewport;

	class RenderingCancelledException extends _util.BaseException {
	  constructor(msg, type) {
	    super(msg);
	    this.type = type;
	  }

	}

	exports.RenderingCancelledException = RenderingCancelledException;
	const LinkTarget = {
	  NONE: 0,
	  SELF: 1,
	  BLANK: 2,
	  PARENT: 3,
	  TOP: 4
	};
	exports.LinkTarget = LinkTarget;

	function addLinkAttributes(link, {
	  url,
	  target,
	  rel,
	  enabled = true
	} = {}) {
	  (0, _util.assert)(url && typeof url === "string", 'addLinkAttributes: A valid "url" parameter must provided.');
	  const urlNullRemoved = (0, _util.removeNullCharacters)(url);

	  if (enabled) {
	    link.href = link.title = urlNullRemoved;
	  } else {
	    link.href = "";
	    link.title = `Disabled: ${urlNullRemoved}`;

	    link.onclick = () => {
	      return false;
	    };
	  }

	  let targetStr = "";

	  switch (target) {
	    case LinkTarget.NONE:
	      break;

	    case LinkTarget.SELF:
	      targetStr = "_self";
	      break;

	    case LinkTarget.BLANK:
	      targetStr = "_blank";
	      break;

	    case LinkTarget.PARENT:
	      targetStr = "_parent";
	      break;

	    case LinkTarget.TOP:
	      targetStr = "_top";
	      break;
	  }

	  link.target = targetStr;
	  link.rel = typeof rel === "string" ? rel : DEFAULT_LINK_REL;
	}

	function getFilenameFromUrl(url) {
	  const anchor = url.indexOf("#");
	  const query = url.indexOf("?");
	  const end = Math.min(anchor > 0 ? anchor : url.length, query > 0 ? query : url.length);
	  return url.substring(url.lastIndexOf("/", end) + 1, end);
	}

	class StatTimer {
	  constructor() {
	    this.started = Object.create(null);
	    this.times = [];
	  }

	  time(name) {
	    if (name in this.started) {
	      (0, _util.warn)(`Timer is already running for ${name}`);
	    }

	    this.started[name] = Date.now();
	  }

	  timeEnd(name) {
	    if (!(name in this.started)) {
	      (0, _util.warn)(`Timer has not been started for ${name}`);
	    }

	    this.times.push({
	      name,
	      start: this.started[name],
	      end: Date.now()
	    });
	    delete this.started[name];
	  }

	  toString() {
	    const outBuf = [];
	    let longest = 0;

	    for (const time of this.times) {
	      const name = time.name;

	      if (name.length > longest) {
	        longest = name.length;
	      }
	    }

	    for (const time of this.times) {
	      const duration = time.end - time.start;
	      outBuf.push(`${time.name.padEnd(longest)} ${duration}ms\n`);
	    }

	    return outBuf.join("");
	  }

	}

	exports.StatTimer = StatTimer;

	function isFetchSupported() {
	  return typeof fetch !== "undefined" && typeof Response !== "undefined" && "body" in Response.prototype && typeof ReadableStream !== "undefined";
	}

	function isValidFetchUrl(url, baseUrl) {
	  try {
	    const {
	      protocol
	    } = baseUrl ? new URL(url, baseUrl) : new URL(url);
	    return protocol === "http:" || protocol === "https:";
	  } catch (ex) {
	    return false;
	  }
	}

	function loadScript(src) {
	  return new Promise((resolve, reject) => {
	    const script = document.createElement("script");
	    script.src = src;
	    script.onload = resolve;

	    script.onerror = function () {
	      reject(new Error(`Cannot load script at: ${script.src}`));
	    };

	    (document.head || document.documentElement).appendChild(script);
	  });
	}

	function deprecated(details) {
	  console.log("Deprecated API usage: " + details);
	}

	let pdfDateStringRegex;

	class PDFDateString {
	  static toDateObject(input) {
	    if (!input || !(0, _util.isString)(input)) {
	      return null;
	    }

	    if (!pdfDateStringRegex) {
	      pdfDateStringRegex = new RegExp("^D:" + "(\\d{4})" + "(\\d{2})?" + "(\\d{2})?" + "(\\d{2})?" + "(\\d{2})?" + "(\\d{2})?" + "([Z|+|-])?" + "(\\d{2})?" + "'?" + "(\\d{2})?" + "'?");
	    }

	    const matches = pdfDateStringRegex.exec(input);

	    if (!matches) {
	      return null;
	    }

	    const year = parseInt(matches[1], 10);
	    let month = parseInt(matches[2], 10);
	    month = month >= 1 && month <= 12 ? month - 1 : 0;
	    let day = parseInt(matches[3], 10);
	    day = day >= 1 && day <= 31 ? day : 1;
	    let hour = parseInt(matches[4], 10);
	    hour = hour >= 0 && hour <= 23 ? hour : 0;
	    let minute = parseInt(matches[5], 10);
	    minute = minute >= 0 && minute <= 59 ? minute : 0;
	    let second = parseInt(matches[6], 10);
	    second = second >= 0 && second <= 59 ? second : 0;
	    const universalTimeRelation = matches[7] || "Z";
	    let offsetHour = parseInt(matches[8], 10);
	    offsetHour = offsetHour >= 0 && offsetHour <= 23 ? offsetHour : 0;
	    let offsetMinute = parseInt(matches[9], 10) || 0;
	    offsetMinute = offsetMinute >= 0 && offsetMinute <= 59 ? offsetMinute : 0;

	    if (universalTimeRelation === "-") {
	      hour += offsetHour;
	      minute += offsetMinute;
	    } else if (universalTimeRelation === "+") {
	      hour -= offsetHour;
	      minute -= offsetMinute;
	    }

	    return new Date(Date.UTC(year, month, day, hour, minute, second));
	  }

	}

	exports.PDFDateString = PDFDateString;

	/***/ }),
	/* 2 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.arrayByteLength = arrayByteLength;
	exports.arraysToBytes = arraysToBytes;
	exports.assert = assert;
	exports.bytesToString = bytesToString;
	exports.createPromiseCapability = createPromiseCapability;
	exports.getVerbosityLevel = getVerbosityLevel;
	exports.info = info;
	exports.isArrayBuffer = isArrayBuffer;
	exports.isArrayEqual = isArrayEqual;
	exports.isBool = isBool;
	exports.isEmptyObj = isEmptyObj;
	exports.isNum = isNum;
	exports.isString = isString;
	exports.isSameOrigin = isSameOrigin;
	exports.createValidAbsoluteUrl = createValidAbsoluteUrl;
	exports.removeNullCharacters = removeNullCharacters;
	exports.setVerbosityLevel = setVerbosityLevel;
	exports.shadow = shadow;
	exports.string32 = string32;
	exports.stringToBytes = stringToBytes;
	exports.stringToPDFString = stringToPDFString;
	exports.stringToUTF8String = stringToUTF8String;
	exports.utf8StringToString = utf8StringToString;
	exports.warn = warn;
	exports.unreachable = unreachable;
	exports.IsEvalSupportedCached = exports.IsLittleEndianCached = exports.createObjectURL = exports.FormatError = exports.Util = exports.UnknownErrorException = exports.UnexpectedResponseException = exports.TextRenderingMode = exports.StreamType = exports.PermissionFlag = exports.PasswordResponses = exports.PasswordException = exports.MissingPDFException = exports.InvalidPDFException = exports.AbortException = exports.CMapCompressionType = exports.ImageKind = exports.FontType = exports.AnnotationType = exports.AnnotationStateModelType = exports.AnnotationReviewState = exports.AnnotationReplyType = exports.AnnotationMarkedState = exports.AnnotationFlag = exports.AnnotationFieldFlag = exports.AnnotationBorderStyleType = exports.UNSUPPORTED_FEATURES = exports.VerbosityLevel = exports.OPS = exports.IDENTITY_MATRIX = exports.FONT_IDENTITY_MATRIX = exports.BaseException = void 0;

	__w_pdfjs_require__(3);

	const IDENTITY_MATRIX = [1, 0, 0, 1, 0, 0];
	exports.IDENTITY_MATRIX = IDENTITY_MATRIX;
	const FONT_IDENTITY_MATRIX = [0.001, 0, 0, 0.001, 0, 0];
	exports.FONT_IDENTITY_MATRIX = FONT_IDENTITY_MATRIX;
	const PermissionFlag = {
	  PRINT: 0x04,
	  MODIFY_CONTENTS: 0x08,
	  COPY: 0x10,
	  MODIFY_ANNOTATIONS: 0x20,
	  FILL_INTERACTIVE_FORMS: 0x100,
	  COPY_FOR_ACCESSIBILITY: 0x200,
	  ASSEMBLE: 0x400,
	  PRINT_HIGH_QUALITY: 0x800
	};
	exports.PermissionFlag = PermissionFlag;
	const TextRenderingMode = {
	  FILL: 0,
	  STROKE: 1,
	  FILL_STROKE: 2,
	  INVISIBLE: 3,
	  FILL_ADD_TO_PATH: 4,
	  STROKE_ADD_TO_PATH: 5,
	  FILL_STROKE_ADD_TO_PATH: 6,
	  ADD_TO_PATH: 7,
	  FILL_STROKE_MASK: 3,
	  ADD_TO_PATH_FLAG: 4
	};
	exports.TextRenderingMode = TextRenderingMode;
	const ImageKind = {
	  GRAYSCALE_1BPP: 1,
	  RGB_24BPP: 2,
	  RGBA_32BPP: 3
	};
	exports.ImageKind = ImageKind;
	const AnnotationType = {
	  TEXT: 1,
	  LINK: 2,
	  FREETEXT: 3,
	  LINE: 4,
	  SQUARE: 5,
	  CIRCLE: 6,
	  POLYGON: 7,
	  POLYLINE: 8,
	  HIGHLIGHT: 9,
	  UNDERLINE: 10,
	  SQUIGGLY: 11,
	  STRIKEOUT: 12,
	  STAMP: 13,
	  CARET: 14,
	  INK: 15,
	  POPUP: 16,
	  FILEATTACHMENT: 17,
	  SOUND: 18,
	  MOVIE: 19,
	  WIDGET: 20,
	  SCREEN: 21,
	  PRINTERMARK: 22,
	  TRAPNET: 23,
	  WATERMARK: 24,
	  THREED: 25,
	  REDACT: 26
	};
	exports.AnnotationType = AnnotationType;
	const AnnotationStateModelType = {
	  MARKED: "Marked",
	  REVIEW: "Review"
	};
	exports.AnnotationStateModelType = AnnotationStateModelType;
	const AnnotationMarkedState = {
	  MARKED: "Marked",
	  UNMARKED: "Unmarked"
	};
	exports.AnnotationMarkedState = AnnotationMarkedState;
	const AnnotationReviewState = {
	  ACCEPTED: "Accepted",
	  REJECTED: "Rejected",
	  CANCELLED: "Cancelled",
	  COMPLETED: "Completed",
	  NONE: "None"
	};
	exports.AnnotationReviewState = AnnotationReviewState;
	const AnnotationReplyType = {
	  GROUP: "Group",
	  REPLY: "R"
	};
	exports.AnnotationReplyType = AnnotationReplyType;
	const AnnotationFlag = {
	  INVISIBLE: 0x01,
	  HIDDEN: 0x02,
	  PRINT: 0x04,
	  NOZOOM: 0x08,
	  NOROTATE: 0x10,
	  NOVIEW: 0x20,
	  READONLY: 0x40,
	  LOCKED: 0x80,
	  TOGGLENOVIEW: 0x100,
	  LOCKEDCONTENTS: 0x200
	};
	exports.AnnotationFlag = AnnotationFlag;
	const AnnotationFieldFlag = {
	  READONLY: 0x0000001,
	  REQUIRED: 0x0000002,
	  NOEXPORT: 0x0000004,
	  MULTILINE: 0x0001000,
	  PASSWORD: 0x0002000,
	  NOTOGGLETOOFF: 0x0004000,
	  RADIO: 0x0008000,
	  PUSHBUTTON: 0x0010000,
	  COMBO: 0x0020000,
	  EDIT: 0x0040000,
	  SORT: 0x0080000,
	  FILESELECT: 0x0100000,
	  MULTISELECT: 0x0200000,
	  DONOTSPELLCHECK: 0x0400000,
	  DONOTSCROLL: 0x0800000,
	  COMB: 0x1000000,
	  RICHTEXT: 0x2000000,
	  RADIOSINUNISON: 0x2000000,
	  COMMITONSELCHANGE: 0x4000000
	};
	exports.AnnotationFieldFlag = AnnotationFieldFlag;
	const AnnotationBorderStyleType = {
	  SOLID: 1,
	  DASHED: 2,
	  BEVELED: 3,
	  INSET: 4,
	  UNDERLINE: 5
	};
	exports.AnnotationBorderStyleType = AnnotationBorderStyleType;
	const StreamType = {
	  UNKNOWN: "UNKNOWN",
	  FLATE: "FLATE",
	  LZW: "LZW",
	  DCT: "DCT",
	  JPX: "JPX",
	  JBIG: "JBIG",
	  A85: "A85",
	  AHX: "AHX",
	  CCF: "CCF",
	  RLX: "RLX"
	};
	exports.StreamType = StreamType;
	const FontType = {
	  UNKNOWN: "UNKNOWN",
	  TYPE1: "TYPE1",
	  TYPE1C: "TYPE1C",
	  CIDFONTTYPE0: "CIDFONTTYPE0",
	  CIDFONTTYPE0C: "CIDFONTTYPE0C",
	  TRUETYPE: "TRUETYPE",
	  CIDFONTTYPE2: "CIDFONTTYPE2",
	  TYPE3: "TYPE3",
	  OPENTYPE: "OPENTYPE",
	  TYPE0: "TYPE0",
	  MMTYPE1: "MMTYPE1"
	};
	exports.FontType = FontType;
	const VerbosityLevel = {
	  ERRORS: 0,
	  WARNINGS: 1,
	  INFOS: 5
	};
	exports.VerbosityLevel = VerbosityLevel;
	const CMapCompressionType = {
	  NONE: 0,
	  BINARY: 1,
	  STREAM: 2
	};
	exports.CMapCompressionType = CMapCompressionType;
	const OPS = {
	  dependency: 1,
	  setLineWidth: 2,
	  setLineCap: 3,
	  setLineJoin: 4,
	  setMiterLimit: 5,
	  setDash: 6,
	  setRenderingIntent: 7,
	  setFlatness: 8,
	  setGState: 9,
	  save: 10,
	  restore: 11,
	  transform: 12,
	  moveTo: 13,
	  lineTo: 14,
	  curveTo: 15,
	  curveTo2: 16,
	  curveTo3: 17,
	  closePath: 18,
	  rectangle: 19,
	  stroke: 20,
	  closeStroke: 21,
	  fill: 22,
	  eoFill: 23,
	  fillStroke: 24,
	  eoFillStroke: 25,
	  closeFillStroke: 26,
	  closeEOFillStroke: 27,
	  endPath: 28,
	  clip: 29,
	  eoClip: 30,
	  beginText: 31,
	  endText: 32,
	  setCharSpacing: 33,
	  setWordSpacing: 34,
	  setHScale: 35,
	  setLeading: 36,
	  setFont: 37,
	  setTextRenderingMode: 38,
	  setTextRise: 39,
	  moveText: 40,
	  setLeadingMoveText: 41,
	  setTextMatrix: 42,
	  nextLine: 43,
	  showText: 44,
	  showSpacedText: 45,
	  nextLineShowText: 46,
	  nextLineSetSpacingShowText: 47,
	  setCharWidth: 48,
	  setCharWidthAndBounds: 49,
	  setStrokeColorSpace: 50,
	  setFillColorSpace: 51,
	  setStrokeColor: 52,
	  setStrokeColorN: 53,
	  setFillColor: 54,
	  setFillColorN: 55,
	  setStrokeGray: 56,
	  setFillGray: 57,
	  setStrokeRGBColor: 58,
	  setFillRGBColor: 59,
	  setStrokeCMYKColor: 60,
	  setFillCMYKColor: 61,
	  shadingFill: 62,
	  beginInlineImage: 63,
	  beginImageData: 64,
	  endInlineImage: 65,
	  paintXObject: 66,
	  markPoint: 67,
	  markPointProps: 68,
	  beginMarkedContent: 69,
	  beginMarkedContentProps: 70,
	  endMarkedContent: 71,
	  beginCompat: 72,
	  endCompat: 73,
	  paintFormXObjectBegin: 74,
	  paintFormXObjectEnd: 75,
	  beginGroup: 76,
	  endGroup: 77,
	  beginAnnotations: 78,
	  endAnnotations: 79,
	  beginAnnotation: 80,
	  endAnnotation: 81,
	  paintJpegXObject: 82,
	  paintImageMaskXObject: 83,
	  paintImageMaskXObjectGroup: 84,
	  paintImageXObject: 85,
	  paintInlineImageXObject: 86,
	  paintInlineImageXObjectGroup: 87,
	  paintImageXObjectRepeat: 88,
	  paintImageMaskXObjectRepeat: 89,
	  paintSolidColorImageMask: 90,
	  constructPath: 91
	};
	exports.OPS = OPS;
	const UNSUPPORTED_FEATURES = {
	  unknown: "unknown",
	  forms: "forms",
	  javaScript: "javaScript",
	  smask: "smask",
	  shadingPattern: "shadingPattern",
	  font: "font",
	  errorTilingPattern: "errorTilingPattern",
	  errorExtGState: "errorExtGState",
	  errorXObject: "errorXObject",
	  errorFontLoadType3: "errorFontLoadType3",
	  errorFontState: "errorFontState",
	  errorFontMissing: "errorFontMissing",
	  errorFontTranslate: "errorFontTranslate",
	  errorColorSpace: "errorColorSpace",
	  errorOperatorList: "errorOperatorList",
	  errorFontToUnicode: "errorFontToUnicode",
	  errorFontLoadNative: "errorFontLoadNative",
	  errorFontGetPath: "errorFontGetPath"
	};
	exports.UNSUPPORTED_FEATURES = UNSUPPORTED_FEATURES;
	const PasswordResponses = {
	  NEED_PASSWORD: 1,
	  INCORRECT_PASSWORD: 2
	};
	exports.PasswordResponses = PasswordResponses;
	let verbosity = VerbosityLevel.WARNINGS;

	function setVerbosityLevel(level) {
	  if (Number.isInteger(level)) {
	    verbosity = level;
	  }
	}

	function getVerbosityLevel() {
	  return verbosity;
	}

	function info(msg) {
	  if (verbosity >= VerbosityLevel.INFOS) {
	    console.log(`Info: ${msg}`);
	  }
	}

	function warn(msg) {
	  if (verbosity >= VerbosityLevel.WARNINGS) {
	    console.log(`Warning: ${msg}`);
	  }
	}

	function unreachable(msg) {
	  throw new Error(msg);
	}

	function assert(cond, msg) {
	  if (!cond) {
	    unreachable(msg);
	  }
	}

	function isSameOrigin(baseUrl, otherUrl) {
	  let base;

	  try {
	    base = new URL(baseUrl);

	    if (!base.origin || base.origin === "null") {
	      return false;
	    }
	  } catch (e) {
	    return false;
	  }

	  const other = new URL(otherUrl, base);
	  return base.origin === other.origin;
	}

	function _isValidProtocol(url) {
	  if (!url) {
	    return false;
	  }

	  switch (url.protocol) {
	    case "http:":
	    case "https:":
	    case "ftp:":
	    case "mailto:":
	    case "tel:":
	      return true;

	    default:
	      return false;
	  }
	}

	function createValidAbsoluteUrl(url, baseUrl) {
	  if (!url) {
	    return null;
	  }

	  try {
	    const absoluteUrl = baseUrl ? new URL(url, baseUrl) : new URL(url);

	    if (_isValidProtocol(absoluteUrl)) {
	      return absoluteUrl;
	    }
	  } catch (ex) {}

	  return null;
	}

	function shadow(obj, prop, value) {
	  Object.defineProperty(obj, prop, {
	    value,
	    enumerable: true,
	    configurable: true,
	    writable: false
	  });
	  return value;
	}

	const BaseException = function BaseExceptionClosure() {
	  function BaseException(message) {
	    if (this.constructor === BaseException) {
	      unreachable("Cannot initialize BaseException.");
	    }

	    this.message = message;
	    this.name = this.constructor.name;
	  }

	  BaseException.prototype = new Error();
	  BaseException.constructor = BaseException;
	  return BaseException;
	}();

	exports.BaseException = BaseException;

	class PasswordException extends BaseException {
	  constructor(msg, code) {
	    super(msg);
	    this.code = code;
	  }

	}

	exports.PasswordException = PasswordException;

	class UnknownErrorException extends BaseException {
	  constructor(msg, details) {
	    super(msg);
	    this.details = details;
	  }

	}

	exports.UnknownErrorException = UnknownErrorException;

	class InvalidPDFException extends BaseException {}

	exports.InvalidPDFException = InvalidPDFException;

	class MissingPDFException extends BaseException {}

	exports.MissingPDFException = MissingPDFException;

	class UnexpectedResponseException extends BaseException {
	  constructor(msg, status) {
	    super(msg);
	    this.status = status;
	  }

	}

	exports.UnexpectedResponseException = UnexpectedResponseException;

	class FormatError extends BaseException {}

	exports.FormatError = FormatError;

	class AbortException extends BaseException {}

	exports.AbortException = AbortException;
	const NullCharactersRegExp = /\x00/g;

	function removeNullCharacters(str) {
	  if (typeof str !== "string") {
	    warn("The argument for removeNullCharacters must be a string.");
	    return str;
	  }

	  return str.replace(NullCharactersRegExp, "");
	}

	function bytesToString(bytes) {
	  assert(bytes !== null && typeof bytes === "object" && bytes.length !== undefined, "Invalid argument for bytesToString");
	  const length = bytes.length;
	  const MAX_ARGUMENT_COUNT = 8192;

	  if (length < MAX_ARGUMENT_COUNT) {
	    return String.fromCharCode.apply(null, bytes);
	  }

	  const strBuf = [];

	  for (let i = 0; i < length; i += MAX_ARGUMENT_COUNT) {
	    const chunkEnd = Math.min(i + MAX_ARGUMENT_COUNT, length);
	    const chunk = bytes.subarray(i, chunkEnd);
	    strBuf.push(String.fromCharCode.apply(null, chunk));
	  }

	  return strBuf.join("");
	}

	function stringToBytes(str) {
	  assert(typeof str === "string", "Invalid argument for stringToBytes");
	  const length = str.length;
	  const bytes = new Uint8Array(length);

	  for (let i = 0; i < length; ++i) {
	    bytes[i] = str.charCodeAt(i) & 0xff;
	  }

	  return bytes;
	}

	function arrayByteLength(arr) {
	  if (arr.length !== undefined) {
	    return arr.length;
	  }

	  assert(arr.byteLength !== undefined, "arrayByteLength - invalid argument.");
	  return arr.byteLength;
	}

	function arraysToBytes(arr) {
	  const length = arr.length;

	  if (length === 1 && arr[0] instanceof Uint8Array) {
	    return arr[0];
	  }

	  let resultLength = 0;

	  for (let i = 0; i < length; i++) {
	    resultLength += arrayByteLength(arr[i]);
	  }

	  let pos = 0;
	  const data = new Uint8Array(resultLength);

	  for (let i = 0; i < length; i++) {
	    let item = arr[i];

	    if (!(item instanceof Uint8Array)) {
	      if (typeof item === "string") {
	        item = stringToBytes(item);
	      } else {
	        item = new Uint8Array(item);
	      }
	    }

	    const itemLength = item.byteLength;
	    data.set(item, pos);
	    pos += itemLength;
	  }

	  return data;
	}

	function string32(value) {
	  return String.fromCharCode(value >> 24 & 0xff, value >> 16 & 0xff, value >> 8 & 0xff, value & 0xff);
	}

	function isLittleEndian() {
	  const buffer8 = new Uint8Array(4);
	  buffer8[0] = 1;
	  const view32 = new Uint32Array(buffer8.buffer, 0, 1);
	  return view32[0] === 1;
	}

	const IsLittleEndianCached = {
	  get value() {
	    return shadow(this, "value", isLittleEndian());
	  }

	};
	exports.IsLittleEndianCached = IsLittleEndianCached;

	function isEvalSupported() {
	  try {
	    new Function("");
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	const IsEvalSupportedCached = {
	  get value() {
	    return shadow(this, "value", isEvalSupported());
	  }

	};
	exports.IsEvalSupportedCached = IsEvalSupportedCached;
	const rgbBuf = ["rgb(", 0, ",", 0, ",", 0, ")"];

	class Util {
	  static makeCssRgb(r, g, b) {
	    rgbBuf[1] = r;
	    rgbBuf[3] = g;
	    rgbBuf[5] = b;
	    return rgbBuf.join("");
	  }

	  static transform(m1, m2) {
	    return [m1[0] * m2[0] + m1[2] * m2[1], m1[1] * m2[0] + m1[3] * m2[1], m1[0] * m2[2] + m1[2] * m2[3], m1[1] * m2[2] + m1[3] * m2[3], m1[0] * m2[4] + m1[2] * m2[5] + m1[4], m1[1] * m2[4] + m1[3] * m2[5] + m1[5]];
	  }

	  static applyTransform(p, m) {
	    const xt = p[0] * m[0] + p[1] * m[2] + m[4];
	    const yt = p[0] * m[1] + p[1] * m[3] + m[5];
	    return [xt, yt];
	  }

	  static applyInverseTransform(p, m) {
	    const d = m[0] * m[3] - m[1] * m[2];
	    const xt = (p[0] * m[3] - p[1] * m[2] + m[2] * m[5] - m[4] * m[3]) / d;
	    const yt = (-p[0] * m[1] + p[1] * m[0] + m[4] * m[1] - m[5] * m[0]) / d;
	    return [xt, yt];
	  }

	  static getAxialAlignedBoundingBox(r, m) {
	    const p1 = Util.applyTransform(r, m);
	    const p2 = Util.applyTransform(r.slice(2, 4), m);
	    const p3 = Util.applyTransform([r[0], r[3]], m);
	    const p4 = Util.applyTransform([r[2], r[1]], m);
	    return [Math.min(p1[0], p2[0], p3[0], p4[0]), Math.min(p1[1], p2[1], p3[1], p4[1]), Math.max(p1[0], p2[0], p3[0], p4[0]), Math.max(p1[1], p2[1], p3[1], p4[1])];
	  }

	  static inverseTransform(m) {
	    const d = m[0] * m[3] - m[1] * m[2];
	    return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[4] * m[3]) / d, (m[4] * m[1] - m[5] * m[0]) / d];
	  }

	  static apply3dTransform(m, v) {
	    return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
	  }

	  static singularValueDecompose2dScale(m) {
	    const transpose = [m[0], m[2], m[1], m[3]];
	    const a = m[0] * transpose[0] + m[1] * transpose[2];
	    const b = m[0] * transpose[1] + m[1] * transpose[3];
	    const c = m[2] * transpose[0] + m[3] * transpose[2];
	    const d = m[2] * transpose[1] + m[3] * transpose[3];
	    const first = (a + d) / 2;
	    const second = Math.sqrt((a + d) * (a + d) - 4 * (a * d - c * b)) / 2;
	    const sx = first + second || 1;
	    const sy = first - second || 1;
	    return [Math.sqrt(sx), Math.sqrt(sy)];
	  }

	  static normalizeRect(rect) {
	    const r = rect.slice(0);

	    if (rect[0] > rect[2]) {
	      r[0] = rect[2];
	      r[2] = rect[0];
	    }

	    if (rect[1] > rect[3]) {
	      r[1] = rect[3];
	      r[3] = rect[1];
	    }

	    return r;
	  }

	  static intersect(rect1, rect2) {
	    function compare(a, b) {
	      return a - b;
	    }

	    const orderedX = [rect1[0], rect1[2], rect2[0], rect2[2]].sort(compare);
	    const orderedY = [rect1[1], rect1[3], rect2[1], rect2[3]].sort(compare);
	    const result = [];
	    rect1 = Util.normalizeRect(rect1);
	    rect2 = Util.normalizeRect(rect2);

	    if (orderedX[0] === rect1[0] && orderedX[1] === rect2[0] || orderedX[0] === rect2[0] && orderedX[1] === rect1[0]) {
	      result[0] = orderedX[1];
	      result[2] = orderedX[2];
	    } else {
	      return null;
	    }

	    if (orderedY[0] === rect1[1] && orderedY[1] === rect2[1] || orderedY[0] === rect2[1] && orderedY[1] === rect1[1]) {
	      result[1] = orderedY[1];
	      result[3] = orderedY[2];
	    } else {
	      return null;
	    }

	    return result;
	  }

	}

	exports.Util = Util;
	const PDFStringTranslateTable = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x2D8, 0x2C7, 0x2C6, 0x2D9, 0x2DD, 0x2DB, 0x2DA, 0x2DC, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x2022, 0x2020, 0x2021, 0x2026, 0x2014, 0x2013, 0x192, 0x2044, 0x2039, 0x203A, 0x2212, 0x2030, 0x201E, 0x201C, 0x201D, 0x2018, 0x2019, 0x201A, 0x2122, 0xFB01, 0xFB02, 0x141, 0x152, 0x160, 0x178, 0x17D, 0x131, 0x142, 0x153, 0x161, 0x17E, 0, 0x20AC];

	function stringToPDFString(str) {
	  const length = str.length,
	        strBuf = [];

	  if (str[0] === "\xFE" && str[1] === "\xFF") {
	    for (let i = 2; i < length; i += 2) {
	      strBuf.push(String.fromCharCode(str.charCodeAt(i) << 8 | str.charCodeAt(i + 1)));
	    }
	  } else if (str[0] === "\xFF" && str[1] === "\xFE") {
	    for (let i = 2; i < length; i += 2) {
	      strBuf.push(String.fromCharCode(str.charCodeAt(i + 1) << 8 | str.charCodeAt(i)));
	    }
	  } else {
	    for (let i = 0; i < length; ++i) {
	      const code = PDFStringTranslateTable[str.charCodeAt(i)];
	      strBuf.push(code ? String.fromCharCode(code) : str.charAt(i));
	    }
	  }

	  return strBuf.join("");
	}

	function stringToUTF8String(str) {
	  return decodeURIComponent(escape(str));
	}

	function utf8StringToString(str) {
	  return unescape(encodeURIComponent(str));
	}

	function isEmptyObj(obj) {
	  for (const key in obj) {
	    return false;
	  }

	  return true;
	}

	function isBool(v) {
	  return typeof v === "boolean";
	}

	function isNum(v) {
	  return typeof v === "number";
	}

	function isString(v) {
	  return typeof v === "string";
	}

	function isArrayBuffer(v) {
	  return typeof v === "object" && v !== null && v.byteLength !== undefined;
	}

	function isArrayEqual(arr1, arr2) {
	  if (arr1.length !== arr2.length) {
	    return false;
	  }

	  return arr1.every(function (element, index) {
	    return element === arr2[index];
	  });
	}

	function createPromiseCapability() {
	  const capability = Object.create(null);
	  let isSettled = false;
	  Object.defineProperty(capability, "settled", {
	    get() {
	      return isSettled;
	    }

	  });
	  capability.promise = new Promise(function (resolve, reject) {
	    capability.resolve = function (data) {
	      isSettled = true;
	      resolve(data);
	    };

	    capability.reject = function (reason) {
	      isSettled = true;
	      reject(reason);
	    };
	  });
	  return capability;
	}

	const createObjectURL = function createObjectURLClosure() {
	  const digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	  return function createObjectURL(data, contentType, forceDataSchema = false) {
	    if (!forceDataSchema && URL.createObjectURL) {
	      const blob = new Blob([data], {
	        type: contentType
	      });
	      return URL.createObjectURL(blob);
	    }

	    let buffer = `data:${contentType};base64,`;

	    for (let i = 0, ii = data.length; i < ii; i += 3) {
	      const b1 = data[i] & 0xff;
	      const b2 = data[i + 1] & 0xff;
	      const b3 = data[i + 2] & 0xff;
	      const d1 = b1 >> 2,
	            d2 = (b1 & 3) << 4 | b2 >> 4;
	      const d3 = i + 1 < ii ? (b2 & 0xf) << 2 | b3 >> 6 : 64;
	      const d4 = i + 2 < ii ? b3 & 0x3f : 64;
	      buffer += digits[d1] + digits[d2] + digits[d3] + digits[d4];
	    }

	    return buffer;
	  };
	}();

	exports.createObjectURL = createObjectURL;

	/***/ }),
	/* 3 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	__w_pdfjs_require__(4);

	/***/ }),
	/* 4 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.isNodeJS = void 0;
	const isNodeJS = typeof browser$1 === "object" && browser$1 + "" === "[object process]" && !browser$1.versions.nw && !browser$1.versions.electron;
	exports.isNodeJS = isNodeJS;

	/***/ }),
	/* 5 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getDocument = getDocument;
	exports.setPDFNetworkStreamFactory = setPDFNetworkStreamFactory;
	exports.build = exports.version = exports.PDFPageProxy = exports.PDFDocumentProxy = exports.PDFWorker = exports.PDFDataRangeTransport = exports.LoopbackPort = void 0;

	var _util = __w_pdfjs_require__(2);

	var _display_utils = __w_pdfjs_require__(1);

	var _font_loader = __w_pdfjs_require__(6);

	var _api_compatibility = __w_pdfjs_require__(7);

	var _canvas = __w_pdfjs_require__(8);

	var _worker_options = __w_pdfjs_require__(10);

	var _is_node = __w_pdfjs_require__(4);

	var _message_handler = __w_pdfjs_require__(11);

	var _metadata = __w_pdfjs_require__(12);

	var _transport_stream = __w_pdfjs_require__(14);

	var _webgl = __w_pdfjs_require__(15);

	const DEFAULT_RANGE_CHUNK_SIZE = 65536;
	const RENDERING_CANCELLED_TIMEOUT = 100;
	let createPDFNetworkStream;

	function setPDFNetworkStreamFactory(pdfNetworkStreamFactory) {
	  createPDFNetworkStream = pdfNetworkStreamFactory;
	}

	function getDocument(src) {
	  const task = new PDFDocumentLoadingTask();
	  let source;

	  if (typeof src === "string") {
	    source = {
	      url: src
	    };
	  } else if ((0, _util.isArrayBuffer)(src)) {
	    source = {
	      data: src
	    };
	  } else if (src instanceof PDFDataRangeTransport) {
	    source = {
	      range: src
	    };
	  } else {
	    if (typeof src !== "object") {
	      throw new Error("Invalid parameter in getDocument, " + "need either Uint8Array, string or a parameter object");
	    }

	    if (!src.url && !src.data && !src.range) {
	      throw new Error("Invalid parameter object: need either .data, .range or .url");
	    }

	    source = src;
	  }

	  const params = Object.create(null);
	  let rangeTransport = null,
	      worker = null;

	  for (const key in source) {
	    if (key === "url" && typeof window !== "undefined") {
	      params[key] = new URL(source[key], window.location).href;
	      continue;
	    } else if (key === "range") {
	      rangeTransport = source[key];
	      continue;
	    } else if (key === "worker") {
	      worker = source[key];
	      continue;
	    } else if (key === "data" && !(source[key] instanceof Uint8Array)) {
	      const pdfBytes = source[key];

	      if (typeof pdfBytes === "string") {
	        params[key] = (0, _util.stringToBytes)(pdfBytes);
	      } else if (typeof pdfBytes === "object" && pdfBytes !== null && !isNaN(pdfBytes.length)) {
	        params[key] = new Uint8Array(pdfBytes);
	      } else if ((0, _util.isArrayBuffer)(pdfBytes)) {
	        params[key] = new Uint8Array(pdfBytes);
	      } else {
	        throw new Error("Invalid PDF binary data: either typed array, " + "string or array-like object is expected in the " + "data property.");
	      }

	      continue;
	    }

	    params[key] = source[key];
	  }

	  params.rangeChunkSize = params.rangeChunkSize || DEFAULT_RANGE_CHUNK_SIZE;
	  params.CMapReaderFactory = params.CMapReaderFactory || _display_utils.DOMCMapReaderFactory;
	  params.ignoreErrors = params.stopAtErrors !== true;
	  params.fontExtraProperties = params.fontExtraProperties === true;
	  params.pdfBug = params.pdfBug === true;

	  if (!Number.isInteger(params.maxImageSize)) {
	    params.maxImageSize = -1;
	  }

	  if (typeof params.isEvalSupported !== "boolean") {
	    params.isEvalSupported = true;
	  }

	  if (typeof params.disableFontFace !== "boolean") {
	    params.disableFontFace = _api_compatibility.apiCompatibilityParams.disableFontFace || false;
	  }

	  if (typeof params.disableRange !== "boolean") {
	    params.disableRange = false;
	  }

	  if (typeof params.disableStream !== "boolean") {
	    params.disableStream = false;
	  }

	  if (typeof params.disableAutoFetch !== "boolean") {
	    params.disableAutoFetch = false;
	  }

	  (0, _util.setVerbosityLevel)(params.verbosity);

	  if (!worker) {
	    const workerParams = {
	      verbosity: params.verbosity,
	      port: _worker_options.GlobalWorkerOptions.workerPort
	    };
	    worker = workerParams.port ? PDFWorker.fromPort(workerParams) : new PDFWorker(workerParams);
	    task._worker = worker;
	  }

	  const docId = task.docId;
	  worker.promise.then(function () {
	    if (task.destroyed) {
	      throw new Error("Loading aborted");
	    }

	    const workerIdPromise = _fetchDocument(worker, params, rangeTransport, docId);

	    const networkStreamPromise = new Promise(function (resolve) {
	      let networkStream;

	      if (rangeTransport) {
	        networkStream = new _transport_stream.PDFDataTransportStream({
	          length: params.length,
	          initialData: params.initialData,
	          progressiveDone: params.progressiveDone,
	          disableRange: params.disableRange,
	          disableStream: params.disableStream
	        }, rangeTransport);
	      } else if (!params.data) {
	        networkStream = createPDFNetworkStream({
	          url: params.url,
	          length: params.length,
	          httpHeaders: params.httpHeaders,
	          withCredentials: params.withCredentials,
	          rangeChunkSize: params.rangeChunkSize,
	          disableRange: params.disableRange,
	          disableStream: params.disableStream
	        });
	      }

	      resolve(networkStream);
	    });
	    return Promise.all([workerIdPromise, networkStreamPromise]).then(function ([workerId, networkStream]) {
	      if (task.destroyed) {
	        throw new Error("Loading aborted");
	      }

	      const messageHandler = new _message_handler.MessageHandler(docId, workerId, worker.port);
	      messageHandler.postMessageTransfers = worker.postMessageTransfers;
	      const transport = new WorkerTransport(messageHandler, task, networkStream, params);
	      task._transport = transport;
	      messageHandler.send("Ready", null);
	    });
	  }).catch(task._capability.reject);
	  return task;
	}

	function _fetchDocument(worker, source, pdfDataRangeTransport, docId) {
	  if (worker.destroyed) {
	    return Promise.reject(new Error("Worker was destroyed"));
	  }

	  if (pdfDataRangeTransport) {
	    source.length = pdfDataRangeTransport.length;
	    source.initialData = pdfDataRangeTransport.initialData;
	    source.progressiveDone = pdfDataRangeTransport.progressiveDone;
	  }

	  return worker.messageHandler.sendWithPromise("GetDocRequest", {
	    docId,
	    apiVersion: '2.5.207',
	    source: {
	      data: source.data,
	      url: source.url,
	      password: source.password,
	      disableAutoFetch: source.disableAutoFetch,
	      rangeChunkSize: source.rangeChunkSize,
	      length: source.length
	    },
	    maxImageSize: source.maxImageSize,
	    disableFontFace: source.disableFontFace,
	    postMessageTransfers: worker.postMessageTransfers,
	    docBaseUrl: source.docBaseUrl,
	    ignoreErrors: source.ignoreErrors,
	    isEvalSupported: source.isEvalSupported,
	    fontExtraProperties: source.fontExtraProperties
	  }).then(function (workerId) {
	    if (worker.destroyed) {
	      throw new Error("Worker was destroyed");
	    }

	    return workerId;
	  });
	}

	const PDFDocumentLoadingTask = function PDFDocumentLoadingTaskClosure() {
	  let nextDocumentId = 0;

	  class PDFDocumentLoadingTask {
	    constructor() {
	      this._capability = (0, _util.createPromiseCapability)();
	      this._transport = null;
	      this._worker = null;
	      this.docId = "d" + nextDocumentId++;
	      this.destroyed = false;
	      this.onPassword = null;
	      this.onProgress = null;
	      this.onUnsupportedFeature = null;
	    }

	    get promise() {
	      return this._capability.promise;
	    }

	    destroy() {
	      this.destroyed = true;
	      const transportDestroyed = !this._transport ? Promise.resolve() : this._transport.destroy();
	      return transportDestroyed.then(() => {
	        this._transport = null;

	        if (this._worker) {
	          this._worker.destroy();

	          this._worker = null;
	        }
	      });
	    }

	  }

	  return PDFDocumentLoadingTask;
	}();

	class PDFDataRangeTransport {
	  constructor(length, initialData, progressiveDone = false) {
	    this.length = length;
	    this.initialData = initialData;
	    this.progressiveDone = progressiveDone;
	    this._rangeListeners = [];
	    this._progressListeners = [];
	    this._progressiveReadListeners = [];
	    this._progressiveDoneListeners = [];
	    this._readyCapability = (0, _util.createPromiseCapability)();
	  }

	  addRangeListener(listener) {
	    this._rangeListeners.push(listener);
	  }

	  addProgressListener(listener) {
	    this._progressListeners.push(listener);
	  }

	  addProgressiveReadListener(listener) {
	    this._progressiveReadListeners.push(listener);
	  }

	  addProgressiveDoneListener(listener) {
	    this._progressiveDoneListeners.push(listener);
	  }

	  onDataRange(begin, chunk) {
	    for (const listener of this._rangeListeners) {
	      listener(begin, chunk);
	    }
	  }

	  onDataProgress(loaded, total) {
	    this._readyCapability.promise.then(() => {
	      for (const listener of this._progressListeners) {
	        listener(loaded, total);
	      }
	    });
	  }

	  onDataProgressiveRead(chunk) {
	    this._readyCapability.promise.then(() => {
	      for (const listener of this._progressiveReadListeners) {
	        listener(chunk);
	      }
	    });
	  }

	  onDataProgressiveDone() {
	    this._readyCapability.promise.then(() => {
	      for (const listener of this._progressiveDoneListeners) {
	        listener();
	      }
	    });
	  }

	  transportReady() {
	    this._readyCapability.resolve();
	  }

	  requestDataRange(begin, end) {
	    (0, _util.unreachable)("Abstract method PDFDataRangeTransport.requestDataRange");
	  }

	  abort() {}

	}

	exports.PDFDataRangeTransport = PDFDataRangeTransport;

	class PDFDocumentProxy {
	  constructor(pdfInfo, transport) {
	    this._pdfInfo = pdfInfo;
	    this._transport = transport;
	  }

	  get numPages() {
	    return this._pdfInfo.numPages;
	  }

	  get fingerprint() {
	    return this._pdfInfo.fingerprint;
	  }

	  getPage(pageNumber) {
	    return this._transport.getPage(pageNumber);
	  }

	  getPageIndex(ref) {
	    return this._transport.getPageIndex(ref);
	  }

	  getDestinations() {
	    return this._transport.getDestinations();
	  }

	  getDestination(id) {
	    return this._transport.getDestination(id);
	  }

	  getPageLabels() {
	    return this._transport.getPageLabels();
	  }

	  getPageLayout() {
	    return this._transport.getPageLayout();
	  }

	  getPageMode() {
	    return this._transport.getPageMode();
	  }

	  getViewerPreferences() {
	    return this._transport.getViewerPreferences();
	  }

	  getOpenAction() {
	    return this._transport.getOpenAction();
	  }

	  getOpenActionDestination() {
	    (0, _display_utils.deprecated)("getOpenActionDestination, use getOpenAction instead.");
	    return this.getOpenAction().then(function (openAction) {
	      return openAction && openAction.dest ? openAction.dest : null;
	    });
	  }

	  getAttachments() {
	    return this._transport.getAttachments();
	  }

	  getJavaScript() {
	    return this._transport.getJavaScript();
	  }

	  getOutline() {
	    return this._transport.getOutline();
	  }

	  getPermissions() {
	    return this._transport.getPermissions();
	  }

	  getMetadata() {
	    return this._transport.getMetadata();
	  }

	  getData() {
	    return this._transport.getData();
	  }

	  getDownloadInfo() {
	    return this._transport.downloadInfoCapability.promise;
	  }

	  getStats() {
	    return this._transport.getStats();
	  }

	  cleanup() {
	    return this._transport.startCleanup();
	  }

	  destroy() {
	    return this.loadingTask.destroy();
	  }

	  get loadingParams() {
	    return this._transport.loadingParams;
	  }

	  get loadingTask() {
	    return this._transport.loadingTask;
	  }

	}

	exports.PDFDocumentProxy = PDFDocumentProxy;

	class PDFPageProxy {
	  constructor(pageIndex, pageInfo, transport, pdfBug = false) {
	    this._pageIndex = pageIndex;
	    this._pageInfo = pageInfo;
	    this._transport = transport;
	    this._stats = pdfBug ? new _display_utils.StatTimer() : null;
	    this._pdfBug = pdfBug;
	    this.commonObjs = transport.commonObjs;
	    this.objs = new PDFObjects();
	    this.cleanupAfterRender = false;
	    this.pendingCleanup = false;
	    this.intentStates = Object.create(null);
	    this.destroyed = false;
	  }

	  get pageNumber() {
	    return this._pageIndex + 1;
	  }

	  get rotate() {
	    return this._pageInfo.rotate;
	  }

	  get ref() {
	    return this._pageInfo.ref;
	  }

	  get userUnit() {
	    return this._pageInfo.userUnit;
	  }

	  get view() {
	    return this._pageInfo.view;
	  }

	  getViewport({
	    scale,
	    rotation = this.rotate,
	    offsetX = 0,
	    offsetY = 0,
	    dontFlip = false
	  } = {}) {
	    return new _display_utils.PageViewport({
	      viewBox: this.view,
	      scale,
	      rotation,
	      offsetX,
	      offsetY,
	      dontFlip
	    });
	  }

	  getAnnotations({
	    intent = null
	  } = {}) {
	    if (!this.annotationsPromise || this.annotationsIntent !== intent) {
	      this.annotationsPromise = this._transport.getAnnotations(this._pageIndex, intent);
	      this.annotationsIntent = intent;
	    }

	    return this.annotationsPromise;
	  }

	  render({
	    canvasContext,
	    viewport,
	    intent = "display",
	    enableWebGL = false,
	    renderInteractiveForms = false,
	    transform = null,
	    imageLayer = null,
	    canvasFactory = null,
	    background = null
	  }) {
	    if (this._stats) {
	      this._stats.time("Overall");
	    }

	    const renderingIntent = intent === "print" ? "print" : "display";
	    this.pendingCleanup = false;

	    if (!this.intentStates[renderingIntent]) {
	      this.intentStates[renderingIntent] = Object.create(null);
	    }

	    const intentState = this.intentStates[renderingIntent];

	    if (intentState.streamReaderCancelTimeout) {
	      clearTimeout(intentState.streamReaderCancelTimeout);
	      intentState.streamReaderCancelTimeout = null;
	    }

	    const canvasFactoryInstance = canvasFactory || new _display_utils.DOMCanvasFactory();
	    const webGLContext = new _webgl.WebGLContext({
	      enable: enableWebGL
	    });

	    if (!intentState.displayReadyCapability) {
	      intentState.displayReadyCapability = (0, _util.createPromiseCapability)();
	      intentState.operatorList = {
	        fnArray: [],
	        argsArray: [],
	        lastChunk: false
	      };

	      if (this._stats) {
	        this._stats.time("Page Request");
	      }

	      this._pumpOperatorList({
	        pageIndex: this._pageIndex,
	        intent: renderingIntent,
	        renderInteractiveForms: renderInteractiveForms === true
	      });
	    }

	    const complete = error => {
	      const i = intentState.renderTasks.indexOf(internalRenderTask);

	      if (i >= 0) {
	        intentState.renderTasks.splice(i, 1);
	      }

	      if (this.cleanupAfterRender || renderingIntent === "print") {
	        this.pendingCleanup = true;
	      }

	      this._tryCleanup();

	      if (error) {
	        internalRenderTask.capability.reject(error);

	        this._abortOperatorList({
	          intentState,
	          reason: error
	        });
	      } else {
	        internalRenderTask.capability.resolve();
	      }

	      if (this._stats) {
	        this._stats.timeEnd("Rendering");

	        this._stats.timeEnd("Overall");
	      }
	    };

	    const internalRenderTask = new InternalRenderTask({
	      callback: complete,
	      params: {
	        canvasContext,
	        viewport,
	        transform,
	        imageLayer,
	        background
	      },
	      objs: this.objs,
	      commonObjs: this.commonObjs,
	      operatorList: intentState.operatorList,
	      pageIndex: this._pageIndex,
	      canvasFactory: canvasFactoryInstance,
	      webGLContext,
	      useRequestAnimationFrame: renderingIntent !== "print",
	      pdfBug: this._pdfBug
	    });

	    if (!intentState.renderTasks) {
	      intentState.renderTasks = [];
	    }

	    intentState.renderTasks.push(internalRenderTask);
	    const renderTask = internalRenderTask.task;
	    intentState.displayReadyCapability.promise.then(transparency => {
	      if (this.pendingCleanup) {
	        complete();
	        return;
	      }

	      if (this._stats) {
	        this._stats.time("Rendering");
	      }

	      internalRenderTask.initializeGraphics(transparency);
	      internalRenderTask.operatorListChanged();
	    }).catch(complete);
	    return renderTask;
	  }

	  getOperatorList() {
	    function operatorListChanged() {
	      if (intentState.operatorList.lastChunk) {
	        intentState.opListReadCapability.resolve(intentState.operatorList);
	        const i = intentState.renderTasks.indexOf(opListTask);

	        if (i >= 0) {
	          intentState.renderTasks.splice(i, 1);
	        }
	      }
	    }

	    const renderingIntent = "oplist";

	    if (!this.intentStates[renderingIntent]) {
	      this.intentStates[renderingIntent] = Object.create(null);
	    }

	    const intentState = this.intentStates[renderingIntent];
	    let opListTask;

	    if (!intentState.opListReadCapability) {
	      opListTask = {};
	      opListTask.operatorListChanged = operatorListChanged;
	      intentState.opListReadCapability = (0, _util.createPromiseCapability)();
	      intentState.renderTasks = [];
	      intentState.renderTasks.push(opListTask);
	      intentState.operatorList = {
	        fnArray: [],
	        argsArray: [],
	        lastChunk: false
	      };

	      if (this._stats) {
	        this._stats.time("Page Request");
	      }

	      this._pumpOperatorList({
	        pageIndex: this._pageIndex,
	        intent: renderingIntent
	      });
	    }

	    return intentState.opListReadCapability.promise;
	  }

	  streamTextContent({
	    normalizeWhitespace = false,
	    disableCombineTextItems = false
	  } = {}) {
	    const TEXT_CONTENT_CHUNK_SIZE = 100;
	    return this._transport.messageHandler.sendWithStream("GetTextContent", {
	      pageIndex: this._pageIndex,
	      normalizeWhitespace: normalizeWhitespace === true,
	      combineTextItems: disableCombineTextItems !== true
	    }, {
	      highWaterMark: TEXT_CONTENT_CHUNK_SIZE,

	      size(textContent) {
	        return textContent.items.length;
	      }

	    });
	  }

	  getTextContent(params = {}) {
	    const readableStream = this.streamTextContent(params);
	    return new Promise(function (resolve, reject) {
	      function pump() {
	        reader.read().then(function ({
	          value,
	          done
	        }) {
	          if (done) {
	            resolve(textContent);
	            return;
	          }

	          Object.assign(textContent.styles, value.styles);
	          textContent.items.push(...value.items);
	          pump();
	        }, reject);
	      }

	      const reader = readableStream.getReader();
	      const textContent = {
	        items: [],
	        styles: Object.create(null)
	      };
	      pump();
	    });
	  }

	  _destroy() {
	    this.destroyed = true;
	    this._transport.pageCache[this._pageIndex] = null;
	    const waitOn = [];
	    Object.keys(this.intentStates).forEach(intent => {
	      const intentState = this.intentStates[intent];

	      this._abortOperatorList({
	        intentState,
	        reason: new Error("Page was destroyed."),
	        force: true
	      });

	      if (intent === "oplist") {
	        return;
	      }

	      intentState.renderTasks.forEach(function (renderTask) {
	        const renderCompleted = renderTask.capability.promise.catch(function () {});
	        waitOn.push(renderCompleted);
	        renderTask.cancel();
	      });
	    });
	    this.objs.clear();
	    this.annotationsPromise = null;
	    this.pendingCleanup = false;
	    return Promise.all(waitOn);
	  }

	  cleanup(resetStats = false) {
	    this.pendingCleanup = true;
	    return this._tryCleanup(resetStats);
	  }

	  _tryCleanup(resetStats = false) {
	    if (!this.pendingCleanup || Object.keys(this.intentStates).some(intent => {
	      const intentState = this.intentStates[intent];
	      return intentState.renderTasks.length !== 0 || !intentState.operatorList.lastChunk;
	    })) {
	      return false;
	    }

	    Object.keys(this.intentStates).forEach(intent => {
	      delete this.intentStates[intent];
	    });
	    this.objs.clear();
	    this.annotationsPromise = null;

	    if (resetStats && this._stats) {
	      this._stats = new _display_utils.StatTimer();
	    }

	    this.pendingCleanup = false;
	    return true;
	  }

	  _startRenderPage(transparency, intent) {
	    const intentState = this.intentStates[intent];

	    if (!intentState) {
	      return;
	    }

	    if (this._stats) {
	      this._stats.timeEnd("Page Request");
	    }

	    if (intentState.displayReadyCapability) {
	      intentState.displayReadyCapability.resolve(transparency);
	    }
	  }

	  _renderPageChunk(operatorListChunk, intentState) {
	    for (let i = 0, ii = operatorListChunk.length; i < ii; i++) {
	      intentState.operatorList.fnArray.push(operatorListChunk.fnArray[i]);
	      intentState.operatorList.argsArray.push(operatorListChunk.argsArray[i]);
	    }

	    intentState.operatorList.lastChunk = operatorListChunk.lastChunk;

	    for (let i = 0; i < intentState.renderTasks.length; i++) {
	      intentState.renderTasks[i].operatorListChanged();
	    }

	    if (operatorListChunk.lastChunk) {
	      this._tryCleanup();
	    }
	  }

	  _pumpOperatorList(args) {
	    (0, _util.assert)(args.intent, 'PDFPageProxy._pumpOperatorList: Expected "intent" argument.');

	    const readableStream = this._transport.messageHandler.sendWithStream("GetOperatorList", args);

	    const reader = readableStream.getReader();
	    const intentState = this.intentStates[args.intent];
	    intentState.streamReader = reader;

	    const pump = () => {
	      reader.read().then(({
	        value,
	        done
	      }) => {
	        if (done) {
	          intentState.streamReader = null;
	          return;
	        }

	        if (this._transport.destroyed) {
	          return;
	        }

	        this._renderPageChunk(value, intentState);

	        pump();
	      }, reason => {
	        intentState.streamReader = null;

	        if (this._transport.destroyed) {
	          return;
	        }

	        if (intentState.operatorList) {
	          intentState.operatorList.lastChunk = true;

	          for (let i = 0; i < intentState.renderTasks.length; i++) {
	            intentState.renderTasks[i].operatorListChanged();
	          }

	          this._tryCleanup();
	        }

	        if (intentState.displayReadyCapability) {
	          intentState.displayReadyCapability.reject(reason);
	        } else if (intentState.opListReadCapability) {
	          intentState.opListReadCapability.reject(reason);
	        } else {
	          throw reason;
	        }
	      });
	    };

	    pump();
	  }

	  _abortOperatorList({
	    intentState,
	    reason,
	    force = false
	  }) {
	    (0, _util.assert)(reason instanceof Error || typeof reason === "object" && reason !== null, 'PDFPageProxy._abortOperatorList: Expected "reason" argument.');

	    if (!intentState.streamReader) {
	      return;
	    }

	    if (!force) {
	      if (intentState.renderTasks.length !== 0) {
	        return;
	      }

	      if (reason instanceof _display_utils.RenderingCancelledException) {
	        intentState.streamReaderCancelTimeout = setTimeout(() => {
	          this._abortOperatorList({
	            intentState,
	            reason,
	            force: true
	          });

	          intentState.streamReaderCancelTimeout = null;
	        }, RENDERING_CANCELLED_TIMEOUT);
	        return;
	      }
	    }

	    intentState.streamReader.cancel(new _util.AbortException(reason && reason.message));
	    intentState.streamReader = null;

	    if (this._transport.destroyed) {
	      return;
	    }

	    Object.keys(this.intentStates).some(intent => {
	      if (this.intentStates[intent] === intentState) {
	        delete this.intentStates[intent];
	        return true;
	      }

	      return false;
	    });
	    this.cleanup();
	  }

	  get stats() {
	    return this._stats;
	  }

	}

	exports.PDFPageProxy = PDFPageProxy;

	class LoopbackPort {
	  constructor(defer = true) {
	    this._listeners = [];
	    this._defer = defer;
	    this._deferred = Promise.resolve(undefined);
	  }

	  postMessage(obj, transfers) {
	    function cloneValue(value) {
	      if (typeof value !== "object" || value === null) {
	        return value;
	      }

	      if (cloned.has(value)) {
	        return cloned.get(value);
	      }

	      let buffer, result;

	      if ((buffer = value.buffer) && (0, _util.isArrayBuffer)(buffer)) {
	        const transferable = transfers && transfers.includes(buffer);

	        if (transferable) {
	          result = new value.constructor(buffer, value.byteOffset, value.byteLength);
	        } else {
	          result = new value.constructor(value);
	        }

	        cloned.set(value, result);
	        return result;
	      }

	      result = Array.isArray(value) ? [] : {};
	      cloned.set(value, result);

	      for (const i in value) {
	        let desc,
	            p = value;

	        while (!(desc = Object.getOwnPropertyDescriptor(p, i))) {
	          p = Object.getPrototypeOf(p);
	        }

	        if (typeof desc.value === "undefined") {
	          continue;
	        }

	        if (typeof desc.value === "function") {
	          if (value.hasOwnProperty && value.hasOwnProperty(i)) {
	            throw new Error(`LoopbackPort.postMessage - cannot clone: ${value[i]}`);
	          }

	          continue;
	        }

	        result[i] = cloneValue(desc.value);
	      }

	      return result;
	    }

	    if (!this._defer) {
	      this._listeners.forEach(listener => {
	        listener.call(this, {
	          data: obj
	        });
	      });

	      return;
	    }

	    const cloned = new WeakMap();
	    const e = {
	      data: cloneValue(obj)
	    };

	    this._deferred.then(() => {
	      this._listeners.forEach(listener => {
	        listener.call(this, e);
	      });
	    });
	  }

	  addEventListener(name, listener) {
	    this._listeners.push(listener);
	  }

	  removeEventListener(name, listener) {
	    const i = this._listeners.indexOf(listener);

	    this._listeners.splice(i, 1);
	  }

	  terminate() {
	    this._listeners.length = 0;
	  }

	}

	exports.LoopbackPort = LoopbackPort;

	const PDFWorker = function PDFWorkerClosure() {
	  const pdfWorkerPorts = new WeakMap();
	  let isWorkerDisabled = false;
	  let fallbackWorkerSrc;
	  let nextFakeWorkerId = 0;
	  let fakeWorkerCapability;

	  if (_is_node.isNodeJS && typeof commonjsRequire === "function") {
	    isWorkerDisabled = true;
	    fallbackWorkerSrc = "./pdf.worker.js";
	  } else if (typeof document === "object" && "currentScript" in document) {
	    const pdfjsFilePath = document.currentScript && document.currentScript.src;

	    if (pdfjsFilePath) {
	      fallbackWorkerSrc = pdfjsFilePath.replace(/(\.(?:min\.)?js)(\?.*)?$/i, ".worker$1$2");
	    }
	  }

	  function getWorkerSrc() {
	    if (_worker_options.GlobalWorkerOptions.workerSrc) {
	      return _worker_options.GlobalWorkerOptions.workerSrc;
	    }

	    if (typeof fallbackWorkerSrc !== "undefined") {
	      if (!_is_node.isNodeJS) {
	        (0, _display_utils.deprecated)('No "GlobalWorkerOptions.workerSrc" specified.');
	      }

	      return fallbackWorkerSrc;
	    }

	    throw new Error('No "GlobalWorkerOptions.workerSrc" specified.');
	  }

	  function getMainThreadWorkerMessageHandler() {
	    let mainWorkerMessageHandler;

	    try {
	      mainWorkerMessageHandler = globalThis.pdfjsWorker && globalThis.pdfjsWorker.WorkerMessageHandler;
	    } catch (ex) {}

	    return mainWorkerMessageHandler || null;
	  }

	  function setupFakeWorkerGlobal() {
	    if (fakeWorkerCapability) {
	      return fakeWorkerCapability.promise;
	    }

	    fakeWorkerCapability = (0, _util.createPromiseCapability)();

	    const loader = async function () {
	      const mainWorkerMessageHandler = getMainThreadWorkerMessageHandler();

	      if (mainWorkerMessageHandler) {
	        return mainWorkerMessageHandler;
	      }

	      if (_is_node.isNodeJS && typeof commonjsRequire === "function") {
	        const worker = eval("require")(getWorkerSrc());
	        return worker.WorkerMessageHandler;
	      }

	      await (0, _display_utils.loadScript)(getWorkerSrc());
	      return window.pdfjsWorker.WorkerMessageHandler;
	    };

	    loader().then(fakeWorkerCapability.resolve, fakeWorkerCapability.reject);
	    return fakeWorkerCapability.promise;
	  }

	  function createCDNWrapper(url) {
	    const wrapper = "importScripts('" + url + "');";
	    return URL.createObjectURL(new Blob([wrapper]));
	  }

	  class PDFWorker {
	    constructor({
	      name = null,
	      port = null,
	      verbosity = (0, _util.getVerbosityLevel)()
	    } = {}) {
	      if (port && pdfWorkerPorts.has(port)) {
	        throw new Error("Cannot use more than one PDFWorker per port");
	      }

	      this.name = name;
	      this.destroyed = false;
	      this.postMessageTransfers = true;
	      this.verbosity = verbosity;
	      this._readyCapability = (0, _util.createPromiseCapability)();
	      this._port = null;
	      this._webWorker = null;
	      this._messageHandler = null;

	      if (port) {
	        pdfWorkerPorts.set(port, this);

	        this._initializeFromPort(port);

	        return;
	      }

	      this._initialize();
	    }

	    get promise() {
	      return this._readyCapability.promise;
	    }

	    get port() {
	      return this._port;
	    }

	    get messageHandler() {
	      return this._messageHandler;
	    }

	    _initializeFromPort(port) {
	      this._port = port;
	      this._messageHandler = new _message_handler.MessageHandler("main", "worker", port);

	      this._messageHandler.on("ready", function () {});

	      this._readyCapability.resolve();
	    }

	    _initialize() {
	      if (typeof Worker !== "undefined" && !isWorkerDisabled && !getMainThreadWorkerMessageHandler()) {
	        let workerSrc = getWorkerSrc();

	        try {
	          if (!(0, _util.isSameOrigin)(window.location.href, workerSrc)) {
	            workerSrc = createCDNWrapper(new URL(workerSrc, window.location).href);
	          }

	          const worker = new Worker(workerSrc);
	          const messageHandler = new _message_handler.MessageHandler("main", "worker", worker);

	          const terminateEarly = () => {
	            worker.removeEventListener("error", onWorkerError);
	            messageHandler.destroy();
	            worker.terminate();

	            if (this.destroyed) {
	              this._readyCapability.reject(new Error("Worker was destroyed"));
	            } else {
	              this._setupFakeWorker();
	            }
	          };

	          const onWorkerError = () => {
	            if (!this._webWorker) {
	              terminateEarly();
	            }
	          };

	          worker.addEventListener("error", onWorkerError);
	          messageHandler.on("test", data => {
	            worker.removeEventListener("error", onWorkerError);

	            if (this.destroyed) {
	              terminateEarly();
	              return;
	            }

	            if (data) {
	              this._messageHandler = messageHandler;
	              this._port = worker;
	              this._webWorker = worker;

	              if (!data.supportTransfers) {
	                this.postMessageTransfers = false;
	              }

	              this._readyCapability.resolve();

	              messageHandler.send("configure", {
	                verbosity: this.verbosity
	              });
	            } else {
	              this._setupFakeWorker();

	              messageHandler.destroy();
	              worker.terminate();
	            }
	          });
	          messageHandler.on("ready", data => {
	            worker.removeEventListener("error", onWorkerError);

	            if (this.destroyed) {
	              terminateEarly();
	              return;
	            }

	            try {
	              sendTest();
	            } catch (e) {
	              this._setupFakeWorker();
	            }
	          });

	          const sendTest = () => {
	            const testObj = new Uint8Array([this.postMessageTransfers ? 255 : 0]);

	            try {
	              messageHandler.send("test", testObj, [testObj.buffer]);
	            } catch (ex) {
	              (0, _util.warn)("Cannot use postMessage transfers.");
	              testObj[0] = 0;
	              messageHandler.send("test", testObj);
	            }
	          };

	          sendTest();
	          return;
	        } catch (e) {
	          (0, _util.info)("The worker has been disabled.");
	        }
	      }

	      this._setupFakeWorker();
	    }

	    _setupFakeWorker() {
	      if (!isWorkerDisabled) {
	        (0, _util.warn)("Setting up fake worker.");
	        isWorkerDisabled = true;
	      }

	      setupFakeWorkerGlobal().then(WorkerMessageHandler => {
	        if (this.destroyed) {
	          this._readyCapability.reject(new Error("Worker was destroyed"));

	          return;
	        }

	        const port = new LoopbackPort();
	        this._port = port;
	        const id = "fake" + nextFakeWorkerId++;
	        const workerHandler = new _message_handler.MessageHandler(id + "_worker", id, port);
	        WorkerMessageHandler.setup(workerHandler, port);
	        const messageHandler = new _message_handler.MessageHandler(id, id + "_worker", port);
	        this._messageHandler = messageHandler;

	        this._readyCapability.resolve();

	        messageHandler.send("configure", {
	          verbosity: this.verbosity
	        });
	      }).catch(reason => {
	        this._readyCapability.reject(new Error(`Setting up fake worker failed: "${reason.message}".`));
	      });
	    }

	    destroy() {
	      this.destroyed = true;

	      if (this._webWorker) {
	        this._webWorker.terminate();

	        this._webWorker = null;
	      }

	      pdfWorkerPorts.delete(this._port);
	      this._port = null;

	      if (this._messageHandler) {
	        this._messageHandler.destroy();

	        this._messageHandler = null;
	      }
	    }

	    static fromPort(params) {
	      if (!params || !params.port) {
	        throw new Error("PDFWorker.fromPort - invalid method signature.");
	      }

	      if (pdfWorkerPorts.has(params.port)) {
	        return pdfWorkerPorts.get(params.port);
	      }

	      return new PDFWorker(params);
	    }

	    static getWorkerSrc() {
	      return getWorkerSrc();
	    }

	  }

	  return PDFWorker;
	}();

	exports.PDFWorker = PDFWorker;

	class WorkerTransport {
	  constructor(messageHandler, loadingTask, networkStream, params) {
	    this.messageHandler = messageHandler;
	    this.loadingTask = loadingTask;
	    this.commonObjs = new PDFObjects();
	    this.fontLoader = new _font_loader.FontLoader({
	      docId: loadingTask.docId,
	      onUnsupportedFeature: this._onUnsupportedFeature.bind(this)
	    });
	    this._params = params;
	    this.CMapReaderFactory = new params.CMapReaderFactory({
	      baseUrl: params.cMapUrl,
	      isCompressed: params.cMapPacked
	    });
	    this.destroyed = false;
	    this.destroyCapability = null;
	    this._passwordCapability = null;
	    this._networkStream = networkStream;
	    this._fullReader = null;
	    this._lastProgress = null;
	    this.pageCache = [];
	    this.pagePromises = [];
	    this.downloadInfoCapability = (0, _util.createPromiseCapability)();
	    this.setupMessageHandler();
	  }

	  destroy() {
	    if (this.destroyCapability) {
	      return this.destroyCapability.promise;
	    }

	    this.destroyed = true;
	    this.destroyCapability = (0, _util.createPromiseCapability)();

	    if (this._passwordCapability) {
	      this._passwordCapability.reject(new Error("Worker was destroyed during onPassword callback"));
	    }

	    const waitOn = [];
	    this.pageCache.forEach(function (page) {
	      if (page) {
	        waitOn.push(page._destroy());
	      }
	    });
	    this.pageCache.length = 0;
	    this.pagePromises.length = 0;
	    const terminated = this.messageHandler.sendWithPromise("Terminate", null);
	    waitOn.push(terminated);
	    Promise.all(waitOn).then(() => {
	      this.fontLoader.clear();

	      if (this._networkStream) {
	        this._networkStream.cancelAllRequests(new _util.AbortException("Worker was terminated."));
	      }

	      if (this.messageHandler) {
	        this.messageHandler.destroy();
	        this.messageHandler = null;
	      }

	      this.destroyCapability.resolve();
	    }, this.destroyCapability.reject);
	    return this.destroyCapability.promise;
	  }

	  setupMessageHandler() {
	    const {
	      messageHandler,
	      loadingTask
	    } = this;
	    messageHandler.on("GetReader", (data, sink) => {
	      (0, _util.assert)(this._networkStream, "GetReader - no `IPDFStream` instance available.");
	      this._fullReader = this._networkStream.getFullReader();

	      this._fullReader.onProgress = evt => {
	        this._lastProgress = {
	          loaded: evt.loaded,
	          total: evt.total
	        };
	      };

	      sink.onPull = () => {
	        this._fullReader.read().then(function ({
	          value,
	          done
	        }) {
	          if (done) {
	            sink.close();
	            return;
	          }

	          (0, _util.assert)((0, _util.isArrayBuffer)(value), "GetReader - expected an ArrayBuffer.");
	          sink.enqueue(new Uint8Array(value), 1, [value]);
	        }).catch(reason => {
	          sink.error(reason);
	        });
	      };

	      sink.onCancel = reason => {
	        this._fullReader.cancel(reason);
	      };
	    });
	    messageHandler.on("ReaderHeadersReady", data => {
	      const headersCapability = (0, _util.createPromiseCapability)();
	      const fullReader = this._fullReader;
	      fullReader.headersReady.then(() => {
	        if (!fullReader.isStreamingSupported || !fullReader.isRangeSupported) {
	          if (this._lastProgress && loadingTask.onProgress) {
	            loadingTask.onProgress(this._lastProgress);
	          }

	          fullReader.onProgress = evt => {
	            if (loadingTask.onProgress) {
	              loadingTask.onProgress({
	                loaded: evt.loaded,
	                total: evt.total
	              });
	            }
	          };
	        }

	        headersCapability.resolve({
	          isStreamingSupported: fullReader.isStreamingSupported,
	          isRangeSupported: fullReader.isRangeSupported,
	          contentLength: fullReader.contentLength
	        });
	      }, headersCapability.reject);
	      return headersCapability.promise;
	    });
	    messageHandler.on("GetRangeReader", (data, sink) => {
	      (0, _util.assert)(this._networkStream, "GetRangeReader - no `IPDFStream` instance available.");

	      const rangeReader = this._networkStream.getRangeReader(data.begin, data.end);

	      if (!rangeReader) {
	        sink.close();
	        return;
	      }

	      sink.onPull = () => {
	        rangeReader.read().then(function ({
	          value,
	          done
	        }) {
	          if (done) {
	            sink.close();
	            return;
	          }

	          (0, _util.assert)((0, _util.isArrayBuffer)(value), "GetRangeReader - expected an ArrayBuffer.");
	          sink.enqueue(new Uint8Array(value), 1, [value]);
	        }).catch(reason => {
	          sink.error(reason);
	        });
	      };

	      sink.onCancel = reason => {
	        rangeReader.cancel(reason);
	      };
	    });
	    messageHandler.on("GetDoc", ({
	      pdfInfo
	    }) => {
	      this._numPages = pdfInfo.numPages;

	      loadingTask._capability.resolve(new PDFDocumentProxy(pdfInfo, this));
	    });
	    messageHandler.on("DocException", function (ex) {
	      let reason;

	      switch (ex.name) {
	        case "PasswordException":
	          reason = new _util.PasswordException(ex.message, ex.code);
	          break;

	        case "InvalidPDFException":
	          reason = new _util.InvalidPDFException(ex.message);
	          break;

	        case "MissingPDFException":
	          reason = new _util.MissingPDFException(ex.message);
	          break;

	        case "UnexpectedResponseException":
	          reason = new _util.UnexpectedResponseException(ex.message, ex.status);
	          break;

	        case "UnknownErrorException":
	          reason = new _util.UnknownErrorException(ex.message, ex.details);
	          break;
	      }

	      loadingTask._capability.reject(reason);
	    });
	    messageHandler.on("PasswordRequest", exception => {
	      this._passwordCapability = (0, _util.createPromiseCapability)();

	      if (loadingTask.onPassword) {
	        const updatePassword = password => {
	          this._passwordCapability.resolve({
	            password
	          });
	        };

	        try {
	          loadingTask.onPassword(updatePassword, exception.code);
	        } catch (ex) {
	          this._passwordCapability.reject(ex);
	        }
	      } else {
	        this._passwordCapability.reject(new _util.PasswordException(exception.message, exception.code));
	      }

	      return this._passwordCapability.promise;
	    });
	    messageHandler.on("DataLoaded", data => {
	      if (loadingTask.onProgress) {
	        loadingTask.onProgress({
	          loaded: data.length,
	          total: data.length
	        });
	      }

	      this.downloadInfoCapability.resolve(data);
	    });
	    messageHandler.on("StartRenderPage", data => {
	      if (this.destroyed) {
	        return;
	      }

	      const page = this.pageCache[data.pageIndex];

	      page._startRenderPage(data.transparency, data.intent);
	    });
	    messageHandler.on("commonobj", data => {
	      if (this.destroyed) {
	        return;
	      }

	      const [id, type, exportedData] = data;

	      if (this.commonObjs.has(id)) {
	        return;
	      }

	      switch (type) {
	        case "Font":
	          const params = this._params;

	          if ("error" in exportedData) {
	            const exportedError = exportedData.error;
	            (0, _util.warn)(`Error during font loading: ${exportedError}`);
	            this.commonObjs.resolve(id, exportedError);
	            break;
	          }

	          let fontRegistry = null;

	          if (params.pdfBug && globalThis.FontInspector && globalThis.FontInspector.enabled) {
	            fontRegistry = {
	              registerFont(font, url) {
	                globalThis.FontInspector.fontAdded(font, url);
	              }

	            };
	          }

	          const font = new _font_loader.FontFaceObject(exportedData, {
	            isEvalSupported: params.isEvalSupported,
	            disableFontFace: params.disableFontFace,
	            ignoreErrors: params.ignoreErrors,
	            onUnsupportedFeature: this._onUnsupportedFeature.bind(this),
	            fontRegistry
	          });
	          this.fontLoader.bind(font).catch(reason => {
	            return messageHandler.sendWithPromise("FontFallback", {
	              id
	            });
	          }).finally(() => {
	            if (!params.fontExtraProperties && font.data) {
	              font.data = null;
	            }

	            this.commonObjs.resolve(id, font);
	          });
	          break;

	        case "FontPath":
	        case "FontType3Res":
	        case "Image":
	          this.commonObjs.resolve(id, exportedData);
	          break;

	        default:
	          throw new Error(`Got unknown common object type ${type}`);
	      }
	    });
	    messageHandler.on("obj", data => {
	      if (this.destroyed) {
	        return undefined;
	      }

	      const [id, pageIndex, type, imageData] = data;
	      const pageProxy = this.pageCache[pageIndex];

	      if (pageProxy.objs.has(id)) {
	        return undefined;
	      }

	      switch (type) {
	        case "Image":
	          pageProxy.objs.resolve(id, imageData);
	          const MAX_IMAGE_SIZE_TO_STORE = 8000000;

	          if (imageData && "data" in imageData && imageData.data.length > MAX_IMAGE_SIZE_TO_STORE) {
	            pageProxy.cleanupAfterRender = true;
	          }

	          break;

	        default:
	          throw new Error(`Got unknown object type ${type}`);
	      }

	      return undefined;
	    });
	    messageHandler.on("DocProgress", data => {
	      if (this.destroyed) {
	        return;
	      }

	      if (loadingTask.onProgress) {
	        loadingTask.onProgress({
	          loaded: data.loaded,
	          total: data.total
	        });
	      }
	    });
	    messageHandler.on("UnsupportedFeature", this._onUnsupportedFeature.bind(this));
	    messageHandler.on("FetchBuiltInCMap", (data, sink) => {
	      if (this.destroyed) {
	        sink.error(new Error("Worker was destroyed"));
	        return;
	      }

	      let fetched = false;

	      sink.onPull = () => {
	        if (fetched) {
	          sink.close();
	          return;
	        }

	        fetched = true;
	        this.CMapReaderFactory.fetch(data).then(function (builtInCMap) {
	          sink.enqueue(builtInCMap, 1, [builtInCMap.cMapData.buffer]);
	        }).catch(function (reason) {
	          sink.error(reason);
	        });
	      };
	    });
	  }

	  _onUnsupportedFeature({
	    featureId
	  }) {
	    if (this.destroyed) {
	      return;
	    }

	    if (this.loadingTask.onUnsupportedFeature) {
	      this.loadingTask.onUnsupportedFeature(featureId);
	    }
	  }

	  getData() {
	    return this.messageHandler.sendWithPromise("GetData", null);
	  }

	  getPage(pageNumber) {
	    if (!Number.isInteger(pageNumber) || pageNumber <= 0 || pageNumber > this._numPages) {
	      return Promise.reject(new Error("Invalid page request"));
	    }

	    const pageIndex = pageNumber - 1;

	    if (pageIndex in this.pagePromises) {
	      return this.pagePromises[pageIndex];
	    }

	    const promise = this.messageHandler.sendWithPromise("GetPage", {
	      pageIndex
	    }).then(pageInfo => {
	      if (this.destroyed) {
	        throw new Error("Transport destroyed");
	      }

	      const page = new PDFPageProxy(pageIndex, pageInfo, this, this._params.pdfBug);
	      this.pageCache[pageIndex] = page;
	      return page;
	    });
	    this.pagePromises[pageIndex] = promise;
	    return promise;
	  }

	  getPageIndex(ref) {
	    return this.messageHandler.sendWithPromise("GetPageIndex", {
	      ref
	    }).catch(function (reason) {
	      return Promise.reject(new Error(reason));
	    });
	  }

	  getAnnotations(pageIndex, intent) {
	    return this.messageHandler.sendWithPromise("GetAnnotations", {
	      pageIndex,
	      intent
	    });
	  }

	  getDestinations() {
	    return this.messageHandler.sendWithPromise("GetDestinations", null);
	  }

	  getDestination(id) {
	    if (typeof id !== "string") {
	      return Promise.reject(new Error("Invalid destination request."));
	    }

	    return this.messageHandler.sendWithPromise("GetDestination", {
	      id
	    });
	  }

	  getPageLabels() {
	    return this.messageHandler.sendWithPromise("GetPageLabels", null);
	  }

	  getPageLayout() {
	    return this.messageHandler.sendWithPromise("GetPageLayout", null);
	  }

	  getPageMode() {
	    return this.messageHandler.sendWithPromise("GetPageMode", null);
	  }

	  getViewerPreferences() {
	    return this.messageHandler.sendWithPromise("GetViewerPreferences", null);
	  }

	  getOpenAction() {
	    return this.messageHandler.sendWithPromise("GetOpenAction", null);
	  }

	  getAttachments() {
	    return this.messageHandler.sendWithPromise("GetAttachments", null);
	  }

	  getJavaScript() {
	    return this.messageHandler.sendWithPromise("GetJavaScript", null);
	  }

	  getOutline() {
	    return this.messageHandler.sendWithPromise("GetOutline", null);
	  }

	  getPermissions() {
	    return this.messageHandler.sendWithPromise("GetPermissions", null);
	  }

	  getMetadata() {
	    return this.messageHandler.sendWithPromise("GetMetadata", null).then(results => {
	      return {
	        info: results[0],
	        metadata: results[1] ? new _metadata.Metadata(results[1]) : null,
	        contentDispositionFilename: this._fullReader ? this._fullReader.filename : null
	      };
	    });
	  }

	  getStats() {
	    return this.messageHandler.sendWithPromise("GetStats", null);
	  }

	  startCleanup() {
	    return this.messageHandler.sendWithPromise("Cleanup", null).then(() => {
	      for (let i = 0, ii = this.pageCache.length; i < ii; i++) {
	        const page = this.pageCache[i];

	        if (page) {
	          const cleanupSuccessful = page.cleanup();

	          if (!cleanupSuccessful) {
	            throw new Error(`startCleanup: Page ${i + 1} is currently rendering.`);
	          }
	        }
	      }

	      this.commonObjs.clear();
	      this.fontLoader.clear();
	    });
	  }

	  get loadingParams() {
	    const params = this._params;
	    return (0, _util.shadow)(this, "loadingParams", {
	      disableAutoFetch: params.disableAutoFetch,
	      disableFontFace: params.disableFontFace
	    });
	  }

	}

	class PDFObjects {
	  constructor() {
	    this._objs = Object.create(null);
	  }

	  _ensureObj(objId) {
	    if (this._objs[objId]) {
	      return this._objs[objId];
	    }

	    return this._objs[objId] = {
	      capability: (0, _util.createPromiseCapability)(),
	      data: null,
	      resolved: false
	    };
	  }

	  get(objId, callback = null) {
	    if (callback) {
	      this._ensureObj(objId).capability.promise.then(callback);

	      return null;
	    }

	    const obj = this._objs[objId];

	    if (!obj || !obj.resolved) {
	      throw new Error(`Requesting object that isn't resolved yet ${objId}.`);
	    }

	    return obj.data;
	  }

	  has(objId) {
	    const obj = this._objs[objId];
	    return obj ? obj.resolved : false;
	  }

	  resolve(objId, data) {
	    const obj = this._ensureObj(objId);

	    obj.resolved = true;
	    obj.data = data;
	    obj.capability.resolve(data);
	  }

	  clear() {
	    this._objs = Object.create(null);
	  }

	}

	class RenderTask {
	  constructor(internalRenderTask) {
	    this._internalRenderTask = internalRenderTask;
	    this.onContinue = null;
	  }

	  get promise() {
	    return this._internalRenderTask.capability.promise;
	  }

	  cancel() {
	    this._internalRenderTask.cancel();
	  }

	}

	const InternalRenderTask = function InternalRenderTaskClosure() {
	  const canvasInRendering = new WeakSet();

	  class InternalRenderTask {
	    constructor({
	      callback,
	      params,
	      objs,
	      commonObjs,
	      operatorList,
	      pageIndex,
	      canvasFactory,
	      webGLContext,
	      useRequestAnimationFrame = false,
	      pdfBug = false
	    }) {
	      this.callback = callback;
	      this.params = params;
	      this.objs = objs;
	      this.commonObjs = commonObjs;
	      this.operatorListIdx = null;
	      this.operatorList = operatorList;
	      this._pageIndex = pageIndex;
	      this.canvasFactory = canvasFactory;
	      this.webGLContext = webGLContext;
	      this._pdfBug = pdfBug;
	      this.running = false;
	      this.graphicsReadyCallback = null;
	      this.graphicsReady = false;
	      this._useRequestAnimationFrame = useRequestAnimationFrame === true && typeof window !== "undefined";
	      this.cancelled = false;
	      this.capability = (0, _util.createPromiseCapability)();
	      this.task = new RenderTask(this);
	      this._continueBound = this._continue.bind(this);
	      this._scheduleNextBound = this._scheduleNext.bind(this);
	      this._nextBound = this._next.bind(this);
	      this._canvas = params.canvasContext.canvas;
	    }

	    initializeGraphics(transparency = false) {
	      if (this.cancelled) {
	        return;
	      }

	      if (this._canvas) {
	        if (canvasInRendering.has(this._canvas)) {
	          throw new Error("Cannot use the same canvas during multiple render() operations. " + "Use different canvas or ensure previous operations were " + "cancelled or completed.");
	        }

	        canvasInRendering.add(this._canvas);
	      }

	      if (this._pdfBug && globalThis.StepperManager && globalThis.StepperManager.enabled) {
	        this.stepper = globalThis.StepperManager.create(this._pageIndex);
	        this.stepper.init(this.operatorList);
	        this.stepper.nextBreakPoint = this.stepper.getNextBreakPoint();
	      }

	      const {
	        canvasContext,
	        viewport,
	        transform,
	        imageLayer,
	        background
	      } = this.params;
	      this.gfx = new _canvas.CanvasGraphics(canvasContext, this.commonObjs, this.objs, this.canvasFactory, this.webGLContext, imageLayer);
	      this.gfx.beginDrawing({
	        transform,
	        viewport,
	        transparency,
	        background
	      });
	      this.operatorListIdx = 0;
	      this.graphicsReady = true;

	      if (this.graphicsReadyCallback) {
	        this.graphicsReadyCallback();
	      }
	    }

	    cancel(error = null) {
	      this.running = false;
	      this.cancelled = true;

	      if (this.gfx) {
	        this.gfx.endDrawing();
	      }

	      if (this._canvas) {
	        canvasInRendering.delete(this._canvas);
	      }

	      this.callback(error || new _display_utils.RenderingCancelledException(`Rendering cancelled, page ${this._pageIndex + 1}`, "canvas"));
	    }

	    operatorListChanged() {
	      if (!this.graphicsReady) {
	        if (!this.graphicsReadyCallback) {
	          this.graphicsReadyCallback = this._continueBound;
	        }

	        return;
	      }

	      if (this.stepper) {
	        this.stepper.updateOperatorList(this.operatorList);
	      }

	      if (this.running) {
	        return;
	      }

	      this._continue();
	    }

	    _continue() {
	      this.running = true;

	      if (this.cancelled) {
	        return;
	      }

	      if (this.task.onContinue) {
	        this.task.onContinue(this._scheduleNextBound);
	      } else {
	        this._scheduleNext();
	      }
	    }

	    _scheduleNext() {
	      if (this._useRequestAnimationFrame) {
	        window.requestAnimationFrame(() => {
	          this._nextBound().catch(this.cancel.bind(this));
	        });
	      } else {
	        Promise.resolve().then(this._nextBound).catch(this.cancel.bind(this));
	      }
	    }

	    async _next() {
	      if (this.cancelled) {
	        return;
	      }

	      this.operatorListIdx = this.gfx.executeOperatorList(this.operatorList, this.operatorListIdx, this._continueBound, this.stepper);

	      if (this.operatorListIdx === this.operatorList.argsArray.length) {
	        this.running = false;

	        if (this.operatorList.lastChunk) {
	          this.gfx.endDrawing();

	          if (this._canvas) {
	            canvasInRendering.delete(this._canvas);
	          }

	          this.callback();
	        }
	      }
	    }

	  }

	  return InternalRenderTask;
	}();

	const version = '2.5.207';
	exports.version = version;
	const build = '0974d605';
	exports.build = build;

	/***/ }),
	/* 6 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.FontLoader = exports.FontFaceObject = void 0;

	var _util = __w_pdfjs_require__(2);

	class BaseFontLoader {
	  constructor({
	    docId,
	    onUnsupportedFeature
	  }) {
	    if (this.constructor === BaseFontLoader) {
	      (0, _util.unreachable)("Cannot initialize BaseFontLoader.");
	    }

	    this.docId = docId;
	    this._onUnsupportedFeature = onUnsupportedFeature;
	    this.nativeFontFaces = [];
	    this.styleElement = null;
	  }

	  addNativeFontFace(nativeFontFace) {
	    this.nativeFontFaces.push(nativeFontFace);
	    document.fonts.add(nativeFontFace);
	  }

	  insertRule(rule) {
	    let styleElement = this.styleElement;

	    if (!styleElement) {
	      styleElement = this.styleElement = document.createElement("style");
	      styleElement.id = `PDFJS_FONT_STYLE_TAG_${this.docId}`;
	      document.documentElement.getElementsByTagName("head")[0].appendChild(styleElement);
	    }

	    const styleSheet = styleElement.sheet;
	    styleSheet.insertRule(rule, styleSheet.cssRules.length);
	  }

	  clear() {
	    this.nativeFontFaces.forEach(function (nativeFontFace) {
	      document.fonts.delete(nativeFontFace);
	    });
	    this.nativeFontFaces.length = 0;

	    if (this.styleElement) {
	      this.styleElement.remove();
	      this.styleElement = null;
	    }
	  }

	  async bind(font) {
	    if (font.attached || font.missingFile) {
	      return;
	    }

	    font.attached = true;

	    if (this.isFontLoadingAPISupported) {
	      const nativeFontFace = font.createNativeFontFace();

	      if (nativeFontFace) {
	        this.addNativeFontFace(nativeFontFace);

	        try {
	          await nativeFontFace.loaded;
	        } catch (ex) {
	          this._onUnsupportedFeature({
	            featureId: _util.UNSUPPORTED_FEATURES.errorFontLoadNative
	          });

	          (0, _util.warn)(`Failed to load font '${nativeFontFace.family}': '${ex}'.`);
	          font.disableFontFace = true;
	          throw ex;
	        }
	      }

	      return;
	    }

	    const rule = font.createFontFaceRule();

	    if (rule) {
	      this.insertRule(rule);

	      if (this.isSyncFontLoadingSupported) {
	        return;
	      }

	      await new Promise(resolve => {
	        const request = this._queueLoadingCallback(resolve);

	        this._prepareFontLoadEvent([rule], [font], request);
	      });
	    }
	  }

	  _queueLoadingCallback(callback) {
	    (0, _util.unreachable)("Abstract method `_queueLoadingCallback`.");
	  }

	  get isFontLoadingAPISupported() {
	    const supported = typeof document !== "undefined" && !!document.fonts;
	    return (0, _util.shadow)(this, "isFontLoadingAPISupported", supported);
	  }

	  get isSyncFontLoadingSupported() {
	    (0, _util.unreachable)("Abstract method `isSyncFontLoadingSupported`.");
	  }

	  get _loadTestFont() {
	    (0, _util.unreachable)("Abstract method `_loadTestFont`.");
	  }

	  _prepareFontLoadEvent(rules, fontsToLoad, request) {
	    (0, _util.unreachable)("Abstract method `_prepareFontLoadEvent`.");
	  }

	}

	let FontLoader;
	exports.FontLoader = FontLoader;
	{
	  exports.FontLoader = FontLoader = class GenericFontLoader extends BaseFontLoader {
	    constructor(docId) {
	      super(docId);
	      this.loadingContext = {
	        requests: [],
	        nextRequestId: 0
	      };
	      this.loadTestFontId = 0;
	    }

	    get isSyncFontLoadingSupported() {
	      let supported = false;

	      if (typeof navigator === "undefined") {
	        supported = true;
	      } else {
	        const m = /Mozilla\/5.0.*?rv:(\d+).*? Gecko/.exec(navigator.userAgent);

	        if (m && m[1] >= 14) {
	          supported = true;
	        }
	      }

	      return (0, _util.shadow)(this, "isSyncFontLoadingSupported", supported);
	    }

	    _queueLoadingCallback(callback) {
	      function completeRequest() {
	        (0, _util.assert)(!request.done, "completeRequest() cannot be called twice.");
	        request.done = true;

	        while (context.requests.length > 0 && context.requests[0].done) {
	          const otherRequest = context.requests.shift();
	          setTimeout(otherRequest.callback, 0);
	        }
	      }

	      const context = this.loadingContext;
	      const request = {
	        id: `pdfjs-font-loading-${context.nextRequestId++}`,
	        done: false,
	        complete: completeRequest,
	        callback
	      };
	      context.requests.push(request);
	      return request;
	    }

	    get _loadTestFont() {
	      const getLoadTestFont = function () {
	        return atob("T1RUTwALAIAAAwAwQ0ZGIDHtZg4AAAOYAAAAgUZGVE1lkzZwAAAEHAAAABxHREVGABQA" + "FQAABDgAAAAeT1MvMlYNYwkAAAEgAAAAYGNtYXABDQLUAAACNAAAAUJoZWFk/xVFDQAA" + "ALwAAAA2aGhlYQdkA+oAAAD0AAAAJGhtdHgD6AAAAAAEWAAAAAZtYXhwAAJQAAAAARgA" + "AAAGbmFtZVjmdH4AAAGAAAAAsXBvc3T/hgAzAAADeAAAACAAAQAAAAEAALZRFsRfDzz1" + "AAsD6AAAAADOBOTLAAAAAM4KHDwAAAAAA+gDIQAAAAgAAgAAAAAAAAABAAADIQAAAFoD" + "6AAAAAAD6AABAAAAAAAAAAAAAAAAAAAAAQAAUAAAAgAAAAQD6AH0AAUAAAKKArwAAACM" + "AooCvAAAAeAAMQECAAACAAYJAAAAAAAAAAAAAQAAAAAAAAAAAAAAAFBmRWQAwAAuAC4D" + "IP84AFoDIQAAAAAAAQAAAAAAAAAAACAAIAABAAAADgCuAAEAAAAAAAAAAQAAAAEAAAAA" + "AAEAAQAAAAEAAAAAAAIAAQAAAAEAAAAAAAMAAQAAAAEAAAAAAAQAAQAAAAEAAAAAAAUA" + "AQAAAAEAAAAAAAYAAQAAAAMAAQQJAAAAAgABAAMAAQQJAAEAAgABAAMAAQQJAAIAAgAB" + "AAMAAQQJAAMAAgABAAMAAQQJAAQAAgABAAMAAQQJAAUAAgABAAMAAQQJAAYAAgABWABY" + "AAAAAAAAAwAAAAMAAAAcAAEAAAAAADwAAwABAAAAHAAEACAAAAAEAAQAAQAAAC7//wAA" + "AC7////TAAEAAAAAAAABBgAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAD/gwAyAAAAAQAAAAAAAAAAAAAAAAAA" + "AAABAAQEAAEBAQJYAAEBASH4DwD4GwHEAvgcA/gXBIwMAYuL+nz5tQXkD5j3CBLnEQAC" + "AQEBIVhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYAAABAQAADwACAQEEE/t3" + "Dov6fAH6fAT+fPp8+nwHDosMCvm1Cvm1DAz6fBQAAAAAAAABAAAAAMmJbzEAAAAAzgTj" + "FQAAAADOBOQpAAEAAAAAAAAADAAUAAQAAAABAAAAAgABAAAAAAAAAAAD6AAAAAAAAA==");
	      };

	      return (0, _util.shadow)(this, "_loadTestFont", getLoadTestFont());
	    }

	    _prepareFontLoadEvent(rules, fonts, request) {
	      function int32(data, offset) {
	        return data.charCodeAt(offset) << 24 | data.charCodeAt(offset + 1) << 16 | data.charCodeAt(offset + 2) << 8 | data.charCodeAt(offset + 3) & 0xff;
	      }

	      function spliceString(s, offset, remove, insert) {
	        const chunk1 = s.substring(0, offset);
	        const chunk2 = s.substring(offset + remove);
	        return chunk1 + insert + chunk2;
	      }

	      let i, ii;
	      const canvas = document.createElement("canvas");
	      canvas.width = 1;
	      canvas.height = 1;
	      const ctx = canvas.getContext("2d");
	      let called = 0;

	      function isFontReady(name, callback) {
	        called++;

	        if (called > 30) {
	          (0, _util.warn)("Load test font never loaded.");
	          callback();
	          return;
	        }

	        ctx.font = "30px " + name;
	        ctx.fillText(".", 0, 20);
	        const imageData = ctx.getImageData(0, 0, 1, 1);

	        if (imageData.data[3] > 0) {
	          callback();
	          return;
	        }

	        setTimeout(isFontReady.bind(null, name, callback));
	      }

	      const loadTestFontId = `lt${Date.now()}${this.loadTestFontId++}`;
	      let data = this._loadTestFont;
	      const COMMENT_OFFSET = 976;
	      data = spliceString(data, COMMENT_OFFSET, loadTestFontId.length, loadTestFontId);
	      const CFF_CHECKSUM_OFFSET = 16;
	      const XXXX_VALUE = 0x58585858;
	      let checksum = int32(data, CFF_CHECKSUM_OFFSET);

	      for (i = 0, ii = loadTestFontId.length - 3; i < ii; i += 4) {
	        checksum = checksum - XXXX_VALUE + int32(loadTestFontId, i) | 0;
	      }

	      if (i < loadTestFontId.length) {
	        checksum = checksum - XXXX_VALUE + int32(loadTestFontId + "XXX", i) | 0;
	      }

	      data = spliceString(data, CFF_CHECKSUM_OFFSET, 4, (0, _util.string32)(checksum));
	      const url = `url(data:font/opentype;base64,${btoa(data)});`;
	      const rule = `@font-face {font-family:"${loadTestFontId}";src:${url}}`;
	      this.insertRule(rule);
	      const names = [];

	      for (i = 0, ii = fonts.length; i < ii; i++) {
	        names.push(fonts[i].loadedName);
	      }

	      names.push(loadTestFontId);
	      const div = document.createElement("div");
	      div.style.visibility = "hidden";
	      div.style.width = div.style.height = "10px";
	      div.style.position = "absolute";
	      div.style.top = div.style.left = "0px";

	      for (i = 0, ii = names.length; i < ii; ++i) {
	        const span = document.createElement("span");
	        span.textContent = "Hi";
	        span.style.fontFamily = names[i];
	        div.appendChild(span);
	      }

	      document.body.appendChild(div);
	      isFontReady(loadTestFontId, function () {
	        document.body.removeChild(div);
	        request.complete();
	      });
	    }

	  };
	}

	class FontFaceObject {
	  constructor(translatedData, {
	    isEvalSupported = true,
	    disableFontFace = false,
	    ignoreErrors = false,
	    onUnsupportedFeature = null,
	    fontRegistry = null
	  }) {
	    this.compiledGlyphs = Object.create(null);

	    for (const i in translatedData) {
	      this[i] = translatedData[i];
	    }

	    this.isEvalSupported = isEvalSupported !== false;
	    this.disableFontFace = disableFontFace === true;
	    this.ignoreErrors = ignoreErrors === true;
	    this._onUnsupportedFeature = onUnsupportedFeature;
	    this.fontRegistry = fontRegistry;
	  }

	  createNativeFontFace() {
	    if (!this.data || this.disableFontFace) {
	      return null;
	    }

	    const nativeFontFace = new FontFace(this.loadedName, this.data, {});

	    if (this.fontRegistry) {
	      this.fontRegistry.registerFont(this);
	    }

	    return nativeFontFace;
	  }

	  createFontFaceRule() {
	    if (!this.data || this.disableFontFace) {
	      return null;
	    }

	    const data = (0, _util.bytesToString)(new Uint8Array(this.data));
	    const url = `url(data:${this.mimetype};base64,${btoa(data)});`;
	    const rule = `@font-face {font-family:"${this.loadedName}";src:${url}}`;

	    if (this.fontRegistry) {
	      this.fontRegistry.registerFont(this, url);
	    }

	    return rule;
	  }

	  getPathGenerator(objs, character) {
	    if (this.compiledGlyphs[character] !== undefined) {
	      return this.compiledGlyphs[character];
	    }

	    let cmds, current;

	    try {
	      cmds = objs.get(this.loadedName + "_path_" + character);
	    } catch (ex) {
	      if (!this.ignoreErrors) {
	        throw ex;
	      }

	      if (this._onUnsupportedFeature) {
	        this._onUnsupportedFeature({
	          featureId: _util.UNSUPPORTED_FEATURES.errorFontGetPath
	        });
	      }

	      (0, _util.warn)(`getPathGenerator - ignoring character: "${ex}".`);
	      return this.compiledGlyphs[character] = function (c, size) {};
	    }

	    if (this.isEvalSupported && _util.IsEvalSupportedCached.value) {
	      let args,
	          js = "";

	      for (let i = 0, ii = cmds.length; i < ii; i++) {
	        current = cmds[i];

	        if (current.args !== undefined) {
	          args = current.args.join(",");
	        } else {
	          args = "";
	        }

	        js += "c." + current.cmd + "(" + args + ");\n";
	      }

	      return this.compiledGlyphs[character] = new Function("c", "size", js);
	    }

	    return this.compiledGlyphs[character] = function (c, size) {
	      for (let i = 0, ii = cmds.length; i < ii; i++) {
	        current = cmds[i];

	        if (current.cmd === "scale") {
	          current.args = [size, -size];
	        }

	        c[current.cmd].apply(c, current.args);
	      }
	    };
	  }

	}

	exports.FontFaceObject = FontFaceObject;

	/***/ }),
	/* 7 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.apiCompatibilityParams = void 0;

	var _is_node = __w_pdfjs_require__(4);

	const compatibilityParams = Object.create(null);
	{
	  (function checkFontFace() {
	    if (_is_node.isNodeJS) {
	      compatibilityParams.disableFontFace = true;
	    }
	  })();
	}
	const apiCompatibilityParams = Object.freeze(compatibilityParams);
	exports.apiCompatibilityParams = apiCompatibilityParams;

	/***/ }),
	/* 8 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.CanvasGraphics = void 0;

	var _util = __w_pdfjs_require__(2);

	var _pattern_helper = __w_pdfjs_require__(9);

	var MIN_FONT_SIZE = 16;
	var MAX_FONT_SIZE = 100;
	var MAX_GROUP_SIZE = 4096;
	var MIN_WIDTH_FACTOR = 0.65;
	var MAX_SIZE_TO_COMPILE = 1000;
	var FULL_CHUNK_HEIGHT = 16;

	function addContextCurrentTransform(ctx) {
	  if (!ctx.mozCurrentTransform) {
	    ctx._originalSave = ctx.save;
	    ctx._originalRestore = ctx.restore;
	    ctx._originalRotate = ctx.rotate;
	    ctx._originalScale = ctx.scale;
	    ctx._originalTranslate = ctx.translate;
	    ctx._originalTransform = ctx.transform;
	    ctx._originalSetTransform = ctx.setTransform;
	    ctx._transformMatrix = ctx._transformMatrix || [1, 0, 0, 1, 0, 0];
	    ctx._transformStack = [];
	    Object.defineProperty(ctx, "mozCurrentTransform", {
	      get: function getCurrentTransform() {
	        return this._transformMatrix;
	      }
	    });
	    Object.defineProperty(ctx, "mozCurrentTransformInverse", {
	      get: function getCurrentTransformInverse() {
	        var m = this._transformMatrix;
	        var a = m[0],
	            b = m[1],
	            c = m[2],
	            d = m[3],
	            e = m[4],
	            f = m[5];
	        var ad_bc = a * d - b * c;
	        var bc_ad = b * c - a * d;
	        return [d / ad_bc, b / bc_ad, c / bc_ad, a / ad_bc, (d * e - c * f) / bc_ad, (b * e - a * f) / ad_bc];
	      }
	    });

	    ctx.save = function ctxSave() {
	      var old = this._transformMatrix;

	      this._transformStack.push(old);

	      this._transformMatrix = old.slice(0, 6);

	      this._originalSave();
	    };

	    ctx.restore = function ctxRestore() {
	      var prev = this._transformStack.pop();

	      if (prev) {
	        this._transformMatrix = prev;

	        this._originalRestore();
	      }
	    };

	    ctx.translate = function ctxTranslate(x, y) {
	      var m = this._transformMatrix;
	      m[4] = m[0] * x + m[2] * y + m[4];
	      m[5] = m[1] * x + m[3] * y + m[5];

	      this._originalTranslate(x, y);
	    };

	    ctx.scale = function ctxScale(x, y) {
	      var m = this._transformMatrix;
	      m[0] = m[0] * x;
	      m[1] = m[1] * x;
	      m[2] = m[2] * y;
	      m[3] = m[3] * y;

	      this._originalScale(x, y);
	    };

	    ctx.transform = function ctxTransform(a, b, c, d, e, f) {
	      var m = this._transformMatrix;
	      this._transformMatrix = [m[0] * a + m[2] * b, m[1] * a + m[3] * b, m[0] * c + m[2] * d, m[1] * c + m[3] * d, m[0] * e + m[2] * f + m[4], m[1] * e + m[3] * f + m[5]];

	      ctx._originalTransform(a, b, c, d, e, f);
	    };

	    ctx.setTransform = function ctxSetTransform(a, b, c, d, e, f) {
	      this._transformMatrix = [a, b, c, d, e, f];

	      ctx._originalSetTransform(a, b, c, d, e, f);
	    };

	    ctx.rotate = function ctxRotate(angle) {
	      var cosValue = Math.cos(angle);
	      var sinValue = Math.sin(angle);
	      var m = this._transformMatrix;
	      this._transformMatrix = [m[0] * cosValue + m[2] * sinValue, m[1] * cosValue + m[3] * sinValue, m[0] * -sinValue + m[2] * cosValue, m[1] * -sinValue + m[3] * cosValue, m[4], m[5]];

	      this._originalRotate(angle);
	    };
	  }
	}

	var CachedCanvases = function CachedCanvasesClosure() {
	  function CachedCanvases(canvasFactory) {
	    this.canvasFactory = canvasFactory;
	    this.cache = Object.create(null);
	  }

	  CachedCanvases.prototype = {
	    getCanvas: function CachedCanvases_getCanvas(id, width, height, trackTransform) {
	      var canvasEntry;

	      if (this.cache[id] !== undefined) {
	        canvasEntry = this.cache[id];
	        this.canvasFactory.reset(canvasEntry, width, height);
	        canvasEntry.context.setTransform(1, 0, 0, 1, 0, 0);
	      } else {
	        canvasEntry = this.canvasFactory.create(width, height);
	        this.cache[id] = canvasEntry;
	      }

	      if (trackTransform) {
	        addContextCurrentTransform(canvasEntry.context);
	      }

	      return canvasEntry;
	    },

	    clear() {
	      for (var id in this.cache) {
	        var canvasEntry = this.cache[id];
	        this.canvasFactory.destroy(canvasEntry);
	        delete this.cache[id];
	      }
	    }

	  };
	  return CachedCanvases;
	}();

	function compileType3Glyph(imgData) {
	  var POINT_TO_PROCESS_LIMIT = 1000;
	  var width = imgData.width,
	      height = imgData.height;
	  var i,
	      j,
	      j0,
	      width1 = width + 1;
	  var points = new Uint8Array(width1 * (height + 1));
	  var POINT_TYPES = new Uint8Array([0, 2, 4, 0, 1, 0, 5, 4, 8, 10, 0, 8, 0, 2, 1, 0]);
	  var lineSize = width + 7 & ~7,
	      data0 = imgData.data;
	  var data = new Uint8Array(lineSize * height),
	      pos = 0,
	      ii;

	  for (i = 0, ii = data0.length; i < ii; i++) {
	    var mask = 128,
	        elem = data0[i];

	    while (mask > 0) {
	      data[pos++] = elem & mask ? 0 : 255;
	      mask >>= 1;
	    }
	  }

	  var count = 0;
	  pos = 0;

	  if (data[pos] !== 0) {
	    points[0] = 1;
	    ++count;
	  }

	  for (j = 1; j < width; j++) {
	    if (data[pos] !== data[pos + 1]) {
	      points[j] = data[pos] ? 2 : 1;
	      ++count;
	    }

	    pos++;
	  }

	  if (data[pos] !== 0) {
	    points[j] = 2;
	    ++count;
	  }

	  for (i = 1; i < height; i++) {
	    pos = i * lineSize;
	    j0 = i * width1;

	    if (data[pos - lineSize] !== data[pos]) {
	      points[j0] = data[pos] ? 1 : 8;
	      ++count;
	    }

	    var sum = (data[pos] ? 4 : 0) + (data[pos - lineSize] ? 8 : 0);

	    for (j = 1; j < width; j++) {
	      sum = (sum >> 2) + (data[pos + 1] ? 4 : 0) + (data[pos - lineSize + 1] ? 8 : 0);

	      if (POINT_TYPES[sum]) {
	        points[j0 + j] = POINT_TYPES[sum];
	        ++count;
	      }

	      pos++;
	    }

	    if (data[pos - lineSize] !== data[pos]) {
	      points[j0 + j] = data[pos] ? 2 : 4;
	      ++count;
	    }

	    if (count > POINT_TO_PROCESS_LIMIT) {
	      return null;
	    }
	  }

	  pos = lineSize * (height - 1);
	  j0 = i * width1;

	  if (data[pos] !== 0) {
	    points[j0] = 8;
	    ++count;
	  }

	  for (j = 1; j < width; j++) {
	    if (data[pos] !== data[pos + 1]) {
	      points[j0 + j] = data[pos] ? 4 : 8;
	      ++count;
	    }

	    pos++;
	  }

	  if (data[pos] !== 0) {
	    points[j0 + j] = 4;
	    ++count;
	  }

	  if (count > POINT_TO_PROCESS_LIMIT) {
	    return null;
	  }

	  var steps = new Int32Array([0, width1, -1, 0, -width1, 0, 0, 0, 1]);
	  var outlines = [];

	  for (i = 0; count && i <= height; i++) {
	    var p = i * width1;
	    var end = p + width;

	    while (p < end && !points[p]) {
	      p++;
	    }

	    if (p === end) {
	      continue;
	    }

	    var coords = [p % width1, i];
	    var type = points[p],
	        p0 = p,
	        pp;

	    do {
	      var step = steps[type];

	      do {
	        p += step;
	      } while (!points[p]);

	      pp = points[p];

	      if (pp !== 5 && pp !== 10) {
	        type = pp;
	        points[p] = 0;
	      } else {
	        type = pp & 0x33 * type >> 4;
	        points[p] &= type >> 2 | type << 2;
	      }

	      coords.push(p % width1);
	      coords.push(p / width1 | 0);

	      if (!points[p]) {
	        --count;
	      }
	    } while (p0 !== p);

	    outlines.push(coords);
	    --i;
	  }

	  var drawOutline = function (c) {
	    c.save();
	    c.scale(1 / width, -1 / height);
	    c.translate(0, -height);
	    c.beginPath();

	    for (let k = 0, kk = outlines.length; k < kk; k++) {
	      var o = outlines[k];
	      c.moveTo(o[0], o[1]);

	      for (let l = 2, ll = o.length; l < ll; l += 2) {
	        c.lineTo(o[l], o[l + 1]);
	      }
	    }

	    c.fill();
	    c.beginPath();
	    c.restore();
	  };

	  return drawOutline;
	}

	var CanvasExtraState = function CanvasExtraStateClosure() {
	  function CanvasExtraState() {
	    this.alphaIsShape = false;
	    this.fontSize = 0;
	    this.fontSizeScale = 1;
	    this.textMatrix = _util.IDENTITY_MATRIX;
	    this.textMatrixScale = 1;
	    this.fontMatrix = _util.FONT_IDENTITY_MATRIX;
	    this.leading = 0;
	    this.x = 0;
	    this.y = 0;
	    this.lineX = 0;
	    this.lineY = 0;
	    this.charSpacing = 0;
	    this.wordSpacing = 0;
	    this.textHScale = 1;
	    this.textRenderingMode = _util.TextRenderingMode.FILL;
	    this.textRise = 0;
	    this.fillColor = "#000000";
	    this.strokeColor = "#000000";
	    this.patternFill = false;
	    this.fillAlpha = 1;
	    this.strokeAlpha = 1;
	    this.lineWidth = 1;
	    this.activeSMask = null;
	    this.resumeSMaskCtx = null;
	  }

	  CanvasExtraState.prototype = {
	    clone: function CanvasExtraState_clone() {
	      return Object.create(this);
	    },
	    setCurrentPoint: function CanvasExtraState_setCurrentPoint(x, y) {
	      this.x = x;
	      this.y = y;
	    }
	  };
	  return CanvasExtraState;
	}();

	var CanvasGraphics = function CanvasGraphicsClosure() {
	  var EXECUTION_TIME = 15;
	  var EXECUTION_STEPS = 10;

	  function CanvasGraphics(canvasCtx, commonObjs, objs, canvasFactory, webGLContext, imageLayer) {
	    this.ctx = canvasCtx;
	    this.current = new CanvasExtraState();
	    this.stateStack = [];
	    this.pendingClip = null;
	    this.pendingEOFill = false;
	    this.res = null;
	    this.xobjs = null;
	    this.commonObjs = commonObjs;
	    this.objs = objs;
	    this.canvasFactory = canvasFactory;
	    this.webGLContext = webGLContext;
	    this.imageLayer = imageLayer;
	    this.groupStack = [];
	    this.processingType3 = null;
	    this.baseTransform = null;
	    this.baseTransformStack = [];
	    this.groupLevel = 0;
	    this.smaskStack = [];
	    this.smaskCounter = 0;
	    this.tempSMask = null;
	    this.cachedCanvases = new CachedCanvases(this.canvasFactory);

	    if (canvasCtx) {
	      addContextCurrentTransform(canvasCtx);
	    }

	    this._cachedGetSinglePixelWidth = null;
	  }

	  function putBinaryImageData(ctx, imgData) {
	    if (typeof ImageData !== "undefined" && imgData instanceof ImageData) {
	      ctx.putImageData(imgData, 0, 0);
	      return;
	    }

	    var height = imgData.height,
	        width = imgData.width;
	    var partialChunkHeight = height % FULL_CHUNK_HEIGHT;
	    var fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
	    var totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
	    var chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
	    var srcPos = 0,
	        destPos;
	    var src = imgData.data;
	    var dest = chunkImgData.data;
	    var i, j, thisChunkHeight, elemsInThisChunk;

	    if (imgData.kind === _util.ImageKind.GRAYSCALE_1BPP) {
	      var srcLength = src.byteLength;
	      var dest32 = new Uint32Array(dest.buffer, 0, dest.byteLength >> 2);
	      var dest32DataLength = dest32.length;
	      var fullSrcDiff = width + 7 >> 3;
	      var white = 0xffffffff;
	      var black = _util.IsLittleEndianCached.value ? 0xff000000 : 0x000000ff;

	      for (i = 0; i < totalChunks; i++) {
	        thisChunkHeight = i < fullChunks ? FULL_CHUNK_HEIGHT : partialChunkHeight;
	        destPos = 0;

	        for (j = 0; j < thisChunkHeight; j++) {
	          var srcDiff = srcLength - srcPos;
	          var k = 0;
	          var kEnd = srcDiff > fullSrcDiff ? width : srcDiff * 8 - 7;
	          var kEndUnrolled = kEnd & ~7;
	          var mask = 0;
	          var srcByte = 0;

	          for (; k < kEndUnrolled; k += 8) {
	            srcByte = src[srcPos++];
	            dest32[destPos++] = srcByte & 128 ? white : black;
	            dest32[destPos++] = srcByte & 64 ? white : black;
	            dest32[destPos++] = srcByte & 32 ? white : black;
	            dest32[destPos++] = srcByte & 16 ? white : black;
	            dest32[destPos++] = srcByte & 8 ? white : black;
	            dest32[destPos++] = srcByte & 4 ? white : black;
	            dest32[destPos++] = srcByte & 2 ? white : black;
	            dest32[destPos++] = srcByte & 1 ? white : black;
	          }

	          for (; k < kEnd; k++) {
	            if (mask === 0) {
	              srcByte = src[srcPos++];
	              mask = 128;
	            }

	            dest32[destPos++] = srcByte & mask ? white : black;
	            mask >>= 1;
	          }
	        }

	        while (destPos < dest32DataLength) {
	          dest32[destPos++] = 0;
	        }

	        ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
	      }
	    } else if (imgData.kind === _util.ImageKind.RGBA_32BPP) {
	      j = 0;
	      elemsInThisChunk = width * FULL_CHUNK_HEIGHT * 4;

	      for (i = 0; i < fullChunks; i++) {
	        dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
	        srcPos += elemsInThisChunk;
	        ctx.putImageData(chunkImgData, 0, j);
	        j += FULL_CHUNK_HEIGHT;
	      }

	      if (i < totalChunks) {
	        elemsInThisChunk = width * partialChunkHeight * 4;
	        dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
	        ctx.putImageData(chunkImgData, 0, j);
	      }
	    } else if (imgData.kind === _util.ImageKind.RGB_24BPP) {
	      thisChunkHeight = FULL_CHUNK_HEIGHT;
	      elemsInThisChunk = width * thisChunkHeight;

	      for (i = 0; i < totalChunks; i++) {
	        if (i >= fullChunks) {
	          thisChunkHeight = partialChunkHeight;
	          elemsInThisChunk = width * thisChunkHeight;
	        }

	        destPos = 0;

	        for (j = elemsInThisChunk; j--;) {
	          dest[destPos++] = src[srcPos++];
	          dest[destPos++] = src[srcPos++];
	          dest[destPos++] = src[srcPos++];
	          dest[destPos++] = 255;
	        }

	        ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
	      }
	    } else {
	      throw new Error(`bad image kind: ${imgData.kind}`);
	    }
	  }

	  function putBinaryImageMask(ctx, imgData) {
	    var height = imgData.height,
	        width = imgData.width;
	    var partialChunkHeight = height % FULL_CHUNK_HEIGHT;
	    var fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
	    var totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
	    var chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
	    var srcPos = 0;
	    var src = imgData.data;
	    var dest = chunkImgData.data;

	    for (var i = 0; i < totalChunks; i++) {
	      var thisChunkHeight = i < fullChunks ? FULL_CHUNK_HEIGHT : partialChunkHeight;
	      var destPos = 3;

	      for (var j = 0; j < thisChunkHeight; j++) {
	        var mask = 0;

	        for (var k = 0; k < width; k++) {
	          if (!mask) {
	            var elem = src[srcPos++];
	            mask = 128;
	          }

	          dest[destPos] = elem & mask ? 0 : 255;
	          destPos += 4;
	          mask >>= 1;
	        }
	      }

	      ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
	    }
	  }

	  function copyCtxState(sourceCtx, destCtx) {
	    var properties = ["strokeStyle", "fillStyle", "fillRule", "globalAlpha", "lineWidth", "lineCap", "lineJoin", "miterLimit", "globalCompositeOperation", "font"];

	    for (var i = 0, ii = properties.length; i < ii; i++) {
	      var property = properties[i];

	      if (sourceCtx[property] !== undefined) {
	        destCtx[property] = sourceCtx[property];
	      }
	    }

	    if (sourceCtx.setLineDash !== undefined) {
	      destCtx.setLineDash(sourceCtx.getLineDash());
	      destCtx.lineDashOffset = sourceCtx.lineDashOffset;
	    }
	  }

	  function resetCtxToDefault(ctx) {
	    ctx.strokeStyle = "#000000";
	    ctx.fillStyle = "#000000";
	    ctx.fillRule = "nonzero";
	    ctx.globalAlpha = 1;
	    ctx.lineWidth = 1;
	    ctx.lineCap = "butt";
	    ctx.lineJoin = "miter";
	    ctx.miterLimit = 10;
	    ctx.globalCompositeOperation = "source-over";
	    ctx.font = "10px sans-serif";

	    if (ctx.setLineDash !== undefined) {
	      ctx.setLineDash([]);
	      ctx.lineDashOffset = 0;
	    }
	  }

	  function composeSMaskBackdrop(bytes, r0, g0, b0) {
	    var length = bytes.length;

	    for (var i = 3; i < length; i += 4) {
	      var alpha = bytes[i];

	      if (alpha === 0) {
	        bytes[i - 3] = r0;
	        bytes[i - 2] = g0;
	        bytes[i - 1] = b0;
	      } else if (alpha < 255) {
	        var alpha_ = 255 - alpha;
	        bytes[i - 3] = bytes[i - 3] * alpha + r0 * alpha_ >> 8;
	        bytes[i - 2] = bytes[i - 2] * alpha + g0 * alpha_ >> 8;
	        bytes[i - 1] = bytes[i - 1] * alpha + b0 * alpha_ >> 8;
	      }
	    }
	  }

	  function composeSMaskAlpha(maskData, layerData, transferMap) {
	    var length = maskData.length;
	    var scale = 1 / 255;

	    for (var i = 3; i < length; i += 4) {
	      var alpha = transferMap ? transferMap[maskData[i]] : maskData[i];
	      layerData[i] = layerData[i] * alpha * scale | 0;
	    }
	  }

	  function composeSMaskLuminosity(maskData, layerData, transferMap) {
	    var length = maskData.length;

	    for (var i = 3; i < length; i += 4) {
	      var y = maskData[i - 3] * 77 + maskData[i - 2] * 152 + maskData[i - 1] * 28;
	      layerData[i] = transferMap ? layerData[i] * transferMap[y >> 8] >> 8 : layerData[i] * y >> 16;
	    }
	  }

	  function genericComposeSMask(maskCtx, layerCtx, width, height, subtype, backdrop, transferMap) {
	    var hasBackdrop = !!backdrop;
	    var r0 = hasBackdrop ? backdrop[0] : 0;
	    var g0 = hasBackdrop ? backdrop[1] : 0;
	    var b0 = hasBackdrop ? backdrop[2] : 0;
	    var composeFn;

	    if (subtype === "Luminosity") {
	      composeFn = composeSMaskLuminosity;
	    } else {
	      composeFn = composeSMaskAlpha;
	    }

	    var PIXELS_TO_PROCESS = 1048576;
	    var chunkSize = Math.min(height, Math.ceil(PIXELS_TO_PROCESS / width));

	    for (var row = 0; row < height; row += chunkSize) {
	      var chunkHeight = Math.min(chunkSize, height - row);
	      var maskData = maskCtx.getImageData(0, row, width, chunkHeight);
	      var layerData = layerCtx.getImageData(0, row, width, chunkHeight);

	      if (hasBackdrop) {
	        composeSMaskBackdrop(maskData.data, r0, g0, b0);
	      }

	      composeFn(maskData.data, layerData.data, transferMap);
	      maskCtx.putImageData(layerData, 0, row);
	    }
	  }

	  function composeSMask(ctx, smask, layerCtx, webGLContext) {
	    var mask = smask.canvas;
	    var maskCtx = smask.context;
	    ctx.setTransform(smask.scaleX, 0, 0, smask.scaleY, smask.offsetX, smask.offsetY);
	    var backdrop = smask.backdrop || null;

	    if (!smask.transferMap && webGLContext.isEnabled) {
	      const composed = webGLContext.composeSMask({
	        layer: layerCtx.canvas,
	        mask,
	        properties: {
	          subtype: smask.subtype,
	          backdrop
	        }
	      });
	      ctx.setTransform(1, 0, 0, 1, 0, 0);
	      ctx.drawImage(composed, smask.offsetX, smask.offsetY);
	      return;
	    }

	    genericComposeSMask(maskCtx, layerCtx, mask.width, mask.height, smask.subtype, backdrop, smask.transferMap);
	    ctx.drawImage(mask, 0, 0);
	  }

	  var LINE_CAP_STYLES = ["butt", "round", "square"];
	  var LINE_JOIN_STYLES = ["miter", "round", "bevel"];
	  var NORMAL_CLIP = {};
	  var EO_CLIP = {};
	  CanvasGraphics.prototype = {
	    beginDrawing({
	      transform,
	      viewport,
	      transparency = false,
	      background = null
	    }) {
	      var width = this.ctx.canvas.width;
	      var height = this.ctx.canvas.height;
	      this.ctx.save();
	      this.ctx.fillStyle = background || "rgb(255, 255, 255)";
	      this.ctx.fillRect(0, 0, width, height);
	      this.ctx.restore();

	      if (transparency) {
	        var transparentCanvas = this.cachedCanvases.getCanvas("transparent", width, height, true);
	        this.compositeCtx = this.ctx;
	        this.transparentCanvas = transparentCanvas.canvas;
	        this.ctx = transparentCanvas.context;
	        this.ctx.save();
	        this.ctx.transform.apply(this.ctx, this.compositeCtx.mozCurrentTransform);
	      }

	      this.ctx.save();
	      resetCtxToDefault(this.ctx);

	      if (transform) {
	        this.ctx.transform.apply(this.ctx, transform);
	      }

	      this.ctx.transform.apply(this.ctx, viewport.transform);
	      this.baseTransform = this.ctx.mozCurrentTransform.slice();

	      if (this.imageLayer) {
	        this.imageLayer.beginLayout();
	      }
	    },

	    executeOperatorList: function CanvasGraphics_executeOperatorList(operatorList, executionStartIdx, continueCallback, stepper) {
	      var argsArray = operatorList.argsArray;
	      var fnArray = operatorList.fnArray;
	      var i = executionStartIdx || 0;
	      var argsArrayLen = argsArray.length;

	      if (argsArrayLen === i) {
	        return i;
	      }

	      var chunkOperations = argsArrayLen - i > EXECUTION_STEPS && typeof continueCallback === "function";
	      var endTime = chunkOperations ? Date.now() + EXECUTION_TIME : 0;
	      var steps = 0;
	      var commonObjs = this.commonObjs;
	      var objs = this.objs;
	      var fnId;

	      while (true) {
	        if (stepper !== undefined && i === stepper.nextBreakPoint) {
	          stepper.breakIt(i, continueCallback);
	          return i;
	        }

	        fnId = fnArray[i];

	        if (fnId !== _util.OPS.dependency) {
	          this[fnId].apply(this, argsArray[i]);
	        } else {
	          for (const depObjId of argsArray[i]) {
	            const objsPool = depObjId.startsWith("g_") ? commonObjs : objs;

	            if (!objsPool.has(depObjId)) {
	              objsPool.get(depObjId, continueCallback);
	              return i;
	            }
	          }
	        }

	        i++;

	        if (i === argsArrayLen) {
	          return i;
	        }

	        if (chunkOperations && ++steps > EXECUTION_STEPS) {
	          if (Date.now() > endTime) {
	            continueCallback();
	            return i;
	          }

	          steps = 0;
	        }
	      }
	    },
	    endDrawing: function CanvasGraphics_endDrawing() {
	      if (this.current.activeSMask !== null) {
	        this.endSMaskGroup();
	      }

	      this.ctx.restore();

	      if (this.transparentCanvas) {
	        this.ctx = this.compositeCtx;
	        this.ctx.save();
	        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
	        this.ctx.drawImage(this.transparentCanvas, 0, 0);
	        this.ctx.restore();
	        this.transparentCanvas = null;
	      }

	      this.cachedCanvases.clear();
	      this.webGLContext.clear();

	      if (this.imageLayer) {
	        this.imageLayer.endLayout();
	      }
	    },
	    setLineWidth: function CanvasGraphics_setLineWidth(width) {
	      this.current.lineWidth = width;
	      this.ctx.lineWidth = width;
	    },
	    setLineCap: function CanvasGraphics_setLineCap(style) {
	      this.ctx.lineCap = LINE_CAP_STYLES[style];
	    },
	    setLineJoin: function CanvasGraphics_setLineJoin(style) {
	      this.ctx.lineJoin = LINE_JOIN_STYLES[style];
	    },
	    setMiterLimit: function CanvasGraphics_setMiterLimit(limit) {
	      this.ctx.miterLimit = limit;
	    },
	    setDash: function CanvasGraphics_setDash(dashArray, dashPhase) {
	      var ctx = this.ctx;

	      if (ctx.setLineDash !== undefined) {
	        ctx.setLineDash(dashArray);
	        ctx.lineDashOffset = dashPhase;
	      }
	    },

	    setRenderingIntent(intent) {},

	    setFlatness(flatness) {},

	    setGState: function CanvasGraphics_setGState(states) {
	      for (var i = 0, ii = states.length; i < ii; i++) {
	        var state = states[i];
	        var key = state[0];
	        var value = state[1];

	        switch (key) {
	          case "LW":
	            this.setLineWidth(value);
	            break;

	          case "LC":
	            this.setLineCap(value);
	            break;

	          case "LJ":
	            this.setLineJoin(value);
	            break;

	          case "ML":
	            this.setMiterLimit(value);
	            break;

	          case "D":
	            this.setDash(value[0], value[1]);
	            break;

	          case "RI":
	            this.setRenderingIntent(value);
	            break;

	          case "FL":
	            this.setFlatness(value);
	            break;

	          case "Font":
	            this.setFont(value[0], value[1]);
	            break;

	          case "CA":
	            this.current.strokeAlpha = state[1];
	            break;

	          case "ca":
	            this.current.fillAlpha = state[1];
	            this.ctx.globalAlpha = state[1];
	            break;

	          case "BM":
	            this.ctx.globalCompositeOperation = value;
	            break;

	          case "SMask":
	            if (this.current.activeSMask) {
	              if (this.stateStack.length > 0 && this.stateStack[this.stateStack.length - 1].activeSMask === this.current.activeSMask) {
	                this.suspendSMaskGroup();
	              } else {
	                this.endSMaskGroup();
	              }
	            }

	            this.current.activeSMask = value ? this.tempSMask : null;

	            if (this.current.activeSMask) {
	              this.beginSMaskGroup();
	            }

	            this.tempSMask = null;
	            break;
	        }
	      }
	    },
	    beginSMaskGroup: function CanvasGraphics_beginSMaskGroup() {
	      var activeSMask = this.current.activeSMask;
	      var drawnWidth = activeSMask.canvas.width;
	      var drawnHeight = activeSMask.canvas.height;
	      var cacheId = "smaskGroupAt" + this.groupLevel;
	      var scratchCanvas = this.cachedCanvases.getCanvas(cacheId, drawnWidth, drawnHeight, true);
	      var currentCtx = this.ctx;
	      var currentTransform = currentCtx.mozCurrentTransform;
	      this.ctx.save();
	      var groupCtx = scratchCanvas.context;
	      groupCtx.scale(1 / activeSMask.scaleX, 1 / activeSMask.scaleY);
	      groupCtx.translate(-activeSMask.offsetX, -activeSMask.offsetY);
	      groupCtx.transform.apply(groupCtx, currentTransform);
	      activeSMask.startTransformInverse = groupCtx.mozCurrentTransformInverse;
	      copyCtxState(currentCtx, groupCtx);
	      this.ctx = groupCtx;
	      this.setGState([["BM", "source-over"], ["ca", 1], ["CA", 1]]);
	      this.groupStack.push(currentCtx);
	      this.groupLevel++;
	    },
	    suspendSMaskGroup: function CanvasGraphics_endSMaskGroup() {
	      var groupCtx = this.ctx;
	      this.groupLevel--;
	      this.ctx = this.groupStack.pop();
	      composeSMask(this.ctx, this.current.activeSMask, groupCtx, this.webGLContext);
	      this.ctx.restore();
	      this.ctx.save();
	      copyCtxState(groupCtx, this.ctx);
	      this.current.resumeSMaskCtx = groupCtx;

	      var deltaTransform = _util.Util.transform(this.current.activeSMask.startTransformInverse, groupCtx.mozCurrentTransform);

	      this.ctx.transform.apply(this.ctx, deltaTransform);
	      groupCtx.save();
	      groupCtx.setTransform(1, 0, 0, 1, 0, 0);
	      groupCtx.clearRect(0, 0, groupCtx.canvas.width, groupCtx.canvas.height);
	      groupCtx.restore();
	    },
	    resumeSMaskGroup: function CanvasGraphics_endSMaskGroup() {
	      var groupCtx = this.current.resumeSMaskCtx;
	      var currentCtx = this.ctx;
	      this.ctx = groupCtx;
	      this.groupStack.push(currentCtx);
	      this.groupLevel++;
	    },
	    endSMaskGroup: function CanvasGraphics_endSMaskGroup() {
	      var groupCtx = this.ctx;
	      this.groupLevel--;
	      this.ctx = this.groupStack.pop();
	      composeSMask(this.ctx, this.current.activeSMask, groupCtx, this.webGLContext);
	      this.ctx.restore();
	      copyCtxState(groupCtx, this.ctx);

	      var deltaTransform = _util.Util.transform(this.current.activeSMask.startTransformInverse, groupCtx.mozCurrentTransform);

	      this.ctx.transform.apply(this.ctx, deltaTransform);
	    },
	    save: function CanvasGraphics_save() {
	      this.ctx.save();
	      var old = this.current;
	      this.stateStack.push(old);
	      this.current = old.clone();
	      this.current.resumeSMaskCtx = null;
	    },
	    restore: function CanvasGraphics_restore() {
	      if (this.current.resumeSMaskCtx) {
	        this.resumeSMaskGroup();
	      }

	      if (this.current.activeSMask !== null && (this.stateStack.length === 0 || this.stateStack[this.stateStack.length - 1].activeSMask !== this.current.activeSMask)) {
	        this.endSMaskGroup();
	      }

	      if (this.stateStack.length !== 0) {
	        this.current = this.stateStack.pop();
	        this.ctx.restore();
	        this.pendingClip = null;
	        this._cachedGetSinglePixelWidth = null;
	      }
	    },
	    transform: function CanvasGraphics_transform(a, b, c, d, e, f) {
	      this.ctx.transform(a, b, c, d, e, f);
	      this._cachedGetSinglePixelWidth = null;
	    },
	    constructPath: function CanvasGraphics_constructPath(ops, args) {
	      var ctx = this.ctx;
	      var current = this.current;
	      var x = current.x,
	          y = current.y;

	      for (var i = 0, j = 0, ii = ops.length; i < ii; i++) {
	        switch (ops[i] | 0) {
	          case _util.OPS.rectangle:
	            x = args[j++];
	            y = args[j++];
	            var width = args[j++];
	            var height = args[j++];

	            if (width === 0) {
	              width = this.getSinglePixelWidth();
	            }

	            if (height === 0) {
	              height = this.getSinglePixelWidth();
	            }

	            var xw = x + width;
	            var yh = y + height;
	            this.ctx.moveTo(x, y);
	            this.ctx.lineTo(xw, y);
	            this.ctx.lineTo(xw, yh);
	            this.ctx.lineTo(x, yh);
	            this.ctx.lineTo(x, y);
	            this.ctx.closePath();
	            break;

	          case _util.OPS.moveTo:
	            x = args[j++];
	            y = args[j++];
	            ctx.moveTo(x, y);
	            break;

	          case _util.OPS.lineTo:
	            x = args[j++];
	            y = args[j++];
	            ctx.lineTo(x, y);
	            break;

	          case _util.OPS.curveTo:
	            x = args[j + 4];
	            y = args[j + 5];
	            ctx.bezierCurveTo(args[j], args[j + 1], args[j + 2], args[j + 3], x, y);
	            j += 6;
	            break;

	          case _util.OPS.curveTo2:
	            ctx.bezierCurveTo(x, y, args[j], args[j + 1], args[j + 2], args[j + 3]);
	            x = args[j + 2];
	            y = args[j + 3];
	            j += 4;
	            break;

	          case _util.OPS.curveTo3:
	            x = args[j + 2];
	            y = args[j + 3];
	            ctx.bezierCurveTo(args[j], args[j + 1], x, y, x, y);
	            j += 4;
	            break;

	          case _util.OPS.closePath:
	            ctx.closePath();
	            break;
	        }
	      }

	      current.setCurrentPoint(x, y);
	    },
	    closePath: function CanvasGraphics_closePath() {
	      this.ctx.closePath();
	    },
	    stroke: function CanvasGraphics_stroke(consumePath) {
	      consumePath = typeof consumePath !== "undefined" ? consumePath : true;
	      var ctx = this.ctx;
	      var strokeColor = this.current.strokeColor;
	      ctx.globalAlpha = this.current.strokeAlpha;

	      if (strokeColor && strokeColor.hasOwnProperty("type") && strokeColor.type === "Pattern") {
	        ctx.save();
	        const transform = ctx.mozCurrentTransform;

	        const scale = _util.Util.singularValueDecompose2dScale(transform)[0];

	        ctx.strokeStyle = strokeColor.getPattern(ctx, this);
	        ctx.lineWidth = Math.max(this.getSinglePixelWidth() * MIN_WIDTH_FACTOR, this.current.lineWidth * scale);
	        ctx.stroke();
	        ctx.restore();
	      } else {
	        ctx.lineWidth = Math.max(this.getSinglePixelWidth() * MIN_WIDTH_FACTOR, this.current.lineWidth);
	        ctx.stroke();
	      }

	      if (consumePath) {
	        this.consumePath();
	      }

	      ctx.globalAlpha = this.current.fillAlpha;
	    },
	    closeStroke: function CanvasGraphics_closeStroke() {
	      this.closePath();
	      this.stroke();
	    },
	    fill: function CanvasGraphics_fill(consumePath) {
	      consumePath = typeof consumePath !== "undefined" ? consumePath : true;
	      var ctx = this.ctx;
	      var fillColor = this.current.fillColor;
	      var isPatternFill = this.current.patternFill;
	      var needRestore = false;

	      if (isPatternFill) {
	        ctx.save();

	        if (this.baseTransform) {
	          ctx.setTransform.apply(ctx, this.baseTransform);
	        }

	        ctx.fillStyle = fillColor.getPattern(ctx, this);
	        needRestore = true;
	      }

	      if (this.pendingEOFill) {
	        ctx.fill("evenodd");
	        this.pendingEOFill = false;
	      } else {
	        ctx.fill();
	      }

	      if (needRestore) {
	        ctx.restore();
	      }

	      if (consumePath) {
	        this.consumePath();
	      }
	    },
	    eoFill: function CanvasGraphics_eoFill() {
	      this.pendingEOFill = true;
	      this.fill();
	    },
	    fillStroke: function CanvasGraphics_fillStroke() {
	      this.fill(false);
	      this.stroke(false);
	      this.consumePath();
	    },
	    eoFillStroke: function CanvasGraphics_eoFillStroke() {
	      this.pendingEOFill = true;
	      this.fillStroke();
	    },
	    closeFillStroke: function CanvasGraphics_closeFillStroke() {
	      this.closePath();
	      this.fillStroke();
	    },
	    closeEOFillStroke: function CanvasGraphics_closeEOFillStroke() {
	      this.pendingEOFill = true;
	      this.closePath();
	      this.fillStroke();
	    },
	    endPath: function CanvasGraphics_endPath() {
	      this.consumePath();
	    },
	    clip: function CanvasGraphics_clip() {
	      this.pendingClip = NORMAL_CLIP;
	    },
	    eoClip: function CanvasGraphics_eoClip() {
	      this.pendingClip = EO_CLIP;
	    },
	    beginText: function CanvasGraphics_beginText() {
	      this.current.textMatrix = _util.IDENTITY_MATRIX;
	      this.current.textMatrixScale = 1;
	      this.current.x = this.current.lineX = 0;
	      this.current.y = this.current.lineY = 0;
	    },
	    endText: function CanvasGraphics_endText() {
	      var paths = this.pendingTextPaths;
	      var ctx = this.ctx;

	      if (paths === undefined) {
	        ctx.beginPath();
	        return;
	      }

	      ctx.save();
	      ctx.beginPath();

	      for (var i = 0; i < paths.length; i++) {
	        var path = paths[i];
	        ctx.setTransform.apply(ctx, path.transform);
	        ctx.translate(path.x, path.y);
	        path.addToPath(ctx, path.fontSize);
	      }

	      ctx.restore();
	      ctx.clip();
	      ctx.beginPath();
	      delete this.pendingTextPaths;
	    },
	    setCharSpacing: function CanvasGraphics_setCharSpacing(spacing) {
	      this.current.charSpacing = spacing;
	    },
	    setWordSpacing: function CanvasGraphics_setWordSpacing(spacing) {
	      this.current.wordSpacing = spacing;
	    },
	    setHScale: function CanvasGraphics_setHScale(scale) {
	      this.current.textHScale = scale / 100;
	    },
	    setLeading: function CanvasGraphics_setLeading(leading) {
	      this.current.leading = -leading;
	    },
	    setFont: function CanvasGraphics_setFont(fontRefName, size) {
	      var fontObj = this.commonObjs.get(fontRefName);
	      var current = this.current;

	      if (!fontObj) {
	        throw new Error(`Can't find font for ${fontRefName}`);
	      }

	      current.fontMatrix = fontObj.fontMatrix ? fontObj.fontMatrix : _util.FONT_IDENTITY_MATRIX;

	      if (current.fontMatrix[0] === 0 || current.fontMatrix[3] === 0) {
	        (0, _util.warn)("Invalid font matrix for font " + fontRefName);
	      }

	      if (size < 0) {
	        size = -size;
	        current.fontDirection = -1;
	      } else {
	        current.fontDirection = 1;
	      }

	      this.current.font = fontObj;
	      this.current.fontSize = size;

	      if (fontObj.isType3Font) {
	        return;
	      }

	      var name = fontObj.loadedName || "sans-serif";
	      let bold = "normal";

	      if (fontObj.black) {
	        bold = "900";
	      } else if (fontObj.bold) {
	        bold = "bold";
	      }

	      var italic = fontObj.italic ? "italic" : "normal";
	      var typeface = `"${name}", ${fontObj.fallbackName}`;
	      let browserFontSize = size;

	      if (size < MIN_FONT_SIZE) {
	        browserFontSize = MIN_FONT_SIZE;
	      } else if (size > MAX_FONT_SIZE) {
	        browserFontSize = MAX_FONT_SIZE;
	      }

	      this.current.fontSizeScale = size / browserFontSize;
	      this.ctx.font = `${italic} ${bold} ${browserFontSize}px ${typeface}`;
	    },
	    setTextRenderingMode: function CanvasGraphics_setTextRenderingMode(mode) {
	      this.current.textRenderingMode = mode;
	    },
	    setTextRise: function CanvasGraphics_setTextRise(rise) {
	      this.current.textRise = rise;
	    },
	    moveText: function CanvasGraphics_moveText(x, y) {
	      this.current.x = this.current.lineX += x;
	      this.current.y = this.current.lineY += y;
	    },
	    setLeadingMoveText: function CanvasGraphics_setLeadingMoveText(x, y) {
	      this.setLeading(-y);
	      this.moveText(x, y);
	    },
	    setTextMatrix: function CanvasGraphics_setTextMatrix(a, b, c, d, e, f) {
	      this.current.textMatrix = [a, b, c, d, e, f];
	      this.current.textMatrixScale = Math.sqrt(a * a + b * b);
	      this.current.x = this.current.lineX = 0;
	      this.current.y = this.current.lineY = 0;
	    },
	    nextLine: function CanvasGraphics_nextLine() {
	      this.moveText(0, this.current.leading);
	    },

	    paintChar(character, x, y, patternTransform) {
	      var ctx = this.ctx;
	      var current = this.current;
	      var font = current.font;
	      var textRenderingMode = current.textRenderingMode;
	      var fontSize = current.fontSize / current.fontSizeScale;
	      var fillStrokeMode = textRenderingMode & _util.TextRenderingMode.FILL_STROKE_MASK;
	      var isAddToPathSet = !!(textRenderingMode & _util.TextRenderingMode.ADD_TO_PATH_FLAG);
	      const patternFill = current.patternFill && !font.missingFile;
	      var addToPath;

	      if (font.disableFontFace || isAddToPathSet || patternFill) {
	        addToPath = font.getPathGenerator(this.commonObjs, character);
	      }

	      if (font.disableFontFace || patternFill) {
	        ctx.save();
	        ctx.translate(x, y);
	        ctx.beginPath();
	        addToPath(ctx, fontSize);

	        if (patternTransform) {
	          ctx.setTransform.apply(ctx, patternTransform);
	        }

	        if (fillStrokeMode === _util.TextRenderingMode.FILL || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
	          ctx.fill();
	        }

	        if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
	          ctx.stroke();
	        }

	        ctx.restore();
	      } else {
	        if (fillStrokeMode === _util.TextRenderingMode.FILL || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
	          ctx.fillText(character, x, y);
	        }

	        if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
	          ctx.strokeText(character, x, y);
	        }
	      }

	      if (isAddToPathSet) {
	        var paths = this.pendingTextPaths || (this.pendingTextPaths = []);
	        paths.push({
	          transform: ctx.mozCurrentTransform,
	          x,
	          y,
	          fontSize,
	          addToPath
	        });
	      }
	    },

	    get isFontSubpixelAAEnabled() {
	      const {
	        context: ctx
	      } = this.cachedCanvases.getCanvas("isFontSubpixelAAEnabled", 10, 10);
	      ctx.scale(1.5, 1);
	      ctx.fillText("I", 0, 10);
	      var data = ctx.getImageData(0, 0, 10, 10).data;
	      var enabled = false;

	      for (var i = 3; i < data.length; i += 4) {
	        if (data[i] > 0 && data[i] < 255) {
	          enabled = true;
	          break;
	        }
	      }

	      return (0, _util.shadow)(this, "isFontSubpixelAAEnabled", enabled);
	    },

	    showText: function CanvasGraphics_showText(glyphs) {
	      var current = this.current;
	      var font = current.font;

	      if (font.isType3Font) {
	        return this.showType3Text(glyphs);
	      }

	      var fontSize = current.fontSize;

	      if (fontSize === 0) {
	        return undefined;
	      }

	      var ctx = this.ctx;
	      var fontSizeScale = current.fontSizeScale;
	      var charSpacing = current.charSpacing;
	      var wordSpacing = current.wordSpacing;
	      var fontDirection = current.fontDirection;
	      var textHScale = current.textHScale * fontDirection;
	      var glyphsLength = glyphs.length;
	      var vertical = font.vertical;
	      var spacingDir = vertical ? 1 : -1;
	      var defaultVMetrics = font.defaultVMetrics;
	      var widthAdvanceScale = fontSize * current.fontMatrix[0];
	      var simpleFillText = current.textRenderingMode === _util.TextRenderingMode.FILL && !font.disableFontFace && !current.patternFill;
	      ctx.save();
	      let patternTransform;

	      if (current.patternFill) {
	        ctx.save();
	        const pattern = current.fillColor.getPattern(ctx, this);
	        patternTransform = ctx.mozCurrentTransform;
	        ctx.restore();
	        ctx.fillStyle = pattern;
	      }

	      ctx.transform.apply(ctx, current.textMatrix);
	      ctx.translate(current.x, current.y + current.textRise);

	      if (fontDirection > 0) {
	        ctx.scale(textHScale, -1);
	      } else {
	        ctx.scale(textHScale, 1);
	      }

	      var lineWidth = current.lineWidth;
	      var scale = current.textMatrixScale;

	      if (scale === 0 || lineWidth === 0) {
	        var fillStrokeMode = current.textRenderingMode & _util.TextRenderingMode.FILL_STROKE_MASK;

	        if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
	          this._cachedGetSinglePixelWidth = null;
	          lineWidth = this.getSinglePixelWidth() * MIN_WIDTH_FACTOR;
	        }
	      } else {
	        lineWidth /= scale;
	      }

	      if (fontSizeScale !== 1.0) {
	        ctx.scale(fontSizeScale, fontSizeScale);
	        lineWidth /= fontSizeScale;
	      }

	      ctx.lineWidth = lineWidth;
	      var x = 0,
	          i;

	      for (i = 0; i < glyphsLength; ++i) {
	        var glyph = glyphs[i];

	        if ((0, _util.isNum)(glyph)) {
	          x += spacingDir * glyph * fontSize / 1000;
	          continue;
	        }

	        var restoreNeeded = false;
	        var spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
	        var character = glyph.fontChar;
	        var accent = glyph.accent;
	        var scaledX, scaledY, scaledAccentX, scaledAccentY;
	        var width = glyph.width;

	        if (vertical) {
	          var vmetric, vx, vy;
	          vmetric = glyph.vmetric || defaultVMetrics;
	          vx = glyph.vmetric ? vmetric[1] : width * 0.5;
	          vx = -vx * widthAdvanceScale;
	          vy = vmetric[2] * widthAdvanceScale;
	          width = vmetric ? -vmetric[0] : width;
	          scaledX = vx / fontSizeScale;
	          scaledY = (x + vy) / fontSizeScale;
	        } else {
	          scaledX = x / fontSizeScale;
	          scaledY = 0;
	        }

	        if (font.remeasure && width > 0) {
	          var measuredWidth = ctx.measureText(character).width * 1000 / fontSize * fontSizeScale;

	          if (width < measuredWidth && this.isFontSubpixelAAEnabled) {
	            var characterScaleX = width / measuredWidth;
	            restoreNeeded = true;
	            ctx.save();
	            ctx.scale(characterScaleX, 1);
	            scaledX /= characterScaleX;
	          } else if (width !== measuredWidth) {
	            scaledX += (width - measuredWidth) / 2000 * fontSize / fontSizeScale;
	          }
	        }

	        if (glyph.isInFont || font.missingFile) {
	          if (simpleFillText && !accent) {
	            ctx.fillText(character, scaledX, scaledY);
	          } else {
	            this.paintChar(character, scaledX, scaledY, patternTransform);

	            if (accent) {
	              scaledAccentX = scaledX + accent.offset.x / fontSizeScale;
	              scaledAccentY = scaledY - accent.offset.y / fontSizeScale;
	              this.paintChar(accent.fontChar, scaledAccentX, scaledAccentY, patternTransform);
	            }
	          }
	        }

	        var charWidth;

	        if (vertical) {
	          charWidth = width * widthAdvanceScale - spacing * fontDirection;
	        } else {
	          charWidth = width * widthAdvanceScale + spacing * fontDirection;
	        }

	        x += charWidth;

	        if (restoreNeeded) {
	          ctx.restore();
	        }
	      }

	      if (vertical) {
	        current.y -= x;
	      } else {
	        current.x += x * textHScale;
	      }

	      ctx.restore();
	    },
	    showType3Text: function CanvasGraphics_showType3Text(glyphs) {
	      var ctx = this.ctx;
	      var current = this.current;
	      var font = current.font;
	      var fontSize = current.fontSize;
	      var fontDirection = current.fontDirection;
	      var spacingDir = font.vertical ? 1 : -1;
	      var charSpacing = current.charSpacing;
	      var wordSpacing = current.wordSpacing;
	      var textHScale = current.textHScale * fontDirection;
	      var fontMatrix = current.fontMatrix || _util.FONT_IDENTITY_MATRIX;
	      var glyphsLength = glyphs.length;
	      var isTextInvisible = current.textRenderingMode === _util.TextRenderingMode.INVISIBLE;
	      var i, glyph, width, spacingLength;

	      if (isTextInvisible || fontSize === 0) {
	        return;
	      }

	      this._cachedGetSinglePixelWidth = null;
	      ctx.save();
	      ctx.transform.apply(ctx, current.textMatrix);
	      ctx.translate(current.x, current.y);
	      ctx.scale(textHScale, fontDirection);

	      for (i = 0; i < glyphsLength; ++i) {
	        glyph = glyphs[i];

	        if ((0, _util.isNum)(glyph)) {
	          spacingLength = spacingDir * glyph * fontSize / 1000;
	          this.ctx.translate(spacingLength, 0);
	          current.x += spacingLength * textHScale;
	          continue;
	        }

	        var spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
	        var operatorList = font.charProcOperatorList[glyph.operatorListId];

	        if (!operatorList) {
	          (0, _util.warn)(`Type3 character "${glyph.operatorListId}" is not available.`);
	          continue;
	        }

	        this.processingType3 = glyph;
	        this.save();
	        ctx.scale(fontSize, fontSize);
	        ctx.transform.apply(ctx, fontMatrix);
	        this.executeOperatorList(operatorList);
	        this.restore();

	        var transformed = _util.Util.applyTransform([glyph.width, 0], fontMatrix);

	        width = transformed[0] * fontSize + spacing;
	        ctx.translate(width, 0);
	        current.x += width * textHScale;
	      }

	      ctx.restore();
	      this.processingType3 = null;
	    },
	    setCharWidth: function CanvasGraphics_setCharWidth(xWidth, yWidth) {},
	    setCharWidthAndBounds: function CanvasGraphics_setCharWidthAndBounds(xWidth, yWidth, llx, lly, urx, ury) {
	      this.ctx.rect(llx, lly, urx - llx, ury - lly);
	      this.clip();
	      this.endPath();
	    },
	    getColorN_Pattern: function CanvasGraphics_getColorN_Pattern(IR) {
	      var pattern;

	      if (IR[0] === "TilingPattern") {
	        var color = IR[1];
	        var baseTransform = this.baseTransform || this.ctx.mozCurrentTransform.slice();
	        var canvasGraphicsFactory = {
	          createCanvasGraphics: ctx => {
	            return new CanvasGraphics(ctx, this.commonObjs, this.objs, this.canvasFactory, this.webGLContext);
	          }
	        };
	        pattern = new _pattern_helper.TilingPattern(IR, color, this.ctx, canvasGraphicsFactory, baseTransform);
	      } else {
	        pattern = (0, _pattern_helper.getShadingPatternFromIR)(IR);
	      }

	      return pattern;
	    },
	    setStrokeColorN: function CanvasGraphics_setStrokeColorN() {
	      this.current.strokeColor = this.getColorN_Pattern(arguments);
	    },
	    setFillColorN: function CanvasGraphics_setFillColorN() {
	      this.current.fillColor = this.getColorN_Pattern(arguments);
	      this.current.patternFill = true;
	    },
	    setStrokeRGBColor: function CanvasGraphics_setStrokeRGBColor(r, g, b) {
	      var color = _util.Util.makeCssRgb(r, g, b);

	      this.ctx.strokeStyle = color;
	      this.current.strokeColor = color;
	    },
	    setFillRGBColor: function CanvasGraphics_setFillRGBColor(r, g, b) {
	      var color = _util.Util.makeCssRgb(r, g, b);

	      this.ctx.fillStyle = color;
	      this.current.fillColor = color;
	      this.current.patternFill = false;
	    },
	    shadingFill: function CanvasGraphics_shadingFill(patternIR) {
	      var ctx = this.ctx;
	      this.save();
	      var pattern = (0, _pattern_helper.getShadingPatternFromIR)(patternIR);
	      ctx.fillStyle = pattern.getPattern(ctx, this, true);
	      var inv = ctx.mozCurrentTransformInverse;

	      if (inv) {
	        var canvas = ctx.canvas;
	        var width = canvas.width;
	        var height = canvas.height;

	        var bl = _util.Util.applyTransform([0, 0], inv);

	        var br = _util.Util.applyTransform([0, height], inv);

	        var ul = _util.Util.applyTransform([width, 0], inv);

	        var ur = _util.Util.applyTransform([width, height], inv);

	        var x0 = Math.min(bl[0], br[0], ul[0], ur[0]);
	        var y0 = Math.min(bl[1], br[1], ul[1], ur[1]);
	        var x1 = Math.max(bl[0], br[0], ul[0], ur[0]);
	        var y1 = Math.max(bl[1], br[1], ul[1], ur[1]);
	        this.ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
	      } else {
	        this.ctx.fillRect(-1e10, -1e10, 2e10, 2e10);
	      }

	      this.restore();
	    },
	    beginInlineImage: function CanvasGraphics_beginInlineImage() {
	      (0, _util.unreachable)("Should not call beginInlineImage");
	    },
	    beginImageData: function CanvasGraphics_beginImageData() {
	      (0, _util.unreachable)("Should not call beginImageData");
	    },
	    paintFormXObjectBegin: function CanvasGraphics_paintFormXObjectBegin(matrix, bbox) {
	      this.save();
	      this.baseTransformStack.push(this.baseTransform);

	      if (Array.isArray(matrix) && matrix.length === 6) {
	        this.transform.apply(this, matrix);
	      }

	      this.baseTransform = this.ctx.mozCurrentTransform;

	      if (bbox) {
	        var width = bbox[2] - bbox[0];
	        var height = bbox[3] - bbox[1];
	        this.ctx.rect(bbox[0], bbox[1], width, height);
	        this.clip();
	        this.endPath();
	      }
	    },
	    paintFormXObjectEnd: function CanvasGraphics_paintFormXObjectEnd() {
	      this.restore();
	      this.baseTransform = this.baseTransformStack.pop();
	    },
	    beginGroup: function CanvasGraphics_beginGroup(group) {
	      this.save();
	      var currentCtx = this.ctx;

	      if (!group.isolated) {
	        (0, _util.info)("TODO: Support non-isolated groups.");
	      }

	      if (group.knockout) {
	        (0, _util.warn)("Knockout groups not supported.");
	      }

	      var currentTransform = currentCtx.mozCurrentTransform;

	      if (group.matrix) {
	        currentCtx.transform.apply(currentCtx, group.matrix);
	      }

	      if (!group.bbox) {
	        throw new Error("Bounding box is required.");
	      }

	      var bounds = _util.Util.getAxialAlignedBoundingBox(group.bbox, currentCtx.mozCurrentTransform);

	      var canvasBounds = [0, 0, currentCtx.canvas.width, currentCtx.canvas.height];
	      bounds = _util.Util.intersect(bounds, canvasBounds) || [0, 0, 0, 0];
	      var offsetX = Math.floor(bounds[0]);
	      var offsetY = Math.floor(bounds[1]);
	      var drawnWidth = Math.max(Math.ceil(bounds[2]) - offsetX, 1);
	      var drawnHeight = Math.max(Math.ceil(bounds[3]) - offsetY, 1);
	      var scaleX = 1,
	          scaleY = 1;

	      if (drawnWidth > MAX_GROUP_SIZE) {
	        scaleX = drawnWidth / MAX_GROUP_SIZE;
	        drawnWidth = MAX_GROUP_SIZE;
	      }

	      if (drawnHeight > MAX_GROUP_SIZE) {
	        scaleY = drawnHeight / MAX_GROUP_SIZE;
	        drawnHeight = MAX_GROUP_SIZE;
	      }

	      var cacheId = "groupAt" + this.groupLevel;

	      if (group.smask) {
	        cacheId += "_smask_" + this.smaskCounter++ % 2;
	      }

	      var scratchCanvas = this.cachedCanvases.getCanvas(cacheId, drawnWidth, drawnHeight, true);
	      var groupCtx = scratchCanvas.context;
	      groupCtx.scale(1 / scaleX, 1 / scaleY);
	      groupCtx.translate(-offsetX, -offsetY);
	      groupCtx.transform.apply(groupCtx, currentTransform);

	      if (group.smask) {
	        this.smaskStack.push({
	          canvas: scratchCanvas.canvas,
	          context: groupCtx,
	          offsetX,
	          offsetY,
	          scaleX,
	          scaleY,
	          subtype: group.smask.subtype,
	          backdrop: group.smask.backdrop,
	          transferMap: group.smask.transferMap || null,
	          startTransformInverse: null
	        });
	      } else {
	        currentCtx.setTransform(1, 0, 0, 1, 0, 0);
	        currentCtx.translate(offsetX, offsetY);
	        currentCtx.scale(scaleX, scaleY);
	      }

	      copyCtxState(currentCtx, groupCtx);
	      this.ctx = groupCtx;
	      this.setGState([["BM", "source-over"], ["ca", 1], ["CA", 1]]);
	      this.groupStack.push(currentCtx);
	      this.groupLevel++;
	      this.current.activeSMask = null;
	    },
	    endGroup: function CanvasGraphics_endGroup(group) {
	      this.groupLevel--;
	      var groupCtx = this.ctx;
	      this.ctx = this.groupStack.pop();

	      if (this.ctx.imageSmoothingEnabled !== undefined) {
	        this.ctx.imageSmoothingEnabled = false;
	      } else {
	        this.ctx.mozImageSmoothingEnabled = false;
	      }

	      if (group.smask) {
	        this.tempSMask = this.smaskStack.pop();
	      } else {
	        this.ctx.drawImage(groupCtx.canvas, 0, 0);
	      }

	      this.restore();
	    },
	    beginAnnotations: function CanvasGraphics_beginAnnotations() {
	      this.save();

	      if (this.baseTransform) {
	        this.ctx.setTransform.apply(this.ctx, this.baseTransform);
	      }
	    },
	    endAnnotations: function CanvasGraphics_endAnnotations() {
	      this.restore();
	    },
	    beginAnnotation: function CanvasGraphics_beginAnnotation(rect, transform, matrix) {
	      this.save();
	      resetCtxToDefault(this.ctx);
	      this.current = new CanvasExtraState();

	      if (Array.isArray(rect) && rect.length === 4) {
	        var width = rect[2] - rect[0];
	        var height = rect[3] - rect[1];
	        this.ctx.rect(rect[0], rect[1], width, height);
	        this.clip();
	        this.endPath();
	      }

	      this.transform.apply(this, transform);
	      this.transform.apply(this, matrix);
	    },
	    endAnnotation: function CanvasGraphics_endAnnotation() {
	      this.restore();
	    },
	    paintImageMaskXObject: function CanvasGraphics_paintImageMaskXObject(img) {
	      var ctx = this.ctx;
	      var width = img.width,
	          height = img.height;
	      var fillColor = this.current.fillColor;
	      var isPatternFill = this.current.patternFill;
	      var glyph = this.processingType3;

	      if (glyph && glyph.compiled === undefined) {
	        if (width <= MAX_SIZE_TO_COMPILE && height <= MAX_SIZE_TO_COMPILE) {
	          glyph.compiled = compileType3Glyph({
	            data: img.data,
	            width,
	            height
	          });
	        } else {
	          glyph.compiled = null;
	        }
	      }

	      if (glyph && glyph.compiled) {
	        glyph.compiled(ctx);
	        return;
	      }

	      var maskCanvas = this.cachedCanvases.getCanvas("maskCanvas", width, height);
	      var maskCtx = maskCanvas.context;
	      maskCtx.save();
	      putBinaryImageMask(maskCtx, img);
	      maskCtx.globalCompositeOperation = "source-in";
	      maskCtx.fillStyle = isPatternFill ? fillColor.getPattern(maskCtx, this) : fillColor;
	      maskCtx.fillRect(0, 0, width, height);
	      maskCtx.restore();
	      this.paintInlineImageXObject(maskCanvas.canvas);
	    },
	    paintImageMaskXObjectRepeat: function CanvasGraphics_paintImageMaskXObjectRepeat(imgData, scaleX, scaleY, positions) {
	      var width = imgData.width;
	      var height = imgData.height;
	      var fillColor = this.current.fillColor;
	      var isPatternFill = this.current.patternFill;
	      var maskCanvas = this.cachedCanvases.getCanvas("maskCanvas", width, height);
	      var maskCtx = maskCanvas.context;
	      maskCtx.save();
	      putBinaryImageMask(maskCtx, imgData);
	      maskCtx.globalCompositeOperation = "source-in";
	      maskCtx.fillStyle = isPatternFill ? fillColor.getPattern(maskCtx, this) : fillColor;
	      maskCtx.fillRect(0, 0, width, height);
	      maskCtx.restore();
	      var ctx = this.ctx;

	      for (var i = 0, ii = positions.length; i < ii; i += 2) {
	        ctx.save();
	        ctx.transform(scaleX, 0, 0, scaleY, positions[i], positions[i + 1]);
	        ctx.scale(1, -1);
	        ctx.drawImage(maskCanvas.canvas, 0, 0, width, height, 0, -1, 1, 1);
	        ctx.restore();
	      }
	    },
	    paintImageMaskXObjectGroup: function CanvasGraphics_paintImageMaskXObjectGroup(images) {
	      var ctx = this.ctx;
	      var fillColor = this.current.fillColor;
	      var isPatternFill = this.current.patternFill;

	      for (var i = 0, ii = images.length; i < ii; i++) {
	        var image = images[i];
	        var width = image.width,
	            height = image.height;
	        var maskCanvas = this.cachedCanvases.getCanvas("maskCanvas", width, height);
	        var maskCtx = maskCanvas.context;
	        maskCtx.save();
	        putBinaryImageMask(maskCtx, image);
	        maskCtx.globalCompositeOperation = "source-in";
	        maskCtx.fillStyle = isPatternFill ? fillColor.getPattern(maskCtx, this) : fillColor;
	        maskCtx.fillRect(0, 0, width, height);
	        maskCtx.restore();
	        ctx.save();
	        ctx.transform.apply(ctx, image.transform);
	        ctx.scale(1, -1);
	        ctx.drawImage(maskCanvas.canvas, 0, 0, width, height, 0, -1, 1, 1);
	        ctx.restore();
	      }
	    },
	    paintImageXObject: function CanvasGraphics_paintImageXObject(objId) {
	      const imgData = objId.startsWith("g_") ? this.commonObjs.get(objId) : this.objs.get(objId);

	      if (!imgData) {
	        (0, _util.warn)("Dependent image isn't ready yet");
	        return;
	      }

	      this.paintInlineImageXObject(imgData);
	    },
	    paintImageXObjectRepeat: function CanvasGraphics_paintImageXObjectRepeat(objId, scaleX, scaleY, positions) {
	      const imgData = objId.startsWith("g_") ? this.commonObjs.get(objId) : this.objs.get(objId);

	      if (!imgData) {
	        (0, _util.warn)("Dependent image isn't ready yet");
	        return;
	      }

	      var width = imgData.width;
	      var height = imgData.height;
	      var map = [];

	      for (var i = 0, ii = positions.length; i < ii; i += 2) {
	        map.push({
	          transform: [scaleX, 0, 0, scaleY, positions[i], positions[i + 1]],
	          x: 0,
	          y: 0,
	          w: width,
	          h: height
	        });
	      }

	      this.paintInlineImageXObjectGroup(imgData, map);
	    },
	    paintInlineImageXObject: function CanvasGraphics_paintInlineImageXObject(imgData) {
	      var width = imgData.width;
	      var height = imgData.height;
	      var ctx = this.ctx;
	      this.save();
	      ctx.scale(1 / width, -1 / height);
	      var currentTransform = ctx.mozCurrentTransformInverse;
	      var a = currentTransform[0],
	          b = currentTransform[1];
	      var widthScale = Math.max(Math.sqrt(a * a + b * b), 1);
	      var c = currentTransform[2],
	          d = currentTransform[3];
	      var heightScale = Math.max(Math.sqrt(c * c + d * d), 1);
	      var imgToPaint, tmpCanvas;

	      if (typeof HTMLElement === "function" && imgData instanceof HTMLElement || !imgData.data) {
	        imgToPaint = imgData;
	      } else {
	        tmpCanvas = this.cachedCanvases.getCanvas("inlineImage", width, height);
	        var tmpCtx = tmpCanvas.context;
	        putBinaryImageData(tmpCtx, imgData);
	        imgToPaint = tmpCanvas.canvas;
	      }

	      var paintWidth = width,
	          paintHeight = height;
	      var tmpCanvasId = "prescale1";

	      while (widthScale > 2 && paintWidth > 1 || heightScale > 2 && paintHeight > 1) {
	        var newWidth = paintWidth,
	            newHeight = paintHeight;

	        if (widthScale > 2 && paintWidth > 1) {
	          newWidth = Math.ceil(paintWidth / 2);
	          widthScale /= paintWidth / newWidth;
	        }

	        if (heightScale > 2 && paintHeight > 1) {
	          newHeight = Math.ceil(paintHeight / 2);
	          heightScale /= paintHeight / newHeight;
	        }

	        tmpCanvas = this.cachedCanvases.getCanvas(tmpCanvasId, newWidth, newHeight);
	        tmpCtx = tmpCanvas.context;
	        tmpCtx.clearRect(0, 0, newWidth, newHeight);
	        tmpCtx.drawImage(imgToPaint, 0, 0, paintWidth, paintHeight, 0, 0, newWidth, newHeight);
	        imgToPaint = tmpCanvas.canvas;
	        paintWidth = newWidth;
	        paintHeight = newHeight;
	        tmpCanvasId = tmpCanvasId === "prescale1" ? "prescale2" : "prescale1";
	      }

	      ctx.drawImage(imgToPaint, 0, 0, paintWidth, paintHeight, 0, -height, width, height);

	      if (this.imageLayer) {
	        var position = this.getCanvasPosition(0, -height);
	        this.imageLayer.appendImage({
	          imgData,
	          left: position[0],
	          top: position[1],
	          width: width / currentTransform[0],
	          height: height / currentTransform[3]
	        });
	      }

	      this.restore();
	    },
	    paintInlineImageXObjectGroup: function CanvasGraphics_paintInlineImageXObjectGroup(imgData, map) {
	      var ctx = this.ctx;
	      var w = imgData.width;
	      var h = imgData.height;
	      var tmpCanvas = this.cachedCanvases.getCanvas("inlineImage", w, h);
	      var tmpCtx = tmpCanvas.context;
	      putBinaryImageData(tmpCtx, imgData);

	      for (var i = 0, ii = map.length; i < ii; i++) {
	        var entry = map[i];
	        ctx.save();
	        ctx.transform.apply(ctx, entry.transform);
	        ctx.scale(1, -1);
	        ctx.drawImage(tmpCanvas.canvas, entry.x, entry.y, entry.w, entry.h, 0, -1, 1, 1);

	        if (this.imageLayer) {
	          var position = this.getCanvasPosition(entry.x, entry.y);
	          this.imageLayer.appendImage({
	            imgData,
	            left: position[0],
	            top: position[1],
	            width: w,
	            height: h
	          });
	        }

	        ctx.restore();
	      }
	    },
	    paintSolidColorImageMask: function CanvasGraphics_paintSolidColorImageMask() {
	      this.ctx.fillRect(0, 0, 1, 1);
	    },
	    paintXObject: function CanvasGraphics_paintXObject() {
	      (0, _util.warn)("Unsupported 'paintXObject' command.");
	    },
	    markPoint: function CanvasGraphics_markPoint(tag) {},
	    markPointProps: function CanvasGraphics_markPointProps(tag, properties) {},
	    beginMarkedContent: function CanvasGraphics_beginMarkedContent(tag) {},
	    beginMarkedContentProps: function CanvasGraphics_beginMarkedContentProps(tag, properties) {},
	    endMarkedContent: function CanvasGraphics_endMarkedContent() {},
	    beginCompat: function CanvasGraphics_beginCompat() {},
	    endCompat: function CanvasGraphics_endCompat() {},
	    consumePath: function CanvasGraphics_consumePath() {
	      var ctx = this.ctx;

	      if (this.pendingClip) {
	        if (this.pendingClip === EO_CLIP) {
	          ctx.clip("evenodd");
	        } else {
	          ctx.clip();
	        }

	        this.pendingClip = null;
	      }

	      ctx.beginPath();
	    },

	    getSinglePixelWidth(scale) {
	      if (this._cachedGetSinglePixelWidth === null) {
	        const inverse = this.ctx.mozCurrentTransformInverse;
	        this._cachedGetSinglePixelWidth = Math.sqrt(Math.max(inverse[0] * inverse[0] + inverse[1] * inverse[1], inverse[2] * inverse[2] + inverse[3] * inverse[3]));
	      }

	      return this._cachedGetSinglePixelWidth;
	    },

	    getCanvasPosition: function CanvasGraphics_getCanvasPosition(x, y) {
	      var transform = this.ctx.mozCurrentTransform;
	      return [transform[0] * x + transform[2] * y + transform[4], transform[1] * x + transform[3] * y + transform[5]];
	    }
	  };

	  for (var op in _util.OPS) {
	    CanvasGraphics.prototype[_util.OPS[op]] = CanvasGraphics.prototype[op];
	  }

	  return CanvasGraphics;
	}();

	exports.CanvasGraphics = CanvasGraphics;

	/***/ }),
	/* 9 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getShadingPatternFromIR = getShadingPatternFromIR;
	exports.TilingPattern = void 0;

	var _util = __w_pdfjs_require__(2);

	var ShadingIRs = {};

	function applyBoundingBox(ctx, bbox) {
	  if (!bbox || typeof Path2D === "undefined") {
	    return;
	  }

	  const width = bbox[2] - bbox[0];
	  const height = bbox[3] - bbox[1];
	  const region = new Path2D();
	  region.rect(bbox[0], bbox[1], width, height);
	  ctx.clip(region);
	}

	ShadingIRs.RadialAxial = {
	  fromIR: function RadialAxial_fromIR(raw) {
	    var type = raw[1];
	    var bbox = raw[2];
	    var colorStops = raw[3];
	    var p0 = raw[4];
	    var p1 = raw[5];
	    var r0 = raw[6];
	    var r1 = raw[7];
	    return {
	      type: "Pattern",
	      getPattern: function RadialAxial_getPattern(ctx) {
	        applyBoundingBox(ctx, bbox);
	        var grad;

	        if (type === "axial") {
	          grad = ctx.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
	        } else if (type === "radial") {
	          grad = ctx.createRadialGradient(p0[0], p0[1], r0, p1[0], p1[1], r1);
	        }

	        for (var i = 0, ii = colorStops.length; i < ii; ++i) {
	          var c = colorStops[i];
	          grad.addColorStop(c[0], c[1]);
	        }

	        return grad;
	      }
	    };
	  }
	};

	var createMeshCanvas = function createMeshCanvasClosure() {
	  function drawTriangle(data, context, p1, p2, p3, c1, c2, c3) {
	    var coords = context.coords,
	        colors = context.colors;
	    var bytes = data.data,
	        rowSize = data.width * 4;
	    var tmp;

	    if (coords[p1 + 1] > coords[p2 + 1]) {
	      tmp = p1;
	      p1 = p2;
	      p2 = tmp;
	      tmp = c1;
	      c1 = c2;
	      c2 = tmp;
	    }

	    if (coords[p2 + 1] > coords[p3 + 1]) {
	      tmp = p2;
	      p2 = p3;
	      p3 = tmp;
	      tmp = c2;
	      c2 = c3;
	      c3 = tmp;
	    }

	    if (coords[p1 + 1] > coords[p2 + 1]) {
	      tmp = p1;
	      p1 = p2;
	      p2 = tmp;
	      tmp = c1;
	      c1 = c2;
	      c2 = tmp;
	    }

	    var x1 = (coords[p1] + context.offsetX) * context.scaleX;
	    var y1 = (coords[p1 + 1] + context.offsetY) * context.scaleY;
	    var x2 = (coords[p2] + context.offsetX) * context.scaleX;
	    var y2 = (coords[p2 + 1] + context.offsetY) * context.scaleY;
	    var x3 = (coords[p3] + context.offsetX) * context.scaleX;
	    var y3 = (coords[p3 + 1] + context.offsetY) * context.scaleY;

	    if (y1 >= y3) {
	      return;
	    }

	    var c1r = colors[c1],
	        c1g = colors[c1 + 1],
	        c1b = colors[c1 + 2];
	    var c2r = colors[c2],
	        c2g = colors[c2 + 1],
	        c2b = colors[c2 + 2];
	    var c3r = colors[c3],
	        c3g = colors[c3 + 1],
	        c3b = colors[c3 + 2];
	    var minY = Math.round(y1),
	        maxY = Math.round(y3);
	    var xa, car, cag, cab;
	    var xb, cbr, cbg, cbb;

	    for (var y = minY; y <= maxY; y++) {
	      if (y < y2) {
	        let k;

	        if (y < y1) {
	          k = 0;
	        } else if (y1 === y2) {
	          k = 1;
	        } else {
	          k = (y1 - y) / (y1 - y2);
	        }

	        xa = x1 - (x1 - x2) * k;
	        car = c1r - (c1r - c2r) * k;
	        cag = c1g - (c1g - c2g) * k;
	        cab = c1b - (c1b - c2b) * k;
	      } else {
	        let k;

	        if (y > y3) {
	          k = 1;
	        } else if (y2 === y3) {
	          k = 0;
	        } else {
	          k = (y2 - y) / (y2 - y3);
	        }

	        xa = x2 - (x2 - x3) * k;
	        car = c2r - (c2r - c3r) * k;
	        cag = c2g - (c2g - c3g) * k;
	        cab = c2b - (c2b - c3b) * k;
	      }

	      let k;

	      if (y < y1) {
	        k = 0;
	      } else if (y > y3) {
	        k = 1;
	      } else {
	        k = (y1 - y) / (y1 - y3);
	      }

	      xb = x1 - (x1 - x3) * k;
	      cbr = c1r - (c1r - c3r) * k;
	      cbg = c1g - (c1g - c3g) * k;
	      cbb = c1b - (c1b - c3b) * k;
	      var x1_ = Math.round(Math.min(xa, xb));
	      var x2_ = Math.round(Math.max(xa, xb));
	      var j = rowSize * y + x1_ * 4;

	      for (var x = x1_; x <= x2_; x++) {
	        k = (xa - x) / (xa - xb);

	        if (k < 0) {
	          k = 0;
	        } else if (k > 1) {
	          k = 1;
	        }

	        bytes[j++] = car - (car - cbr) * k | 0;
	        bytes[j++] = cag - (cag - cbg) * k | 0;
	        bytes[j++] = cab - (cab - cbb) * k | 0;
	        bytes[j++] = 255;
	      }
	    }
	  }

	  function drawFigure(data, figure, context) {
	    var ps = figure.coords;
	    var cs = figure.colors;
	    var i, ii;

	    switch (figure.type) {
	      case "lattice":
	        var verticesPerRow = figure.verticesPerRow;
	        var rows = Math.floor(ps.length / verticesPerRow) - 1;
	        var cols = verticesPerRow - 1;

	        for (i = 0; i < rows; i++) {
	          var q = i * verticesPerRow;

	          for (var j = 0; j < cols; j++, q++) {
	            drawTriangle(data, context, ps[q], ps[q + 1], ps[q + verticesPerRow], cs[q], cs[q + 1], cs[q + verticesPerRow]);
	            drawTriangle(data, context, ps[q + verticesPerRow + 1], ps[q + 1], ps[q + verticesPerRow], cs[q + verticesPerRow + 1], cs[q + 1], cs[q + verticesPerRow]);
	          }
	        }

	        break;

	      case "triangles":
	        for (i = 0, ii = ps.length; i < ii; i += 3) {
	          drawTriangle(data, context, ps[i], ps[i + 1], ps[i + 2], cs[i], cs[i + 1], cs[i + 2]);
	        }

	        break;

	      default:
	        throw new Error("illegal figure");
	    }
	  }

	  function createMeshCanvas(bounds, combinesScale, coords, colors, figures, backgroundColor, cachedCanvases, webGLContext) {
	    var EXPECTED_SCALE = 1.1;
	    var MAX_PATTERN_SIZE = 3000;
	    var BORDER_SIZE = 2;
	    var offsetX = Math.floor(bounds[0]);
	    var offsetY = Math.floor(bounds[1]);
	    var boundsWidth = Math.ceil(bounds[2]) - offsetX;
	    var boundsHeight = Math.ceil(bounds[3]) - offsetY;
	    var width = Math.min(Math.ceil(Math.abs(boundsWidth * combinesScale[0] * EXPECTED_SCALE)), MAX_PATTERN_SIZE);
	    var height = Math.min(Math.ceil(Math.abs(boundsHeight * combinesScale[1] * EXPECTED_SCALE)), MAX_PATTERN_SIZE);
	    var scaleX = boundsWidth / width;
	    var scaleY = boundsHeight / height;
	    var context = {
	      coords,
	      colors,
	      offsetX: -offsetX,
	      offsetY: -offsetY,
	      scaleX: 1 / scaleX,
	      scaleY: 1 / scaleY
	    };
	    var paddedWidth = width + BORDER_SIZE * 2;
	    var paddedHeight = height + BORDER_SIZE * 2;
	    var canvas, tmpCanvas, i, ii;

	    if (webGLContext.isEnabled) {
	      canvas = webGLContext.drawFigures({
	        width,
	        height,
	        backgroundColor,
	        figures,
	        context
	      });
	      tmpCanvas = cachedCanvases.getCanvas("mesh", paddedWidth, paddedHeight, false);
	      tmpCanvas.context.drawImage(canvas, BORDER_SIZE, BORDER_SIZE);
	      canvas = tmpCanvas.canvas;
	    } else {
	      tmpCanvas = cachedCanvases.getCanvas("mesh", paddedWidth, paddedHeight, false);
	      var tmpCtx = tmpCanvas.context;
	      var data = tmpCtx.createImageData(width, height);

	      if (backgroundColor) {
	        var bytes = data.data;

	        for (i = 0, ii = bytes.length; i < ii; i += 4) {
	          bytes[i] = backgroundColor[0];
	          bytes[i + 1] = backgroundColor[1];
	          bytes[i + 2] = backgroundColor[2];
	          bytes[i + 3] = 255;
	        }
	      }

	      for (i = 0; i < figures.length; i++) {
	        drawFigure(data, figures[i], context);
	      }

	      tmpCtx.putImageData(data, BORDER_SIZE, BORDER_SIZE);
	      canvas = tmpCanvas.canvas;
	    }

	    return {
	      canvas,
	      offsetX: offsetX - BORDER_SIZE * scaleX,
	      offsetY: offsetY - BORDER_SIZE * scaleY,
	      scaleX,
	      scaleY
	    };
	  }

	  return createMeshCanvas;
	}();

	ShadingIRs.Mesh = {
	  fromIR: function Mesh_fromIR(raw) {
	    var coords = raw[2];
	    var colors = raw[3];
	    var figures = raw[4];
	    var bounds = raw[5];
	    var matrix = raw[6];
	    var bbox = raw[7];
	    var background = raw[8];
	    return {
	      type: "Pattern",
	      getPattern: function Mesh_getPattern(ctx, owner, shadingFill) {
	        applyBoundingBox(ctx, bbox);
	        var scale;

	        if (shadingFill) {
	          scale = _util.Util.singularValueDecompose2dScale(ctx.mozCurrentTransform);
	        } else {
	          scale = _util.Util.singularValueDecompose2dScale(owner.baseTransform);

	          if (matrix) {
	            var matrixScale = _util.Util.singularValueDecompose2dScale(matrix);

	            scale = [scale[0] * matrixScale[0], scale[1] * matrixScale[1]];
	          }
	        }

	        var temporaryPatternCanvas = createMeshCanvas(bounds, scale, coords, colors, figures, shadingFill ? null : background, owner.cachedCanvases, owner.webGLContext);

	        if (!shadingFill) {
	          ctx.setTransform.apply(ctx, owner.baseTransform);

	          if (matrix) {
	            ctx.transform.apply(ctx, matrix);
	          }
	        }

	        ctx.translate(temporaryPatternCanvas.offsetX, temporaryPatternCanvas.offsetY);
	        ctx.scale(temporaryPatternCanvas.scaleX, temporaryPatternCanvas.scaleY);
	        return ctx.createPattern(temporaryPatternCanvas.canvas, "no-repeat");
	      }
	    };
	  }
	};
	ShadingIRs.Dummy = {
	  fromIR: function Dummy_fromIR() {
	    return {
	      type: "Pattern",
	      getPattern: function Dummy_fromIR_getPattern() {
	        return "hotpink";
	      }
	    };
	  }
	};

	function getShadingPatternFromIR(raw) {
	  var shadingIR = ShadingIRs[raw[0]];

	  if (!shadingIR) {
	    throw new Error(`Unknown IR type: ${raw[0]}`);
	  }

	  return shadingIR.fromIR(raw);
	}

	var TilingPattern = function TilingPatternClosure() {
	  var PaintType = {
	    COLORED: 1,
	    UNCOLORED: 2
	  };
	  var MAX_PATTERN_SIZE = 3000;

	  function TilingPattern(IR, color, ctx, canvasGraphicsFactory, baseTransform) {
	    this.operatorList = IR[2];
	    this.matrix = IR[3] || [1, 0, 0, 1, 0, 0];
	    this.bbox = IR[4];
	    this.xstep = IR[5];
	    this.ystep = IR[6];
	    this.paintType = IR[7];
	    this.tilingType = IR[8];
	    this.color = color;
	    this.canvasGraphicsFactory = canvasGraphicsFactory;
	    this.baseTransform = baseTransform;
	    this.type = "Pattern";
	    this.ctx = ctx;
	  }

	  TilingPattern.prototype = {
	    createPatternCanvas: function TilinPattern_createPatternCanvas(owner) {
	      var operatorList = this.operatorList;
	      var bbox = this.bbox;
	      var xstep = this.xstep;
	      var ystep = this.ystep;
	      var paintType = this.paintType;
	      var tilingType = this.tilingType;
	      var color = this.color;
	      var canvasGraphicsFactory = this.canvasGraphicsFactory;
	      (0, _util.info)("TilingType: " + tilingType);
	      var x0 = bbox[0],
	          y0 = bbox[1],
	          x1 = bbox[2],
	          y1 = bbox[3];

	      var matrixScale = _util.Util.singularValueDecompose2dScale(this.matrix);

	      var curMatrixScale = _util.Util.singularValueDecompose2dScale(this.baseTransform);

	      var combinedScale = [matrixScale[0] * curMatrixScale[0], matrixScale[1] * curMatrixScale[1]];
	      var dimx = this.getSizeAndScale(xstep, this.ctx.canvas.width, combinedScale[0]);
	      var dimy = this.getSizeAndScale(ystep, this.ctx.canvas.height, combinedScale[1]);
	      var tmpCanvas = owner.cachedCanvases.getCanvas("pattern", dimx.size, dimy.size, true);
	      var tmpCtx = tmpCanvas.context;
	      var graphics = canvasGraphicsFactory.createCanvasGraphics(tmpCtx);
	      graphics.groupLevel = owner.groupLevel;
	      this.setFillAndStrokeStyleToContext(graphics, paintType, color);
	      graphics.transform(dimx.scale, 0, 0, dimy.scale, 0, 0);
	      graphics.transform(1, 0, 0, 1, -x0, -y0);
	      this.clipBbox(graphics, bbox, x0, y0, x1, y1);
	      graphics.executeOperatorList(operatorList);
	      this.ctx.transform(1, 0, 0, 1, x0, y0);
	      this.ctx.scale(1 / dimx.scale, 1 / dimy.scale);
	      return tmpCanvas.canvas;
	    },
	    getSizeAndScale: function TilingPattern_getSizeAndScale(step, realOutputSize, scale) {
	      step = Math.abs(step);
	      var maxSize = Math.max(MAX_PATTERN_SIZE, realOutputSize);
	      var size = Math.ceil(step * scale);

	      if (size >= maxSize) {
	        size = maxSize;
	      } else {
	        scale = size / step;
	      }

	      return {
	        scale,
	        size
	      };
	    },
	    clipBbox: function clipBbox(graphics, bbox, x0, y0, x1, y1) {
	      if (Array.isArray(bbox) && bbox.length === 4) {
	        var bboxWidth = x1 - x0;
	        var bboxHeight = y1 - y0;
	        graphics.ctx.rect(x0, y0, bboxWidth, bboxHeight);
	        graphics.clip();
	        graphics.endPath();
	      }
	    },
	    setFillAndStrokeStyleToContext: function setFillAndStrokeStyleToContext(graphics, paintType, color) {
	      const context = graphics.ctx,
	            current = graphics.current;

	      switch (paintType) {
	        case PaintType.COLORED:
	          var ctx = this.ctx;
	          context.fillStyle = ctx.fillStyle;
	          context.strokeStyle = ctx.strokeStyle;
	          current.fillColor = ctx.fillStyle;
	          current.strokeColor = ctx.strokeStyle;
	          break;

	        case PaintType.UNCOLORED:
	          var cssColor = _util.Util.makeCssRgb(color[0], color[1], color[2]);

	          context.fillStyle = cssColor;
	          context.strokeStyle = cssColor;
	          current.fillColor = cssColor;
	          current.strokeColor = cssColor;
	          break;

	        default:
	          throw new _util.FormatError(`Unsupported paint type: ${paintType}`);
	      }
	    },
	    getPattern: function TilingPattern_getPattern(ctx, owner) {
	      ctx = this.ctx;
	      ctx.setTransform.apply(ctx, this.baseTransform);
	      ctx.transform.apply(ctx, this.matrix);
	      var temporaryPatternCanvas = this.createPatternCanvas(owner);
	      return ctx.createPattern(temporaryPatternCanvas, "repeat");
	    }
	  };
	  return TilingPattern;
	}();

	exports.TilingPattern = TilingPattern;

	/***/ }),
	/* 10 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.GlobalWorkerOptions = void 0;
	const GlobalWorkerOptions = Object.create(null);
	exports.GlobalWorkerOptions = GlobalWorkerOptions;
	GlobalWorkerOptions.workerPort = GlobalWorkerOptions.workerPort === undefined ? null : GlobalWorkerOptions.workerPort;
	GlobalWorkerOptions.workerSrc = GlobalWorkerOptions.workerSrc === undefined ? "" : GlobalWorkerOptions.workerSrc;

	/***/ }),
	/* 11 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.MessageHandler = void 0;

	var _util = __w_pdfjs_require__(2);

	const CallbackKind = {
	  UNKNOWN: 0,
	  DATA: 1,
	  ERROR: 2
	};
	const StreamKind = {
	  UNKNOWN: 0,
	  CANCEL: 1,
	  CANCEL_COMPLETE: 2,
	  CLOSE: 3,
	  ENQUEUE: 4,
	  ERROR: 5,
	  PULL: 6,
	  PULL_COMPLETE: 7,
	  START_COMPLETE: 8
	};

	function wrapReason(reason) {
	  if (typeof reason !== "object" || reason === null) {
	    return reason;
	  }

	  switch (reason.name) {
	    case "AbortException":
	      return new _util.AbortException(reason.message);

	    case "MissingPDFException":
	      return new _util.MissingPDFException(reason.message);

	    case "UnexpectedResponseException":
	      return new _util.UnexpectedResponseException(reason.message, reason.status);

	    case "UnknownErrorException":
	      return new _util.UnknownErrorException(reason.message, reason.details);

	    default:
	      return new _util.UnknownErrorException(reason.message, reason.toString());
	  }
	}

	class MessageHandler {
	  constructor(sourceName, targetName, comObj) {
	    this.sourceName = sourceName;
	    this.targetName = targetName;
	    this.comObj = comObj;
	    this.callbackId = 1;
	    this.streamId = 1;
	    this.postMessageTransfers = true;
	    this.streamSinks = Object.create(null);
	    this.streamControllers = Object.create(null);
	    this.callbackCapabilities = Object.create(null);
	    this.actionHandler = Object.create(null);

	    this._onComObjOnMessage = event => {
	      const data = event.data;

	      if (data.targetName !== this.sourceName) {
	        return;
	      }

	      if (data.stream) {
	        this._processStreamMessage(data);

	        return;
	      }

	      if (data.callback) {
	        const callbackId = data.callbackId;
	        const capability = this.callbackCapabilities[callbackId];

	        if (!capability) {
	          throw new Error(`Cannot resolve callback ${callbackId}`);
	        }

	        delete this.callbackCapabilities[callbackId];

	        if (data.callback === CallbackKind.DATA) {
	          capability.resolve(data.data);
	        } else if (data.callback === CallbackKind.ERROR) {
	          capability.reject(wrapReason(data.reason));
	        } else {
	          throw new Error("Unexpected callback case");
	        }

	        return;
	      }

	      const action = this.actionHandler[data.action];

	      if (!action) {
	        throw new Error(`Unknown action from worker: ${data.action}`);
	      }

	      if (data.callbackId) {
	        const cbSourceName = this.sourceName;
	        const cbTargetName = data.sourceName;
	        new Promise(function (resolve) {
	          resolve(action(data.data));
	        }).then(function (result) {
	          comObj.postMessage({
	            sourceName: cbSourceName,
	            targetName: cbTargetName,
	            callback: CallbackKind.DATA,
	            callbackId: data.callbackId,
	            data: result
	          });
	        }, function (reason) {
	          comObj.postMessage({
	            sourceName: cbSourceName,
	            targetName: cbTargetName,
	            callback: CallbackKind.ERROR,
	            callbackId: data.callbackId,
	            reason: wrapReason(reason)
	          });
	        });
	        return;
	      }

	      if (data.streamId) {
	        this._createStreamSink(data);

	        return;
	      }

	      action(data.data);
	    };

	    comObj.addEventListener("message", this._onComObjOnMessage);
	  }

	  on(actionName, handler) {
	    const ah = this.actionHandler;

	    if (ah[actionName]) {
	      throw new Error(`There is already an actionName called "${actionName}"`);
	    }

	    ah[actionName] = handler;
	  }

	  send(actionName, data, transfers) {
	    this._postMessage({
	      sourceName: this.sourceName,
	      targetName: this.targetName,
	      action: actionName,
	      data
	    }, transfers);
	  }

	  sendWithPromise(actionName, data, transfers) {
	    const callbackId = this.callbackId++;
	    const capability = (0, _util.createPromiseCapability)();
	    this.callbackCapabilities[callbackId] = capability;

	    try {
	      this._postMessage({
	        sourceName: this.sourceName,
	        targetName: this.targetName,
	        action: actionName,
	        callbackId,
	        data
	      }, transfers);
	    } catch (ex) {
	      capability.reject(ex);
	    }

	    return capability.promise;
	  }

	  sendWithStream(actionName, data, queueingStrategy, transfers) {
	    const streamId = this.streamId++;
	    const sourceName = this.sourceName;
	    const targetName = this.targetName;
	    const comObj = this.comObj;
	    return new ReadableStream({
	      start: controller => {
	        const startCapability = (0, _util.createPromiseCapability)();
	        this.streamControllers[streamId] = {
	          controller,
	          startCall: startCapability,
	          pullCall: null,
	          cancelCall: null,
	          isClosed: false
	        };

	        this._postMessage({
	          sourceName,
	          targetName,
	          action: actionName,
	          streamId,
	          data,
	          desiredSize: controller.desiredSize
	        }, transfers);

	        return startCapability.promise;
	      },
	      pull: controller => {
	        const pullCapability = (0, _util.createPromiseCapability)();
	        this.streamControllers[streamId].pullCall = pullCapability;
	        comObj.postMessage({
	          sourceName,
	          targetName,
	          stream: StreamKind.PULL,
	          streamId,
	          desiredSize: controller.desiredSize
	        });
	        return pullCapability.promise;
	      },
	      cancel: reason => {
	        (0, _util.assert)(reason instanceof Error, "cancel must have a valid reason");
	        const cancelCapability = (0, _util.createPromiseCapability)();
	        this.streamControllers[streamId].cancelCall = cancelCapability;
	        this.streamControllers[streamId].isClosed = true;
	        comObj.postMessage({
	          sourceName,
	          targetName,
	          stream: StreamKind.CANCEL,
	          streamId,
	          reason: wrapReason(reason)
	        });
	        return cancelCapability.promise;
	      }
	    }, queueingStrategy);
	  }

	  _createStreamSink(data) {
	    const self = this;
	    const action = this.actionHandler[data.action];
	    const streamId = data.streamId;
	    const sourceName = this.sourceName;
	    const targetName = data.sourceName;
	    const comObj = this.comObj;
	    const streamSink = {
	      enqueue(chunk, size = 1, transfers) {
	        if (this.isCancelled) {
	          return;
	        }

	        const lastDesiredSize = this.desiredSize;
	        this.desiredSize -= size;

	        if (lastDesiredSize > 0 && this.desiredSize <= 0) {
	          this.sinkCapability = (0, _util.createPromiseCapability)();
	          this.ready = this.sinkCapability.promise;
	        }

	        self._postMessage({
	          sourceName,
	          targetName,
	          stream: StreamKind.ENQUEUE,
	          streamId,
	          chunk
	        }, transfers);
	      },

	      close() {
	        if (this.isCancelled) {
	          return;
	        }

	        this.isCancelled = true;
	        comObj.postMessage({
	          sourceName,
	          targetName,
	          stream: StreamKind.CLOSE,
	          streamId
	        });
	        delete self.streamSinks[streamId];
	      },

	      error(reason) {
	        (0, _util.assert)(reason instanceof Error, "error must have a valid reason");

	        if (this.isCancelled) {
	          return;
	        }

	        this.isCancelled = true;
	        comObj.postMessage({
	          sourceName,
	          targetName,
	          stream: StreamKind.ERROR,
	          streamId,
	          reason: wrapReason(reason)
	        });
	      },

	      sinkCapability: (0, _util.createPromiseCapability)(),
	      onPull: null,
	      onCancel: null,
	      isCancelled: false,
	      desiredSize: data.desiredSize,
	      ready: null
	    };
	    streamSink.sinkCapability.resolve();
	    streamSink.ready = streamSink.sinkCapability.promise;
	    this.streamSinks[streamId] = streamSink;
	    new Promise(function (resolve) {
	      resolve(action(data.data, streamSink));
	    }).then(function () {
	      comObj.postMessage({
	        sourceName,
	        targetName,
	        stream: StreamKind.START_COMPLETE,
	        streamId,
	        success: true
	      });
	    }, function (reason) {
	      comObj.postMessage({
	        sourceName,
	        targetName,
	        stream: StreamKind.START_COMPLETE,
	        streamId,
	        reason: wrapReason(reason)
	      });
	    });
	  }

	  _processStreamMessage(data) {
	    const streamId = data.streamId;
	    const sourceName = this.sourceName;
	    const targetName = data.sourceName;
	    const comObj = this.comObj;

	    switch (data.stream) {
	      case StreamKind.START_COMPLETE:
	        if (data.success) {
	          this.streamControllers[streamId].startCall.resolve();
	        } else {
	          this.streamControllers[streamId].startCall.reject(wrapReason(data.reason));
	        }

	        break;

	      case StreamKind.PULL_COMPLETE:
	        if (data.success) {
	          this.streamControllers[streamId].pullCall.resolve();
	        } else {
	          this.streamControllers[streamId].pullCall.reject(wrapReason(data.reason));
	        }

	        break;

	      case StreamKind.PULL:
	        if (!this.streamSinks[streamId]) {
	          comObj.postMessage({
	            sourceName,
	            targetName,
	            stream: StreamKind.PULL_COMPLETE,
	            streamId,
	            success: true
	          });
	          break;
	        }

	        if (this.streamSinks[streamId].desiredSize <= 0 && data.desiredSize > 0) {
	          this.streamSinks[streamId].sinkCapability.resolve();
	        }

	        this.streamSinks[streamId].desiredSize = data.desiredSize;
	        const {
	          onPull
	        } = this.streamSinks[data.streamId];
	        new Promise(function (resolve) {
	          resolve(onPull && onPull());
	        }).then(function () {
	          comObj.postMessage({
	            sourceName,
	            targetName,
	            stream: StreamKind.PULL_COMPLETE,
	            streamId,
	            success: true
	          });
	        }, function (reason) {
	          comObj.postMessage({
	            sourceName,
	            targetName,
	            stream: StreamKind.PULL_COMPLETE,
	            streamId,
	            reason: wrapReason(reason)
	          });
	        });
	        break;

	      case StreamKind.ENQUEUE:
	        (0, _util.assert)(this.streamControllers[streamId], "enqueue should have stream controller");

	        if (this.streamControllers[streamId].isClosed) {
	          break;
	        }

	        this.streamControllers[streamId].controller.enqueue(data.chunk);
	        break;

	      case StreamKind.CLOSE:
	        (0, _util.assert)(this.streamControllers[streamId], "close should have stream controller");

	        if (this.streamControllers[streamId].isClosed) {
	          break;
	        }

	        this.streamControllers[streamId].isClosed = true;
	        this.streamControllers[streamId].controller.close();

	        this._deleteStreamController(streamId);

	        break;

	      case StreamKind.ERROR:
	        (0, _util.assert)(this.streamControllers[streamId], "error should have stream controller");
	        this.streamControllers[streamId].controller.error(wrapReason(data.reason));

	        this._deleteStreamController(streamId);

	        break;

	      case StreamKind.CANCEL_COMPLETE:
	        if (data.success) {
	          this.streamControllers[streamId].cancelCall.resolve();
	        } else {
	          this.streamControllers[streamId].cancelCall.reject(wrapReason(data.reason));
	        }

	        this._deleteStreamController(streamId);

	        break;

	      case StreamKind.CANCEL:
	        if (!this.streamSinks[streamId]) {
	          break;
	        }

	        const {
	          onCancel
	        } = this.streamSinks[data.streamId];
	        new Promise(function (resolve) {
	          resolve(onCancel && onCancel(wrapReason(data.reason)));
	        }).then(function () {
	          comObj.postMessage({
	            sourceName,
	            targetName,
	            stream: StreamKind.CANCEL_COMPLETE,
	            streamId,
	            success: true
	          });
	        }, function (reason) {
	          comObj.postMessage({
	            sourceName,
	            targetName,
	            stream: StreamKind.CANCEL_COMPLETE,
	            streamId,
	            reason: wrapReason(reason)
	          });
	        });
	        this.streamSinks[streamId].sinkCapability.reject(wrapReason(data.reason));
	        this.streamSinks[streamId].isCancelled = true;
	        delete this.streamSinks[streamId];
	        break;

	      default:
	        throw new Error("Unexpected stream case");
	    }
	  }

	  async _deleteStreamController(streamId) {
	    await Promise.allSettled([this.streamControllers[streamId].startCall, this.streamControllers[streamId].pullCall, this.streamControllers[streamId].cancelCall].map(function (capability) {
	      return capability && capability.promise;
	    }));
	    delete this.streamControllers[streamId];
	  }

	  _postMessage(message, transfers) {
	    if (transfers && this.postMessageTransfers) {
	      this.comObj.postMessage(message, transfers);
	    } else {
	      this.comObj.postMessage(message);
	    }
	  }

	  destroy() {
	    this.comObj.removeEventListener("message", this._onComObjOnMessage);
	  }

	}

	exports.MessageHandler = MessageHandler;

	/***/ }),
	/* 12 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Metadata = void 0;

	var _util = __w_pdfjs_require__(2);

	var _xml_parser = __w_pdfjs_require__(13);

	class Metadata {
	  constructor(data) {
	    (0, _util.assert)(typeof data === "string", "Metadata: input is not a string");
	    data = this._repair(data);
	    const parser = new _xml_parser.SimpleXMLParser();
	    const xmlDocument = parser.parseFromString(data);
	    this._metadataMap = new Map();

	    if (xmlDocument) {
	      this._parse(xmlDocument);
	    }
	  }

	  _repair(data) {
	    return data.replace(/^[^<]+/, "").replace(/>\\376\\377([^<]+)/g, function (all, codes) {
	      const bytes = codes.replace(/\\([0-3])([0-7])([0-7])/g, function (code, d1, d2, d3) {
	        return String.fromCharCode(d1 * 64 + d2 * 8 + d3 * 1);
	      }).replace(/&(amp|apos|gt|lt|quot);/g, function (str, name) {
	        switch (name) {
	          case "amp":
	            return "&";

	          case "apos":
	            return "'";

	          case "gt":
	            return ">";

	          case "lt":
	            return "<";

	          case "quot":
	            return '"';
	        }

	        throw new Error(`_repair: ${name} isn't defined.`);
	      });
	      let chars = "";

	      for (let i = 0, ii = bytes.length; i < ii; i += 2) {
	        const code = bytes.charCodeAt(i) * 256 + bytes.charCodeAt(i + 1);

	        if (code >= 32 && code < 127 && code !== 60 && code !== 62 && code !== 38) {
	          chars += String.fromCharCode(code);
	        } else {
	          chars += "&#x" + (0x10000 + code).toString(16).substring(1) + ";";
	        }
	      }

	      return ">" + chars;
	    });
	  }

	  _parse(xmlDocument) {
	    let rdf = xmlDocument.documentElement;

	    if (rdf.nodeName.toLowerCase() !== "rdf:rdf") {
	      rdf = rdf.firstChild;

	      while (rdf && rdf.nodeName.toLowerCase() !== "rdf:rdf") {
	        rdf = rdf.nextSibling;
	      }
	    }

	    const nodeName = rdf ? rdf.nodeName.toLowerCase() : null;

	    if (!rdf || nodeName !== "rdf:rdf" || !rdf.hasChildNodes()) {
	      return;
	    }

	    const children = rdf.childNodes;

	    for (let i = 0, ii = children.length; i < ii; i++) {
	      const desc = children[i];

	      if (desc.nodeName.toLowerCase() !== "rdf:description") {
	        continue;
	      }

	      for (let j = 0, jj = desc.childNodes.length; j < jj; j++) {
	        if (desc.childNodes[j].nodeName.toLowerCase() !== "#text") {
	          const entry = desc.childNodes[j];
	          const name = entry.nodeName.toLowerCase();

	          this._metadataMap.set(name, entry.textContent.trim());
	        }
	      }
	    }
	  }

	  get(name) {
	    return this._metadataMap.has(name) ? this._metadataMap.get(name) : null;
	  }

	  getAll() {
	    const obj = Object.create(null);

	    for (const [key, value] of this._metadataMap) {
	      obj[key] = value;
	    }

	    return obj;
	  }

	  has(name) {
	    return this._metadataMap.has(name);
	  }

	}

	exports.Metadata = Metadata;

	/***/ }),
	/* 13 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.SimpleXMLParser = void 0;
	const XMLParserErrorCode = {
	  NoError: 0,
	  EndOfDocument: -1,
	  UnterminatedCdat: -2,
	  UnterminatedXmlDeclaration: -3,
	  UnterminatedDoctypeDeclaration: -4,
	  UnterminatedComment: -5,
	  MalformedElement: -6,
	  OutOfMemory: -7,
	  UnterminatedAttributeValue: -8,
	  UnterminatedElement: -9,
	  ElementNeverBegun: -10
	};

	function isWhitespace(s, index) {
	  const ch = s[index];
	  return ch === " " || ch === "\n" || ch === "\r" || ch === "\t";
	}

	function isWhitespaceString(s) {
	  for (let i = 0, ii = s.length; i < ii; i++) {
	    if (!isWhitespace(s, i)) {
	      return false;
	    }
	  }

	  return true;
	}

	class XMLParserBase {
	  _resolveEntities(s) {
	    return s.replace(/&([^;]+);/g, (all, entity) => {
	      if (entity.substring(0, 2) === "#x") {
	        return String.fromCharCode(parseInt(entity.substring(2), 16));
	      } else if (entity.substring(0, 1) === "#") {
	        return String.fromCharCode(parseInt(entity.substring(1), 10));
	      }

	      switch (entity) {
	        case "lt":
	          return "<";

	        case "gt":
	          return ">";

	        case "amp":
	          return "&";

	        case "quot":
	          return '"';
	      }

	      return this.onResolveEntity(entity);
	    });
	  }

	  _parseContent(s, start) {
	    const attributes = [];
	    let pos = start;

	    function skipWs() {
	      while (pos < s.length && isWhitespace(s, pos)) {
	        ++pos;
	      }
	    }

	    while (pos < s.length && !isWhitespace(s, pos) && s[pos] !== ">" && s[pos] !== "/") {
	      ++pos;
	    }

	    const name = s.substring(start, pos);
	    skipWs();

	    while (pos < s.length && s[pos] !== ">" && s[pos] !== "/" && s[pos] !== "?") {
	      skipWs();
	      let attrName = "",
	          attrValue = "";

	      while (pos < s.length && !isWhitespace(s, pos) && s[pos] !== "=") {
	        attrName += s[pos];
	        ++pos;
	      }

	      skipWs();

	      if (s[pos] !== "=") {
	        return null;
	      }

	      ++pos;
	      skipWs();
	      const attrEndChar = s[pos];

	      if (attrEndChar !== '"' && attrEndChar !== "'") {
	        return null;
	      }

	      const attrEndIndex = s.indexOf(attrEndChar, ++pos);

	      if (attrEndIndex < 0) {
	        return null;
	      }

	      attrValue = s.substring(pos, attrEndIndex);
	      attributes.push({
	        name: attrName,
	        value: this._resolveEntities(attrValue)
	      });
	      pos = attrEndIndex + 1;
	      skipWs();
	    }

	    return {
	      name,
	      attributes,
	      parsed: pos - start
	    };
	  }

	  _parseProcessingInstruction(s, start) {
	    let pos = start;

	    function skipWs() {
	      while (pos < s.length && isWhitespace(s, pos)) {
	        ++pos;
	      }
	    }

	    while (pos < s.length && !isWhitespace(s, pos) && s[pos] !== ">" && s[pos] !== "/") {
	      ++pos;
	    }

	    const name = s.substring(start, pos);
	    skipWs();
	    const attrStart = pos;

	    while (pos < s.length && (s[pos] !== "?" || s[pos + 1] !== ">")) {
	      ++pos;
	    }

	    const value = s.substring(attrStart, pos);
	    return {
	      name,
	      value,
	      parsed: pos - start
	    };
	  }

	  parseXml(s) {
	    let i = 0;

	    while (i < s.length) {
	      const ch = s[i];
	      let j = i;

	      if (ch === "<") {
	        ++j;
	        const ch2 = s[j];
	        let q;

	        switch (ch2) {
	          case "/":
	            ++j;
	            q = s.indexOf(">", j);

	            if (q < 0) {
	              this.onError(XMLParserErrorCode.UnterminatedElement);
	              return;
	            }

	            this.onEndElement(s.substring(j, q));
	            j = q + 1;
	            break;

	          case "?":
	            ++j;

	            const pi = this._parseProcessingInstruction(s, j);

	            if (s.substring(j + pi.parsed, j + pi.parsed + 2) !== "?>") {
	              this.onError(XMLParserErrorCode.UnterminatedXmlDeclaration);
	              return;
	            }

	            this.onPi(pi.name, pi.value);
	            j += pi.parsed + 2;
	            break;

	          case "!":
	            if (s.substring(j + 1, j + 3) === "--") {
	              q = s.indexOf("-->", j + 3);

	              if (q < 0) {
	                this.onError(XMLParserErrorCode.UnterminatedComment);
	                return;
	              }

	              this.onComment(s.substring(j + 3, q));
	              j = q + 3;
	            } else if (s.substring(j + 1, j + 8) === "[CDATA[") {
	              q = s.indexOf("]]>", j + 8);

	              if (q < 0) {
	                this.onError(XMLParserErrorCode.UnterminatedCdat);
	                return;
	              }

	              this.onCdata(s.substring(j + 8, q));
	              j = q + 3;
	            } else if (s.substring(j + 1, j + 8) === "DOCTYPE") {
	              const q2 = s.indexOf("[", j + 8);
	              let complexDoctype = false;
	              q = s.indexOf(">", j + 8);

	              if (q < 0) {
	                this.onError(XMLParserErrorCode.UnterminatedDoctypeDeclaration);
	                return;
	              }

	              if (q2 > 0 && q > q2) {
	                q = s.indexOf("]>", j + 8);

	                if (q < 0) {
	                  this.onError(XMLParserErrorCode.UnterminatedDoctypeDeclaration);
	                  return;
	                }

	                complexDoctype = true;
	              }

	              const doctypeContent = s.substring(j + 8, q + (complexDoctype ? 1 : 0));
	              this.onDoctype(doctypeContent);
	              j = q + (complexDoctype ? 2 : 1);
	            } else {
	              this.onError(XMLParserErrorCode.MalformedElement);
	              return;
	            }

	            break;

	          default:
	            const content = this._parseContent(s, j);

	            if (content === null) {
	              this.onError(XMLParserErrorCode.MalformedElement);
	              return;
	            }

	            let isClosed = false;

	            if (s.substring(j + content.parsed, j + content.parsed + 2) === "/>") {
	              isClosed = true;
	            } else if (s.substring(j + content.parsed, j + content.parsed + 1) !== ">") {
	              this.onError(XMLParserErrorCode.UnterminatedElement);
	              return;
	            }

	            this.onBeginElement(content.name, content.attributes, isClosed);
	            j += content.parsed + (isClosed ? 2 : 1);
	            break;
	        }
	      } else {
	        while (j < s.length && s[j] !== "<") {
	          j++;
	        }

	        const text = s.substring(i, j);
	        this.onText(this._resolveEntities(text));
	      }

	      i = j;
	    }
	  }

	  onResolveEntity(name) {
	    return `&${name};`;
	  }

	  onPi(name, value) {}

	  onComment(text) {}

	  onCdata(text) {}

	  onDoctype(doctypeContent) {}

	  onText(text) {}

	  onBeginElement(name, attributes, isEmpty) {}

	  onEndElement(name) {}

	  onError(code) {}

	}

	class SimpleDOMNode {
	  constructor(nodeName, nodeValue) {
	    this.nodeName = nodeName;
	    this.nodeValue = nodeValue;
	    Object.defineProperty(this, "parentNode", {
	      value: null,
	      writable: true
	    });
	  }

	  get firstChild() {
	    return this.childNodes && this.childNodes[0];
	  }

	  get nextSibling() {
	    const childNodes = this.parentNode.childNodes;

	    if (!childNodes) {
	      return undefined;
	    }

	    const index = childNodes.indexOf(this);

	    if (index === -1) {
	      return undefined;
	    }

	    return childNodes[index + 1];
	  }

	  get textContent() {
	    if (!this.childNodes) {
	      return this.nodeValue || "";
	    }

	    return this.childNodes.map(function (child) {
	      return child.textContent;
	    }).join("");
	  }

	  hasChildNodes() {
	    return this.childNodes && this.childNodes.length > 0;
	  }

	}

	class SimpleXMLParser extends XMLParserBase {
	  constructor() {
	    super();
	    this._currentFragment = null;
	    this._stack = null;
	    this._errorCode = XMLParserErrorCode.NoError;
	  }

	  parseFromString(data) {
	    this._currentFragment = [];
	    this._stack = [];
	    this._errorCode = XMLParserErrorCode.NoError;
	    this.parseXml(data);

	    if (this._errorCode !== XMLParserErrorCode.NoError) {
	      return undefined;
	    }

	    const [documentElement] = this._currentFragment;

	    if (!documentElement) {
	      return undefined;
	    }

	    return {
	      documentElement
	    };
	  }

	  onResolveEntity(name) {
	    switch (name) {
	      case "apos":
	        return "'";
	    }

	    return super.onResolveEntity(name);
	  }

	  onText(text) {
	    if (isWhitespaceString(text)) {
	      return;
	    }

	    const node = new SimpleDOMNode("#text", text);

	    this._currentFragment.push(node);
	  }

	  onCdata(text) {
	    const node = new SimpleDOMNode("#text", text);

	    this._currentFragment.push(node);
	  }

	  onBeginElement(name, attributes, isEmpty) {
	    const node = new SimpleDOMNode(name);
	    node.childNodes = [];

	    this._currentFragment.push(node);

	    if (isEmpty) {
	      return;
	    }

	    this._stack.push(this._currentFragment);

	    this._currentFragment = node.childNodes;
	  }

	  onEndElement(name) {
	    this._currentFragment = this._stack.pop() || [];
	    const lastElement = this._currentFragment[this._currentFragment.length - 1];

	    if (!lastElement) {
	      return;
	    }

	    for (let i = 0, ii = lastElement.childNodes.length; i < ii; i++) {
	      lastElement.childNodes[i].parentNode = lastElement;
	    }
	  }

	  onError(code) {
	    this._errorCode = code;
	  }

	}

	exports.SimpleXMLParser = SimpleXMLParser;

	/***/ }),
	/* 14 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.PDFDataTransportStream = void 0;

	var _util = __w_pdfjs_require__(2);

	class PDFDataTransportStream {
	  constructor(params, pdfDataRangeTransport) {
	    (0, _util.assert)(pdfDataRangeTransport, 'PDFDataTransportStream - missing required "pdfDataRangeTransport" argument.');
	    this._queuedChunks = [];
	    this._progressiveDone = params.progressiveDone || false;
	    const initialData = params.initialData;

	    if (initialData && initialData.length > 0) {
	      const buffer = new Uint8Array(initialData).buffer;

	      this._queuedChunks.push(buffer);
	    }

	    this._pdfDataRangeTransport = pdfDataRangeTransport;
	    this._isStreamingSupported = !params.disableStream;
	    this._isRangeSupported = !params.disableRange;
	    this._contentLength = params.length;
	    this._fullRequestReader = null;
	    this._rangeReaders = [];

	    this._pdfDataRangeTransport.addRangeListener((begin, chunk) => {
	      this._onReceiveData({
	        begin,
	        chunk
	      });
	    });

	    this._pdfDataRangeTransport.addProgressListener((loaded, total) => {
	      this._onProgress({
	        loaded,
	        total
	      });
	    });

	    this._pdfDataRangeTransport.addProgressiveReadListener(chunk => {
	      this._onReceiveData({
	        chunk
	      });
	    });

	    this._pdfDataRangeTransport.addProgressiveDoneListener(() => {
	      this._onProgressiveDone();
	    });

	    this._pdfDataRangeTransport.transportReady();
	  }

	  _onReceiveData(args) {
	    const buffer = new Uint8Array(args.chunk).buffer;

	    if (args.begin === undefined) {
	      if (this._fullRequestReader) {
	        this._fullRequestReader._enqueue(buffer);
	      } else {
	        this._queuedChunks.push(buffer);
	      }
	    } else {
	      const found = this._rangeReaders.some(function (rangeReader) {
	        if (rangeReader._begin !== args.begin) {
	          return false;
	        }

	        rangeReader._enqueue(buffer);

	        return true;
	      });

	      (0, _util.assert)(found, "_onReceiveData - no `PDFDataTransportStreamRangeReader` instance found.");
	    }
	  }

	  get _progressiveDataLength() {
	    return this._fullRequestReader ? this._fullRequestReader._loaded : 0;
	  }

	  _onProgress(evt) {
	    if (evt.total === undefined) {
	      const firstReader = this._rangeReaders[0];

	      if (firstReader && firstReader.onProgress) {
	        firstReader.onProgress({
	          loaded: evt.loaded
	        });
	      }
	    } else {
	      const fullReader = this._fullRequestReader;

	      if (fullReader && fullReader.onProgress) {
	        fullReader.onProgress({
	          loaded: evt.loaded,
	          total: evt.total
	        });
	      }
	    }
	  }

	  _onProgressiveDone() {
	    if (this._fullRequestReader) {
	      this._fullRequestReader.progressiveDone();
	    }

	    this._progressiveDone = true;
	  }

	  _removeRangeReader(reader) {
	    const i = this._rangeReaders.indexOf(reader);

	    if (i >= 0) {
	      this._rangeReaders.splice(i, 1);
	    }
	  }

	  getFullReader() {
	    (0, _util.assert)(!this._fullRequestReader, "PDFDataTransportStream.getFullReader can only be called once.");
	    const queuedChunks = this._queuedChunks;
	    this._queuedChunks = null;
	    return new PDFDataTransportStreamReader(this, queuedChunks, this._progressiveDone);
	  }

	  getRangeReader(begin, end) {
	    if (end <= this._progressiveDataLength) {
	      return null;
	    }

	    const reader = new PDFDataTransportStreamRangeReader(this, begin, end);

	    this._pdfDataRangeTransport.requestDataRange(begin, end);

	    this._rangeReaders.push(reader);

	    return reader;
	  }

	  cancelAllRequests(reason) {
	    if (this._fullRequestReader) {
	      this._fullRequestReader.cancel(reason);
	    }

	    const readers = this._rangeReaders.slice(0);

	    readers.forEach(function (rangeReader) {
	      rangeReader.cancel(reason);
	    });

	    this._pdfDataRangeTransport.abort();
	  }

	}

	exports.PDFDataTransportStream = PDFDataTransportStream;

	class PDFDataTransportStreamReader {
	  constructor(stream, queuedChunks, progressiveDone = false) {
	    this._stream = stream;
	    this._done = progressiveDone || false;
	    this._filename = null;
	    this._queuedChunks = queuedChunks || [];
	    this._loaded = 0;

	    for (const chunk of this._queuedChunks) {
	      this._loaded += chunk.byteLength;
	    }

	    this._requests = [];
	    this._headersReady = Promise.resolve();
	    stream._fullRequestReader = this;
	    this.onProgress = null;
	  }

	  _enqueue(chunk) {
	    if (this._done) {
	      return;
	    }

	    if (this._requests.length > 0) {
	      const requestCapability = this._requests.shift();

	      requestCapability.resolve({
	        value: chunk,
	        done: false
	      });
	    } else {
	      this._queuedChunks.push(chunk);
	    }

	    this._loaded += chunk.byteLength;
	  }

	  get headersReady() {
	    return this._headersReady;
	  }

	  get filename() {
	    return this._filename;
	  }

	  get isRangeSupported() {
	    return this._stream._isRangeSupported;
	  }

	  get isStreamingSupported() {
	    return this._stream._isStreamingSupported;
	  }

	  get contentLength() {
	    return this._stream._contentLength;
	  }

	  async read() {
	    if (this._queuedChunks.length > 0) {
	      const chunk = this._queuedChunks.shift();

	      return {
	        value: chunk,
	        done: false
	      };
	    }

	    if (this._done) {
	      return {
	        value: undefined,
	        done: true
	      };
	    }

	    const requestCapability = (0, _util.createPromiseCapability)();

	    this._requests.push(requestCapability);

	    return requestCapability.promise;
	  }

	  cancel(reason) {
	    this._done = true;

	    this._requests.forEach(function (requestCapability) {
	      requestCapability.resolve({
	        value: undefined,
	        done: true
	      });
	    });

	    this._requests = [];
	  }

	  progressiveDone() {
	    if (this._done) {
	      return;
	    }

	    this._done = true;
	  }

	}

	class PDFDataTransportStreamRangeReader {
	  constructor(stream, begin, end) {
	    this._stream = stream;
	    this._begin = begin;
	    this._end = end;
	    this._queuedChunk = null;
	    this._requests = [];
	    this._done = false;
	    this.onProgress = null;
	  }

	  _enqueue(chunk) {
	    if (this._done) {
	      return;
	    }

	    if (this._requests.length === 0) {
	      this._queuedChunk = chunk;
	    } else {
	      const requestsCapability = this._requests.shift();

	      requestsCapability.resolve({
	        value: chunk,
	        done: false
	      });

	      this._requests.forEach(function (requestCapability) {
	        requestCapability.resolve({
	          value: undefined,
	          done: true
	        });
	      });

	      this._requests = [];
	    }

	    this._done = true;

	    this._stream._removeRangeReader(this);
	  }

	  get isStreamingSupported() {
	    return false;
	  }

	  async read() {
	    if (this._queuedChunk) {
	      const chunk = this._queuedChunk;
	      this._queuedChunk = null;
	      return {
	        value: chunk,
	        done: false
	      };
	    }

	    if (this._done) {
	      return {
	        value: undefined,
	        done: true
	      };
	    }

	    const requestCapability = (0, _util.createPromiseCapability)();

	    this._requests.push(requestCapability);

	    return requestCapability.promise;
	  }

	  cancel(reason) {
	    this._done = true;

	    this._requests.forEach(function (requestCapability) {
	      requestCapability.resolve({
	        value: undefined,
	        done: true
	      });
	    });

	    this._requests = [];

	    this._stream._removeRangeReader(this);
	  }

	}

	/***/ }),
	/* 15 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.WebGLContext = void 0;

	var _util = __w_pdfjs_require__(2);

	class WebGLContext {
	  constructor({
	    enable = false
	  }) {
	    this._enabled = enable === true;
	  }

	  get isEnabled() {
	    let enabled = this._enabled;

	    if (enabled) {
	      enabled = WebGLUtils.tryInitGL();
	    }

	    return (0, _util.shadow)(this, "isEnabled", enabled);
	  }

	  composeSMask({
	    layer,
	    mask,
	    properties
	  }) {
	    return WebGLUtils.composeSMask(layer, mask, properties);
	  }

	  drawFigures({
	    width,
	    height,
	    backgroundColor,
	    figures,
	    context
	  }) {
	    return WebGLUtils.drawFigures(width, height, backgroundColor, figures, context);
	  }

	  clear() {
	    WebGLUtils.cleanup();
	  }

	}

	exports.WebGLContext = WebGLContext;

	var WebGLUtils = function WebGLUtilsClosure() {
	  function loadShader(gl, code, shaderType) {
	    var shader = gl.createShader(shaderType);
	    gl.shaderSource(shader, code);
	    gl.compileShader(shader);
	    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

	    if (!compiled) {
	      var errorMsg = gl.getShaderInfoLog(shader);
	      throw new Error("Error during shader compilation: " + errorMsg);
	    }

	    return shader;
	  }

	  function createVertexShader(gl, code) {
	    return loadShader(gl, code, gl.VERTEX_SHADER);
	  }

	  function createFragmentShader(gl, code) {
	    return loadShader(gl, code, gl.FRAGMENT_SHADER);
	  }

	  function createProgram(gl, shaders) {
	    var program = gl.createProgram();

	    for (var i = 0, ii = shaders.length; i < ii; ++i) {
	      gl.attachShader(program, shaders[i]);
	    }

	    gl.linkProgram(program);
	    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);

	    if (!linked) {
	      var errorMsg = gl.getProgramInfoLog(program);
	      throw new Error("Error during program linking: " + errorMsg);
	    }

	    return program;
	  }

	  function createTexture(gl, image, textureId) {
	    gl.activeTexture(textureId);
	    var texture = gl.createTexture();
	    gl.bindTexture(gl.TEXTURE_2D, texture);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	    return texture;
	  }

	  var currentGL, currentCanvas;

	  function generateGL() {
	    if (currentGL) {
	      return;
	    }

	    currentCanvas = document.createElement("canvas");
	    currentGL = currentCanvas.getContext("webgl", {
	      premultipliedalpha: false
	    });
	  }

	  var smaskVertexShaderCode = "\
	  attribute vec2 a_position;                                    \
	  attribute vec2 a_texCoord;                                    \
	                                                                \
	  uniform vec2 u_resolution;                                    \
	                                                                \
	  varying vec2 v_texCoord;                                      \
	                                                                \
	  void main() {                                                 \
	    vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;   \
	    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);          \
	                                                                \
	    v_texCoord = a_texCoord;                                    \
	  }                                                             ";
	  var smaskFragmentShaderCode = "\
	  precision mediump float;                                      \
	                                                                \
	  uniform vec4 u_backdrop;                                      \
	  uniform int u_subtype;                                        \
	  uniform sampler2D u_image;                                    \
	  uniform sampler2D u_mask;                                     \
	                                                                \
	  varying vec2 v_texCoord;                                      \
	                                                                \
	  void main() {                                                 \
	    vec4 imageColor = texture2D(u_image, v_texCoord);           \
	    vec4 maskColor = texture2D(u_mask, v_texCoord);             \
	    if (u_backdrop.a > 0.0) {                                   \
	      maskColor.rgb = maskColor.rgb * maskColor.a +             \
	                      u_backdrop.rgb * (1.0 - maskColor.a);     \
	    }                                                           \
	    float lum;                                                  \
	    if (u_subtype == 0) {                                       \
	      lum = maskColor.a;                                        \
	    } else {                                                    \
	      lum = maskColor.r * 0.3 + maskColor.g * 0.59 +            \
	            maskColor.b * 0.11;                                 \
	    }                                                           \
	    imageColor.a *= lum;                                        \
	    imageColor.rgb *= imageColor.a;                             \
	    gl_FragColor = imageColor;                                  \
	  }                                                             ";
	  var smaskCache = null;

	  function initSmaskGL() {
	    var canvas, gl;
	    generateGL();
	    canvas = currentCanvas;
	    currentCanvas = null;
	    gl = currentGL;
	    currentGL = null;
	    var vertexShader = createVertexShader(gl, smaskVertexShaderCode);
	    var fragmentShader = createFragmentShader(gl, smaskFragmentShaderCode);
	    var program = createProgram(gl, [vertexShader, fragmentShader]);
	    gl.useProgram(program);
	    var cache = {};
	    cache.gl = gl;
	    cache.canvas = canvas;
	    cache.resolutionLocation = gl.getUniformLocation(program, "u_resolution");
	    cache.positionLocation = gl.getAttribLocation(program, "a_position");
	    cache.backdropLocation = gl.getUniformLocation(program, "u_backdrop");
	    cache.subtypeLocation = gl.getUniformLocation(program, "u_subtype");
	    var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
	    var texLayerLocation = gl.getUniformLocation(program, "u_image");
	    var texMaskLocation = gl.getUniformLocation(program, "u_mask");
	    var texCoordBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]), gl.STATIC_DRAW);
	    gl.enableVertexAttribArray(texCoordLocation);
	    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
	    gl.uniform1i(texLayerLocation, 0);
	    gl.uniform1i(texMaskLocation, 1);
	    smaskCache = cache;
	  }

	  function composeSMask(layer, mask, properties) {
	    var width = layer.width,
	        height = layer.height;

	    if (!smaskCache) {
	      initSmaskGL();
	    }

	    var cache = smaskCache,
	        canvas = cache.canvas,
	        gl = cache.gl;
	    canvas.width = width;
	    canvas.height = height;
	    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	    gl.uniform2f(cache.resolutionLocation, width, height);

	    if (properties.backdrop) {
	      gl.uniform4f(cache.resolutionLocation, properties.backdrop[0], properties.backdrop[1], properties.backdrop[2], 1);
	    } else {
	      gl.uniform4f(cache.resolutionLocation, 0, 0, 0, 0);
	    }

	    gl.uniform1i(cache.subtypeLocation, properties.subtype === "Luminosity" ? 1 : 0);
	    var texture = createTexture(gl, layer, gl.TEXTURE0);
	    var maskTexture = createTexture(gl, mask, gl.TEXTURE1);
	    var buffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, width, 0, 0, height, 0, height, width, 0, width, height]), gl.STATIC_DRAW);
	    gl.enableVertexAttribArray(cache.positionLocation);
	    gl.vertexAttribPointer(cache.positionLocation, 2, gl.FLOAT, false, 0, 0);
	    gl.clearColor(0, 0, 0, 0);
	    gl.enable(gl.BLEND);
	    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	    gl.clear(gl.COLOR_BUFFER_BIT);
	    gl.drawArrays(gl.TRIANGLES, 0, 6);
	    gl.flush();
	    gl.deleteTexture(texture);
	    gl.deleteTexture(maskTexture);
	    gl.deleteBuffer(buffer);
	    return canvas;
	  }

	  var figuresVertexShaderCode = "\
	  attribute vec2 a_position;                                    \
	  attribute vec3 a_color;                                       \
	                                                                \
	  uniform vec2 u_resolution;                                    \
	  uniform vec2 u_scale;                                         \
	  uniform vec2 u_offset;                                        \
	                                                                \
	  varying vec4 v_color;                                         \
	                                                                \
	  void main() {                                                 \
	    vec2 position = (a_position + u_offset) * u_scale;          \
	    vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;     \
	    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);          \
	                                                                \
	    v_color = vec4(a_color / 255.0, 1.0);                       \
	  }                                                             ";
	  var figuresFragmentShaderCode = "\
	  precision mediump float;                                      \
	                                                                \
	  varying vec4 v_color;                                         \
	                                                                \
	  void main() {                                                 \
	    gl_FragColor = v_color;                                     \
	  }                                                             ";
	  var figuresCache = null;

	  function initFiguresGL() {
	    var canvas, gl;
	    generateGL();
	    canvas = currentCanvas;
	    currentCanvas = null;
	    gl = currentGL;
	    currentGL = null;
	    var vertexShader = createVertexShader(gl, figuresVertexShaderCode);
	    var fragmentShader = createFragmentShader(gl, figuresFragmentShaderCode);
	    var program = createProgram(gl, [vertexShader, fragmentShader]);
	    gl.useProgram(program);
	    var cache = {};
	    cache.gl = gl;
	    cache.canvas = canvas;
	    cache.resolutionLocation = gl.getUniformLocation(program, "u_resolution");
	    cache.scaleLocation = gl.getUniformLocation(program, "u_scale");
	    cache.offsetLocation = gl.getUniformLocation(program, "u_offset");
	    cache.positionLocation = gl.getAttribLocation(program, "a_position");
	    cache.colorLocation = gl.getAttribLocation(program, "a_color");
	    figuresCache = cache;
	  }

	  function drawFigures(width, height, backgroundColor, figures, context) {
	    if (!figuresCache) {
	      initFiguresGL();
	    }

	    var cache = figuresCache,
	        canvas = cache.canvas,
	        gl = cache.gl;
	    canvas.width = width;
	    canvas.height = height;
	    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	    gl.uniform2f(cache.resolutionLocation, width, height);
	    var count = 0;
	    var i, ii, rows;

	    for (i = 0, ii = figures.length; i < ii; i++) {
	      switch (figures[i].type) {
	        case "lattice":
	          rows = figures[i].coords.length / figures[i].verticesPerRow | 0;
	          count += (rows - 1) * (figures[i].verticesPerRow - 1) * 6;
	          break;

	        case "triangles":
	          count += figures[i].coords.length;
	          break;
	      }
	    }

	    var coords = new Float32Array(count * 2);
	    var colors = new Uint8Array(count * 3);
	    var coordsMap = context.coords,
	        colorsMap = context.colors;
	    var pIndex = 0,
	        cIndex = 0;

	    for (i = 0, ii = figures.length; i < ii; i++) {
	      var figure = figures[i],
	          ps = figure.coords,
	          cs = figure.colors;

	      switch (figure.type) {
	        case "lattice":
	          var cols = figure.verticesPerRow;
	          rows = ps.length / cols | 0;

	          for (var row = 1; row < rows; row++) {
	            var offset = row * cols + 1;

	            for (var col = 1; col < cols; col++, offset++) {
	              coords[pIndex] = coordsMap[ps[offset - cols - 1]];
	              coords[pIndex + 1] = coordsMap[ps[offset - cols - 1] + 1];
	              coords[pIndex + 2] = coordsMap[ps[offset - cols]];
	              coords[pIndex + 3] = coordsMap[ps[offset - cols] + 1];
	              coords[pIndex + 4] = coordsMap[ps[offset - 1]];
	              coords[pIndex + 5] = coordsMap[ps[offset - 1] + 1];
	              colors[cIndex] = colorsMap[cs[offset - cols - 1]];
	              colors[cIndex + 1] = colorsMap[cs[offset - cols - 1] + 1];
	              colors[cIndex + 2] = colorsMap[cs[offset - cols - 1] + 2];
	              colors[cIndex + 3] = colorsMap[cs[offset - cols]];
	              colors[cIndex + 4] = colorsMap[cs[offset - cols] + 1];
	              colors[cIndex + 5] = colorsMap[cs[offset - cols] + 2];
	              colors[cIndex + 6] = colorsMap[cs[offset - 1]];
	              colors[cIndex + 7] = colorsMap[cs[offset - 1] + 1];
	              colors[cIndex + 8] = colorsMap[cs[offset - 1] + 2];
	              coords[pIndex + 6] = coords[pIndex + 2];
	              coords[pIndex + 7] = coords[pIndex + 3];
	              coords[pIndex + 8] = coords[pIndex + 4];
	              coords[pIndex + 9] = coords[pIndex + 5];
	              coords[pIndex + 10] = coordsMap[ps[offset]];
	              coords[pIndex + 11] = coordsMap[ps[offset] + 1];
	              colors[cIndex + 9] = colors[cIndex + 3];
	              colors[cIndex + 10] = colors[cIndex + 4];
	              colors[cIndex + 11] = colors[cIndex + 5];
	              colors[cIndex + 12] = colors[cIndex + 6];
	              colors[cIndex + 13] = colors[cIndex + 7];
	              colors[cIndex + 14] = colors[cIndex + 8];
	              colors[cIndex + 15] = colorsMap[cs[offset]];
	              colors[cIndex + 16] = colorsMap[cs[offset] + 1];
	              colors[cIndex + 17] = colorsMap[cs[offset] + 2];
	              pIndex += 12;
	              cIndex += 18;
	            }
	          }

	          break;

	        case "triangles":
	          for (var j = 0, jj = ps.length; j < jj; j++) {
	            coords[pIndex] = coordsMap[ps[j]];
	            coords[pIndex + 1] = coordsMap[ps[j] + 1];
	            colors[cIndex] = colorsMap[cs[j]];
	            colors[cIndex + 1] = colorsMap[cs[j] + 1];
	            colors[cIndex + 2] = colorsMap[cs[j] + 2];
	            pIndex += 2;
	            cIndex += 3;
	          }

	          break;
	      }
	    }

	    if (backgroundColor) {
	      gl.clearColor(backgroundColor[0] / 255, backgroundColor[1] / 255, backgroundColor[2] / 255, 1.0);
	    } else {
	      gl.clearColor(0, 0, 0, 0);
	    }

	    gl.clear(gl.COLOR_BUFFER_BIT);
	    var coordsBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, coordsBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, coords, gl.STATIC_DRAW);
	    gl.enableVertexAttribArray(cache.positionLocation);
	    gl.vertexAttribPointer(cache.positionLocation, 2, gl.FLOAT, false, 0, 0);
	    var colorsBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
	    gl.enableVertexAttribArray(cache.colorLocation);
	    gl.vertexAttribPointer(cache.colorLocation, 3, gl.UNSIGNED_BYTE, false, 0, 0);
	    gl.uniform2f(cache.scaleLocation, context.scaleX, context.scaleY);
	    gl.uniform2f(cache.offsetLocation, context.offsetX, context.offsetY);
	    gl.drawArrays(gl.TRIANGLES, 0, count);
	    gl.flush();
	    gl.deleteBuffer(coordsBuffer);
	    gl.deleteBuffer(colorsBuffer);
	    return canvas;
	  }

	  return {
	    tryInitGL() {
	      try {
	        generateGL();
	        return !!currentGL;
	      } catch (ex) {}

	      return false;
	    },

	    composeSMask,
	    drawFigures,

	    cleanup() {
	      if (smaskCache && smaskCache.canvas) {
	        smaskCache.canvas.width = 0;
	        smaskCache.canvas.height = 0;
	      }

	      if (figuresCache && figuresCache.canvas) {
	        figuresCache.canvas.width = 0;
	        figuresCache.canvas.height = 0;
	      }

	      smaskCache = null;
	      figuresCache = null;
	    }

	  };
	}();

	/***/ }),
	/* 16 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.AnnotationLayer = void 0;

	var _display_utils = __w_pdfjs_require__(1);

	var _util = __w_pdfjs_require__(2);

	class AnnotationElementFactory {
	  static create(parameters) {
	    const subtype = parameters.data.annotationType;

	    switch (subtype) {
	      case _util.AnnotationType.LINK:
	        return new LinkAnnotationElement(parameters);

	      case _util.AnnotationType.TEXT:
	        return new TextAnnotationElement(parameters);

	      case _util.AnnotationType.WIDGET:
	        const fieldType = parameters.data.fieldType;

	        switch (fieldType) {
	          case "Tx":
	            return new TextWidgetAnnotationElement(parameters);

	          case "Btn":
	            if (parameters.data.radioButton) {
	              return new RadioButtonWidgetAnnotationElement(parameters);
	            } else if (parameters.data.checkBox) {
	              return new CheckboxWidgetAnnotationElement(parameters);
	            }

	            return new PushButtonWidgetAnnotationElement(parameters);

	          case "Ch":
	            return new ChoiceWidgetAnnotationElement(parameters);
	        }

	        return new WidgetAnnotationElement(parameters);

	      case _util.AnnotationType.POPUP:
	        return new PopupAnnotationElement(parameters);

	      case _util.AnnotationType.FREETEXT:
	        return new FreeTextAnnotationElement(parameters);

	      case _util.AnnotationType.LINE:
	        return new LineAnnotationElement(parameters);

	      case _util.AnnotationType.SQUARE:
	        return new SquareAnnotationElement(parameters);

	      case _util.AnnotationType.CIRCLE:
	        return new CircleAnnotationElement(parameters);

	      case _util.AnnotationType.POLYLINE:
	        return new PolylineAnnotationElement(parameters);

	      case _util.AnnotationType.CARET:
	        return new CaretAnnotationElement(parameters);

	      case _util.AnnotationType.INK:
	        return new InkAnnotationElement(parameters);

	      case _util.AnnotationType.POLYGON:
	        return new PolygonAnnotationElement(parameters);

	      case _util.AnnotationType.HIGHLIGHT:
	        return new HighlightAnnotationElement(parameters);

	      case _util.AnnotationType.UNDERLINE:
	        return new UnderlineAnnotationElement(parameters);

	      case _util.AnnotationType.SQUIGGLY:
	        return new SquigglyAnnotationElement(parameters);

	      case _util.AnnotationType.STRIKEOUT:
	        return new StrikeOutAnnotationElement(parameters);

	      case _util.AnnotationType.STAMP:
	        return new StampAnnotationElement(parameters);

	      case _util.AnnotationType.FILEATTACHMENT:
	        return new FileAttachmentAnnotationElement(parameters);

	      default:
	        return new AnnotationElement(parameters);
	    }
	  }

	}

	class AnnotationElement {
	  constructor(parameters, isRenderable = false, ignoreBorder = false) {
	    this.isRenderable = isRenderable;
	    this.data = parameters.data;
	    this.layer = parameters.layer;
	    this.page = parameters.page;
	    this.viewport = parameters.viewport;
	    this.linkService = parameters.linkService;
	    this.downloadManager = parameters.downloadManager;
	    this.imageResourcesPath = parameters.imageResourcesPath;
	    this.renderInteractiveForms = parameters.renderInteractiveForms;
	    this.svgFactory = parameters.svgFactory;

	    if (isRenderable) {
	      this.container = this._createContainer(ignoreBorder);
	    }
	  }

	  _createContainer(ignoreBorder = false) {
	    const data = this.data,
	          page = this.page,
	          viewport = this.viewport;
	    const container = document.createElement("section");
	    let width = data.rect[2] - data.rect[0];
	    let height = data.rect[3] - data.rect[1];
	    container.setAttribute("data-annotation-id", data.id);

	    const rect = _util.Util.normalizeRect([data.rect[0], page.view[3] - data.rect[1] + page.view[1], data.rect[2], page.view[3] - data.rect[3] + page.view[1]]);

	    container.style.transform = `matrix(${viewport.transform.join(",")})`;
	    container.style.transformOrigin = `-${rect[0]}px -${rect[1]}px`;

	    if (!ignoreBorder && data.borderStyle.width > 0) {
	      container.style.borderWidth = `${data.borderStyle.width}px`;

	      if (data.borderStyle.style !== _util.AnnotationBorderStyleType.UNDERLINE) {
	        width = width - 2 * data.borderStyle.width;
	        height = height - 2 * data.borderStyle.width;
	      }

	      const horizontalRadius = data.borderStyle.horizontalCornerRadius;
	      const verticalRadius = data.borderStyle.verticalCornerRadius;

	      if (horizontalRadius > 0 || verticalRadius > 0) {
	        const radius = `${horizontalRadius}px / ${verticalRadius}px`;
	        container.style.borderRadius = radius;
	      }

	      switch (data.borderStyle.style) {
	        case _util.AnnotationBorderStyleType.SOLID:
	          container.style.borderStyle = "solid";
	          break;

	        case _util.AnnotationBorderStyleType.DASHED:
	          container.style.borderStyle = "dashed";
	          break;

	        case _util.AnnotationBorderStyleType.BEVELED:
	          (0, _util.warn)("Unimplemented border style: beveled");
	          break;

	        case _util.AnnotationBorderStyleType.INSET:
	          (0, _util.warn)("Unimplemented border style: inset");
	          break;

	        case _util.AnnotationBorderStyleType.UNDERLINE:
	          container.style.borderBottomStyle = "solid";
	          break;
	      }

	      if (data.color) {
	        container.style.borderColor = _util.Util.makeCssRgb(data.color[0] | 0, data.color[1] | 0, data.color[2] | 0);
	      } else {
	        container.style.borderWidth = 0;
	      }
	    }

	    container.style.left = `${rect[0]}px`;
	    container.style.top = `${rect[1]}px`;
	    container.style.width = `${width}px`;
	    container.style.height = `${height}px`;
	    return container;
	  }

	  _createPopup(container, trigger, data) {
	    if (!trigger) {
	      trigger = document.createElement("div");
	      trigger.style.height = container.style.height;
	      trigger.style.width = container.style.width;
	      container.appendChild(trigger);
	    }

	    const popupElement = new PopupElement({
	      container,
	      trigger,
	      color: data.color,
	      title: data.title,
	      modificationDate: data.modificationDate,
	      contents: data.contents,
	      hideWrapper: true
	    });
	    const popup = popupElement.render();
	    popup.style.left = container.style.width;
	    container.appendChild(popup);
	  }

	  render() {
	    (0, _util.unreachable)("Abstract method `AnnotationElement.render` called");
	  }

	}

	class LinkAnnotationElement extends AnnotationElement {
	  constructor(parameters) {
	    const isRenderable = !!(parameters.data.url || parameters.data.dest || parameters.data.action);
	    super(parameters, isRenderable);
	  }

	  render() {
	    this.container.className = "linkAnnotation";
	    const {
	      data,
	      linkService
	    } = this;
	    const link = document.createElement("a");

	    if (data.url) {
	      (0, _display_utils.addLinkAttributes)(link, {
	        url: data.url,
	        target: data.newWindow ? _display_utils.LinkTarget.BLANK : linkService.externalLinkTarget,
	        rel: linkService.externalLinkRel,
	        enabled: linkService.externalLinkEnabled
	      });
	    } else if (data.action) {
	      this._bindNamedAction(link, data.action);
	    } else {
	      this._bindLink(link, data.dest);
	    }

	    this.container.appendChild(link);
	    return this.container;
	  }

	  _bindLink(link, destination) {
	    link.href = this.linkService.getDestinationHash(destination);

	    link.onclick = () => {
	      if (destination) {
	        this.linkService.navigateTo(destination);
	      }

	      return false;
	    };

	    if (destination) {
	      link.className = "internalLink";
	    }
	  }

	  _bindNamedAction(link, action) {
	    link.href = this.linkService.getAnchorUrl("");

	    link.onclick = () => {
	      this.linkService.executeNamedAction(action);
	      return false;
	    };

	    link.className = "internalLink";
	  }

	}

	class TextAnnotationElement extends AnnotationElement {
	  constructor(parameters) {
	    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
	    super(parameters, isRenderable);
	  }

	  render() {
	    this.container.className = "textAnnotation";
	    const image = document.createElement("img");
	    image.style.height = this.container.style.height;
	    image.style.width = this.container.style.width;
	    image.src = this.imageResourcesPath + "annotation-" + this.data.name.toLowerCase() + ".svg";
	    image.alt = "[{{type}} Annotation]";
	    image.dataset.l10nId = "text_annotation_type";
	    image.dataset.l10nArgs = JSON.stringify({
	      type: this.data.name
	    });

	    if (!this.data.hasPopup) {
	      this._createPopup(this.container, image, this.data);
	    }

	    this.container.appendChild(image);
	    return this.container;
	  }

	}

	class WidgetAnnotationElement extends AnnotationElement {
	  render() {
	    return this.container;
	  }

	}

	class TextWidgetAnnotationElement extends WidgetAnnotationElement {
	  constructor(parameters) {
	    const isRenderable = parameters.renderInteractiveForms || !parameters.data.hasAppearance && !!parameters.data.fieldValue;
	    super(parameters, isRenderable);
	  }

	  render() {
	    const TEXT_ALIGNMENT = ["left", "center", "right"];
	    this.container.className = "textWidgetAnnotation";
	    let element = null;

	    if (this.renderInteractiveForms) {
	      if (this.data.multiLine) {
	        element = document.createElement("textarea");
	        element.textContent = this.data.fieldValue;
	      } else {
	        element = document.createElement("input");
	        element.type = "text";
	        element.setAttribute("value", this.data.fieldValue);
	      }

	      element.disabled = this.data.readOnly;
	      element.name = this.data.fieldName;

	      if (this.data.maxLen !== null) {
	        element.maxLength = this.data.maxLen;
	      }

	      if (this.data.comb) {
	        const fieldWidth = this.data.rect[2] - this.data.rect[0];
	        const combWidth = fieldWidth / this.data.maxLen;
	        element.classList.add("comb");
	        element.style.letterSpacing = `calc(${combWidth}px - 1ch)`;
	      }
	    } else {
	      element = document.createElement("div");
	      element.textContent = this.data.fieldValue;
	      element.style.verticalAlign = "middle";
	      element.style.display = "table-cell";
	      let font = null;

	      if (this.data.fontRefName && this.page.commonObjs.has(this.data.fontRefName)) {
	        font = this.page.commonObjs.get(this.data.fontRefName);
	      }

	      this._setTextStyle(element, font);
	    }

	    if (this.data.textAlignment !== null) {
	      element.style.textAlign = TEXT_ALIGNMENT[this.data.textAlignment];
	    }

	    this.container.appendChild(element);
	    return this.container;
	  }

	  _setTextStyle(element, font) {
	    const style = element.style;
	    style.fontSize = `${this.data.fontSize}px`;
	    style.direction = this.data.fontDirection < 0 ? "rtl" : "ltr";

	    if (!font) {
	      return;
	    }

	    let bold = "normal";

	    if (font.black) {
	      bold = "900";
	    } else if (font.bold) {
	      bold = "bold";
	    }

	    style.fontWeight = bold;
	    style.fontStyle = font.italic ? "italic" : "normal";
	    const fontFamily = font.loadedName ? `"${font.loadedName}", ` : "";
	    const fallbackName = font.fallbackName || "Helvetica, sans-serif";
	    style.fontFamily = fontFamily + fallbackName;
	  }

	}

	class CheckboxWidgetAnnotationElement extends WidgetAnnotationElement {
	  constructor(parameters) {
	    super(parameters, parameters.renderInteractiveForms);
	  }

	  render() {
	    this.container.className = "buttonWidgetAnnotation checkBox";
	    const element = document.createElement("input");
	    element.disabled = this.data.readOnly;
	    element.type = "checkbox";
	    element.name = this.data.fieldName;

	    if (this.data.fieldValue && this.data.fieldValue !== "Off") {
	      element.setAttribute("checked", true);
	    }

	    this.container.appendChild(element);
	    return this.container;
	  }

	}

	class RadioButtonWidgetAnnotationElement extends WidgetAnnotationElement {
	  constructor(parameters) {
	    super(parameters, parameters.renderInteractiveForms);
	  }

	  render() {
	    this.container.className = "buttonWidgetAnnotation radioButton";
	    const element = document.createElement("input");
	    element.disabled = this.data.readOnly;
	    element.type = "radio";
	    element.name = this.data.fieldName;

	    if (this.data.fieldValue === this.data.buttonValue) {
	      element.setAttribute("checked", true);
	    }

	    this.container.appendChild(element);
	    return this.container;
	  }

	}

	class PushButtonWidgetAnnotationElement extends LinkAnnotationElement {
	  render() {
	    const container = super.render();
	    container.className = "buttonWidgetAnnotation pushButton";
	    return container;
	  }

	}

	class ChoiceWidgetAnnotationElement extends WidgetAnnotationElement {
	  constructor(parameters) {
	    super(parameters, parameters.renderInteractiveForms);
	  }

	  render() {
	    this.container.className = "choiceWidgetAnnotation";
	    const selectElement = document.createElement("select");
	    selectElement.disabled = this.data.readOnly;
	    selectElement.name = this.data.fieldName;

	    if (!this.data.combo) {
	      selectElement.size = this.data.options.length;

	      if (this.data.multiSelect) {
	        selectElement.multiple = true;
	      }
	    }

	    for (const option of this.data.options) {
	      const optionElement = document.createElement("option");
	      optionElement.textContent = option.displayValue;
	      optionElement.value = option.exportValue;

	      if (this.data.fieldValue.includes(option.displayValue)) {
	        optionElement.setAttribute("selected", true);
	      }

	      selectElement.appendChild(optionElement);
	    }

	    this.container.appendChild(selectElement);
	    return this.container;
	  }

	}

	class PopupAnnotationElement extends AnnotationElement {
	  constructor(parameters) {
	    const isRenderable = !!(parameters.data.title || parameters.data.contents);
	    super(parameters, isRenderable);
	  }

	  render() {
	    const IGNORE_TYPES = ["Line", "Square", "Circle", "PolyLine", "Polygon", "Ink"];
	    this.container.className = "popupAnnotation";

	    if (IGNORE_TYPES.includes(this.data.parentType)) {
	      return this.container;
	    }

	    const selector = `[data-annotation-id="${this.data.parentId}"]`;
	    const parentElement = this.layer.querySelector(selector);

	    if (!parentElement) {
	      return this.container;
	    }

	    const popup = new PopupElement({
	      container: this.container,
	      trigger: parentElement,
	      color: this.data.color,
	      title: this.data.title,
	      modificationDate: this.data.modificationDate,
	      contents: this.data.contents
	    });
	    const parentLeft = parseFloat(parentElement.style.left);
	    const parentWidth = parseFloat(parentElement.style.width);
	    this.container.style.transformOrigin = `-${parentLeft + parentWidth}px -${parentElement.style.top}`;
	    this.container.style.left = `${parentLeft + parentWidth}px`;
	    this.container.appendChild(popup.render());
	    return this.container;
	  }

	}

	class PopupElement {
	  constructor(parameters) {
	    this.container = parameters.container;
	    this.trigger = parameters.trigger;
	    this.color = parameters.color;
	    this.title = parameters.title;
	    this.modificationDate = parameters.modificationDate;
	    this.contents = parameters.contents;
	    this.hideWrapper = parameters.hideWrapper || false;
	    this.pinned = false;
	  }

	  render() {
	    const BACKGROUND_ENLIGHT = 0.7;
	    const wrapper = document.createElement("div");
	    wrapper.className = "popupWrapper";
	    this.hideElement = this.hideWrapper ? wrapper : this.container;
	    this.hideElement.setAttribute("hidden", true);
	    const popup = document.createElement("div");
	    popup.className = "popup";
	    const color = this.color;

	    if (color) {
	      const r = BACKGROUND_ENLIGHT * (255 - color[0]) + color[0];
	      const g = BACKGROUND_ENLIGHT * (255 - color[1]) + color[1];
	      const b = BACKGROUND_ENLIGHT * (255 - color[2]) + color[2];
	      popup.style.backgroundColor = _util.Util.makeCssRgb(r | 0, g | 0, b | 0);
	    }

	    const title = document.createElement("h1");
	    title.textContent = this.title;
	    popup.appendChild(title);

	    const dateObject = _display_utils.PDFDateString.toDateObject(this.modificationDate);

	    if (dateObject) {
	      const modificationDate = document.createElement("span");
	      modificationDate.textContent = "{{date}}, {{time}}";
	      modificationDate.dataset.l10nId = "annotation_date_string";
	      modificationDate.dataset.l10nArgs = JSON.stringify({
	        date: dateObject.toLocaleDateString(),
	        time: dateObject.toLocaleTimeString()
	      });
	      popup.appendChild(modificationDate);
	    }

	    const contents = this._formatContents(this.contents);

	    popup.appendChild(contents);
	    this.trigger.addEventListener("click", this._toggle.bind(this));
	    this.trigger.addEventListener("mouseover", this._show.bind(this, false));
	    this.trigger.addEventListener("mouseout", this._hide.bind(this, false));
	    popup.addEventListener("click", this._hide.bind(this, true));
	    wrapper.appendChild(popup);
	    return wrapper;
	  }

	  _formatContents(contents) {
	    const p = document.createElement("p");
	    const lines = contents.split(/(?:\r\n?|\n)/);

	    for (let i = 0, ii = lines.length; i < ii; ++i) {
	      const line = lines[i];
	      p.appendChild(document.createTextNode(line));

	      if (i < ii - 1) {
	        p.appendChild(document.createElement("br"));
	      }
	    }

	    return p;
	  }

	  _toggle() {
	    if (this.pinned) {
	      this._hide(true);
	    } else {
	      this._show(true);
	    }
	  }

	  _show(pin = false) {
	    if (pin) {
	      this.pinned = true;
	    }

	    if (this.hideElement.hasAttribute("hidden")) {
	      this.hideElement.removeAttribute("hidden");
	      this.container.style.zIndex += 1;
	    }
	  }

	  _hide(unpin = true) {
	    if (unpin) {
	      this.pinned = false;
	    }

	    if (!this.hideElement.hasAttribute("hidden") && !this.pinned) {
	      this.hideElement.setAttribute("hidden", true);
	      this.container.style.zIndex -= 1;
	    }
	  }

	}

	class FreeTextAnnotationElement extends AnnotationElement {
	  constructor(parameters) {
	    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
	    super(parameters, isRenderable, true);
	  }

	  render() {
	    this.container.className = "freeTextAnnotation";

	    if (!this.data.hasPopup) {
	      this._createPopup(this.container, null, this.data);
	    }

	    return this.container;
	  }

	}

	class LineAnnotationElement extends AnnotationElement {
	  constructor(parameters) {
	    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
	    super(parameters, isRenderable, true);
	  }

	  render() {
	    this.container.className = "lineAnnotation";
	    const data = this.data;
	    const width = data.rect[2] - data.rect[0];
	    const height = data.rect[3] - data.rect[1];
	    const svg = this.svgFactory.create(width, height);
	    const line = this.svgFactory.createElement("svg:line");
	    line.setAttribute("x1", data.rect[2] - data.lineCoordinates[0]);
	    line.setAttribute("y1", data.rect[3] - data.lineCoordinates[1]);
	    line.setAttribute("x2", data.rect[2] - data.lineCoordinates[2]);
	    line.setAttribute("y2", data.rect[3] - data.lineCoordinates[3]);
	    line.setAttribute("stroke-width", data.borderStyle.width || 1);
	    line.setAttribute("stroke", "transparent");
	    svg.appendChild(line);
	    this.container.append(svg);

	    this._createPopup(this.container, line, data);

	    return this.container;
	  }

	}

	class SquareAnnotationElement extends AnnotationElement {
	  constructor(parameters) {
	    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
	    super(parameters, isRenderable, true);
	  }

	  render() {
	    this.container.className = "squareAnnotation";
	    const data = this.data;
	    const width = data.rect[2] - data.rect[0];
	    const height = data.rect[3] - data.rect[1];
	    const svg = this.svgFactory.create(width, height);
	    const borderWidth = data.borderStyle.width;
	    const square = this.svgFactory.createElement("svg:rect");
	    square.setAttribute("x", borderWidth / 2);
	    square.setAttribute("y", borderWidth / 2);
	    square.setAttribute("width", width - borderWidth);
	    square.setAttribute("height", height - borderWidth);
	    square.setAttribute("stroke-width", borderWidth || 1);
	    square.setAttribute("stroke", "transparent");
	    square.setAttribute("fill", "none");
	    svg.appendChild(square);
	    this.container.append(svg);

	    this._createPopup(this.container, square, data);

	    return this.container;
	  }

	}

	class CircleAnnotationElement extends AnnotationElement {
	  constructor(parameters) {
	    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
	    super(parameters, isRenderable, true);
	  }

	  render() {
	    this.container.className = "circleAnnotation";
	    const data = this.data;
	    const width = data.rect[2] - data.rect[0];
	    const height = data.rect[3] - data.rect[1];
	    const svg = this.svgFactory.create(width, height);
	    const borderWidth = data.borderStyle.width;
	    const circle = this.svgFactory.createElement("svg:ellipse");
	    circle.setAttribute("cx", width / 2);
	    circle.setAttribute("cy", height / 2);
	    circle.setAttribute("rx", width / 2 - borderWidth / 2);
	    circle.setAttribute("ry", height / 2 - borderWidth / 2);
	    circle.setAttribute("stroke-width", borderWidth || 1);
	    circle.setAttribute("stroke", "transparent");
	    circle.setAttribute("fill", "none");
	    svg.appendChild(circle);
	    this.container.append(svg);

	    this._createPopup(this.container, circle, data);

	    return this.container;
	  }

	}

	class PolylineAnnotationElement extends AnnotationElement {
	  constructor(parameters) {
	    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
	    super(parameters, isRenderable, true);
	    this.containerClassName = "polylineAnnotation";
	    this.svgElementName = "svg:polyline";
	  }

	  render() {
	    this.container.className = this.containerClassName;
	    const data = this.data;
	    const width = data.rect[2] - data.rect[0];
	    const height = data.rect[3] - data.rect[1];
	    const svg = this.svgFactory.create(width, height);
	    let points = [];

	    for (const coordinate of data.vertices) {
	      const x = coordinate.x - data.rect[0];
	      const y = data.rect[3] - coordinate.y;
	      points.push(x + "," + y);
	    }

	    points = points.join(" ");
	    const polyline = this.svgFactory.createElement(this.svgElementName);
	    polyline.setAttribute("points", points);
	    polyline.setAttribute("stroke-width", data.borderStyle.width || 1);
	    polyline.setAttribute("stroke", "transparent");
	    polyline.setAttribute("fill", "none");
	    svg.appendChild(polyline);
	    this.container.append(svg);

	    this._createPopup(this.container, polyline, data);

	    return this.container;
	  }

	}

	class PolygonAnnotationElement extends PolylineAnnotationElement {
	  constructor(parameters) {
	    super(parameters);
	    this.containerClassName = "polygonAnnotation";
	    this.svgElementName = "svg:polygon";
	  }

	}

	class CaretAnnotationElement extends AnnotationElement {
	  constructor(parameters) {
	    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
	    super(parameters, isRenderable, true);
	  }

	  render() {
	    this.container.className = "caretAnnotation";

	    if (!this.data.hasPopup) {
	      this._createPopup(this.container, null, this.data);
	    }

	    return this.container;
	  }

	}

	class InkAnnotationElement extends AnnotationElement {
	  constructor(parameters) {
	    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
	    super(parameters, isRenderable, true);
	    this.containerClassName = "inkAnnotation";
	    this.svgElementName = "svg:polyline";
	  }

	  render() {
	    this.container.className = this.containerClassName;
	    const data = this.data;
	    const width = data.rect[2] - data.rect[0];
	    const height = data.rect[3] - data.rect[1];
	    const svg = this.svgFactory.create(width, height);

	    for (const inkList of data.inkLists) {
	      let points = [];

	      for (const coordinate of inkList) {
	        const x = coordinate.x - data.rect[0];
	        const y = data.rect[3] - coordinate.y;
	        points.push(`${x},${y}`);
	      }

	      points = points.join(" ");
	      const polyline = this.svgFactory.createElement(this.svgElementName);
	      polyline.setAttribute("points", points);
	      polyline.setAttribute("stroke-width", data.borderStyle.width || 1);
	      polyline.setAttribute("stroke", "transparent");
	      polyline.setAttribute("fill", "none");

	      this._createPopup(this.container, polyline, data);

	      svg.appendChild(polyline);
	    }

	    this.container.append(svg);
	    return this.container;
	  }

	}

	class HighlightAnnotationElement extends AnnotationElement {
	  constructor(parameters) {
	    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
	    super(parameters, isRenderable, true);
	  }

	  render() {
	    this.container.className = "highlightAnnotation";

	    if (!this.data.hasPopup) {
	      this._createPopup(this.container, null, this.data);
	    }

	    return this.container;
	  }

	}

	class UnderlineAnnotationElement extends AnnotationElement {
	  constructor(parameters) {
	    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
	    super(parameters, isRenderable, true);
	  }

	  render() {
	    this.container.className = "underlineAnnotation";

	    if (!this.data.hasPopup) {
	      this._createPopup(this.container, null, this.data);
	    }

	    return this.container;
	  }

	}

	class SquigglyAnnotationElement extends AnnotationElement {
	  constructor(parameters) {
	    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
	    super(parameters, isRenderable, true);
	  }

	  render() {
	    this.container.className = "squigglyAnnotation";

	    if (!this.data.hasPopup) {
	      this._createPopup(this.container, null, this.data);
	    }

	    return this.container;
	  }

	}

	class StrikeOutAnnotationElement extends AnnotationElement {
	  constructor(parameters) {
	    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
	    super(parameters, isRenderable, true);
	  }

	  render() {
	    this.container.className = "strikeoutAnnotation";

	    if (!this.data.hasPopup) {
	      this._createPopup(this.container, null, this.data);
	    }

	    return this.container;
	  }

	}

	class StampAnnotationElement extends AnnotationElement {
	  constructor(parameters) {
	    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
	    super(parameters, isRenderable, true);
	  }

	  render() {
	    this.container.className = "stampAnnotation";

	    if (!this.data.hasPopup) {
	      this._createPopup(this.container, null, this.data);
	    }

	    return this.container;
	  }

	}

	class FileAttachmentAnnotationElement extends AnnotationElement {
	  constructor(parameters) {
	    super(parameters, true);
	    const {
	      filename,
	      content
	    } = this.data.file;
	    this.filename = (0, _display_utils.getFilenameFromUrl)(filename);
	    this.content = content;

	    if (this.linkService.eventBus) {
	      this.linkService.eventBus.dispatch("fileattachmentannotation", {
	        source: this,
	        id: (0, _util.stringToPDFString)(filename),
	        filename,
	        content
	      });
	    }
	  }

	  render() {
	    this.container.className = "fileAttachmentAnnotation";
	    const trigger = document.createElement("div");
	    trigger.style.height = this.container.style.height;
	    trigger.style.width = this.container.style.width;
	    trigger.addEventListener("dblclick", this._download.bind(this));

	    if (!this.data.hasPopup && (this.data.title || this.data.contents)) {
	      this._createPopup(this.container, trigger, this.data);
	    }

	    this.container.appendChild(trigger);
	    return this.container;
	  }

	  _download() {
	    if (!this.downloadManager) {
	      (0, _util.warn)("Download cannot be started due to unavailable download manager");
	      return;
	    }

	    this.downloadManager.downloadData(this.content, this.filename, "");
	  }

	}

	class AnnotationLayer {
	  static render(parameters) {
	    const sortedAnnotations = [],
	          popupAnnotations = [];

	    for (const data of parameters.annotations) {
	      if (!data) {
	        continue;
	      }

	      if (data.annotationType === _util.AnnotationType.POPUP) {
	        popupAnnotations.push(data);
	        continue;
	      }

	      sortedAnnotations.push(data);
	    }

	    if (popupAnnotations.length) {
	      sortedAnnotations.push(...popupAnnotations);
	    }

	    for (const data of sortedAnnotations) {
	      const element = AnnotationElementFactory.create({
	        data,
	        layer: parameters.div,
	        page: parameters.page,
	        viewport: parameters.viewport,
	        linkService: parameters.linkService,
	        downloadManager: parameters.downloadManager,
	        imageResourcesPath: parameters.imageResourcesPath || "",
	        renderInteractiveForms: parameters.renderInteractiveForms || false,
	        svgFactory: new _display_utils.DOMSVGFactory()
	      });

	      if (element.isRenderable) {
	        parameters.div.appendChild(element.render());
	      }
	    }
	  }

	  static update(parameters) {
	    for (const data of parameters.annotations) {
	      const element = parameters.div.querySelector(`[data-annotation-id="${data.id}"]`);

	      if (element) {
	        element.style.transform = `matrix(${parameters.viewport.transform.join(",")})`;
	      }
	    }

	    parameters.div.removeAttribute("hidden");
	  }

	}

	exports.AnnotationLayer = AnnotationLayer;

	/***/ }),
	/* 17 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.renderTextLayer = void 0;

	var _util = __w_pdfjs_require__(2);

	var renderTextLayer = function renderTextLayerClosure() {
	  var MAX_TEXT_DIVS_TO_RENDER = 100000;
	  var NonWhitespaceRegexp = /\S/;

	  function isAllWhitespace(str) {
	    return !NonWhitespaceRegexp.test(str);
	  }

	  function appendText(task, geom, styles) {
	    var textDiv = document.createElement("span");
	    var textDivProperties = {
	      angle: 0,
	      canvasWidth: 0,
	      isWhitespace: false,
	      originalTransform: null,
	      paddingBottom: 0,
	      paddingLeft: 0,
	      paddingRight: 0,
	      paddingTop: 0,
	      scale: 1
	    };

	    task._textDivs.push(textDiv);

	    if (isAllWhitespace(geom.str)) {
	      textDivProperties.isWhitespace = true;

	      task._textDivProperties.set(textDiv, textDivProperties);

	      return;
	    }

	    var tx = _util.Util.transform(task._viewport.transform, geom.transform);

	    var angle = Math.atan2(tx[1], tx[0]);
	    var style = styles[geom.fontName];

	    if (style.vertical) {
	      angle += Math.PI / 2;
	    }

	    var fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
	    var fontAscent = fontHeight;

	    if (style.ascent) {
	      fontAscent = style.ascent * fontAscent;
	    } else if (style.descent) {
	      fontAscent = (1 + style.descent) * fontAscent;
	    }

	    let left, top;

	    if (angle === 0) {
	      left = tx[4];
	      top = tx[5] - fontAscent;
	    } else {
	      left = tx[4] + fontAscent * Math.sin(angle);
	      top = tx[5] - fontAscent * Math.cos(angle);
	    }

	    textDiv.style.left = `${left}px`;
	    textDiv.style.top = `${top}px`;
	    textDiv.style.fontSize = `${fontHeight}px`;
	    textDiv.style.fontFamily = style.fontFamily;
	    textDiv.textContent = geom.str;

	    if (task._fontInspectorEnabled) {
	      textDiv.dataset.fontName = geom.fontName;
	    }

	    if (angle !== 0) {
	      textDivProperties.angle = angle * (180 / Math.PI);
	    }

	    let shouldScaleText = false;

	    if (geom.str.length > 1) {
	      shouldScaleText = true;
	    } else if (geom.transform[0] !== geom.transform[3]) {
	      const absScaleX = Math.abs(geom.transform[0]),
	            absScaleY = Math.abs(geom.transform[3]);

	      if (absScaleX !== absScaleY && Math.max(absScaleX, absScaleY) / Math.min(absScaleX, absScaleY) > 1.5) {
	        shouldScaleText = true;
	      }
	    }

	    if (shouldScaleText) {
	      if (style.vertical) {
	        textDivProperties.canvasWidth = geom.height * task._viewport.scale;
	      } else {
	        textDivProperties.canvasWidth = geom.width * task._viewport.scale;
	      }
	    }

	    task._textDivProperties.set(textDiv, textDivProperties);

	    if (task._textContentStream) {
	      task._layoutText(textDiv);
	    }

	    if (task._enhanceTextSelection) {
	      var angleCos = 1,
	          angleSin = 0;

	      if (angle !== 0) {
	        angleCos = Math.cos(angle);
	        angleSin = Math.sin(angle);
	      }

	      var divWidth = (style.vertical ? geom.height : geom.width) * task._viewport.scale;
	      var divHeight = fontHeight;
	      var m, b;

	      if (angle !== 0) {
	        m = [angleCos, angleSin, -angleSin, angleCos, left, top];
	        b = _util.Util.getAxialAlignedBoundingBox([0, 0, divWidth, divHeight], m);
	      } else {
	        b = [left, top, left + divWidth, top + divHeight];
	      }

	      task._bounds.push({
	        left: b[0],
	        top: b[1],
	        right: b[2],
	        bottom: b[3],
	        div: textDiv,
	        size: [divWidth, divHeight],
	        m
	      });
	    }
	  }

	  function render(task) {
	    if (task._canceled) {
	      return;
	    }

	    var textDivs = task._textDivs;
	    var capability = task._capability;
	    var textDivsLength = textDivs.length;

	    if (textDivsLength > MAX_TEXT_DIVS_TO_RENDER) {
	      task._renderingDone = true;
	      capability.resolve();
	      return;
	    }

	    if (!task._textContentStream) {
	      for (var i = 0; i < textDivsLength; i++) {
	        task._layoutText(textDivs[i]);
	      }
	    }

	    task._renderingDone = true;
	    capability.resolve();
	  }

	  function findPositiveMin(ts, offset, count) {
	    let result = 0;

	    for (let i = 0; i < count; i++) {
	      const t = ts[offset++];

	      if (t > 0) {
	        result = result ? Math.min(t, result) : t;
	      }
	    }

	    return result;
	  }

	  function expand(task) {
	    var bounds = task._bounds;
	    var viewport = task._viewport;
	    var expanded = expandBounds(viewport.width, viewport.height, bounds);

	    for (var i = 0; i < expanded.length; i++) {
	      var div = bounds[i].div;

	      var divProperties = task._textDivProperties.get(div);

	      if (divProperties.angle === 0) {
	        divProperties.paddingLeft = bounds[i].left - expanded[i].left;
	        divProperties.paddingTop = bounds[i].top - expanded[i].top;
	        divProperties.paddingRight = expanded[i].right - bounds[i].right;
	        divProperties.paddingBottom = expanded[i].bottom - bounds[i].bottom;

	        task._textDivProperties.set(div, divProperties);

	        continue;
	      }

	      var e = expanded[i],
	          b = bounds[i];
	      var m = b.m,
	          c = m[0],
	          s = m[1];
	      var points = [[0, 0], [0, b.size[1]], [b.size[0], 0], b.size];
	      var ts = new Float64Array(64);
	      points.forEach(function (p, j) {
	        var t = _util.Util.applyTransform(p, m);

	        ts[j + 0] = c && (e.left - t[0]) / c;
	        ts[j + 4] = s && (e.top - t[1]) / s;
	        ts[j + 8] = c && (e.right - t[0]) / c;
	        ts[j + 12] = s && (e.bottom - t[1]) / s;
	        ts[j + 16] = s && (e.left - t[0]) / -s;
	        ts[j + 20] = c && (e.top - t[1]) / c;
	        ts[j + 24] = s && (e.right - t[0]) / -s;
	        ts[j + 28] = c && (e.bottom - t[1]) / c;
	        ts[j + 32] = c && (e.left - t[0]) / -c;
	        ts[j + 36] = s && (e.top - t[1]) / -s;
	        ts[j + 40] = c && (e.right - t[0]) / -c;
	        ts[j + 44] = s && (e.bottom - t[1]) / -s;
	        ts[j + 48] = s && (e.left - t[0]) / s;
	        ts[j + 52] = c && (e.top - t[1]) / -c;
	        ts[j + 56] = s && (e.right - t[0]) / s;
	        ts[j + 60] = c && (e.bottom - t[1]) / -c;
	      });
	      var boxScale = 1 + Math.min(Math.abs(c), Math.abs(s));
	      divProperties.paddingLeft = findPositiveMin(ts, 32, 16) / boxScale;
	      divProperties.paddingTop = findPositiveMin(ts, 48, 16) / boxScale;
	      divProperties.paddingRight = findPositiveMin(ts, 0, 16) / boxScale;
	      divProperties.paddingBottom = findPositiveMin(ts, 16, 16) / boxScale;

	      task._textDivProperties.set(div, divProperties);
	    }
	  }

	  function expandBounds(width, height, boxes) {
	    var bounds = boxes.map(function (box, i) {
	      return {
	        x1: box.left,
	        y1: box.top,
	        x2: box.right,
	        y2: box.bottom,
	        index: i,
	        x1New: undefined,
	        x2New: undefined
	      };
	    });
	    expandBoundsLTR(width, bounds);
	    var expanded = new Array(boxes.length);
	    bounds.forEach(function (b) {
	      var i = b.index;
	      expanded[i] = {
	        left: b.x1New,
	        top: 0,
	        right: b.x2New,
	        bottom: 0
	      };
	    });
	    boxes.map(function (box, i) {
	      var e = expanded[i],
	          b = bounds[i];
	      b.x1 = box.top;
	      b.y1 = width - e.right;
	      b.x2 = box.bottom;
	      b.y2 = width - e.left;
	      b.index = i;
	      b.x1New = undefined;
	      b.x2New = undefined;
	    });
	    expandBoundsLTR(height, bounds);
	    bounds.forEach(function (b) {
	      var i = b.index;
	      expanded[i].top = b.x1New;
	      expanded[i].bottom = b.x2New;
	    });
	    return expanded;
	  }

	  function expandBoundsLTR(width, bounds) {
	    bounds.sort(function (a, b) {
	      return a.x1 - b.x1 || a.index - b.index;
	    });
	    var fakeBoundary = {
	      x1: -Infinity,
	      y1: -Infinity,
	      x2: 0,
	      y2: Infinity,
	      index: -1,
	      x1New: 0,
	      x2New: 0
	    };
	    var horizon = [{
	      start: -Infinity,
	      end: Infinity,
	      boundary: fakeBoundary
	    }];
	    bounds.forEach(function (boundary) {
	      var i = 0;

	      while (i < horizon.length && horizon[i].end <= boundary.y1) {
	        i++;
	      }

	      var j = horizon.length - 1;

	      while (j >= 0 && horizon[j].start >= boundary.y2) {
	        j--;
	      }

	      var horizonPart, affectedBoundary;
	      var q,
	          k,
	          maxXNew = -Infinity;

	      for (q = i; q <= j; q++) {
	        horizonPart = horizon[q];
	        affectedBoundary = horizonPart.boundary;
	        var xNew;

	        if (affectedBoundary.x2 > boundary.x1) {
	          xNew = affectedBoundary.index > boundary.index ? affectedBoundary.x1New : boundary.x1;
	        } else if (affectedBoundary.x2New === undefined) {
	          xNew = (affectedBoundary.x2 + boundary.x1) / 2;
	        } else {
	          xNew = affectedBoundary.x2New;
	        }

	        if (xNew > maxXNew) {
	          maxXNew = xNew;
	        }
	      }

	      boundary.x1New = maxXNew;

	      for (q = i; q <= j; q++) {
	        horizonPart = horizon[q];
	        affectedBoundary = horizonPart.boundary;

	        if (affectedBoundary.x2New === undefined) {
	          if (affectedBoundary.x2 > boundary.x1) {
	            if (affectedBoundary.index > boundary.index) {
	              affectedBoundary.x2New = affectedBoundary.x2;
	            }
	          } else {
	            affectedBoundary.x2New = maxXNew;
	          }
	        } else if (affectedBoundary.x2New > maxXNew) {
	          affectedBoundary.x2New = Math.max(maxXNew, affectedBoundary.x2);
	        }
	      }

	      var changedHorizon = [],
	          lastBoundary = null;

	      for (q = i; q <= j; q++) {
	        horizonPart = horizon[q];
	        affectedBoundary = horizonPart.boundary;
	        var useBoundary = affectedBoundary.x2 > boundary.x2 ? affectedBoundary : boundary;

	        if (lastBoundary === useBoundary) {
	          changedHorizon[changedHorizon.length - 1].end = horizonPart.end;
	        } else {
	          changedHorizon.push({
	            start: horizonPart.start,
	            end: horizonPart.end,
	            boundary: useBoundary
	          });
	          lastBoundary = useBoundary;
	        }
	      }

	      if (horizon[i].start < boundary.y1) {
	        changedHorizon[0].start = boundary.y1;
	        changedHorizon.unshift({
	          start: horizon[i].start,
	          end: boundary.y1,
	          boundary: horizon[i].boundary
	        });
	      }

	      if (boundary.y2 < horizon[j].end) {
	        changedHorizon[changedHorizon.length - 1].end = boundary.y2;
	        changedHorizon.push({
	          start: boundary.y2,
	          end: horizon[j].end,
	          boundary: horizon[j].boundary
	        });
	      }

	      for (q = i; q <= j; q++) {
	        horizonPart = horizon[q];
	        affectedBoundary = horizonPart.boundary;

	        if (affectedBoundary.x2New !== undefined) {
	          continue;
	        }

	        var used = false;

	        for (k = i - 1; !used && k >= 0 && horizon[k].start >= affectedBoundary.y1; k--) {
	          used = horizon[k].boundary === affectedBoundary;
	        }

	        for (k = j + 1; !used && k < horizon.length && horizon[k].end <= affectedBoundary.y2; k++) {
	          used = horizon[k].boundary === affectedBoundary;
	        }

	        for (k = 0; !used && k < changedHorizon.length; k++) {
	          used = changedHorizon[k].boundary === affectedBoundary;
	        }

	        if (!used) {
	          affectedBoundary.x2New = maxXNew;
	        }
	      }

	      Array.prototype.splice.apply(horizon, [i, j - i + 1].concat(changedHorizon));
	    });
	    horizon.forEach(function (horizonPart) {
	      var affectedBoundary = horizonPart.boundary;

	      if (affectedBoundary.x2New === undefined) {
	        affectedBoundary.x2New = Math.max(width, affectedBoundary.x2);
	      }
	    });
	  }

	  function TextLayerRenderTask({
	    textContent,
	    textContentStream,
	    container,
	    viewport,
	    textDivs,
	    textContentItemsStr,
	    enhanceTextSelection
	  }) {
	    this._textContent = textContent;
	    this._textContentStream = textContentStream;
	    this._container = container;
	    this._viewport = viewport;
	    this._textDivs = textDivs || [];
	    this._textContentItemsStr = textContentItemsStr || [];
	    this._enhanceTextSelection = !!enhanceTextSelection;
	    this._fontInspectorEnabled = !!(globalThis.FontInspector && globalThis.FontInspector.enabled);
	    this._reader = null;
	    this._layoutTextLastFontSize = null;
	    this._layoutTextLastFontFamily = null;
	    this._layoutTextCtx = null;
	    this._textDivProperties = new WeakMap();
	    this._renderingDone = false;
	    this._canceled = false;
	    this._capability = (0, _util.createPromiseCapability)();
	    this._renderTimer = null;
	    this._bounds = [];

	    this._capability.promise.finally(() => {
	      if (this._layoutTextCtx) {
	        this._layoutTextCtx.canvas.width = 0;
	        this._layoutTextCtx.canvas.height = 0;
	        this._layoutTextCtx = null;
	      }
	    }).catch(() => {});
	  }

	  TextLayerRenderTask.prototype = {
	    get promise() {
	      return this._capability.promise;
	    },

	    cancel: function TextLayer_cancel() {
	      this._canceled = true;

	      if (this._reader) {
	        this._reader.cancel(new _util.AbortException("TextLayer task cancelled."));

	        this._reader = null;
	      }

	      if (this._renderTimer !== null) {
	        clearTimeout(this._renderTimer);
	        this._renderTimer = null;
	      }

	      this._capability.reject(new Error("TextLayer task cancelled."));
	    },

	    _processItems(items, styleCache) {
	      for (let i = 0, len = items.length; i < len; i++) {
	        this._textContentItemsStr.push(items[i].str);

	        appendText(this, items[i], styleCache);
	      }
	    },

	    _layoutText(textDiv) {
	      const textDivProperties = this._textDivProperties.get(textDiv);

	      if (textDivProperties.isWhitespace) {
	        return;
	      }

	      let transform = "";

	      if (textDivProperties.canvasWidth !== 0) {
	        const {
	          fontSize,
	          fontFamily
	        } = textDiv.style;

	        if (fontSize !== this._layoutTextLastFontSize || fontFamily !== this._layoutTextLastFontFamily) {
	          this._layoutTextCtx.font = `${fontSize} ${fontFamily}`;
	          this._layoutTextLastFontSize = fontSize;
	          this._layoutTextLastFontFamily = fontFamily;
	        }

	        const {
	          width
	        } = this._layoutTextCtx.measureText(textDiv.textContent);

	        if (width > 0) {
	          textDivProperties.scale = textDivProperties.canvasWidth / width;
	          transform = `scaleX(${textDivProperties.scale})`;
	        }
	      }

	      if (textDivProperties.angle !== 0) {
	        transform = `rotate(${textDivProperties.angle}deg) ${transform}`;
	      }

	      if (transform.length > 0) {
	        if (this._enhanceTextSelection) {
	          textDivProperties.originalTransform = transform;
	        }

	        textDiv.style.transform = transform;
	      }

	      this._textDivProperties.set(textDiv, textDivProperties);

	      this._container.appendChild(textDiv);
	    },

	    _render: function TextLayer_render(timeout) {
	      const capability = (0, _util.createPromiseCapability)();
	      let styleCache = Object.create(null);
	      const canvas = document.createElement("canvas");
	      canvas.mozOpaque = true;
	      this._layoutTextCtx = canvas.getContext("2d", {
	        alpha: false
	      });

	      if (this._textContent) {
	        const textItems = this._textContent.items;
	        const textStyles = this._textContent.styles;

	        this._processItems(textItems, textStyles);

	        capability.resolve();
	      } else if (this._textContentStream) {
	        const pump = () => {
	          this._reader.read().then(({
	            value,
	            done
	          }) => {
	            if (done) {
	              capability.resolve();
	              return;
	            }

	            Object.assign(styleCache, value.styles);

	            this._processItems(value.items, styleCache);

	            pump();
	          }, capability.reject);
	        };

	        this._reader = this._textContentStream.getReader();
	        pump();
	      } else {
	        throw new Error('Neither "textContent" nor "textContentStream"' + " parameters specified.");
	      }

	      capability.promise.then(() => {
	        styleCache = null;

	        if (!timeout) {
	          render(this);
	        } else {
	          this._renderTimer = setTimeout(() => {
	            render(this);
	            this._renderTimer = null;
	          }, timeout);
	        }
	      }, this._capability.reject);
	    },
	    expandTextDivs: function TextLayer_expandTextDivs(expandDivs) {
	      if (!this._enhanceTextSelection || !this._renderingDone) {
	        return;
	      }

	      if (this._bounds !== null) {
	        expand(this);
	        this._bounds = null;
	      }

	      const transformBuf = [],
	            paddingBuf = [];

	      for (var i = 0, ii = this._textDivs.length; i < ii; i++) {
	        const div = this._textDivs[i];

	        const divProps = this._textDivProperties.get(div);

	        if (divProps.isWhitespace) {
	          continue;
	        }

	        if (expandDivs) {
	          transformBuf.length = 0;
	          paddingBuf.length = 0;

	          if (divProps.originalTransform) {
	            transformBuf.push(divProps.originalTransform);
	          }

	          if (divProps.paddingTop > 0) {
	            paddingBuf.push(`${divProps.paddingTop}px`);
	            transformBuf.push(`translateY(${-divProps.paddingTop}px)`);
	          } else {
	            paddingBuf.push(0);
	          }

	          if (divProps.paddingRight > 0) {
	            paddingBuf.push(`${divProps.paddingRight / divProps.scale}px`);
	          } else {
	            paddingBuf.push(0);
	          }

	          if (divProps.paddingBottom > 0) {
	            paddingBuf.push(`${divProps.paddingBottom}px`);
	          } else {
	            paddingBuf.push(0);
	          }

	          if (divProps.paddingLeft > 0) {
	            paddingBuf.push(`${divProps.paddingLeft / divProps.scale}px`);
	            transformBuf.push(`translateX(${-divProps.paddingLeft / divProps.scale}px)`);
	          } else {
	            paddingBuf.push(0);
	          }

	          div.style.padding = paddingBuf.join(" ");

	          if (transformBuf.length) {
	            div.style.transform = transformBuf.join(" ");
	          }
	        } else {
	          div.style.padding = null;
	          div.style.transform = divProps.originalTransform;
	        }
	      }
	    }
	  };

	  function renderTextLayer(renderParameters) {
	    var task = new TextLayerRenderTask({
	      textContent: renderParameters.textContent,
	      textContentStream: renderParameters.textContentStream,
	      container: renderParameters.container,
	      viewport: renderParameters.viewport,
	      textDivs: renderParameters.textDivs,
	      textContentItemsStr: renderParameters.textContentItemsStr,
	      enhanceTextSelection: renderParameters.enhanceTextSelection
	    });

	    task._render(renderParameters.timeout);

	    return task;
	  }

	  return renderTextLayer;
	}();

	exports.renderTextLayer = renderTextLayer;

	/***/ }),
	/* 18 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.SVGGraphics = void 0;

	var _util = __w_pdfjs_require__(2);

	var _display_utils = __w_pdfjs_require__(1);

	var _is_node = __w_pdfjs_require__(4);

	let SVGGraphics = function () {
	  throw new Error("Not implemented: SVGGraphics");
	};

	exports.SVGGraphics = SVGGraphics;
	{
	  const SVG_DEFAULTS = {
	    fontStyle: "normal",
	    fontWeight: "normal",
	    fillColor: "#000000"
	  };
	  const XML_NS = "http://www.w3.org/XML/1998/namespace";
	  const XLINK_NS = "http://www.w3.org/1999/xlink";
	  const LINE_CAP_STYLES = ["butt", "round", "square"];
	  const LINE_JOIN_STYLES = ["miter", "round", "bevel"];

	  const convertImgDataToPng = function () {
	    const PNG_HEADER = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
	    const CHUNK_WRAPPER_SIZE = 12;
	    const crcTable = new Int32Array(256);

	    for (let i = 0; i < 256; i++) {
	      let c = i;

	      for (let h = 0; h < 8; h++) {
	        if (c & 1) {
	          c = 0xedb88320 ^ c >> 1 & 0x7fffffff;
	        } else {
	          c = c >> 1 & 0x7fffffff;
	        }
	      }

	      crcTable[i] = c;
	    }

	    function crc32(data, start, end) {
	      let crc = -1;

	      for (let i = start; i < end; i++) {
	        const a = (crc ^ data[i]) & 0xff;
	        const b = crcTable[a];
	        crc = crc >>> 8 ^ b;
	      }

	      return crc ^ -1;
	    }

	    function writePngChunk(type, body, data, offset) {
	      let p = offset;
	      const len = body.length;
	      data[p] = len >> 24 & 0xff;
	      data[p + 1] = len >> 16 & 0xff;
	      data[p + 2] = len >> 8 & 0xff;
	      data[p + 3] = len & 0xff;
	      p += 4;
	      data[p] = type.charCodeAt(0) & 0xff;
	      data[p + 1] = type.charCodeAt(1) & 0xff;
	      data[p + 2] = type.charCodeAt(2) & 0xff;
	      data[p + 3] = type.charCodeAt(3) & 0xff;
	      p += 4;
	      data.set(body, p);
	      p += body.length;
	      const crc = crc32(data, offset + 4, p);
	      data[p] = crc >> 24 & 0xff;
	      data[p + 1] = crc >> 16 & 0xff;
	      data[p + 2] = crc >> 8 & 0xff;
	      data[p + 3] = crc & 0xff;
	    }

	    function adler32(data, start, end) {
	      let a = 1;
	      let b = 0;

	      for (let i = start; i < end; ++i) {
	        a = (a + (data[i] & 0xff)) % 65521;
	        b = (b + a) % 65521;
	      }

	      return b << 16 | a;
	    }

	    function deflateSync(literals) {
	      if (!_is_node.isNodeJS) {
	        return deflateSyncUncompressed(literals);
	      }

	      try {
	        let input;

	        if (parseInt(browser$1.versions.node) >= 8) {
	          input = literals;
	        } else {
	          input = Buffer.from(literals);
	        }

	        const output = require$$0.deflateSync(input, {
	          level: 9
	        });

	        return output instanceof Uint8Array ? output : new Uint8Array(output);
	      } catch (e) {
	        (0, _util.warn)("Not compressing PNG because zlib.deflateSync is unavailable: " + e);
	      }

	      return deflateSyncUncompressed(literals);
	    }

	    function deflateSyncUncompressed(literals) {
	      let len = literals.length;
	      const maxBlockLength = 0xffff;
	      const deflateBlocks = Math.ceil(len / maxBlockLength);
	      const idat = new Uint8Array(2 + len + deflateBlocks * 5 + 4);
	      let pi = 0;
	      idat[pi++] = 0x78;
	      idat[pi++] = 0x9c;
	      let pos = 0;

	      while (len > maxBlockLength) {
	        idat[pi++] = 0x00;
	        idat[pi++] = 0xff;
	        idat[pi++] = 0xff;
	        idat[pi++] = 0x00;
	        idat[pi++] = 0x00;
	        idat.set(literals.subarray(pos, pos + maxBlockLength), pi);
	        pi += maxBlockLength;
	        pos += maxBlockLength;
	        len -= maxBlockLength;
	      }

	      idat[pi++] = 0x01;
	      idat[pi++] = len & 0xff;
	      idat[pi++] = len >> 8 & 0xff;
	      idat[pi++] = ~len & 0xffff & 0xff;
	      idat[pi++] = (~len & 0xffff) >> 8 & 0xff;
	      idat.set(literals.subarray(pos), pi);
	      pi += literals.length - pos;
	      const adler = adler32(literals, 0, literals.length);
	      idat[pi++] = adler >> 24 & 0xff;
	      idat[pi++] = adler >> 16 & 0xff;
	      idat[pi++] = adler >> 8 & 0xff;
	      idat[pi++] = adler & 0xff;
	      return idat;
	    }

	    function encode(imgData, kind, forceDataSchema, isMask) {
	      const width = imgData.width;
	      const height = imgData.height;
	      let bitDepth, colorType, lineSize;
	      const bytes = imgData.data;

	      switch (kind) {
	        case _util.ImageKind.GRAYSCALE_1BPP:
	          colorType = 0;
	          bitDepth = 1;
	          lineSize = width + 7 >> 3;
	          break;

	        case _util.ImageKind.RGB_24BPP:
	          colorType = 2;
	          bitDepth = 8;
	          lineSize = width * 3;
	          break;

	        case _util.ImageKind.RGBA_32BPP:
	          colorType = 6;
	          bitDepth = 8;
	          lineSize = width * 4;
	          break;

	        default:
	          throw new Error("invalid format");
	      }

	      const literals = new Uint8Array((1 + lineSize) * height);
	      let offsetLiterals = 0,
	          offsetBytes = 0;

	      for (let y = 0; y < height; ++y) {
	        literals[offsetLiterals++] = 0;
	        literals.set(bytes.subarray(offsetBytes, offsetBytes + lineSize), offsetLiterals);
	        offsetBytes += lineSize;
	        offsetLiterals += lineSize;
	      }

	      if (kind === _util.ImageKind.GRAYSCALE_1BPP && isMask) {
	        offsetLiterals = 0;

	        for (let y = 0; y < height; y++) {
	          offsetLiterals++;

	          for (let i = 0; i < lineSize; i++) {
	            literals[offsetLiterals++] ^= 0xff;
	          }
	        }
	      }

	      const ihdr = new Uint8Array([width >> 24 & 0xff, width >> 16 & 0xff, width >> 8 & 0xff, width & 0xff, height >> 24 & 0xff, height >> 16 & 0xff, height >> 8 & 0xff, height & 0xff, bitDepth, colorType, 0x00, 0x00, 0x00]);
	      const idat = deflateSync(literals);
	      const pngLength = PNG_HEADER.length + CHUNK_WRAPPER_SIZE * 3 + ihdr.length + idat.length;
	      const data = new Uint8Array(pngLength);
	      let offset = 0;
	      data.set(PNG_HEADER, offset);
	      offset += PNG_HEADER.length;
	      writePngChunk("IHDR", ihdr, data, offset);
	      offset += CHUNK_WRAPPER_SIZE + ihdr.length;
	      writePngChunk("IDATA", idat, data, offset);
	      offset += CHUNK_WRAPPER_SIZE + idat.length;
	      writePngChunk("IEND", new Uint8Array(0), data, offset);
	      return (0, _util.createObjectURL)(data, "image/png", forceDataSchema);
	    }

	    return function convertImgDataToPng(imgData, forceDataSchema, isMask) {
	      const kind = imgData.kind === undefined ? _util.ImageKind.GRAYSCALE_1BPP : imgData.kind;
	      return encode(imgData, kind, forceDataSchema, isMask);
	    };
	  }();

	  class SVGExtraState {
	    constructor() {
	      this.fontSizeScale = 1;
	      this.fontWeight = SVG_DEFAULTS.fontWeight;
	      this.fontSize = 0;
	      this.textMatrix = _util.IDENTITY_MATRIX;
	      this.fontMatrix = _util.FONT_IDENTITY_MATRIX;
	      this.leading = 0;
	      this.textRenderingMode = _util.TextRenderingMode.FILL;
	      this.textMatrixScale = 1;
	      this.x = 0;
	      this.y = 0;
	      this.lineX = 0;
	      this.lineY = 0;
	      this.charSpacing = 0;
	      this.wordSpacing = 0;
	      this.textHScale = 1;
	      this.textRise = 0;
	      this.fillColor = SVG_DEFAULTS.fillColor;
	      this.strokeColor = "#000000";
	      this.fillAlpha = 1;
	      this.strokeAlpha = 1;
	      this.lineWidth = 1;
	      this.lineJoin = "";
	      this.lineCap = "";
	      this.miterLimit = 0;
	      this.dashArray = [];
	      this.dashPhase = 0;
	      this.dependencies = [];
	      this.activeClipUrl = null;
	      this.clipGroup = null;
	      this.maskId = "";
	    }

	    clone() {
	      return Object.create(this);
	    }

	    setCurrentPoint(x, y) {
	      this.x = x;
	      this.y = y;
	    }

	  }

	  function opListToTree(opList) {
	    let opTree = [];
	    const tmp = [];

	    for (const opListElement of opList) {
	      if (opListElement.fn === "save") {
	        opTree.push({
	          fnId: 92,
	          fn: "group",
	          items: []
	        });
	        tmp.push(opTree);
	        opTree = opTree[opTree.length - 1].items;
	        continue;
	      }

	      if (opListElement.fn === "restore") {
	        opTree = tmp.pop();
	      } else {
	        opTree.push(opListElement);
	      }
	    }

	    return opTree;
	  }

	  function pf(value) {
	    if (Number.isInteger(value)) {
	      return value.toString();
	    }

	    const s = value.toFixed(10);
	    let i = s.length - 1;

	    if (s[i] !== "0") {
	      return s;
	    }

	    do {
	      i--;
	    } while (s[i] === "0");

	    return s.substring(0, s[i] === "." ? i : i + 1);
	  }

	  function pm(m) {
	    if (m[4] === 0 && m[5] === 0) {
	      if (m[1] === 0 && m[2] === 0) {
	        if (m[0] === 1 && m[3] === 1) {
	          return "";
	        }

	        return `scale(${pf(m[0])} ${pf(m[3])})`;
	      }

	      if (m[0] === m[3] && m[1] === -m[2]) {
	        const a = Math.acos(m[0]) * 180 / Math.PI;
	        return `rotate(${pf(a)})`;
	      }
	    } else {
	      if (m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1) {
	        return `translate(${pf(m[4])} ${pf(m[5])})`;
	      }
	    }

	    return `matrix(${pf(m[0])} ${pf(m[1])} ${pf(m[2])} ${pf(m[3])} ${pf(m[4])} ` + `${pf(m[5])})`;
	  }

	  let clipCount = 0;
	  let maskCount = 0;
	  let shadingCount = 0;
	  exports.SVGGraphics = SVGGraphics = class SVGGraphics {
	    constructor(commonObjs, objs, forceDataSchema = false) {
	      this.svgFactory = new _display_utils.DOMSVGFactory();
	      this.current = new SVGExtraState();
	      this.transformMatrix = _util.IDENTITY_MATRIX;
	      this.transformStack = [];
	      this.extraStack = [];
	      this.commonObjs = commonObjs;
	      this.objs = objs;
	      this.pendingClip = null;
	      this.pendingEOFill = false;
	      this.embedFonts = false;
	      this.embeddedFonts = Object.create(null);
	      this.cssStyle = null;
	      this.forceDataSchema = !!forceDataSchema;
	      this._operatorIdMapping = [];

	      for (const op in _util.OPS) {
	        this._operatorIdMapping[_util.OPS[op]] = op;
	      }
	    }

	    save() {
	      this.transformStack.push(this.transformMatrix);
	      const old = this.current;
	      this.extraStack.push(old);
	      this.current = old.clone();
	    }

	    restore() {
	      this.transformMatrix = this.transformStack.pop();
	      this.current = this.extraStack.pop();
	      this.pendingClip = null;
	      this.tgrp = null;
	    }

	    group(items) {
	      this.save();
	      this.executeOpTree(items);
	      this.restore();
	    }

	    loadDependencies(operatorList) {
	      const fnArray = operatorList.fnArray;
	      const argsArray = operatorList.argsArray;

	      for (let i = 0, ii = fnArray.length; i < ii; i++) {
	        if (fnArray[i] !== _util.OPS.dependency) {
	          continue;
	        }

	        for (const obj of argsArray[i]) {
	          const objsPool = obj.startsWith("g_") ? this.commonObjs : this.objs;
	          const promise = new Promise(resolve => {
	            objsPool.get(obj, resolve);
	          });
	          this.current.dependencies.push(promise);
	        }
	      }

	      return Promise.all(this.current.dependencies);
	    }

	    transform(a, b, c, d, e, f) {
	      const transformMatrix = [a, b, c, d, e, f];
	      this.transformMatrix = _util.Util.transform(this.transformMatrix, transformMatrix);
	      this.tgrp = null;
	    }

	    getSVG(operatorList, viewport) {
	      this.viewport = viewport;

	      const svgElement = this._initialize(viewport);

	      return this.loadDependencies(operatorList).then(() => {
	        this.transformMatrix = _util.IDENTITY_MATRIX;
	        this.executeOpTree(this.convertOpList(operatorList));
	        return svgElement;
	      });
	    }

	    convertOpList(operatorList) {
	      const operatorIdMapping = this._operatorIdMapping;
	      const argsArray = operatorList.argsArray;
	      const fnArray = operatorList.fnArray;
	      const opList = [];

	      for (let i = 0, ii = fnArray.length; i < ii; i++) {
	        const fnId = fnArray[i];
	        opList.push({
	          fnId,
	          fn: operatorIdMapping[fnId],
	          args: argsArray[i]
	        });
	      }

	      return opListToTree(opList);
	    }

	    executeOpTree(opTree) {
	      for (const opTreeElement of opTree) {
	        const fn = opTreeElement.fn;
	        const fnId = opTreeElement.fnId;
	        const args = opTreeElement.args;

	        switch (fnId | 0) {
	          case _util.OPS.beginText:
	            this.beginText();
	            break;

	          case _util.OPS.dependency:
	            break;

	          case _util.OPS.setLeading:
	            this.setLeading(args);
	            break;

	          case _util.OPS.setLeadingMoveText:
	            this.setLeadingMoveText(args[0], args[1]);
	            break;

	          case _util.OPS.setFont:
	            this.setFont(args);
	            break;

	          case _util.OPS.showText:
	            this.showText(args[0]);
	            break;

	          case _util.OPS.showSpacedText:
	            this.showText(args[0]);
	            break;

	          case _util.OPS.endText:
	            this.endText();
	            break;

	          case _util.OPS.moveText:
	            this.moveText(args[0], args[1]);
	            break;

	          case _util.OPS.setCharSpacing:
	            this.setCharSpacing(args[0]);
	            break;

	          case _util.OPS.setWordSpacing:
	            this.setWordSpacing(args[0]);
	            break;

	          case _util.OPS.setHScale:
	            this.setHScale(args[0]);
	            break;

	          case _util.OPS.setTextMatrix:
	            this.setTextMatrix(args[0], args[1], args[2], args[3], args[4], args[5]);
	            break;

	          case _util.OPS.setTextRise:
	            this.setTextRise(args[0]);
	            break;

	          case _util.OPS.setTextRenderingMode:
	            this.setTextRenderingMode(args[0]);
	            break;

	          case _util.OPS.setLineWidth:
	            this.setLineWidth(args[0]);
	            break;

	          case _util.OPS.setLineJoin:
	            this.setLineJoin(args[0]);
	            break;

	          case _util.OPS.setLineCap:
	            this.setLineCap(args[0]);
	            break;

	          case _util.OPS.setMiterLimit:
	            this.setMiterLimit(args[0]);
	            break;

	          case _util.OPS.setFillRGBColor:
	            this.setFillRGBColor(args[0], args[1], args[2]);
	            break;

	          case _util.OPS.setStrokeRGBColor:
	            this.setStrokeRGBColor(args[0], args[1], args[2]);
	            break;

	          case _util.OPS.setStrokeColorN:
	            this.setStrokeColorN(args);
	            break;

	          case _util.OPS.setFillColorN:
	            this.setFillColorN(args);
	            break;

	          case _util.OPS.shadingFill:
	            this.shadingFill(args[0]);
	            break;

	          case _util.OPS.setDash:
	            this.setDash(args[0], args[1]);
	            break;

	          case _util.OPS.setRenderingIntent:
	            this.setRenderingIntent(args[0]);
	            break;

	          case _util.OPS.setFlatness:
	            this.setFlatness(args[0]);
	            break;

	          case _util.OPS.setGState:
	            this.setGState(args[0]);
	            break;

	          case _util.OPS.fill:
	            this.fill();
	            break;

	          case _util.OPS.eoFill:
	            this.eoFill();
	            break;

	          case _util.OPS.stroke:
	            this.stroke();
	            break;

	          case _util.OPS.fillStroke:
	            this.fillStroke();
	            break;

	          case _util.OPS.eoFillStroke:
	            this.eoFillStroke();
	            break;

	          case _util.OPS.clip:
	            this.clip("nonzero");
	            break;

	          case _util.OPS.eoClip:
	            this.clip("evenodd");
	            break;

	          case _util.OPS.paintSolidColorImageMask:
	            this.paintSolidColorImageMask();
	            break;

	          case _util.OPS.paintImageXObject:
	            this.paintImageXObject(args[0]);
	            break;

	          case _util.OPS.paintInlineImageXObject:
	            this.paintInlineImageXObject(args[0]);
	            break;

	          case _util.OPS.paintImageMaskXObject:
	            this.paintImageMaskXObject(args[0]);
	            break;

	          case _util.OPS.paintFormXObjectBegin:
	            this.paintFormXObjectBegin(args[0], args[1]);
	            break;

	          case _util.OPS.paintFormXObjectEnd:
	            this.paintFormXObjectEnd();
	            break;

	          case _util.OPS.closePath:
	            this.closePath();
	            break;

	          case _util.OPS.closeStroke:
	            this.closeStroke();
	            break;

	          case _util.OPS.closeFillStroke:
	            this.closeFillStroke();
	            break;

	          case _util.OPS.closeEOFillStroke:
	            this.closeEOFillStroke();
	            break;

	          case _util.OPS.nextLine:
	            this.nextLine();
	            break;

	          case _util.OPS.transform:
	            this.transform(args[0], args[1], args[2], args[3], args[4], args[5]);
	            break;

	          case _util.OPS.constructPath:
	            this.constructPath(args[0], args[1]);
	            break;

	          case _util.OPS.endPath:
	            this.endPath();
	            break;

	          case 92:
	            this.group(opTreeElement.items);
	            break;

	          default:
	            (0, _util.warn)(`Unimplemented operator ${fn}`);
	            break;
	        }
	      }
	    }

	    setWordSpacing(wordSpacing) {
	      this.current.wordSpacing = wordSpacing;
	    }

	    setCharSpacing(charSpacing) {
	      this.current.charSpacing = charSpacing;
	    }

	    nextLine() {
	      this.moveText(0, this.current.leading);
	    }

	    setTextMatrix(a, b, c, d, e, f) {
	      const current = this.current;
	      current.textMatrix = current.lineMatrix = [a, b, c, d, e, f];
	      current.textMatrixScale = Math.sqrt(a * a + b * b);
	      current.x = current.lineX = 0;
	      current.y = current.lineY = 0;
	      current.xcoords = [];
	      current.ycoords = [];
	      current.tspan = this.svgFactory.createElement("svg:tspan");
	      current.tspan.setAttributeNS(null, "font-family", current.fontFamily);
	      current.tspan.setAttributeNS(null, "font-size", `${pf(current.fontSize)}px`);
	      current.tspan.setAttributeNS(null, "y", pf(-current.y));
	      current.txtElement = this.svgFactory.createElement("svg:text");
	      current.txtElement.appendChild(current.tspan);
	    }

	    beginText() {
	      const current = this.current;
	      current.x = current.lineX = 0;
	      current.y = current.lineY = 0;
	      current.textMatrix = _util.IDENTITY_MATRIX;
	      current.lineMatrix = _util.IDENTITY_MATRIX;
	      current.textMatrixScale = 1;
	      current.tspan = this.svgFactory.createElement("svg:tspan");
	      current.txtElement = this.svgFactory.createElement("svg:text");
	      current.txtgrp = this.svgFactory.createElement("svg:g");
	      current.xcoords = [];
	      current.ycoords = [];
	    }

	    moveText(x, y) {
	      const current = this.current;
	      current.x = current.lineX += x;
	      current.y = current.lineY += y;
	      current.xcoords = [];
	      current.ycoords = [];
	      current.tspan = this.svgFactory.createElement("svg:tspan");
	      current.tspan.setAttributeNS(null, "font-family", current.fontFamily);
	      current.tspan.setAttributeNS(null, "font-size", `${pf(current.fontSize)}px`);
	      current.tspan.setAttributeNS(null, "y", pf(-current.y));
	    }

	    showText(glyphs) {
	      const current = this.current;
	      const font = current.font;
	      const fontSize = current.fontSize;

	      if (fontSize === 0) {
	        return;
	      }

	      const fontSizeScale = current.fontSizeScale;
	      const charSpacing = current.charSpacing;
	      const wordSpacing = current.wordSpacing;
	      const fontDirection = current.fontDirection;
	      const textHScale = current.textHScale * fontDirection;
	      const vertical = font.vertical;
	      const spacingDir = vertical ? 1 : -1;
	      const defaultVMetrics = font.defaultVMetrics;
	      const widthAdvanceScale = fontSize * current.fontMatrix[0];
	      let x = 0;

	      for (const glyph of glyphs) {
	        if (glyph === null) {
	          x += fontDirection * wordSpacing;
	          continue;
	        } else if ((0, _util.isNum)(glyph)) {
	          x += spacingDir * glyph * fontSize / 1000;
	          continue;
	        }

	        const spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
	        const character = glyph.fontChar;
	        let scaledX, scaledY;
	        let width = glyph.width;

	        if (vertical) {
	          let vx;
	          const vmetric = glyph.vmetric || defaultVMetrics;
	          vx = glyph.vmetric ? vmetric[1] : width * 0.5;
	          vx = -vx * widthAdvanceScale;
	          const vy = vmetric[2] * widthAdvanceScale;
	          width = vmetric ? -vmetric[0] : width;
	          scaledX = vx / fontSizeScale;
	          scaledY = (x + vy) / fontSizeScale;
	        } else {
	          scaledX = x / fontSizeScale;
	          scaledY = 0;
	        }

	        if (glyph.isInFont || font.missingFile) {
	          current.xcoords.push(current.x + scaledX);

	          if (vertical) {
	            current.ycoords.push(-current.y + scaledY);
	          }

	          current.tspan.textContent += character;
	        }

	        let charWidth;

	        if (vertical) {
	          charWidth = width * widthAdvanceScale - spacing * fontDirection;
	        } else {
	          charWidth = width * widthAdvanceScale + spacing * fontDirection;
	        }

	        x += charWidth;
	      }

	      current.tspan.setAttributeNS(null, "x", current.xcoords.map(pf).join(" "));

	      if (vertical) {
	        current.tspan.setAttributeNS(null, "y", current.ycoords.map(pf).join(" "));
	      } else {
	        current.tspan.setAttributeNS(null, "y", pf(-current.y));
	      }

	      if (vertical) {
	        current.y -= x;
	      } else {
	        current.x += x * textHScale;
	      }

	      current.tspan.setAttributeNS(null, "font-family", current.fontFamily);
	      current.tspan.setAttributeNS(null, "font-size", `${pf(current.fontSize)}px`);

	      if (current.fontStyle !== SVG_DEFAULTS.fontStyle) {
	        current.tspan.setAttributeNS(null, "font-style", current.fontStyle);
	      }

	      if (current.fontWeight !== SVG_DEFAULTS.fontWeight) {
	        current.tspan.setAttributeNS(null, "font-weight", current.fontWeight);
	      }

	      const fillStrokeMode = current.textRenderingMode & _util.TextRenderingMode.FILL_STROKE_MASK;

	      if (fillStrokeMode === _util.TextRenderingMode.FILL || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
	        if (current.fillColor !== SVG_DEFAULTS.fillColor) {
	          current.tspan.setAttributeNS(null, "fill", current.fillColor);
	        }

	        if (current.fillAlpha < 1) {
	          current.tspan.setAttributeNS(null, "fill-opacity", current.fillAlpha);
	        }
	      } else if (current.textRenderingMode === _util.TextRenderingMode.ADD_TO_PATH) {
	        current.tspan.setAttributeNS(null, "fill", "transparent");
	      } else {
	        current.tspan.setAttributeNS(null, "fill", "none");
	      }

	      if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
	        const lineWidthScale = 1 / (current.textMatrixScale || 1);

	        this._setStrokeAttributes(current.tspan, lineWidthScale);
	      }

	      let textMatrix = current.textMatrix;

	      if (current.textRise !== 0) {
	        textMatrix = textMatrix.slice();
	        textMatrix[5] += current.textRise;
	      }

	      current.txtElement.setAttributeNS(null, "transform", `${pm(textMatrix)} scale(${pf(textHScale)}, -1)`);
	      current.txtElement.setAttributeNS(XML_NS, "xml:space", "preserve");
	      current.txtElement.appendChild(current.tspan);
	      current.txtgrp.appendChild(current.txtElement);

	      this._ensureTransformGroup().appendChild(current.txtElement);
	    }

	    setLeadingMoveText(x, y) {
	      this.setLeading(-y);
	      this.moveText(x, y);
	    }

	    addFontStyle(fontObj) {
	      if (!fontObj.data) {
	        throw new Error("addFontStyle: No font data available, " + 'ensure that the "fontExtraProperties" API parameter is set.');
	      }

	      if (!this.cssStyle) {
	        this.cssStyle = this.svgFactory.createElement("svg:style");
	        this.cssStyle.setAttributeNS(null, "type", "text/css");
	        this.defs.appendChild(this.cssStyle);
	      }

	      const url = (0, _util.createObjectURL)(fontObj.data, fontObj.mimetype, this.forceDataSchema);
	      this.cssStyle.textContent += `@font-face { font-family: "${fontObj.loadedName}";` + ` src: url(${url}); }\n`;
	    }

	    setFont(details) {
	      const current = this.current;
	      const fontObj = this.commonObjs.get(details[0]);
	      let size = details[1];
	      current.font = fontObj;

	      if (this.embedFonts && !fontObj.missingFile && !this.embeddedFonts[fontObj.loadedName]) {
	        this.addFontStyle(fontObj);
	        this.embeddedFonts[fontObj.loadedName] = fontObj;
	      }

	      current.fontMatrix = fontObj.fontMatrix ? fontObj.fontMatrix : _util.FONT_IDENTITY_MATRIX;
	      let bold = "normal";

	      if (fontObj.black) {
	        bold = "900";
	      } else if (fontObj.bold) {
	        bold = "bold";
	      }

	      const italic = fontObj.italic ? "italic" : "normal";

	      if (size < 0) {
	        size = -size;
	        current.fontDirection = -1;
	      } else {
	        current.fontDirection = 1;
	      }

	      current.fontSize = size;
	      current.fontFamily = fontObj.loadedName;
	      current.fontWeight = bold;
	      current.fontStyle = italic;
	      current.tspan = this.svgFactory.createElement("svg:tspan");
	      current.tspan.setAttributeNS(null, "y", pf(-current.y));
	      current.xcoords = [];
	      current.ycoords = [];
	    }

	    endText() {
	      const current = this.current;

	      if (current.textRenderingMode & _util.TextRenderingMode.ADD_TO_PATH_FLAG && current.txtElement && current.txtElement.hasChildNodes()) {
	        current.element = current.txtElement;
	        this.clip("nonzero");
	        this.endPath();
	      }
	    }

	    setLineWidth(width) {
	      if (width > 0) {
	        this.current.lineWidth = width;
	      }
	    }

	    setLineCap(style) {
	      this.current.lineCap = LINE_CAP_STYLES[style];
	    }

	    setLineJoin(style) {
	      this.current.lineJoin = LINE_JOIN_STYLES[style];
	    }

	    setMiterLimit(limit) {
	      this.current.miterLimit = limit;
	    }

	    setStrokeAlpha(strokeAlpha) {
	      this.current.strokeAlpha = strokeAlpha;
	    }

	    setStrokeRGBColor(r, g, b) {
	      this.current.strokeColor = _util.Util.makeCssRgb(r, g, b);
	    }

	    setFillAlpha(fillAlpha) {
	      this.current.fillAlpha = fillAlpha;
	    }

	    setFillRGBColor(r, g, b) {
	      this.current.fillColor = _util.Util.makeCssRgb(r, g, b);
	      this.current.tspan = this.svgFactory.createElement("svg:tspan");
	      this.current.xcoords = [];
	      this.current.ycoords = [];
	    }

	    setStrokeColorN(args) {
	      this.current.strokeColor = this._makeColorN_Pattern(args);
	    }

	    setFillColorN(args) {
	      this.current.fillColor = this._makeColorN_Pattern(args);
	    }

	    shadingFill(args) {
	      const width = this.viewport.width;
	      const height = this.viewport.height;

	      const inv = _util.Util.inverseTransform(this.transformMatrix);

	      const bl = _util.Util.applyTransform([0, 0], inv);

	      const br = _util.Util.applyTransform([0, height], inv);

	      const ul = _util.Util.applyTransform([width, 0], inv);

	      const ur = _util.Util.applyTransform([width, height], inv);

	      const x0 = Math.min(bl[0], br[0], ul[0], ur[0]);
	      const y0 = Math.min(bl[1], br[1], ul[1], ur[1]);
	      const x1 = Math.max(bl[0], br[0], ul[0], ur[0]);
	      const y1 = Math.max(bl[1], br[1], ul[1], ur[1]);
	      const rect = this.svgFactory.createElement("svg:rect");
	      rect.setAttributeNS(null, "x", x0);
	      rect.setAttributeNS(null, "y", y0);
	      rect.setAttributeNS(null, "width", x1 - x0);
	      rect.setAttributeNS(null, "height", y1 - y0);
	      rect.setAttributeNS(null, "fill", this._makeShadingPattern(args));

	      if (this.current.fillAlpha < 1) {
	        rect.setAttributeNS(null, "fill-opacity", this.current.fillAlpha);
	      }

	      this._ensureTransformGroup().appendChild(rect);
	    }

	    _makeColorN_Pattern(args) {
	      if (args[0] === "TilingPattern") {
	        return this._makeTilingPattern(args);
	      }

	      return this._makeShadingPattern(args);
	    }

	    _makeTilingPattern(args) {
	      const color = args[1];
	      const operatorList = args[2];
	      const matrix = args[3] || _util.IDENTITY_MATRIX;
	      const [x0, y0, x1, y1] = args[4];
	      const xstep = args[5];
	      const ystep = args[6];
	      const paintType = args[7];
	      const tilingId = `shading${shadingCount++}`;

	      const [tx0, ty0] = _util.Util.applyTransform([x0, y0], matrix);

	      const [tx1, ty1] = _util.Util.applyTransform([x1, y1], matrix);

	      const [xscale, yscale] = _util.Util.singularValueDecompose2dScale(matrix);

	      const txstep = xstep * xscale;
	      const tystep = ystep * yscale;
	      const tiling = this.svgFactory.createElement("svg:pattern");
	      tiling.setAttributeNS(null, "id", tilingId);
	      tiling.setAttributeNS(null, "patternUnits", "userSpaceOnUse");
	      tiling.setAttributeNS(null, "width", txstep);
	      tiling.setAttributeNS(null, "height", tystep);
	      tiling.setAttributeNS(null, "x", `${tx0}`);
	      tiling.setAttributeNS(null, "y", `${ty0}`);
	      const svg = this.svg;
	      const transformMatrix = this.transformMatrix;
	      const fillColor = this.current.fillColor;
	      const strokeColor = this.current.strokeColor;
	      const bbox = this.svgFactory.create(tx1 - tx0, ty1 - ty0);
	      this.svg = bbox;
	      this.transformMatrix = matrix;

	      if (paintType === 2) {
	        const cssColor = _util.Util.makeCssRgb(...color);

	        this.current.fillColor = cssColor;
	        this.current.strokeColor = cssColor;
	      }

	      this.executeOpTree(this.convertOpList(operatorList));
	      this.svg = svg;
	      this.transformMatrix = transformMatrix;
	      this.current.fillColor = fillColor;
	      this.current.strokeColor = strokeColor;
	      tiling.appendChild(bbox.childNodes[0]);
	      this.defs.appendChild(tiling);
	      return `url(#${tilingId})`;
	    }

	    _makeShadingPattern(args) {
	      switch (args[0]) {
	        case "RadialAxial":
	          const shadingId = `shading${shadingCount++}`;
	          const colorStops = args[3];
	          let gradient;

	          switch (args[1]) {
	            case "axial":
	              const point0 = args[4];
	              const point1 = args[5];
	              gradient = this.svgFactory.createElement("svg:linearGradient");
	              gradient.setAttributeNS(null, "id", shadingId);
	              gradient.setAttributeNS(null, "gradientUnits", "userSpaceOnUse");
	              gradient.setAttributeNS(null, "x1", point0[0]);
	              gradient.setAttributeNS(null, "y1", point0[1]);
	              gradient.setAttributeNS(null, "x2", point1[0]);
	              gradient.setAttributeNS(null, "y2", point1[1]);
	              break;

	            case "radial":
	              const focalPoint = args[4];
	              const circlePoint = args[5];
	              const focalRadius = args[6];
	              const circleRadius = args[7];
	              gradient = this.svgFactory.createElement("svg:radialGradient");
	              gradient.setAttributeNS(null, "id", shadingId);
	              gradient.setAttributeNS(null, "gradientUnits", "userSpaceOnUse");
	              gradient.setAttributeNS(null, "cx", circlePoint[0]);
	              gradient.setAttributeNS(null, "cy", circlePoint[1]);
	              gradient.setAttributeNS(null, "r", circleRadius);
	              gradient.setAttributeNS(null, "fx", focalPoint[0]);
	              gradient.setAttributeNS(null, "fy", focalPoint[1]);
	              gradient.setAttributeNS(null, "fr", focalRadius);
	              break;

	            default:
	              throw new Error(`Unknown RadialAxial type: ${args[1]}`);
	          }

	          for (const colorStop of colorStops) {
	            const stop = this.svgFactory.createElement("svg:stop");
	            stop.setAttributeNS(null, "offset", colorStop[0]);
	            stop.setAttributeNS(null, "stop-color", colorStop[1]);
	            gradient.appendChild(stop);
	          }

	          this.defs.appendChild(gradient);
	          return `url(#${shadingId})`;

	        case "Mesh":
	          (0, _util.warn)("Unimplemented pattern Mesh");
	          return null;

	        case "Dummy":
	          return "hotpink";

	        default:
	          throw new Error(`Unknown IR type: ${args[0]}`);
	      }
	    }

	    setDash(dashArray, dashPhase) {
	      this.current.dashArray = dashArray;
	      this.current.dashPhase = dashPhase;
	    }

	    constructPath(ops, args) {
	      const current = this.current;
	      let x = current.x,
	          y = current.y;
	      let d = [];
	      let j = 0;

	      for (const op of ops) {
	        switch (op | 0) {
	          case _util.OPS.rectangle:
	            x = args[j++];
	            y = args[j++];
	            const width = args[j++];
	            const height = args[j++];
	            const xw = x + width;
	            const yh = y + height;
	            d.push("M", pf(x), pf(y), "L", pf(xw), pf(y), "L", pf(xw), pf(yh), "L", pf(x), pf(yh), "Z");
	            break;

	          case _util.OPS.moveTo:
	            x = args[j++];
	            y = args[j++];
	            d.push("M", pf(x), pf(y));
	            break;

	          case _util.OPS.lineTo:
	            x = args[j++];
	            y = args[j++];
	            d.push("L", pf(x), pf(y));
	            break;

	          case _util.OPS.curveTo:
	            x = args[j + 4];
	            y = args[j + 5];
	            d.push("C", pf(args[j]), pf(args[j + 1]), pf(args[j + 2]), pf(args[j + 3]), pf(x), pf(y));
	            j += 6;
	            break;

	          case _util.OPS.curveTo2:
	            d.push("C", pf(x), pf(y), pf(args[j]), pf(args[j + 1]), pf(args[j + 2]), pf(args[j + 3]));
	            x = args[j + 2];
	            y = args[j + 3];
	            j += 4;
	            break;

	          case _util.OPS.curveTo3:
	            x = args[j + 2];
	            y = args[j + 3];
	            d.push("C", pf(args[j]), pf(args[j + 1]), pf(x), pf(y), pf(x), pf(y));
	            j += 4;
	            break;

	          case _util.OPS.closePath:
	            d.push("Z");
	            break;
	        }
	      }

	      d = d.join(" ");

	      if (current.path && ops.length > 0 && ops[0] !== _util.OPS.rectangle && ops[0] !== _util.OPS.moveTo) {
	        d = current.path.getAttributeNS(null, "d") + d;
	      } else {
	        current.path = this.svgFactory.createElement("svg:path");

	        this._ensureTransformGroup().appendChild(current.path);
	      }

	      current.path.setAttributeNS(null, "d", d);
	      current.path.setAttributeNS(null, "fill", "none");
	      current.element = current.path;
	      current.setCurrentPoint(x, y);
	    }

	    endPath() {
	      const current = this.current;
	      current.path = null;

	      if (!this.pendingClip) {
	        return;
	      }

	      if (!current.element) {
	        this.pendingClip = null;
	        return;
	      }

	      const clipId = `clippath${clipCount++}`;
	      const clipPath = this.svgFactory.createElement("svg:clipPath");
	      clipPath.setAttributeNS(null, "id", clipId);
	      clipPath.setAttributeNS(null, "transform", pm(this.transformMatrix));
	      const clipElement = current.element.cloneNode(true);

	      if (this.pendingClip === "evenodd") {
	        clipElement.setAttributeNS(null, "clip-rule", "evenodd");
	      } else {
	        clipElement.setAttributeNS(null, "clip-rule", "nonzero");
	      }

	      this.pendingClip = null;
	      clipPath.appendChild(clipElement);
	      this.defs.appendChild(clipPath);

	      if (current.activeClipUrl) {
	        current.clipGroup = null;
	        this.extraStack.forEach(function (prev) {
	          prev.clipGroup = null;
	        });
	        clipPath.setAttributeNS(null, "clip-path", current.activeClipUrl);
	      }

	      current.activeClipUrl = `url(#${clipId})`;
	      this.tgrp = null;
	    }

	    clip(type) {
	      this.pendingClip = type;
	    }

	    closePath() {
	      const current = this.current;

	      if (current.path) {
	        const d = `${current.path.getAttributeNS(null, "d")}Z`;
	        current.path.setAttributeNS(null, "d", d);
	      }
	    }

	    setLeading(leading) {
	      this.current.leading = -leading;
	    }

	    setTextRise(textRise) {
	      this.current.textRise = textRise;
	    }

	    setTextRenderingMode(textRenderingMode) {
	      this.current.textRenderingMode = textRenderingMode;
	    }

	    setHScale(scale) {
	      this.current.textHScale = scale / 100;
	    }

	    setRenderingIntent(intent) {}

	    setFlatness(flatness) {}

	    setGState(states) {
	      for (const [key, value] of states) {
	        switch (key) {
	          case "LW":
	            this.setLineWidth(value);
	            break;

	          case "LC":
	            this.setLineCap(value);
	            break;

	          case "LJ":
	            this.setLineJoin(value);
	            break;

	          case "ML":
	            this.setMiterLimit(value);
	            break;

	          case "D":
	            this.setDash(value[0], value[1]);
	            break;

	          case "RI":
	            this.setRenderingIntent(value);
	            break;

	          case "FL":
	            this.setFlatness(value);
	            break;

	          case "Font":
	            this.setFont(value);
	            break;

	          case "CA":
	            this.setStrokeAlpha(value);
	            break;

	          case "ca":
	            this.setFillAlpha(value);
	            break;

	          default:
	            (0, _util.warn)(`Unimplemented graphic state operator ${key}`);
	            break;
	        }
	      }
	    }

	    fill() {
	      const current = this.current;

	      if (current.element) {
	        current.element.setAttributeNS(null, "fill", current.fillColor);
	        current.element.setAttributeNS(null, "fill-opacity", current.fillAlpha);
	        this.endPath();
	      }
	    }

	    stroke() {
	      const current = this.current;

	      if (current.element) {
	        this._setStrokeAttributes(current.element);

	        current.element.setAttributeNS(null, "fill", "none");
	        this.endPath();
	      }
	    }

	    _setStrokeAttributes(element, lineWidthScale = 1) {
	      const current = this.current;
	      let dashArray = current.dashArray;

	      if (lineWidthScale !== 1 && dashArray.length > 0) {
	        dashArray = dashArray.map(function (value) {
	          return lineWidthScale * value;
	        });
	      }

	      element.setAttributeNS(null, "stroke", current.strokeColor);
	      element.setAttributeNS(null, "stroke-opacity", current.strokeAlpha);
	      element.setAttributeNS(null, "stroke-miterlimit", pf(current.miterLimit));
	      element.setAttributeNS(null, "stroke-linecap", current.lineCap);
	      element.setAttributeNS(null, "stroke-linejoin", current.lineJoin);
	      element.setAttributeNS(null, "stroke-width", pf(lineWidthScale * current.lineWidth) + "px");
	      element.setAttributeNS(null, "stroke-dasharray", dashArray.map(pf).join(" "));
	      element.setAttributeNS(null, "stroke-dashoffset", pf(lineWidthScale * current.dashPhase) + "px");
	    }

	    eoFill() {
	      if (this.current.element) {
	        this.current.element.setAttributeNS(null, "fill-rule", "evenodd");
	      }

	      this.fill();
	    }

	    fillStroke() {
	      this.stroke();
	      this.fill();
	    }

	    eoFillStroke() {
	      if (this.current.element) {
	        this.current.element.setAttributeNS(null, "fill-rule", "evenodd");
	      }

	      this.fillStroke();
	    }

	    closeStroke() {
	      this.closePath();
	      this.stroke();
	    }

	    closeFillStroke() {
	      this.closePath();
	      this.fillStroke();
	    }

	    closeEOFillStroke() {
	      this.closePath();
	      this.eoFillStroke();
	    }

	    paintSolidColorImageMask() {
	      const rect = this.svgFactory.createElement("svg:rect");
	      rect.setAttributeNS(null, "x", "0");
	      rect.setAttributeNS(null, "y", "0");
	      rect.setAttributeNS(null, "width", "1px");
	      rect.setAttributeNS(null, "height", "1px");
	      rect.setAttributeNS(null, "fill", this.current.fillColor);

	      this._ensureTransformGroup().appendChild(rect);
	    }

	    paintImageXObject(objId) {
	      const imgData = this.objs.get(objId);

	      if (!imgData) {
	        (0, _util.warn)(`Dependent image with object ID ${objId} is not ready yet`);
	        return;
	      }

	      this.paintInlineImageXObject(imgData);
	    }

	    paintInlineImageXObject(imgData, mask) {
	      const width = imgData.width;
	      const height = imgData.height;
	      const imgSrc = convertImgDataToPng(imgData, this.forceDataSchema, !!mask);
	      const cliprect = this.svgFactory.createElement("svg:rect");
	      cliprect.setAttributeNS(null, "x", "0");
	      cliprect.setAttributeNS(null, "y", "0");
	      cliprect.setAttributeNS(null, "width", pf(width));
	      cliprect.setAttributeNS(null, "height", pf(height));
	      this.current.element = cliprect;
	      this.clip("nonzero");
	      const imgEl = this.svgFactory.createElement("svg:image");
	      imgEl.setAttributeNS(XLINK_NS, "xlink:href", imgSrc);
	      imgEl.setAttributeNS(null, "x", "0");
	      imgEl.setAttributeNS(null, "y", pf(-height));
	      imgEl.setAttributeNS(null, "width", pf(width) + "px");
	      imgEl.setAttributeNS(null, "height", pf(height) + "px");
	      imgEl.setAttributeNS(null, "transform", `scale(${pf(1 / width)} ${pf(-1 / height)})`);

	      if (mask) {
	        mask.appendChild(imgEl);
	      } else {
	        this._ensureTransformGroup().appendChild(imgEl);
	      }
	    }

	    paintImageMaskXObject(imgData) {
	      const current = this.current;
	      const width = imgData.width;
	      const height = imgData.height;
	      const fillColor = current.fillColor;
	      current.maskId = `mask${maskCount++}`;
	      const mask = this.svgFactory.createElement("svg:mask");
	      mask.setAttributeNS(null, "id", current.maskId);
	      const rect = this.svgFactory.createElement("svg:rect");
	      rect.setAttributeNS(null, "x", "0");
	      rect.setAttributeNS(null, "y", "0");
	      rect.setAttributeNS(null, "width", pf(width));
	      rect.setAttributeNS(null, "height", pf(height));
	      rect.setAttributeNS(null, "fill", fillColor);
	      rect.setAttributeNS(null, "mask", `url(#${current.maskId})`);
	      this.defs.appendChild(mask);

	      this._ensureTransformGroup().appendChild(rect);

	      this.paintInlineImageXObject(imgData, mask);
	    }

	    paintFormXObjectBegin(matrix, bbox) {
	      if (Array.isArray(matrix) && matrix.length === 6) {
	        this.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
	      }

	      if (bbox) {
	        const width = bbox[2] - bbox[0];
	        const height = bbox[3] - bbox[1];
	        const cliprect = this.svgFactory.createElement("svg:rect");
	        cliprect.setAttributeNS(null, "x", bbox[0]);
	        cliprect.setAttributeNS(null, "y", bbox[1]);
	        cliprect.setAttributeNS(null, "width", pf(width));
	        cliprect.setAttributeNS(null, "height", pf(height));
	        this.current.element = cliprect;
	        this.clip("nonzero");
	        this.endPath();
	      }
	    }

	    paintFormXObjectEnd() {}

	    _initialize(viewport) {
	      const svg = this.svgFactory.create(viewport.width, viewport.height);
	      const definitions = this.svgFactory.createElement("svg:defs");
	      svg.appendChild(definitions);
	      this.defs = definitions;
	      const rootGroup = this.svgFactory.createElement("svg:g");
	      rootGroup.setAttributeNS(null, "transform", pm(viewport.transform));
	      svg.appendChild(rootGroup);
	      this.svg = rootGroup;
	      return svg;
	    }

	    _ensureClipGroup() {
	      if (!this.current.clipGroup) {
	        const clipGroup = this.svgFactory.createElement("svg:g");
	        clipGroup.setAttributeNS(null, "clip-path", this.current.activeClipUrl);
	        this.svg.appendChild(clipGroup);
	        this.current.clipGroup = clipGroup;
	      }

	      return this.current.clipGroup;
	    }

	    _ensureTransformGroup() {
	      if (!this.tgrp) {
	        this.tgrp = this.svgFactory.createElement("svg:g");
	        this.tgrp.setAttributeNS(null, "transform", pm(this.transformMatrix));

	        if (this.current.activeClipUrl) {
	          this._ensureClipGroup().appendChild(this.tgrp);
	        } else {
	          this.svg.appendChild(this.tgrp);
	        }
	      }

	      return this.tgrp;
	    }

	  };
	}

	/***/ }),
	/* 19 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.PDFNodeStream = void 0;

	var _util = __w_pdfjs_require__(2);

	var _network_utils = __w_pdfjs_require__(20);

	const fs = require$$1;

	const http = require$$2;

	const https = require$$3;

	const url = require$$4;

	const fileUriRegex = /^file:\/\/\/[a-zA-Z]:\//;

	function parseUrl(sourceUrl) {
	  const parsedUrl = url.parse(sourceUrl);

	  if (parsedUrl.protocol === "file:" || parsedUrl.host) {
	    return parsedUrl;
	  }

	  if (/^[a-z]:[/\\]/i.test(sourceUrl)) {
	    return url.parse(`file:///${sourceUrl}`);
	  }

	  if (!parsedUrl.host) {
	    parsedUrl.protocol = "file:";
	  }

	  return parsedUrl;
	}

	class PDFNodeStream {
	  constructor(source) {
	    this.source = source;
	    this.url = parseUrl(source.url);
	    this.isHttp = this.url.protocol === "http:" || this.url.protocol === "https:";
	    this.isFsUrl = this.url.protocol === "file:";
	    this.httpHeaders = this.isHttp && source.httpHeaders || {};
	    this._fullRequestReader = null;
	    this._rangeRequestReaders = [];
	  }

	  get _progressiveDataLength() {
	    return this._fullRequestReader ? this._fullRequestReader._loaded : 0;
	  }

	  getFullReader() {
	    (0, _util.assert)(!this._fullRequestReader, "PDFNodeStream.getFullReader can only be called once.");
	    this._fullRequestReader = this.isFsUrl ? new PDFNodeStreamFsFullReader(this) : new PDFNodeStreamFullReader(this);
	    return this._fullRequestReader;
	  }

	  getRangeReader(start, end) {
	    if (end <= this._progressiveDataLength) {
	      return null;
	    }

	    const rangeReader = this.isFsUrl ? new PDFNodeStreamFsRangeReader(this, start, end) : new PDFNodeStreamRangeReader(this, start, end);

	    this._rangeRequestReaders.push(rangeReader);

	    return rangeReader;
	  }

	  cancelAllRequests(reason) {
	    if (this._fullRequestReader) {
	      this._fullRequestReader.cancel(reason);
	    }

	    const readers = this._rangeRequestReaders.slice(0);

	    readers.forEach(function (reader) {
	      reader.cancel(reason);
	    });
	  }

	}

	exports.PDFNodeStream = PDFNodeStream;

	class BaseFullReader {
	  constructor(stream) {
	    this._url = stream.url;
	    this._done = false;
	    this._storedError = null;
	    this.onProgress = null;
	    const source = stream.source;
	    this._contentLength = source.length;
	    this._loaded = 0;
	    this._filename = null;
	    this._disableRange = source.disableRange || false;
	    this._rangeChunkSize = source.rangeChunkSize;

	    if (!this._rangeChunkSize && !this._disableRange) {
	      this._disableRange = true;
	    }

	    this._isStreamingSupported = !source.disableStream;
	    this._isRangeSupported = !source.disableRange;
	    this._readableStream = null;
	    this._readCapability = (0, _util.createPromiseCapability)();
	    this._headersCapability = (0, _util.createPromiseCapability)();
	  }

	  get headersReady() {
	    return this._headersCapability.promise;
	  }

	  get filename() {
	    return this._filename;
	  }

	  get contentLength() {
	    return this._contentLength;
	  }

	  get isRangeSupported() {
	    return this._isRangeSupported;
	  }

	  get isStreamingSupported() {
	    return this._isStreamingSupported;
	  }

	  async read() {
	    await this._readCapability.promise;

	    if (this._done) {
	      return {
	        value: undefined,
	        done: true
	      };
	    }

	    if (this._storedError) {
	      throw this._storedError;
	    }

	    const chunk = this._readableStream.read();

	    if (chunk === null) {
	      this._readCapability = (0, _util.createPromiseCapability)();
	      return this.read();
	    }

	    this._loaded += chunk.length;

	    if (this.onProgress) {
	      this.onProgress({
	        loaded: this._loaded,
	        total: this._contentLength
	      });
	    }

	    const buffer = new Uint8Array(chunk).buffer;
	    return {
	      value: buffer,
	      done: false
	    };
	  }

	  cancel(reason) {
	    if (!this._readableStream) {
	      this._error(reason);

	      return;
	    }

	    this._readableStream.destroy(reason);
	  }

	  _error(reason) {
	    this._storedError = reason;

	    this._readCapability.resolve();
	  }

	  _setReadableStream(readableStream) {
	    this._readableStream = readableStream;
	    readableStream.on("readable", () => {
	      this._readCapability.resolve();
	    });
	    readableStream.on("end", () => {
	      readableStream.destroy();
	      this._done = true;

	      this._readCapability.resolve();
	    });
	    readableStream.on("error", reason => {
	      this._error(reason);
	    });

	    if (!this._isStreamingSupported && this._isRangeSupported) {
	      this._error(new _util.AbortException("streaming is disabled"));
	    }

	    if (this._storedError) {
	      this._readableStream.destroy(this._storedError);
	    }
	  }

	}

	class BaseRangeReader {
	  constructor(stream) {
	    this._url = stream.url;
	    this._done = false;
	    this._storedError = null;
	    this.onProgress = null;
	    this._loaded = 0;
	    this._readableStream = null;
	    this._readCapability = (0, _util.createPromiseCapability)();
	    const source = stream.source;
	    this._isStreamingSupported = !source.disableStream;
	  }

	  get isStreamingSupported() {
	    return this._isStreamingSupported;
	  }

	  async read() {
	    await this._readCapability.promise;

	    if (this._done) {
	      return {
	        value: undefined,
	        done: true
	      };
	    }

	    if (this._storedError) {
	      throw this._storedError;
	    }

	    const chunk = this._readableStream.read();

	    if (chunk === null) {
	      this._readCapability = (0, _util.createPromiseCapability)();
	      return this.read();
	    }

	    this._loaded += chunk.length;

	    if (this.onProgress) {
	      this.onProgress({
	        loaded: this._loaded
	      });
	    }

	    const buffer = new Uint8Array(chunk).buffer;
	    return {
	      value: buffer,
	      done: false
	    };
	  }

	  cancel(reason) {
	    if (!this._readableStream) {
	      this._error(reason);

	      return;
	    }

	    this._readableStream.destroy(reason);
	  }

	  _error(reason) {
	    this._storedError = reason;

	    this._readCapability.resolve();
	  }

	  _setReadableStream(readableStream) {
	    this._readableStream = readableStream;
	    readableStream.on("readable", () => {
	      this._readCapability.resolve();
	    });
	    readableStream.on("end", () => {
	      readableStream.destroy();
	      this._done = true;

	      this._readCapability.resolve();
	    });
	    readableStream.on("error", reason => {
	      this._error(reason);
	    });

	    if (this._storedError) {
	      this._readableStream.destroy(this._storedError);
	    }
	  }

	}

	function createRequestOptions(parsedUrl, headers) {
	  return {
	    protocol: parsedUrl.protocol,
	    auth: parsedUrl.auth,
	    host: parsedUrl.hostname,
	    port: parsedUrl.port,
	    path: parsedUrl.path,
	    method: "GET",
	    headers
	  };
	}

	class PDFNodeStreamFullReader extends BaseFullReader {
	  constructor(stream) {
	    super(stream);

	    const handleResponse = response => {
	      if (response.statusCode === 404) {
	        const error = new _util.MissingPDFException(`Missing PDF "${this._url}".`);
	        this._storedError = error;

	        this._headersCapability.reject(error);

	        return;
	      }

	      this._headersCapability.resolve();

	      this._setReadableStream(response);

	      const getResponseHeader = name => {
	        return this._readableStream.headers[name.toLowerCase()];
	      };

	      const {
	        allowRangeRequests,
	        suggestedLength
	      } = (0, _network_utils.validateRangeRequestCapabilities)({
	        getResponseHeader,
	        isHttp: stream.isHttp,
	        rangeChunkSize: this._rangeChunkSize,
	        disableRange: this._disableRange
	      });
	      this._isRangeSupported = allowRangeRequests;
	      this._contentLength = suggestedLength || this._contentLength;
	      this._filename = (0, _network_utils.extractFilenameFromHeader)(getResponseHeader);
	    };

	    this._request = null;

	    if (this._url.protocol === "http:") {
	      this._request = http.request(createRequestOptions(this._url, stream.httpHeaders), handleResponse);
	    } else {
	      this._request = https.request(createRequestOptions(this._url, stream.httpHeaders), handleResponse);
	    }

	    this._request.on("error", reason => {
	      this._storedError = reason;

	      this._headersCapability.reject(reason);
	    });

	    this._request.end();
	  }

	}

	class PDFNodeStreamRangeReader extends BaseRangeReader {
	  constructor(stream, start, end) {
	    super(stream);
	    this._httpHeaders = {};

	    for (const property in stream.httpHeaders) {
	      const value = stream.httpHeaders[property];

	      if (typeof value === "undefined") {
	        continue;
	      }

	      this._httpHeaders[property] = value;
	    }

	    this._httpHeaders.Range = `bytes=${start}-${end - 1}`;

	    const handleResponse = response => {
	      if (response.statusCode === 404) {
	        const error = new _util.MissingPDFException(`Missing PDF "${this._url}".`);
	        this._storedError = error;
	        return;
	      }

	      this._setReadableStream(response);
	    };

	    this._request = null;

	    if (this._url.protocol === "http:") {
	      this._request = http.request(createRequestOptions(this._url, this._httpHeaders), handleResponse);
	    } else {
	      this._request = https.request(createRequestOptions(this._url, this._httpHeaders), handleResponse);
	    }

	    this._request.on("error", reason => {
	      this._storedError = reason;
	    });

	    this._request.end();
	  }

	}

	class PDFNodeStreamFsFullReader extends BaseFullReader {
	  constructor(stream) {
	    super(stream);
	    let path = decodeURIComponent(this._url.path);

	    if (fileUriRegex.test(this._url.href)) {
	      path = path.replace(/^\//, "");
	    }

	    fs.lstat(path, (error, stat) => {
	      if (error) {
	        if (error.code === "ENOENT") {
	          error = new _util.MissingPDFException(`Missing PDF "${path}".`);
	        }

	        this._storedError = error;

	        this._headersCapability.reject(error);

	        return;
	      }

	      this._contentLength = stat.size;

	      this._setReadableStream(fs.createReadStream(path));

	      this._headersCapability.resolve();
	    });
	  }

	}

	class PDFNodeStreamFsRangeReader extends BaseRangeReader {
	  constructor(stream, start, end) {
	    super(stream);
	    let path = decodeURIComponent(this._url.path);

	    if (fileUriRegex.test(this._url.href)) {
	      path = path.replace(/^\//, "");
	    }

	    this._setReadableStream(fs.createReadStream(path, {
	      start,
	      end: end - 1
	    }));
	  }

	}

	/***/ }),
	/* 20 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createResponseStatusError = createResponseStatusError;
	exports.extractFilenameFromHeader = extractFilenameFromHeader;
	exports.validateRangeRequestCapabilities = validateRangeRequestCapabilities;
	exports.validateResponseStatus = validateResponseStatus;

	var _util = __w_pdfjs_require__(2);

	var _content_disposition = __w_pdfjs_require__(21);

	function validateRangeRequestCapabilities({
	  getResponseHeader,
	  isHttp,
	  rangeChunkSize,
	  disableRange
	}) {
	  (0, _util.assert)(rangeChunkSize > 0, "Range chunk size must be larger than zero");
	  const returnValues = {
	    allowRangeRequests: false,
	    suggestedLength: undefined
	  };
	  const length = parseInt(getResponseHeader("Content-Length"), 10);

	  if (!Number.isInteger(length)) {
	    return returnValues;
	  }

	  returnValues.suggestedLength = length;

	  if (length <= 2 * rangeChunkSize) {
	    return returnValues;
	  }

	  if (disableRange || !isHttp) {
	    return returnValues;
	  }

	  if (getResponseHeader("Accept-Ranges") !== "bytes") {
	    return returnValues;
	  }

	  const contentEncoding = getResponseHeader("Content-Encoding") || "identity";

	  if (contentEncoding !== "identity") {
	    return returnValues;
	  }

	  returnValues.allowRangeRequests = true;
	  return returnValues;
	}

	function extractFilenameFromHeader(getResponseHeader) {
	  const contentDisposition = getResponseHeader("Content-Disposition");

	  if (contentDisposition) {
	    let filename = (0, _content_disposition.getFilenameFromContentDispositionHeader)(contentDisposition);

	    if (filename.includes("%")) {
	      try {
	        filename = decodeURIComponent(filename);
	      } catch (ex) {}
	    }

	    if (/\.pdf$/i.test(filename)) {
	      return filename;
	    }
	  }

	  return null;
	}

	function createResponseStatusError(status, url) {
	  if (status === 404 || status === 0 && url.startsWith("file:")) {
	    return new _util.MissingPDFException('Missing PDF "' + url + '".');
	  }

	  return new _util.UnexpectedResponseException("Unexpected server response (" + status + ') while retrieving PDF "' + url + '".', status);
	}

	function validateResponseStatus(status) {
	  return status === 200 || status === 206;
	}

	/***/ }),
	/* 21 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getFilenameFromContentDispositionHeader = getFilenameFromContentDispositionHeader;

	function getFilenameFromContentDispositionHeader(contentDisposition) {
	  let needsEncodingFixup = true;
	  let tmp = toParamRegExp("filename\\*", "i").exec(contentDisposition);

	  if (tmp) {
	    tmp = tmp[1];
	    let filename = rfc2616unquote(tmp);
	    filename = unescape(filename);
	    filename = rfc5987decode(filename);
	    filename = rfc2047decode(filename);
	    return fixupEncoding(filename);
	  }

	  tmp = rfc2231getparam(contentDisposition);

	  if (tmp) {
	    const filename = rfc2047decode(tmp);
	    return fixupEncoding(filename);
	  }

	  tmp = toParamRegExp("filename", "i").exec(contentDisposition);

	  if (tmp) {
	    tmp = tmp[1];
	    let filename = rfc2616unquote(tmp);
	    filename = rfc2047decode(filename);
	    return fixupEncoding(filename);
	  }

	  function toParamRegExp(attributePattern, flags) {
	    return new RegExp("(?:^|;)\\s*" + attributePattern + "\\s*=\\s*" + "(" + '[^";\\s][^;\\s]*' + "|" + '"(?:[^"\\\\]|\\\\"?)+"?' + ")", flags);
	  }

	  function textdecode(encoding, value) {
	    if (encoding) {
	      if (!/^[\x00-\xFF]+$/.test(value)) {
	        return value;
	      }

	      try {
	        const decoder = new TextDecoder(encoding, {
	          fatal: true
	        });
	        const bytes = Array.from(value, function (ch) {
	          return ch.charCodeAt(0) & 0xff;
	        });
	        value = decoder.decode(new Uint8Array(bytes));
	        needsEncodingFixup = false;
	      } catch (e) {
	        if (/^utf-?8$/i.test(encoding)) {
	          try {
	            value = decodeURIComponent(escape(value));
	            needsEncodingFixup = false;
	          } catch (err) {}
	        }
	      }
	    }

	    return value;
	  }

	  function fixupEncoding(value) {
	    if (needsEncodingFixup && /[\x80-\xff]/.test(value)) {
	      value = textdecode("utf-8", value);

	      if (needsEncodingFixup) {
	        value = textdecode("iso-8859-1", value);
	      }
	    }

	    return value;
	  }

	  function rfc2231getparam(contentDispositionStr) {
	    const matches = [];
	    let match;
	    const iter = toParamRegExp("filename\\*((?!0\\d)\\d+)(\\*?)", "ig");

	    while ((match = iter.exec(contentDispositionStr)) !== null) {
	      let [, n, quot, part] = match;
	      n = parseInt(n, 10);

	      if (n in matches) {
	        if (n === 0) {
	          break;
	        }

	        continue;
	      }

	      matches[n] = [quot, part];
	    }

	    const parts = [];

	    for (let n = 0; n < matches.length; ++n) {
	      if (!(n in matches)) {
	        break;
	      }

	      let [quot, part] = matches[n];
	      part = rfc2616unquote(part);

	      if (quot) {
	        part = unescape(part);

	        if (n === 0) {
	          part = rfc5987decode(part);
	        }
	      }

	      parts.push(part);
	    }

	    return parts.join("");
	  }

	  function rfc2616unquote(value) {
	    if (value.startsWith('"')) {
	      const parts = value.slice(1).split('\\"');

	      for (let i = 0; i < parts.length; ++i) {
	        const quotindex = parts[i].indexOf('"');

	        if (quotindex !== -1) {
	          parts[i] = parts[i].slice(0, quotindex);
	          parts.length = i + 1;
	        }

	        parts[i] = parts[i].replace(/\\(.)/g, "$1");
	      }

	      value = parts.join('"');
	    }

	    return value;
	  }

	  function rfc5987decode(extvalue) {
	    const encodingend = extvalue.indexOf("'");

	    if (encodingend === -1) {
	      return extvalue;
	    }

	    const encoding = extvalue.slice(0, encodingend);
	    const langvalue = extvalue.slice(encodingend + 1);
	    const value = langvalue.replace(/^[^']*'/, "");
	    return textdecode(encoding, value);
	  }

	  function rfc2047decode(value) {
	    if (!value.startsWith("=?") || /[\x00-\x19\x80-\xff]/.test(value)) {
	      return value;
	    }

	    return value.replace(/=\?([\w-]*)\?([QqBb])\?((?:[^?]|\?(?!=))*)\?=/g, function (matches, charset, encoding, text) {
	      if (encoding === "q" || encoding === "Q") {
	        text = text.replace(/_/g, " ");
	        text = text.replace(/=([0-9a-fA-F]{2})/g, function (match, hex) {
	          return String.fromCharCode(parseInt(hex, 16));
	        });
	        return textdecode(charset, text);
	      }

	      try {
	        text = atob(text);
	      } catch (e) {}

	      return textdecode(charset, text);
	    });
	  }

	  return "";
	}

	/***/ }),
	/* 22 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.PDFNetworkStream = void 0;

	var _util = __w_pdfjs_require__(2);

	var _network_utils = __w_pdfjs_require__(20);
	const OK_RESPONSE = 200;
	const PARTIAL_CONTENT_RESPONSE = 206;

	function getArrayBuffer(xhr) {
	  const data = xhr.response;

	  if (typeof data !== "string") {
	    return data;
	  }

	  const array = (0, _util.stringToBytes)(data);
	  return array.buffer;
	}

	class NetworkManager {
	  constructor(url, args) {
	    this.url = url;
	    args = args || {};
	    this.isHttp = /^https?:/i.test(url);
	    this.httpHeaders = this.isHttp && args.httpHeaders || {};
	    this.withCredentials = args.withCredentials || false;

	    this.getXhr = args.getXhr || function NetworkManager_getXhr() {
	      return new XMLHttpRequest();
	    };

	    this.currXhrId = 0;
	    this.pendingRequests = Object.create(null);
	  }

	  requestRange(begin, end, listeners) {
	    const args = {
	      begin,
	      end
	    };

	    for (const prop in listeners) {
	      args[prop] = listeners[prop];
	    }

	    return this.request(args);
	  }

	  requestFull(listeners) {
	    return this.request(listeners);
	  }

	  request(args) {
	    const xhr = this.getXhr();
	    const xhrId = this.currXhrId++;
	    const pendingRequest = this.pendingRequests[xhrId] = {
	      xhr
	    };
	    xhr.open("GET", this.url);
	    xhr.withCredentials = this.withCredentials;

	    for (const property in this.httpHeaders) {
	      const value = this.httpHeaders[property];

	      if (typeof value === "undefined") {
	        continue;
	      }

	      xhr.setRequestHeader(property, value);
	    }

	    if (this.isHttp && "begin" in args && "end" in args) {
	      xhr.setRequestHeader("Range", `bytes=${args.begin}-${args.end - 1}`);
	      pendingRequest.expectedStatus = PARTIAL_CONTENT_RESPONSE;
	    } else {
	      pendingRequest.expectedStatus = OK_RESPONSE;
	    }

	    xhr.responseType = "arraybuffer";

	    if (args.onError) {
	      xhr.onerror = function (evt) {
	        args.onError(xhr.status);
	      };
	    }

	    xhr.onreadystatechange = this.onStateChange.bind(this, xhrId);
	    xhr.onprogress = this.onProgress.bind(this, xhrId);
	    pendingRequest.onHeadersReceived = args.onHeadersReceived;
	    pendingRequest.onDone = args.onDone;
	    pendingRequest.onError = args.onError;
	    pendingRequest.onProgress = args.onProgress;
	    xhr.send(null);
	    return xhrId;
	  }

	  onProgress(xhrId, evt) {
	    const pendingRequest = this.pendingRequests[xhrId];

	    if (!pendingRequest) {
	      return;
	    }

	    if (pendingRequest.onProgress) {
	      pendingRequest.onProgress(evt);
	    }
	  }

	  onStateChange(xhrId, evt) {
	    const pendingRequest = this.pendingRequests[xhrId];

	    if (!pendingRequest) {
	      return;
	    }

	    const xhr = pendingRequest.xhr;

	    if (xhr.readyState >= 2 && pendingRequest.onHeadersReceived) {
	      pendingRequest.onHeadersReceived();
	      delete pendingRequest.onHeadersReceived;
	    }

	    if (xhr.readyState !== 4) {
	      return;
	    }

	    if (!(xhrId in this.pendingRequests)) {
	      return;
	    }

	    delete this.pendingRequests[xhrId];

	    if (xhr.status === 0 && this.isHttp) {
	      if (pendingRequest.onError) {
	        pendingRequest.onError(xhr.status);
	      }

	      return;
	    }

	    const xhrStatus = xhr.status || OK_RESPONSE;
	    const ok_response_on_range_request = xhrStatus === OK_RESPONSE && pendingRequest.expectedStatus === PARTIAL_CONTENT_RESPONSE;

	    if (!ok_response_on_range_request && xhrStatus !== pendingRequest.expectedStatus) {
	      if (pendingRequest.onError) {
	        pendingRequest.onError(xhr.status);
	      }

	      return;
	    }

	    const chunk = getArrayBuffer(xhr);

	    if (xhrStatus === PARTIAL_CONTENT_RESPONSE) {
	      const rangeHeader = xhr.getResponseHeader("Content-Range");
	      const matches = /bytes (\d+)-(\d+)\/(\d+)/.exec(rangeHeader);
	      pendingRequest.onDone({
	        begin: parseInt(matches[1], 10),
	        chunk
	      });
	    } else if (chunk) {
	      pendingRequest.onDone({
	        begin: 0,
	        chunk
	      });
	    } else if (pendingRequest.onError) {
	      pendingRequest.onError(xhr.status);
	    }
	  }

	  hasPendingRequests() {
	    for (const xhrId in this.pendingRequests) {
	      return true;
	    }

	    return false;
	  }

	  getRequestXhr(xhrId) {
	    return this.pendingRequests[xhrId].xhr;
	  }

	  isPendingRequest(xhrId) {
	    return xhrId in this.pendingRequests;
	  }

	  abortAllRequests() {
	    for (const xhrId in this.pendingRequests) {
	      this.abortRequest(xhrId | 0);
	    }
	  }

	  abortRequest(xhrId) {
	    const xhr = this.pendingRequests[xhrId].xhr;
	    delete this.pendingRequests[xhrId];
	    xhr.abort();
	  }

	}

	class PDFNetworkStream {
	  constructor(source) {
	    this._source = source;
	    this._manager = new NetworkManager(source.url, {
	      httpHeaders: source.httpHeaders,
	      withCredentials: source.withCredentials
	    });
	    this._rangeChunkSize = source.rangeChunkSize;
	    this._fullRequestReader = null;
	    this._rangeRequestReaders = [];
	  }

	  _onRangeRequestReaderClosed(reader) {
	    const i = this._rangeRequestReaders.indexOf(reader);

	    if (i >= 0) {
	      this._rangeRequestReaders.splice(i, 1);
	    }
	  }

	  getFullReader() {
	    (0, _util.assert)(!this._fullRequestReader, "PDFNetworkStream.getFullReader can only be called once.");
	    this._fullRequestReader = new PDFNetworkStreamFullRequestReader(this._manager, this._source);
	    return this._fullRequestReader;
	  }

	  getRangeReader(begin, end) {
	    const reader = new PDFNetworkStreamRangeRequestReader(this._manager, begin, end);
	    reader.onClosed = this._onRangeRequestReaderClosed.bind(this);

	    this._rangeRequestReaders.push(reader);

	    return reader;
	  }

	  cancelAllRequests(reason) {
	    if (this._fullRequestReader) {
	      this._fullRequestReader.cancel(reason);
	    }

	    const readers = this._rangeRequestReaders.slice(0);

	    readers.forEach(function (reader) {
	      reader.cancel(reason);
	    });
	  }

	}

	exports.PDFNetworkStream = PDFNetworkStream;

	class PDFNetworkStreamFullRequestReader {
	  constructor(manager, source) {
	    this._manager = manager;
	    const args = {
	      onHeadersReceived: this._onHeadersReceived.bind(this),
	      onDone: this._onDone.bind(this),
	      onError: this._onError.bind(this),
	      onProgress: this._onProgress.bind(this)
	    };
	    this._url = source.url;
	    this._fullRequestId = manager.requestFull(args);
	    this._headersReceivedCapability = (0, _util.createPromiseCapability)();
	    this._disableRange = source.disableRange || false;
	    this._contentLength = source.length;
	    this._rangeChunkSize = source.rangeChunkSize;

	    if (!this._rangeChunkSize && !this._disableRange) {
	      this._disableRange = true;
	    }

	    this._isStreamingSupported = false;
	    this._isRangeSupported = false;
	    this._cachedChunks = [];
	    this._requests = [];
	    this._done = false;
	    this._storedError = undefined;
	    this._filename = null;
	    this.onProgress = null;
	  }

	  _onHeadersReceived() {
	    const fullRequestXhrId = this._fullRequestId;

	    const fullRequestXhr = this._manager.getRequestXhr(fullRequestXhrId);

	    const getResponseHeader = name => {
	      return fullRequestXhr.getResponseHeader(name);
	    };

	    const {
	      allowRangeRequests,
	      suggestedLength
	    } = (0, _network_utils.validateRangeRequestCapabilities)({
	      getResponseHeader,
	      isHttp: this._manager.isHttp,
	      rangeChunkSize: this._rangeChunkSize,
	      disableRange: this._disableRange
	    });

	    if (allowRangeRequests) {
	      this._isRangeSupported = true;
	    }

	    this._contentLength = suggestedLength || this._contentLength;
	    this._filename = (0, _network_utils.extractFilenameFromHeader)(getResponseHeader);

	    if (this._isRangeSupported) {
	      this._manager.abortRequest(fullRequestXhrId);
	    }

	    this._headersReceivedCapability.resolve();
	  }

	  _onDone(args) {
	    if (args) {
	      if (this._requests.length > 0) {
	        const requestCapability = this._requests.shift();

	        requestCapability.resolve({
	          value: args.chunk,
	          done: false
	        });
	      } else {
	        this._cachedChunks.push(args.chunk);
	      }
	    }

	    this._done = true;

	    if (this._cachedChunks.length > 0) {
	      return;
	    }

	    this._requests.forEach(function (requestCapability) {
	      requestCapability.resolve({
	        value: undefined,
	        done: true
	      });
	    });

	    this._requests = [];
	  }

	  _onError(status) {
	    const url = this._url;
	    const exception = (0, _network_utils.createResponseStatusError)(status, url);
	    this._storedError = exception;

	    this._headersReceivedCapability.reject(exception);

	    this._requests.forEach(function (requestCapability) {
	      requestCapability.reject(exception);
	    });

	    this._requests = [];
	    this._cachedChunks = [];
	  }

	  _onProgress(data) {
	    if (this.onProgress) {
	      this.onProgress({
	        loaded: data.loaded,
	        total: data.lengthComputable ? data.total : this._contentLength
	      });
	    }
	  }

	  get filename() {
	    return this._filename;
	  }

	  get isRangeSupported() {
	    return this._isRangeSupported;
	  }

	  get isStreamingSupported() {
	    return this._isStreamingSupported;
	  }

	  get contentLength() {
	    return this._contentLength;
	  }

	  get headersReady() {
	    return this._headersReceivedCapability.promise;
	  }

	  async read() {
	    if (this._storedError) {
	      throw this._storedError;
	    }

	    if (this._cachedChunks.length > 0) {
	      const chunk = this._cachedChunks.shift();

	      return {
	        value: chunk,
	        done: false
	      };
	    }

	    if (this._done) {
	      return {
	        value: undefined,
	        done: true
	      };
	    }

	    const requestCapability = (0, _util.createPromiseCapability)();

	    this._requests.push(requestCapability);

	    return requestCapability.promise;
	  }

	  cancel(reason) {
	    this._done = true;

	    this._headersReceivedCapability.reject(reason);

	    this._requests.forEach(function (requestCapability) {
	      requestCapability.resolve({
	        value: undefined,
	        done: true
	      });
	    });

	    this._requests = [];

	    if (this._manager.isPendingRequest(this._fullRequestId)) {
	      this._manager.abortRequest(this._fullRequestId);
	    }

	    this._fullRequestReader = null;
	  }

	}

	class PDFNetworkStreamRangeRequestReader {
	  constructor(manager, begin, end) {
	    this._manager = manager;
	    const args = {
	      onDone: this._onDone.bind(this),
	      onProgress: this._onProgress.bind(this)
	    };
	    this._requestId = manager.requestRange(begin, end, args);
	    this._requests = [];
	    this._queuedChunk = null;
	    this._done = false;
	    this.onProgress = null;
	    this.onClosed = null;
	  }

	  _close() {
	    if (this.onClosed) {
	      this.onClosed(this);
	    }
	  }

	  _onDone(data) {
	    const chunk = data.chunk;

	    if (this._requests.length > 0) {
	      const requestCapability = this._requests.shift();

	      requestCapability.resolve({
	        value: chunk,
	        done: false
	      });
	    } else {
	      this._queuedChunk = chunk;
	    }

	    this._done = true;

	    this._requests.forEach(function (requestCapability) {
	      requestCapability.resolve({
	        value: undefined,
	        done: true
	      });
	    });

	    this._requests = [];

	    this._close();
	  }

	  _onProgress(evt) {
	    if (!this.isStreamingSupported && this.onProgress) {
	      this.onProgress({
	        loaded: evt.loaded
	      });
	    }
	  }

	  get isStreamingSupported() {
	    return false;
	  }

	  async read() {
	    if (this._queuedChunk !== null) {
	      const chunk = this._queuedChunk;
	      this._queuedChunk = null;
	      return {
	        value: chunk,
	        done: false
	      };
	    }

	    if (this._done) {
	      return {
	        value: undefined,
	        done: true
	      };
	    }

	    const requestCapability = (0, _util.createPromiseCapability)();

	    this._requests.push(requestCapability);

	    return requestCapability.promise;
	  }

	  cancel(reason) {
	    this._done = true;

	    this._requests.forEach(function (requestCapability) {
	      requestCapability.resolve({
	        value: undefined,
	        done: true
	      });
	    });

	    this._requests = [];

	    if (this._manager.isPendingRequest(this._requestId)) {
	      this._manager.abortRequest(this._requestId);
	    }

	    this._close();
	  }

	}

	/***/ }),
	/* 23 */
	/***/ (function(module, exports, __w_pdfjs_require__) {


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.PDFFetchStream = void 0;

	var _util = __w_pdfjs_require__(2);

	var _network_utils = __w_pdfjs_require__(20);

	function createFetchOptions(headers, withCredentials, abortController) {
	  return {
	    method: "GET",
	    headers,
	    signal: abortController && abortController.signal,
	    mode: "cors",
	    credentials: withCredentials ? "include" : "same-origin",
	    redirect: "follow"
	  };
	}

	function createHeaders(httpHeaders) {
	  const headers = new Headers();

	  for (const property in httpHeaders) {
	    const value = httpHeaders[property];

	    if (typeof value === "undefined") {
	      continue;
	    }

	    headers.append(property, value);
	  }

	  return headers;
	}

	class PDFFetchStream {
	  constructor(source) {
	    this.source = source;
	    this.isHttp = /^https?:/i.test(source.url);
	    this.httpHeaders = this.isHttp && source.httpHeaders || {};
	    this._fullRequestReader = null;
	    this._rangeRequestReaders = [];
	  }

	  get _progressiveDataLength() {
	    return this._fullRequestReader ? this._fullRequestReader._loaded : 0;
	  }

	  getFullReader() {
	    (0, _util.assert)(!this._fullRequestReader, "PDFFetchStream.getFullReader can only be called once.");
	    this._fullRequestReader = new PDFFetchStreamReader(this);
	    return this._fullRequestReader;
	  }

	  getRangeReader(begin, end) {
	    if (end <= this._progressiveDataLength) {
	      return null;
	    }

	    const reader = new PDFFetchStreamRangeReader(this, begin, end);

	    this._rangeRequestReaders.push(reader);

	    return reader;
	  }

	  cancelAllRequests(reason) {
	    if (this._fullRequestReader) {
	      this._fullRequestReader.cancel(reason);
	    }

	    const readers = this._rangeRequestReaders.slice(0);

	    readers.forEach(function (reader) {
	      reader.cancel(reason);
	    });
	  }

	}

	exports.PDFFetchStream = PDFFetchStream;

	class PDFFetchStreamReader {
	  constructor(stream) {
	    this._stream = stream;
	    this._reader = null;
	    this._loaded = 0;
	    this._filename = null;
	    const source = stream.source;
	    this._withCredentials = source.withCredentials || false;
	    this._contentLength = source.length;
	    this._headersCapability = (0, _util.createPromiseCapability)();
	    this._disableRange = source.disableRange || false;
	    this._rangeChunkSize = source.rangeChunkSize;

	    if (!this._rangeChunkSize && !this._disableRange) {
	      this._disableRange = true;
	    }

	    if (typeof AbortController !== "undefined") {
	      this._abortController = new AbortController();
	    }

	    this._isStreamingSupported = !source.disableStream;
	    this._isRangeSupported = !source.disableRange;
	    this._headers = createHeaders(this._stream.httpHeaders);
	    const url = source.url;
	    fetch(url, createFetchOptions(this._headers, this._withCredentials, this._abortController)).then(response => {
	      if (!(0, _network_utils.validateResponseStatus)(response.status)) {
	        throw (0, _network_utils.createResponseStatusError)(response.status, url);
	      }

	      this._reader = response.body.getReader();

	      this._headersCapability.resolve();

	      const getResponseHeader = name => {
	        return response.headers.get(name);
	      };

	      const {
	        allowRangeRequests,
	        suggestedLength
	      } = (0, _network_utils.validateRangeRequestCapabilities)({
	        getResponseHeader,
	        isHttp: this._stream.isHttp,
	        rangeChunkSize: this._rangeChunkSize,
	        disableRange: this._disableRange
	      });
	      this._isRangeSupported = allowRangeRequests;
	      this._contentLength = suggestedLength || this._contentLength;
	      this._filename = (0, _network_utils.extractFilenameFromHeader)(getResponseHeader);

	      if (!this._isStreamingSupported && this._isRangeSupported) {
	        this.cancel(new _util.AbortException("Streaming is disabled."));
	      }
	    }).catch(this._headersCapability.reject);
	    this.onProgress = null;
	  }

	  get headersReady() {
	    return this._headersCapability.promise;
	  }

	  get filename() {
	    return this._filename;
	  }

	  get contentLength() {
	    return this._contentLength;
	  }

	  get isRangeSupported() {
	    return this._isRangeSupported;
	  }

	  get isStreamingSupported() {
	    return this._isStreamingSupported;
	  }

	  async read() {
	    await this._headersCapability.promise;
	    const {
	      value,
	      done
	    } = await this._reader.read();

	    if (done) {
	      return {
	        value,
	        done
	      };
	    }

	    this._loaded += value.byteLength;

	    if (this.onProgress) {
	      this.onProgress({
	        loaded: this._loaded,
	        total: this._contentLength
	      });
	    }

	    const buffer = new Uint8Array(value).buffer;
	    return {
	      value: buffer,
	      done: false
	    };
	  }

	  cancel(reason) {
	    if (this._reader) {
	      this._reader.cancel(reason);
	    }

	    if (this._abortController) {
	      this._abortController.abort();
	    }
	  }

	}

	class PDFFetchStreamRangeReader {
	  constructor(stream, begin, end) {
	    this._stream = stream;
	    this._reader = null;
	    this._loaded = 0;
	    const source = stream.source;
	    this._withCredentials = source.withCredentials || false;
	    this._readCapability = (0, _util.createPromiseCapability)();
	    this._isStreamingSupported = !source.disableStream;

	    if (typeof AbortController !== "undefined") {
	      this._abortController = new AbortController();
	    }

	    this._headers = createHeaders(this._stream.httpHeaders);

	    this._headers.append("Range", `bytes=${begin}-${end - 1}`);

	    const url = source.url;
	    fetch(url, createFetchOptions(this._headers, this._withCredentials, this._abortController)).then(response => {
	      if (!(0, _network_utils.validateResponseStatus)(response.status)) {
	        throw (0, _network_utils.createResponseStatusError)(response.status, url);
	      }

	      this._readCapability.resolve();

	      this._reader = response.body.getReader();
	    });
	    this.onProgress = null;
	  }

	  get isStreamingSupported() {
	    return this._isStreamingSupported;
	  }

	  async read() {
	    await this._readCapability.promise;
	    const {
	      value,
	      done
	    } = await this._reader.read();

	    if (done) {
	      return {
	        value,
	        done
	      };
	    }

	    this._loaded += value.byteLength;

	    if (this.onProgress) {
	      this.onProgress({
	        loaded: this._loaded
	      });
	    }

	    const buffer = new Uint8Array(value).buffer;
	    return {
	      value: buffer,
	      done: false
	    };
	  }

	  cancel(reason) {
	    if (this._reader) {
	      this._reader.cancel(reason);
	    }

	    if (this._abortController) {
	      this._abortController.abort();
	    }
	  }

	}

	/***/ })
	/******/ ]);
	});
	
} (pdf$1));

const pdf = pdf$1.exports;
var pdf_1 = pdf;

export { pdf_1 as default };
