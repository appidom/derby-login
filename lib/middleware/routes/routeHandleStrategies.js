module.exports = function(req, req, next, done) {
  var self = this;

  // Try to find provider
  var provider = method;
  var options = self.options;
  var strategy = options.strategies[provider];

  // Return error if no provider
  if (!strategy) return next(new Error('Unknown auth provider: ' + provider));

  var strategyOptions = strategy.conf || {};

  if (parts[2] === 'callback') {
    restoreQuery();
    // User is redirected here from provider's page
    self._passport.authenticate(provider, self.options.passport, function(err, userId) {
      // Auth failed, return error
      if (err) return done(err);

      // Everything is ok, login user
      self.login(userId, req, done);
    })(req, res, function() {});

  } else {
    saveQuery();
    // User tries to login with provider, he will be redirected to provider's page
    self._passport.authenticate(provider, strategyOptions)(req, res, function() {});
  }

  function saveQuery() {
    var name = options.queryCookieFiled;

    try {
      res.cookie(name, JSON.stringify(req.query || {}));
    } catch (e) {}
  }

  function restoreQuery(){
    var name = options.queryCookieFiled;
    var query = req.cookies[name];

    try {
      query = JSON.parse(query);
    } catch (e) {
      query = {};
    }

    for (var key in query) {
      req.query[key] = req.query[key] || query[key];
    }

    res.clearCookie(name);
  }
};
