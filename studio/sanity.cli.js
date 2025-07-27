"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cli_1 = require("sanity/cli");
exports.default = (0, cli_1.defineCliConfig)({
    api: {
        projectId: 'zflu9f6c',
        dataset: 'production'
    },
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
});
