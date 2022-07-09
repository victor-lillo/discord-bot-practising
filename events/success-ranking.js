const path = require('path');
const { rankingPoints, giveaway } = require('../modules/ranking/ranking');
const { winners_number } = require(path.join(__dirname, '..', 'config.json'))

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const channel_success = '890722315506163722'
const channel_test = '896065740711526471'

const ranking = require(path.join(__dirname, '..', 'modules', 'ranking', 'ranking.json'))

const prefix = "!";

module.exports = {
    name: 'messageCreate',
    async execute(message) {

        //Condicional general de success
        // if (message.channel.id !== channel_test) return
        if (message.channel.id !== channel_success) return

        //Filtros listener success: bot, no canal
        if (message.author.bot) return

        //Condicionales para ejecutar sorteo
        //Prefijo = !
        //Rol = dev o admin
        const role_developer = '890725140613169154'
        const role_admin = '890723938810855455'

        const command = message.cleanContent.trim()

        console.log(`'${message.member.user.tag}'(${message.member.user.id}) : '${message.cleanContent}'\n`);

        //Regex para enlaces de tweets
        const regEx = /https:\/\/twitter.com\/[a-zA-z]{3,}\/status\//gi

        //Para que carguen los embeds
        await sleep(1000)

        //Si es un tuit
        if (regEx.test(command)) {
            // console.log(message.embeds[0].description);

            //Si es un tuit que nos cita, 5 puntos
            if (message.embeds[0].description.toLowerCase().includes('@XXXXXXXXtools')) {

                //Enviamos a ranking.js userID y userName
                await rankingPoints(message.member.user.id, message.member.user.tag, 5)

                message.reply(`<:levtw:901168365526220811> Thanks for sharing **tweet** success. You won 5 points. \n**📊 Total ${ranking[message.member.user.id].points} points**`)
            }
        }
        //Si no es tuit, 1 punto
        else {
            //Enviamos a ranking.js userID y userName
            await rankingPoints(message.member.user.id, message.member.user.tag, 1)

            message.reply(`🥳 Thanks for sharing success. You won 1 point. \n**📊 Total ${ranking[message.member.user.id].points} points**`)

        }


        //! Giveaway
        //ID de developer role: 890725140613169154
        // console.log(message.member._roles);
        const giveawayRoles = [role_developer, role_admin];

        const hasRole = giveawayRoles.some(el => message.member._roles.includes(el));

        //si es developer o admin
        if (hasRole) {

            //Si no empieza por prefijo '!', return
            if (!message.cleanContent.startsWith(prefix)) return;

            //Crea array ['comando', 'parte1']
            const command = message.cleanContent.slice(prefix.length).trim().split(' ');

            //Si no es giveaway, return
            if (command[0] !== 'giveaway') return

            if (command[1] === 'weekly') {
                message.delete()

                //Giveaway retorna array
                await giveaway(command[1])

                await message.channel.send('Weekly winner incoming... @everyone');
                // await message.channel.send('@everyone');
                await sleep(10000)
                await message.channel.send('Are you ready? 🧐');
                await sleep(2000)

                await message.channel.send(`🎉🎈 The **x${winners_number}** access winners to exclusive tools are...  🎈🎉\n ${await giveaway(command[1]).join(', ').replace(', and', ' and')}`);
            }

            //Sorteo mensual
            else if (command[1] === 'monthly') {
                message.delete()

                await message.channel.send('Monthly winner incoming... @everyone');
                // await message.channel.send('@everyone');
                await sleep(10000)
                await message.channel.send('Are you ready? 🧐');
                await sleep(2000)
                await message.channel.send('3...');
                await sleep(1000)
                await message.channel.send('2...');
                await sleep(1000)
                await message.channel.send('1...');
                await sleep(1000)

                //Giveaway retorna string
                await message.channel.send(`✨💸 The **free month** is for <@${await giveaway(command[1])}> 💸✨`);
            }
        }
    }
};