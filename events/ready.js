const { discordScriptRunning } = require("../utilities/discord");

// When the client is ready, run this code (only once)
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.user.setPresence({
            activities:
                [{
                    name: 'XXXXXXXX Tools Beta',
                    type: 0,
                }],

            status: 'dnd'
        });

        console.log(`Ready! Logged in as ${client.user.tag}`);
        discordScriptRunning()

    },
};