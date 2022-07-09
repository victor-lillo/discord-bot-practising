const { discord_rarityID } = require('../utilities/discord');
const { getNFTbyID } = require('../modules/rarity/getdata');
const { getRank } = require('../modules/rarity/getdata');
const { getTop } = require('../modules/rarity/getdata');
const { getTopHTML } = require('../modules/rarity/getdata');
const path = require('path');

const prefix = "!";

module.exports = {
    name: 'messageCreate',
    async execute(message) {

        const channel_suggestions = '890722531210842203'
        const channel_raritychecker = '893047465664708608'
        const channel_webhookprivate = '890723268015820801'
        //Si no empieza por prefijo '!', fin

        //Si es un bot, fin
        if (message.author.bot) return

        if (message.channel.id == channel_suggestions) {

            message.react('🟢')
                .then(() => message.react('🔴'))
        }

        //!Listener #rarity-checker
        else if (message.channel.id == channel_raritychecker) {

            // console.log(`Asked by: ${message.member.user.tag}\n`);
            if (!message.cleanContent.startsWith(prefix)) return;

            //Crea array ['comando', 'parte1', 'parte2']
            const command = message.cleanContent.slice(prefix.length).trim().split(' ');

            console.log(`'${message.member.user.tag}'(${message.member.user.id}) : '${message.cleanContent}'\n`);

            //! command[0] command[1] command [2]
            switch (command[0]) {

                //? !rarity collectionSlug token_id
                case 'rarity':
                    //! getNFTbyID(slug, id)
                    [nftName, nftURL, id, imgURL, fieldCollection] = await getNFTbyID(command[1], command[2])
                    // console.log(nftName,nftURL, id, imgURL, fieldCollection);

                    //Cuando dé error, retornaremos el nftURL=null, por lo que sabremos 
                    if (nftURL !== null) {
                        await discord_rarityID(nftName, nftURL, id, imgURL, fieldCollection)
                    }

                    //Colleccion no encontrada
                    else if (id === "Collection not found") {
                        // console.log("Coleccion no encontrada");
                        message.reply('Collection not included yet or misspelled. Check the collection slug or ask for it in <#890722531210842203> <:levHug:892441081181003836>')
                        // await discord_CollectionNotFound(command[1])

                    }
                    //Si wrong token id
                    else {
                        // message.channel.send('Wrong ID, please check it out <:XXXXXXXX:890866041964617738>')
                        message.reply('Wrong ID, please check it out <:XXXXXXXX:890866041964617738>')
                    }
                    // await discord_rarityID(nftName, id, fieldCollection)

                    break;

                //Te da el rank concreto
                //? !rank collectionSlug rank
                case 'rank':

                    const token_id = await getRank(command[1], command[2]);
                    if (token_id === "Collection not found") {
                        message.reply('Collection not included yet or misspelled. Check the collection slug or ask for it in <#890722531210842203> <:levHug:892441081181003836>')
                        // await discord_CollectionNotFound(command[1])
                    }
                    else if (token_id === "Wrong rank number") {
                        message.reply('Wrong rank, please check the number of items on this collection <:levSci:893080564150718484>')
                    } else {
                        // getNFTbyID(slug, id)
                        const [nftName, nftURL, id, imgURL, fieldCollection] = await getNFTbyID(command[1], token_id)
                        // console.log(nftName, id, imgURL, fieldCollection);

                        //Casi todo ok
                        await discord_rarityID(nftName, nftURL, id, imgURL, fieldCollection)
                    }

                    break;

                //? !top collectionSlug rank[100 | 10% | 1-10]
                case 'top':

                    const topUrl = path.join(__dirname, '..', 'modules', 'rarity', 'assets', 'top.html')

                    //Esperamos a tener el obj de las colecciones y el mensaje
                    // getTop('nftlions', 5)
                    const topResult = await getTop(command[1], command[2])

                    //Si todo ok, getTop() retorna un array
                    if (typeof topResult === 'object') {

                        //Con ese obj, creamos el HTML
                        // top[0] obj_list || top[1] message
                        await getTopHTML(topResult[0])

                        // await message.reply(`Here you have the **${command[2]} ${command[1]} items**. Remember to open the file in your browser:`);
                        await message.reply(topResult[1]);

                        await message.channel.send({ files: [{ name: "XXXXXXXX-top.html", attachment: topUrl }] });
                    }
                    //getTop retorna string, que es siempre error
                    else {
                        if (topResult === 'Collection not found') {
                            message.reply('Collection not included yet or misspelled. Check the collection slug or ask for it in <#890722531210842203> <:levHug:892441081181003836>')
                            // await discord_CollectionNotFound(command[1])
                        }
                        else if (topResult === 'Wrong top number') {
                            message.reply('Wrong top range, please check the number of items on this collection <:levSci:893080564150718484>')
                        }
                    }

                    break;

                default:
                    message.channel.send('Invalid command. Take a look at <#893137439814742056> <:XXXXXXXX:890866041964617738>')
                        // .then(message => console.log(`Sent message: ${message.content} \n`))
                        .catch(console.error);
            }
        }//Fin if canal #rarity-checker
    }
};