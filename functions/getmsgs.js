const {
  getCookie
} = require('./coockies');
const {
  datab
} = require("./db.js");
var db = datab();

function getm(req, tt,res) {
  if (!tt.startsWith("t=") || tt.length < 3) {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end("internal error");
    return;
  }
  var t = parseInt(tt.substring(2, tt.length), 10);
  if (/^\d+$/.test(t) === false) {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end("internal error");
    return;
  }
  let room = getCookie(req, "r");
  if (room == null) {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end("internal error");
    return;
  }

  if (/^\d+$/.test(room) == false) {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end("nice try ;)");
    return;
  }

  const query = 'SELECT * FROM messages WHERE roomid = ' + room + ' AND senttime > ? ORDER BY senttime DESC LIMIT 15';
  // ASC
  db.all(query, [t], (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }
    // Process the result set
    var c = "ok";
    rows = rows.reverse();
    rows.forEach((x) => {
      // console.log(k + "--" + x.senttime)
      if (t < x.senttime) {
        c += '<div class="message english"><p><span class="username">' + x.user + ':</span>' + x.message + '</p></div>';
      }
    });
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(c);
    return;
  });

}


module.exports = {
  getm
};