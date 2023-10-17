
const qs = require('querystring');
const {
    getCookie
} = require("./coockies");
const {
    isclean
} = require('./isipclean.js');
const {datab} =require("./db.js");
var db  = datab();
var s = 21600000;
function sndmsg(req, res) {
    var d = '';
    req.on('data', (i) => {
        d += i.toString();
    });
    req.on('end', () => {
        let u = getCookie(req, "u");
    
        const m = (qs.parse(d)).msg;
        let t = Date.now();
        let r = getCookie(req, "r");
        let i = req.connection.remoteAddress;
        if ( u == null || m.length < 1 || r.length < 1 || /^\d+$/.test(r) == false ) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
              });
            res.end("error 234");
            return;
        }
        if(u.length != 4 || /^\d+$/.test(u) == false){
            res.writeHead(200, {
                'Content-Type': 'text/html'
              });
            res.end("nice try ;)");
            return;
        }
        const query = 'INSERT INTO messages (user, message, senttime, roomid, ip) VALUES (?, ?, ?, ?, ?)';
        const values = [u, m, t, r, i];
        db.run(query, values, (err) => {

            if (err) {
                console.error(err.message);
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end('Error saving message to database');
            } else {
                const w = Date.now();
                const x = w + s;

                res.setHeader('Set-Cookie', ['u=' + u + '; Max-Age=' + s + '; ',
                    'e=' + x + '; Max-Age=' + s + '; '
                ]);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('saved');
                isclean(req,t)
            }
        });

    });
}









module.exports = {
    sndmsg
}