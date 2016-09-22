'use strict';

/**
 * CORS middleware
 *
 * @param {Object} [opts]
 * @return {GeneratorFunction}
 * @api public
 */
module.exports = function getMiddleware (opts) {

  opts = opts || {};
  opts.origin = typeof opts.origin === 'undefined' ? true : opts.origin;
  opts.returnOnOptionsRequest = typeof opts.returnOnOptionsRequest === 'undefined' ? true : opts.returnOnOptionsRequest;
  opts.credentials = typeof opts.credentials === 'undefined' ? false : opts.credentials;
  opts.methods = typeof opts.methods !== 'undefined' ? (Array.isArray(opts.methods) ? opts.methods.join(',') : opts.methods) : 'GET,HEAD,PUT,POST,DELETE';
  opts.expose = typeof opts.expose !== 'undefined' ? (Array.isArray(opts.expose) ? opts.expose.join(',') : opts.expose) : null;
  opts.headers = typeof opts.headers !== 'undefined' ? (Array.isArray(opts.headers) ? opts.headers.join(',') : opts.headers) : null;
  opts.maxAge = typeof opts.maxAge === 'number' ? opts.maxAge.toString() : null;

  return function cors (ctx, next) {
    
    /**
     * Access Control Allow Origin
     */
    var origin;

    if (typeof opts.origin === 'string') {
      origin = opts.origin;
    } else if (opts.origin === true) {
      origin = ctx.get('origin') || '*';
    } else if (opts.origin === false) {
      origin = false;
    } else if (typeof opts.origin === 'function') {
      try {
        origin = opts.origin(ctx.request);
      } catch (e) {
        origin = false;
      }
    }

    if (origin === false) return next();
    ctx.set('Access-Control-Allow-Origin', origin);

    /**
     * Access Control Expose Headers
     */
    if (opts.expose) ctx.set('Access-Control-Expose-Headers', opts.expose);

    /**
     * Access Control Max Age
     */
    if (opts.maxAge) ctx.set('Access-Control-Max-Age', opts.maxAge);

    /**
     * Access Control Allow Credentials - only if no wildcarding in origin
     */
    if (opts.credentials && origin.indexOf('*') >= 0) ctx.set('Access-Control-Allow-Credentials', 'true');

    /**
     * Access Control Allow Methods
     */
    ctx.set('Access-Control-Allow-Methods', opts.methods);

    /**
     * Access Control Allow Headers
     */
    var headers;

    if (opts.headers) {
      headers = opts.headers;
    } else {
      headers = ctx.get('access-control-request-headers');
    }

    if (headers) {
      ctx.set('Access-Control-Allow-Headers', headers);
    }

    /**
     * Returns
     */
    if (opts.returnOnOptionsRequest && ctx.method === 'OPTIONS') {
      ctx.status = 204;
    } else {
      return next();
    }
  };
};
