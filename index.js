const fs = require('fs');
const path = require('path')
// Require the necessary discord.js classes
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { rankingJson_creator } = require('./modules/ranking/ranking');


rankingJson_creator()

// Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        "GUILDS",
        "GUILD_MESSAGES",
        "DIRECT_MESSAGES"
    ]
});
client.commands = new Collection();

//Sacamos un array de los .js en ./commands
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
//Ejecuta los comandos
for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'commands', `${file}`));
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

//Sacamos un array de los .js en ./events
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));
//Ejecuta los eventos
for (const file of eventFiles) {
    const event = require(path.join(__dirname, 'events', `${file}`));
    if (event.once) {
        // console.log("Once");
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        // console.log("On");
        client.on(event.name, (...args) => event.execute(...args));
    }
}



const icon = client.emojis.cache.find(emoji => emoji.name === "XXXXXXXX");



client.login(token);
