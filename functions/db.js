const sqlite3 = require('sqlite3').verbose();

const d = new sqlite3.Database('./db/db.sqlite');


function datab() {
let j = d;
  return j;
}
module.exports =  {
  datab
};
