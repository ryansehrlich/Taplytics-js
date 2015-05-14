var logger = require('../lib/logger');
var api = require('../api');
var location = require('../lib/location');
var session = require('../lib/session');

var auto_page_view = true;

module.exports = function(app) {
    return function(token, options) {
        if (!isValidToken(token)) {
            logger.error("Taplytics: an SDK token is required.", null, logger.USER);
            return undefined;
        }

        app.env = "production";

        if (options) {
            if (options.log_level)
                logger.setPriorityLevel(options.log_level);

            if (options.auto_page_view === false)
                auto_page_view = false;

            if (options.env)
                app.env = options.env;
        }

        /* Initialization */
        app._in = {}; // internal

        app._in.token   = token;

        app._in.logger  = logger; // In case we want to override log level ourselves

        /* Start a session */
        session.start();

        api.users.post(app, {}, "Taplytics: Init failed. Taplytics will not function properly.");

        /* Track current page and other page views. */
        // location.listen(app);

        if (auto_page_view && app.page)
            app.page();

        // Initiate flushQueue:
        api.events.scheduleTick();
        
        return app;
    };
};
// Helper functions

function isValidToken(token) {
    if (!token)
        return false;

    if (typeof token !== "string")
        return false;

    if (!token.length)
        return false;

    return true;
}