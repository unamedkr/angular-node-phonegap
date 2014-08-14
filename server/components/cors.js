'use strict';

var defaults = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
};

function configureOrigin(options, req) {
  var origin = options.origin;
  if (origin === true) {
    origin = req.headers.origin;
  } else if (!origin) {
    origin = '*';
  }
  return {
    key: 'Access-Control-Allow-Origin',
    value: origin
  };
}

function configureMethods(options) {
  var methods = options.methods || defaults.methods;
  if (methods.join) {
    methods = options.methods.join(','); // .methods is an array, so turn it into a string
  }
  return {
    key: 'Access-Control-Allow-Methods',
    value: methods
  };
}

function configureCredentials(options) {
  if (options.credentials === true) {
    return {
      key: 'Access-Control-Allow-Credentials',
      value: 'true'
    };
  }
  return null;
}

function configureAllowedHeaders(options, req) {
  var headers = options.allowedHeaders || options.headers;
  if (!headers) {
    headers = req.headers['access-control-request-headers']; // .headers wasn't specified, so reflect the request headers
  } else if (headers.join) {
    headers = headers.join(','); // .headers is an array, so turn it into a string
  }
  if (headers && headers.length) {
    return {
      key: 'Access-Control-Allow-Headers',
      value: headers
    };
  }
  return null;
}

function configureExposedHeaders(options) {
  var headers = options.exposedHeaders;
  if (!headers) {
    return null;
  } else if (headers.join) {
    headers = headers.join(','); // .headers is an array, so turn it into a string
  }
  if (headers && headers.length) {
    return {
      key: 'Access-Control-Expose-Headers',
      value: headers
    };
  }
  return null;
}

function configureMaxAge(options) {
  var maxAge = options.maxAge && options.maxAge.toString();
  if (maxAge && maxAge.length) {
    return {
      key: 'Access-Control-Max-Age',
      value: maxAge
    };
  }
  return null;
}

function applyHeaders(headers, res) {
  headers.forEach(function(header) {
    if (header && header.value) {
      res.setHeader(header.key, header.value);
    }
  });
}

function cors(options, req, res, next) {
  var headers = [];

  if (req.method === 'OPTIONS') {
    // preflight
    headers.push(configureOrigin(options, req));
    headers.push(configureCredentials(options, req));
    headers.push(configureMethods(options, req));
    headers.push(configureAllowedHeaders(options, req));
    headers.push(configureMaxAge(options, req));
    applyHeaders(headers, res);
    res.statusCode = 204;
    res.end();
  } else {
    // actual response
    headers.push(configureOrigin(options, req));
    headers.push(configureCredentials(options, req));
    headers.push(configureExposedHeaders(options, req));
    applyHeaders(headers, res);
    next();
  }
}

module.exports = function(o) {
  if (!o) {
    o = {};
  }
  if (o.origin === undefined) {
    o.origin = defaults.origin;
  }
  if (o.methods === undefined) {
    o.methods = defaults.methods;
  }

  return function(req, res, next) {
    cors(o, req, res, next);
  };
};
