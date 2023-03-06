"use strict";

const authManager = require("./auth-manager");
const accountAccess = require("../common/account-access");
const frontendCommunicator = require("../common/frontend-communicator");
const logger = require("../logwrapper");
const axios = require("axios").default;

const { secrets } = require("../secrets-manager");

const TWITCH_CLIENT_ID = secrets.twitchClientId;

exports.TWITCH_CLIENT_ID = TWITCH_CLIENT_ID;

const HOST = "https://id.twitch.tv";
const AUTHORIZE_PATH = "/oauth2/authorize";

const STREAMER_ACCOUNT_PROVIDER_ID = "twitch:streamer-account";
const BOT_ACCOUNT_PROVIDER_ID = "twitch:bot-account";

/**
 * @param {import("./auth").AuthProviderDefinition} definition
 * @param {import("./auth").AuthDetails} authDetails
 * @returns boolean
 */
const validator = function(definition, authDetails) {
    return (
        // Ensure authDetails exist
        authDetails &&

        // Check for old auth code flow token
        !authDetails.refresh_token &&

        // Make sure there's at least some scopes
        authDetails.scope &&
        authDetails.scope.length > 0 &&

        // check all required scopes are present
        definition.scopes.every(scope => authDetails.scope.includes(scope))
    );
};

/** @type {import("./auth").AuthProviderDefinition} */
const STREAMER_ACCOUNT_PROVIDER = {
    id: STREAMER_ACCOUNT_PROVIDER_ID,
    name: "Streamer Account",
    client: {
        id: TWITCH_CLIENT_ID
    },
    auth: {
        tokenHost: HOST,
        authorizePath: AUTHORIZE_PATH,
        type: "token"
    },
    scopes: [
        'bits:read',
        'channel:edit:commercial',
        'channel:manage:broadcast',
        'channel:manage:moderators',
        'channel:manage:polls',
        'channel:manage:predictions',
        'channel:manage:raids',
        'channel:manage:redemptions',
        'channel:manage:schedule',
        'channel:manage:videos',
        'channel:manage:vips',
        'channel:moderate',
        'channel:read:charity',
        'channel:read:editors',
        'channel:read:goals',
        'channel:read:hype_train',
        'channel:read:polls',
        'channel:read:predictions',
        'channel:read:redemptions',
        'channel:read:stream_key',
        'channel:read:subscriptions',
        'channel:read:vips',
        'channel_commercial',
        'channel_editor',
        'channel_read',
        'channel_subscriptions',
        'chat:edit',
        'chat:read',
        'clips:edit',
        'moderation:read',
        'moderator:manage:announcements',
        'moderator:manage:automod',
        'moderator:manage:automod_settings',
        'moderator:manage:banned_users',
        'moderator:manage:blocked_terms',
        'moderator:manage:chat_messages',
        'moderator:manage:chat_settings',
        'moderator:manage:shield_mode',
        'moderator:manage:shoutouts',
        'moderator:read:automod_settings',
        'moderator:read:blocked_terms',
        'moderator:read:chat_settings',
        'moderator:read:chatters',
        'moderator:read:followers',
        'moderator:read:shield_mode',
        'moderator:read:shoutouts',
        'user:edit:broadcast',
        'user:manage:blocked_users',
        'user:manage:whispers',
        'user:read:blocked_users',
        'user:read:broadcast',
        'user:read:follows',
        'user:read:subscriptions',
        'user_subscriptions',
        'user_follows_edit',
        'user_read',
        'whispers:edit',
        'whispers:read'
    ]
};

/** @type {import("./auth").AuthProviderDefinition} */
const BOT_ACCOUNT_PROVIDER = {
    id: BOT_ACCOUNT_PROVIDER_ID,
    name: "Bot Account",
    client: {
        id: TWITCH_CLIENT_ID
    },
    auth: {
        tokenHost: HOST,
        authorizePath: AUTHORIZE_PATH,
        type: "token"
    },
    scopes: [
        'channel:moderate',
        'chat:edit',
        'chat:read',
        'moderator:manage:announcements',
        'user:manage:whispers',
        'whispers:edit',
        'whispers:read',
        'channel_read'
    ]
};

exports.STREAMER_ACCOUNT_PROVIDER = STREAMER_ACCOUNT_PROVIDER;
exports.BOT_ACCOUNT_PROVIDER = BOT_ACCOUNT_PROVIDER;

exports.registerTwitchAuthProviders = () => {
    authManager.registerAuthProvider(STREAMER_ACCOUNT_PROVIDER);
    authManager.registerAuthProvider(BOT_ACCOUNT_PROVIDER);
};

async function getUserCurrent(accessToken) {
    try {
        const response = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': 'Firebot v5',
                'Client-ID': TWITCH_CLIENT_ID
            },
            responseType: "json"
        });

        if (response.status >= 200 && response.status <= 204) {
            const userData = response.data;
            if (userData.data && userData.data.length > 0) {
                return userData.data[0];
            }
        }
    } catch (error) {
        logger.error("Error getting current twitch user", error);
    }
    return null;
}

authManager.on("auth-success", async authData => {
    const { providerId, tokenData } = authData;

    if (providerId === STREAMER_ACCOUNT_PROVIDER_ID || providerId === BOT_ACCOUNT_PROVIDER_ID) {
        const userData = await getUserCurrent(tokenData.access_token);
        if (userData == null) {
            return;
        }

        const accountType = providerId === STREAMER_ACCOUNT_PROVIDER_ID ? "streamer" : "bot";
        const accountObject = {
            username: userData.login,
            displayName: userData.display_name,
            channelId: userData.id,
            userId: userData.id,
            avatar: userData.profile_image_url,
            broadcasterType: userData.broadcaster_type,
            auth: tokenData
        };

        accountAccess.updateAccount(accountType, accountObject);
    }
});

frontendCommunicator.on("validate-twitch-account", ({ accountType, authDetails }) => {
    let definition;

    switch (accountType) {
    case "streamer":
        definition = STREAMER_ACCOUNT_PROVIDER;
        break;

    case "bot":
        definition = BOT_ACCOUNT_PROVIDER;
        break;

    default:
        break;
    }

    if (definition) {
        return validator(definition, authDetails);
    }

    return true;
});
