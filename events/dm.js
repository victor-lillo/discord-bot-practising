const path = require('path');

const channel_test = '896065740711526471'
const prefix = "!";

module.exports = {
    name: 'messageCreate',
    async execute(message) {

        //Condicional general de success
        // if (message.channel.id !== channel_test) return
        if (message.channel.id !== channel_test) return

        //Filtros listener success: bot, no canal
        if (message.author.bot) return

        //Condicionales para ejecutar sorteo
        //Prefijo = !
        //Rol = dev o admin
        const role_developer = '890725140613169154'
        const role_admin = '890723938810855455'

        const command = message.cleanContent.slice(prefix.length).trim().split(' ');

        console.log(`'${message.member.user.tag}'(${message.member.user.id}) : '${message.cleanContent}'\n`);

        if (command[0] === 'hola') {
            console.log("Dentro del hola");

            message.member.send(`🥳🥳 Get Salu2`).catch(error => {
                message.channel.send('Could not send you a DM. If you want to use this feature, allow XXXXXXXXTools server DMs in your settings.');
                console.log(`'${message.member.user.tag}'(${message.member.user.id}) does not allow DM`);

            })
        }
    }
};