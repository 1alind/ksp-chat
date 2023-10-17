const targetUserId = '449266006209331210';
const botToken = 'MTE2MjU0NTE4Njk3OTcxMzAyNA.G05QGb.hSQyFxPjMQDa4aokk3HwoWQpfjYarQJ9n60g2c';
const {
    Client,
    GatewayIntentBits,
    MessageEmbed
} = require('discord.js');

async function snddiscord(msg,ch, embed) {

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.DirectMessages,
        ],
    });



    try {
        await client.login(botToken);        
        const channel = await client.channels.fetch(ch);
        //const user = await client.users.fetch(targetUserId);
        if (channel) {
            if (embed == true) {
                await channel.send({ embeds: [msg] });
            } else if (embed == false || embed == undefined) {
                await channel.send(msg);
            }
            //  console.log('Message sent successfully.');
            return true;
        } else {
            //console.log(channel)
            console.error('channel not found.');
            return false;
        }
    } catch (error) {
        console.error('Error sending message:', error);
        return false;
    } finally {
        client.destroy();
    }
}

module.exports = {
    snddiscord
};