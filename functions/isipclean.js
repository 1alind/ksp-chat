
const {
  getCookie
} = require("./coockies.js")

const {
  datab
} = require("./db.js");
var db = datab();
// this guy checks if the ip guy is a spammer by comparing 2 messages, timestamp < 3 seconds : spammer;
async function isclean(req, c) {

  const userIP = req.connection.remoteAddress;
  const userId = await getCookie(req, 'u');

  const query = `
      SELECT senttime FROM messages
      WHERE ip = ? AND user = ?
      ORDER BY senttime DESC
      LIMIT 2
    `;

  try {
    db.all(query, [userIP, userId], (err, rows) => {
      if (err) {
        console.log("error 343: isipclean:js");
        return;
      }
      if (rows.length > 1) {
        let mt = rows[1].senttime
        if (c - mt < 3000) {
          const {
            snddiscord
          } = require('./send_discord.js');

          const {
            EmbedBuilder
          } = require('discord.js');
          let r = getCookie(req, "room");
          const msg = new EmbedBuilder()   
          .setTitle("**SPAM**")         
            .setColor('#3498db')
            .addFields(
              { name: '**user**: ' + userId, value: '\u200B' },                          
              { name: '**room**: ' + r, value: '\u200B', inline: false },              
              { name: '**ip:** ' + userIP, value: '\u200B', inline: false },
            );                      
          snddiscord(msg,process.env.dc_channel, true);
        }
      }
    });


  } catch (err) {
    console.error('Database error:', err);
  } finally {

  }
}


module.exports = {
  isclean
};