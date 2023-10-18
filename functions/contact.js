const qs = require('querystring');
const {
    getCookie
} = require("./coockies");
function contact(req, res) {
    var d = '';
    req.on('data', (i) => {
        d += i.toString();
    });
    req.on('end', async () => {
        const {
            snddiscord
        } = require('./send_discord.js');
        var u = getCookie(req, "u");
        var n = (qs.parse(d)).n;
        var m = (qs.parse(d)).m;
        var e = (qs.parse(d)).e;
        const {
            EmbedBuilder
        } = require('discord.js');
        const msg = new EmbedBuilder()
            .setTitle("**CONTACT**")
            .setColor('#3498db')
            .addFields({
                name: '**user:** ' + u,
                value: '\u200B',
                inline: false
            }, {
                name: '**name:** ' + n,
                value: '\u200B',
                inline: false
            }, {
                name: '**email:** ' + e,
                value: '\u200B',
                inline: false
            }, {
                name: '**ip:** ' + req.connection.remoteAddress,
                value: '\u200B',
                inline: false
            }, {
                name: '**msg:** ',
                value: m,
                inline: false
            }, );
        let dis = await snddiscord(msg,process.env.dc_channel,true);
        if (dis == true) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end("s");
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end("e");
        }
    });
}
module.exports = {
    contact
}