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
          res.status(403).send();
        }
      } else if (!req.session.loggedIn) {
        if (config.googleoauth === true) {
          res.status(403).send();
        } else {
          // res.redirect(403, config.base_url + '/').send();
          res.status(403).send();
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
