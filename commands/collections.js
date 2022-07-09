const { SlashCommandBuilder } = require('@discordjs/builders');
const { getCollectionList } = require('../modules/rarity/getcollections');
const { getCollectionHTML } = require('../modules/rarity/getcollections');
const path = require('path');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('collections')
        .setDescription('Replies with availables NFT collections'),
    async execute(interaction) {

        const collection = path.join(__dirname, '..', 'modules', 'rarity', 'assets', 'collections.html')

        //Esperamos a tener el array de las colecciones
        const list = await getCollectionList()
        //Con ese array, creamos el HTML
        await getCollectionHTML(list)
        // await interaction.reply({ embeds: [embed] });
        await interaction.reply(`Here you have the collections list. Remember to open the file in your browser:`);
        await interaction.channel.send({ files: [{ name: "XXXXXXXX-collection.html", attachment: collection }] });


        // await interaction.reply(payload)
        // .catch(console.error);
    },
};