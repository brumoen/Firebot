"use strict";

const replaceVariableManager = require("./replace-variable-manager");

exports.loadReplaceVariables = () => {
    [
        'account-creation-date',
        'active-chat-user-count',
        'arg-array',
        'arg-count',
        'arg',
        'array-add',
        'array-element',
        'array-filter',
        'array-find',
        'array-find-index',
        'array-join',
        'array-length',
        'array-remove',
        'array-reverse',
        'array-shuffle',
        'bits-badge-tier',
        'bits-badge-unlocked-message',
        'bot',
        'category',
        'category-image-url',
        'chat-message-emote-urls',
        'chat-message',
        'chat-messages',
        'chat-mode-duration',
        'chat-mode',
        'cheer-bits',
        'cheer-message',
        'cheer-total-bits',
        'commafy',
        'command-trigger',
        'concat',
        'count',
        'counter',
        'currency-name',
        'currency',
        'currency-rank',
        'current-viewer-count',
        'custom-role-user-count',
        'custom-role-users',
        'custom-variable',
        'custom-variable-keys',
        'custom-variable-created-data',
        'custom-variable-created-name',
        'custom-variable-expired-data',
        'custom-variable-expired-name',
        'date',
        'donation-amount-formatted',
        'donation-amount',
        'donation-from',
        'donation-message',
        'effect-output',
        'ensure-number',
        'eval-vars',
        'file-exists',
        'file-line-count',
        'follow-age',
        'follow-count',
        'game',
        'gift-count',
        'gift-duration',
        'gift-giver-user',
        'gift-receiver-user',
        'gift-receivers',
        'gift-sub-months',
        'gift-sub-type',
        'has-role',
        'has-roles',
        'host-type',
        'host-viewer-count',
        'loop-count',
        'loop-item',
        'math',
        'mod-reason',
        'moderator',
        'new-currency-amount',
        'number-ceil',
        'number-floor',
        'number-max',
        'number-min',
        'number-pad',
        'number-round',
        'ordinal-indicator',
        'preset-list-arg',
        'previous-currency-amount',
        'profile-page-bytebin-token',
        'quick-store',
        'quote',
        'raid-viewer-count',
        'random-active-viewer',
        'random-custom-role-user',
        'random-number',
        'random-viewer',
        'random-reddit-image',
        'random-dad-joke',
        'random-advice',
        'read-api',
        'read-file',
        'regex-matches',
        'regexExec',
        'regexTest',
        'replace',
        'reward-description',
        'reward-cost',
        'reward-image-url',
        'reward-message',
        'reward-name',
        'roll-dice',
        'run-effect',
        'spoofed/all',
        'spoofed/and',
        'spoofed/any',
        'spoofed/if',
        'spoofed/nall',
        'spoofed/nand',
        'spoofed/nany',
        'spoofed/nor',
        'spoofed/not',
        'spoofed/or',
        'stream-title',
        'streamer',
        'sub-count',
        'sub-points',
        'sub-message',
        'sub-months',
        'sub-streak',
        'sub-type',
        'target',
        'text-length',
        'text-lowercase',
        'text-scramble',
        'text-uppercase',
        'text-capitalize',
        'text-contains',
        'text-decode-from-html',
        'text-decode-from-url',
        'text-encode-for-html',
        'text-encode-for-url',
        'text-split',
        'text-substring',
        'text-trim',
        'time',
        'timeout-duration',
        'top-currency-user',
        'top-currency',
        'top-metadata-user',
        'top-metadata',
        'top-view-time',
        'uptime',
        'user-avatar-url',
        'user-exists',
        'user-id',
        'user-metadata',
        'user',
        'username',
        'usernameArray',
        'view-time',
        'whisper-message',
        'word'
    ].forEach(filename => {
        const definition = require(`./builtin/${filename}.js`);
        replaceVariableManager.registerReplaceVariable(definition);
    });
};
