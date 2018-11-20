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
        rootCallback(errorJSON(err));
      } else {
        childCallback(db, function(err, data){
          if(!err){
            rootCallback(successJSON(data));
          } else {
            console.log(err);
            rootCallback(errorJSON(err));
          }
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

var successJSON = function(data){
  return {
    success: true,
    data: data
  };
}

var errorJSON = function(err){
  return {
    success: false,
    error: {
      message: err.message
    }
  };
}

exports.getUserPosts  = getUserPosts;
exports.getAllPosts   = getAllPosts;
exports.postData      = postData;
