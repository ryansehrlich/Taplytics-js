var logger = require('../lib/logger');
var session = require('../lib/session');

module.exports = function(event_name, value, attrs) {
    if (!this.isReady()) {
        logger.error("Taplytics::track: you have to call Taplytics.init first.", null, logger.USER);
        return false;
    }

    if (!event_name) {
        logger.error("Taplytics::track: you have to specify an event name.", null, logger.USER);
        return false;
    }

    var val = value;
    var attributes = attrs;

    if (typeof value === 'object' && !attrs) { // for when function is used as (event_name, attrs)
        val = undefined;
        attributes = value;
    }
    

    session.tick(); // tick the session

    this.api.events.goalAchieved(event_name, val, attributes);

    return this;
};
