const http = require('http');
const fs = require('fs');
const url = require('url')
var {
  getm
} = require('./functions/getmsgs')
const server = http.createServer(async (req, res) => {
  let {
    isbanned
  } = require("./functions/ban.js");
  if (isbanned(req.connection.remoteAddress) == "yes") {
    res.writeHead(403, {
      'Content-Type': 'text/html'
    });
    res.end("access denied");
    return;
  }
  const p = url.parse(req.url);
  let path = p.pathname;
  if (req.method == "POST") {
    if (path == "/sendmsg") {
      const {
        sndmsg
      } = require("./functions/sendmsg.js");
      sndmsg(req, res)
    } else if (path == "/contdt") {
      const {
        contact
      } = require("./functions/contact.js");
      contact(req, res);
    }
  } else if (req.method == "GET") {
    //const s = querystring.parse(purl.query);
    if (path === '/' || path === '/index.html') {
      let c = fs.readFileSync("web/home.html", 'utf8');
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(c);
    } else if (path === '/room') {
      if (p.query.length < 3 || /^\d+$/.test(p.query.substring(2, p.query.length)) == false) {
        res.writeHead(404, {
          'Content-Type': 'text/plain',
          'X-Suppress-Error': 'true',
        });
        res.end("what u looking for?");
        return;
      }
      let o = p.query.substring(2, p.query.length)
      const {
        savrom
      } = require("./functions/coockies.js")
      if (await savrom(res, o, "add") != true) {
        res.writeHead(501, {
          'Content-Type': 'text/html',
          'X-Suppress-Error': 'true',
        });
        res.end("Internal error 34");
        return;
      }
      let c = fs.readFileSync("./web/room.html")
      res.setHeader('Set-Cookie', [
        'r=' + o + '; Max-Age=21600'
      ]);
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(c);
    } else if (path == "/getsuer") {
      const {
        saveser
      } = require("./functions/coockies");
      let h = await saveser(req, res);
      if (h != true) {
        res.writeHead(501, {
          'Content-Type': 'text/plain',
          'X-Suppress-Error': 'true',
        });
        res.end("Internal error 12 ");
        return;
      }
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end("done");
    } else if (path == "/getmsgs") {
      (async () => {
        await getm(req, p.query,res);        
      })();
    } else if (path == "/favicon.ico") {
      fs.readFile("./favico.png", (err, data) => {
        if (err) {
          console.error('Error reading favicon file:', err);
          res.writeHead(501, {
            'Content-Type': 'text/plain',
            'X-Suppress-Error': 'true',
          });
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, {
            'Content-Type': 'image/x-icon'
          });
          res.end(data);
        }
      });
    } else if (path == "/roomjs") {
      let c = fs.readFileSync("./web/roomjs.js", "utf8");
      res.writeHead(200, {
        'Content-Type': 'application/javascript',
      })
      res.end(c)
    } else if (path == "/roomstyle") {
      let c = fs.readFileSync("./web/roomstyle.css", "utf8");
      res.writeHead(200, {
        'Content-Type': 'text/css',
      })
      res.end(c)
    } else if (path == "/remove") {
      res.setHeader('Set-Cookie', [
        'u=1; Max-Age=1',
        'e=1; Max-Age=1',
        'r=1; Max-Age=1',
        'warn=1; Max-Age=1',
      ]);
      res.setHeader('Content-Type', 'text/plain');
      res.end('done');

    } else if (path == "/newroom") {
      const {
        gename
      } = require("./functions/coockies.js")
      const {
        isFree
      } = require("./functions/genral.js")
      let h = '';
      var st = false;
      while (st == false) {
        h = gename();
        s = await isFree(h);
        if (s == true) {
          st = true;
        }
      }
      if (st == true) {
        res.setHeader('Set-Cookie', [
          'r=' + h + '; Max-Age=21600000'
        ]);
        res.setHeader('Content-Type', 'text/plain');
        res.end('done' + h);
      }
    } else if (path == "/joinroom") {
      const {
        isFree
      } = require("./functions/genral.js")
      let r = p.query.substring(5, p.query.length);
      let s = await isFree(r);
      if (s == false) {
        res.setHeader('Set-Cookie', [
          'r=' + r + '; Max-Age=21600'
        ]);
        res.setHeader('Content-Type', 'text/plain');
        res.end('done' + r);
      } else {
        res.setHeader('Content-Type', 'text/plain');
        res.end("no");
      }

    } else if (path == "/pp") {
      let c = fs.readFileSync("web/privacy.html", 'utf8');
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(c);
    }else if (path == "/tos") {
      let c = fs.readFileSync("web/tos.html", 'utf8');
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(c);
    } else if (path == "/contact") {
      let c = fs.readFileSync("web/contact.html", 'utf8');
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(c);
    } else if (path == "/iplist") {
      let c = fs.readFileSync("web/iplist.html", 'utf8');
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(c);
    } else if (path == "/unbanip") {
      let {
        unbanip
      } = require("./functions/ban.js");
      let s = await unbanip(p.query, req);
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(s);
    } else if (path == "/banip") {
      let {
        banip
      } = require("./functions/ban.js");
      let s = await banip(p.query, req);
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(s);

    } else if (path == "/ipfile") {
     
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      res.end(c);
    } else if(path=="/test"){

      let c = fs.readFileSync("./web/test.html", 'utf8');
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(c);

    } else if(path == "/online"){
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end("online");
    }else  {  
      console.log(path)
      res.writeHead(404, {
        'Content-Type': 'text/html',
        'X-Suppress-Error': 'true',
      });
      res.end('what u looking for?');
    }
  }
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

let {
  startclean
} = require("./functions/delete_old_messages.js")

setInterval(startclean, 21600);