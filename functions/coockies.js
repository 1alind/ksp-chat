const cookies = require('cookies');

function gename() {
    return Math.floor(1000 + Math.random() * 9000);
}
var s = 6 * 60 * 60;

// Function to check and generate cookies
function saveser(req, res) {
    try {
     
        const coo = {};
        const rawCookies = req.headers.cookie ? req.headers.cookie.split('; ') : [];
        rawCookies.forEach(cookie => {
            const [key, value] = cookie.split('=');
            coo[key] = value;
        });

        const u = coo.u;
        const e = coo.e;


        if (u && e) {
         
            const c = Date.now();

            if (c < e) {
                
                return true;
            } else {
                
                const n = gename();
                const w = Date.now();
                const x = w + s;

                res.setHeader('Set-Cookie', [
                    'u=' + n + '; Max-Age=' + s ,
                    'e=' + x + '; Max-Age=' + s                    
                ]);

                return true;
            }
        } else {
           
            const n = gename();
            const w = Date.now();
            const x = w + s;


            res.setHeader('Set-Cookie', [
                'u=' + n + '; Max-Age=' + s ,
                'e=' + x + '; Max-Age=' + s               
            ]);
            return true;
        }
    } catch (error) {
        console.error(error.message);
        return false;
    }
}


function savrom(res, roomid, stat) {
    if (roomid.length < 1 || /^\d+$/.test(roomid) == false) {
        return false;
    }
    if (stat === "add") {        
        res.setHeader('Set-Cookie',[`r=${roomid}; Max-Age=${s};`]);
    } else if (stat === "remove") {
        res.setHeader('Set-Cookie', `r="1"; Max-Age=${10}; `);
    }
    return true;
}

function getCookie(req, cookieName) {   
    const rawCookies = req.headers.cookie ? req.headers.cookie.split('; ') : [];

    for (let i = 0; i < rawCookies.length; i++) {
        const [key, value] = rawCookies[i].split('=');
        if (key === cookieName) {
            return value;
        }
    }
    return null; // Cookie not found
}

module.exports = {
    saveser,
    savrom,
    getCookie,
    gename
}