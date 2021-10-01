"use strict";

const restrictionsManager = require("./restriction-manager");

exports.loadRestrictions = function() {
    const permissions = require("./builtin/permissions");
    const channelCurrency = require("./builtin/channelCurrency");
    const activeChatUsers = require("./builtin/activeChatUsers");
    const customVariable = require('./builtin/customVariable');
    const viewTime = require('./builtin/viewTimeRestriction');
    const chatMessages = require('./builtin/chatMessages');
    const followCheck = require('./builtin/followCheck');
    const channelViewers = require('./builtin/channelViewers');
    const channelGame = require('./builtin/channelGame');

    restrictionsManager.registerRestriction(permissions);
    restrictionsManager.registerRestriction(channelCurrency);
    restrictionsManager.registerRestriction(activeChatUsers);
    restrictionsManager.registerRestriction(customVariable);
    restrictionsManager.registerRestriction(viewTime);
    restrictionsManager.registerRestriction(chatMessages);
    restrictionsManager.registerRestriction(followCheck);
    restrictionsManager.registerRestriction(channelViewers);
    restrictionsManager.registerRestriction(channelGame);
};