# ionic-node-js
Cross-platform application and Node.js server


## Installation
### Server
#### MongoDB
Download and install MongoDb from https://www.mongodb.com/<br/>
#### NodeJS
Download and install NodeJS from https://nodejs.org/en/<br/>

### Client
#### IONIC and Cordova
Download and install IONIC and Cordova from https://ionicframework.com/docs/intro/installation/<br/>

## Start
* The application works with MongoDB listening on standard port 27017, so make sure the Mongo Daemon is running.
* Go to the server folder and launch it: _node my-server.js_ (default listening port: 8080).
* Go to the client/test-ionic folder and launch it: _ionic serve -l_.
* Make sure that server and client are connected to the same Wi-Fi network.

## Usage
### Get the sport areas of Bordeaux
You can get all the sport areas of Bordeaux (France) on the client by clicking on 'Get Bordeaux sport areas' from the home screen.<br/>(source: http://odata.bordeaux.fr/v1/databordeaux/poisport/?format=json)

### Send message to server
You can send messages to server by specifiying a user id and a string (at least three characters) and clicking on 'Send Message' from the home screen.

### Get my messages
You can view the messages posted by any user by specifying his id and clickong on 'Get user posts'. 
