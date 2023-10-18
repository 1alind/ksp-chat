
const {
    datab
  } = require("./db.js");
  var db = datab();

function isFree(r) {
    return new Promise((resolve, reject) => {         
        const query = 'SELECT COUNT(*) as messageCount FROM messages WHERE roomid = ?';
        db.get(query, [r], (err, row) => {
            if (err) {
                console.error(err);
                reject("error 987: genral.js");
                return;
            }
            const messageCount = row.messageCount;       
            const isRoomFree = messageCount === 0;
            resolve(isRoomFree);
                   
        });
    });
}






module.exports = {
    isFree
}