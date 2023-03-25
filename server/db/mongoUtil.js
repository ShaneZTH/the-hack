var MongoClient = require("mongodb").MongoClient;

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
let _db;
const db_name = "DB";

// module.exports = {
//   connectToServer: function (callback) {
//     MongoClient.connect(uri, (err, client) => {
//       if (err) {
//         console.log("Mongo Connection Error: " + err);
//       } else {
//         _db = client.db(db_name);
//         console.log("Mongo connected to: ", db_name);
//         return callback(err);
//       }
//     });
//   },

//   getDb: function () {
//     console.log("DBB: ", _db);
//     return _db;
//   },
// };


module.exports = {
  getDb: function () {
    if (_db) {
      console.log("Mongo already connected");
      return _db;
    } else {
      const client = new MongoClient(uri);
      _db = client.db(db_name);
      console.log("Mongo connected to: ", db_name);
    }
  }
};
