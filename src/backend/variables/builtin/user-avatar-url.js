"use strict";

const twitchApi = require("../../twitch-api/api");
const { OutputDataType, VariableCategory } = require("../../../shared/variable-constants");

const model = {
    definition: {
        handle: "userAvatarUrl",
        usage: "userAvatarUrl",
        description: "Gets the url for the avatar of the associated user (Ie who triggered command, pressed button, etc).",
        examples: [
            {
                usage: "userAvatarUrl[$target]",
                description: "When in a command, gets the the url for the avatar of the target user."
            },
            {
                usage: "userAvatarUrl[ebiggz]",
                description: "Gets the url for the avatar of a specific user."
            }
        ],
        categories: [VariableCategory.USER],
        possibleDataOutput: [OutputDataType.TEXT]
    },
    evaluator: async (trigger, username) => {
        if (username == null) {
            username = trigger.metadata.username;
        }

        try {
            const userInfo = await twitchApi.users.getUserByName(username);
            return userInfo.profilePictureUrl ? userInfo.profilePictureUrl : "[No Avatar Found]";
        } catch (err) {
            return "[No Avatar Found]";
        }
    }
};

module.exports = model;