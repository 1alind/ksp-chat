const {datab} = require("./db.js");
const db = datab();
let pubrooms = [1, 2, 3]


async function deleterows(room) {  
    let query = 'SELECT id FROM messages WHERE roomid = ' + room + ' ORDER BY senttime DESC';
    db.all(query, async (err, rows) => {
      if (err) {
        console.error(err.message);
        return;
      }
      rows = rows.reverse();
      let c = rows.length - 15;
      if (c < 2) {
        return;
      }
      var l = []
      for (let i = 0; i < c; i++) {
        l.push(rows[i].id)
      }      
      let delq = `DELETE FROM messages WHERE id IN (${l.map(() => '?').join(', ')})`;
      try {
        await db.run(delq, l);
       // console.log("Rows deleted successfully");
      } catch (error) {
        console.error(error);
      }
    }); 
}


async function startclean() {
  pubrooms.forEach(async (i) => {
   await  deleterows(i)
  });
    let query = `
       SELECT roomid, MAX(senttime) as last
       FROM messages
       WHERE roomid NOT IN (${pubrooms.join(', ')})
       GROUP BY roomid
     `;  
    let rows = await new Promise((resolve, reject) => {
      db.all(query, async (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    if (rows.length < 1) {
      return;
    }
    rows.forEach(async (x) => {
      if (Date.now() - x.last > 21600000) {
        let delq = `DELETE FROM messages WHERE roomid = ${x.roomid}`;
        try {
          await db.run(delq);
        } catch (error) {
          console.error(error);
        }
      } else if (Date.now() - x.last < 21600000) {
        deleterows(x.roomid)
      }
    });
  }


module.exports = {
  startclean
};