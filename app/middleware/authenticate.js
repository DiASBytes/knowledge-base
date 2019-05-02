'use strict';
const axios = require('axios');

function middleware_authenticate(config) {

  if (config.authentication === true) {
    // Authentication Middleware
    return async function (req, res, next) {
      if (req.query.csp_token) {
        // Auth with CSP
        try {
          const response = await axios.get('http://localhost:8001/api/me', {
            headers: {
              Authorization: `Bearer ${req.query.csp_token}`
            }
          });

          if (response.data && response.data.id) {
            req.session.username = response.data.role === 'superadmin' ? 'admin' : 'user';
            req.session.loggedIn = true;

            return res.redirect(config.base_url + '/');
          }
        } catch (e) {
          res.redirect(403, config.base_url + '/');
        }
      } else if (!req.session.loggedIn) {
        if (config.googleoauth === true) {
          res.redirect(403, config.base_url + '/');
        } else {
          res.redirect(403, config.base_url + '/');
        }
      }
      return next();
    };

  } else {

    // No Authentication Required
    return function (req, res, next) {
      return next();
    };

  }

}

// Exports
module.exports = middleware_authenticate;
