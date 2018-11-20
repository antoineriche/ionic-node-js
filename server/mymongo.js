var MongoClient = require('mongodb').MongoClient;

const DB_NAME = "mydb";
const POSTS_COLLECTION = "posts";
const MONGO_URL = "mongodb://localhost:27017/" + DB_NAME;


var connect = function(rootCallback, childCallback){
  return MongoClient.connect(MONGO_URL, { useNewUrlParser: true }, 
    function(err, db){
      let jsonResp = {};
      if (err) {
        console.log(err);
        jsonResp.success = false;
        jsonResp.error = { message: err.message };
        rootCallback(jsonResp);
      } else {
        childCallback(db, function(err, data){
          if(!err){
            jsonResp.success = true;
            jsonResp.data = data;
          } else {
              console.log(err);
              jsonResp.success = true;
              jsonResp.error = { message: err.message };
          }
          rootCallback(jsonResp);
        });
      }
      db.close();
    });
}

var getAllPosts = function(callback){
  
  connect(callback, function(db, next){
    db.db(DB_NAME).collection(POSTS_COLLECTION).find().toArray(
      function(err, points){
        next(err, points);
      }
    );
  });
}

var getUserPosts = function(userId, callback){

  connect(callback, function(db, next){
    db.db(DB_NAME).collection(POSTS_COLLECTION).find({ userId: userId })
      .toArray(function(err, favorites){
        next(err, favorites);
    });
  });
}

var postData = function(data, callback){
  
  connect(callback, function(db, next){
    db.db(DB_NAME).collection(POSTS_COLLECTION)
      .insertOne(data, function(err, resp){
        next(err, true);
    });
  });
}

exports.getUserPosts  = getUserPosts;
exports.getAllPosts   = getAllPosts;
exports.postData      = postData;
