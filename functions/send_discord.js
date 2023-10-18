const botToken = process.env.dc_bottoken;
const {
    Client,
    GatewayIntentBits    
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
            return true;
        } else {            
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