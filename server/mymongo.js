var MongoClient = require('mongodb').MongoClient;

const DB_NAME = "mydb";
const SPORTPOINTS_COLLECTION = "sportpoints";
const MONGO_URL = "mongodb://localhost:27017/" + DB_NAME;

var connect = function(callback){
  return MongoClient.connect(MONGO_URL, { useNewUrlParser: true }, 
    function(err, db){
      callback(err, db);
      db.close();
    });
}

var getFavorites = function(userId, callback){
  connect(function(err, db){
    let jsonResp = {};
    if (err) {
      console.log(err);
      jsonResp.success = false;
      jsonResp.error = { message: err.message };
      callback(jsonResp);
    } else {
        db.db(DB_NAME).collection(SPORTPOINTS_COLLECTION).find({ userId: userId })
          .toArray(function(err, favorites){
            if(!err){
              jsonResp.success = true;
              jsonResp.data = favorites;
            } else {
                console.log(err);
                jsonResp.success = true;
                jsonResp.error = { message: err.message };
            }
            callback(jsonResp);
        });
      }
  });
}

var postData = function(data, callback){
  connect(function(err, db) {
    let jsonResp = {};
    if (err) {
      console.log(err);
      jsonResp.success = false;
      jsonResp.error = { message: err.message };
      callback(jsonResp);
    } else {
        db.db(DB_NAME).collection(SPORTPOINTS_COLLECTION).insertOne(data, function(err, resp) {
          if(!err){
              jsonResp.success = true;
              jsonResp.data = true;
            } else {
                console.log(err);
                jsonResp.success = true;
                jsonResp.error = { message: err.message };
            }
            callback(jsonResp);
        });
    }
  });
}

exports.getFavorites  = getFavorites;
exports.postData      = postData;
