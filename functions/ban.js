const fs = require("fs");
const f = "./db/ip.json";

async function banip(d, req) {
  var i = gq(d);
  if (i.u == undefined || i.u.length < 2) {
    return "username";
  }
  if (i.i == undefined || i.i.length < 7) {
    return "ip";
  }
  if (i.p == undefined || i.p.length < 8) {
    return "password";
  }
  if (hash(i.p) !== hash("fuckurmother")) {
    const {
      snddiscord
    } = require('./send_discord.js');
    const {
      EmbedBuilder
    } = require('discord.js');
    const {
      getCookie
    } = require("./coockies");
    var u = getCookie(req, "u");
    var r = getCookie(req, "r");
    const userIP = req.connection.remoteAddress;
    let ua = req.headers['user-agent']
    const msg = new EmbedBuilder()
      .setTitle("**HACK**")
      .setColor('#B22222')
      .addFields({
        name: '**user**: ' + u,
        value: '\u200B'
      }, {
        name: '**room**: ' + r,
        value: '\u200B',
        inline: false
      }, {
        name: '**ip:** ' + userIP,
        value: '\u200B',
        inline: false
      }, {
        name: '**u-agent:** ' + ua,
        value: '\u200B',
        inline: false
      }, {
        name: '\u200B',
        value: '\u200B',
        inline: false
      }, {
        name: '**requested:**',
        value: '\u200B',
        inline: false
      }, {
        name: '**user:** ' + i.u,
        value: '\u200B',
        inline: false
      }, {
        name: '**ip:** ' + i.i,
        value: '\u200B',
        inline: false
      }, {
        name: '**pass:** ' + i.p,
        value: '\u200B',
        inline: false
      }, {
        name: `**action:**`,
        value: `[ban](http://${req.headers.host}/banip?u=${u}&i=${userIP}&p=fuckurmother)`,
        inline: false
      }, );
    snddiscord(msg, "1162809943699771522", true);
    return "wrong";
  }
  if (await isbanned(i.i) == "yes") {
    return "already";
  }
  try {
    const bl = JSON.parse(await fs.readFileSync(f, 'utf-8'));
    bl.push({
      u: i.u,
      i: i.i,
      t: Date.now()
    });
    await fs.writeFileSync(f, JSON.stringify(bl, null, 2), 'utf-8');
    return "banned";
  } catch (error) {
    console.error('Error reading, parsing, or writing the file:', error);
    return "error";
  }
}



async function unbanip(d, req) {
  var i = gq(d);
  if (i.i == undefined || i.i.length < 7) {
    return "ip";
  }
  if (i.p == undefined || i.p.length < 8) {
    return "password";
  }
  if (hash(i.p) !== hash("fuckurmother")) {    
    return "wrong";
  }
  if (await isbanned(i.i) == "no") {
    return "not";
  }
  try {
    const fd = JSON.parse(fs.readFileSync(f));
    const up = fd.filter(x => x.i !== i.i);
    fs.writeFileSync(f, JSON.stringify(up, null, 2));
    return "unbanned";
  } catch (e) {
    console.log(e)
    return "error";
  }
}



function isbanned(ip) {
  try {
    const bannedList = JSON.parse(fs.readFileSync(f, 'utf-8'));
    return bannedList.some(entry => entry.i === ip) ? 'yes' : 'no';
  } catch (error) {
    console.error('Error reading or parsing the file:', error);
    return "502";
  }
}

function gq(q) {
  return q.replace('?', '').split('&').reduce((o, p) => (kv => (o[kv[0]] = decodeURIComponent(kv[1]), o))(p.split('=')), {});
}

function hash(s) {
  const {
    createHash
  } = require('crypto');
  return createHash('md5').update(s).digest('hex');
}
module.exports = {
  banip,
  unbanip,
  isbanned
}