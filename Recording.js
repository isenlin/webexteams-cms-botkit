require('dotenv').config();
var request = require('request');

//REST API POST for get Room ID



    function Recording() {
        this.start = function(nono,callback) {
            var RecStart = { method: 'PUT',
                url: process.env.CMS_HTTPS + "/api/v1/calls/"+process.env.CMS_ROOM_ID,
                auth: {
                username: process.env.CMS_USERNAME,
                password: process.env.CMS_PASSWORD
                },
                form: { recording: "true" }
                };

            request(RecStart, function (error, response, body) {
                //Get request error
                if (error) throw new Error(error);
                    if(response.statusCode==200) {
                                callback("Recording Start! Room Name:" + process.env.CMS_ROOMNAME);
                    }
                    else {
                                callback("XX Recording Fail XX for " + process.env.CMS_ROOMNAME);
                    }
            });
            
        }       
        this.stop = function(nono,callback) {
            var RecStop = { method: 'PUT',
                url: process.env.CMS_HTTPS + "/api/v1/calls/"+process.env.CMS_ROOM_ID,
                auth: {
                username: process.env.CMS_USERNAME,
                password: process.env.CMS_PASSWORD
                },
                form: { recording: "false" }
                };
            request(RecStop, function (error, response, body) {
                //Get request error
                if (error) throw new Error(error);
                    if(response.statusCode==200) {
                                callback("Recording Stop! Room Name:" + process.env.CMS_ROOMNAME);
                    }
                    else {
                                callback("XX Recording Fail XX Room Name:" + process.env.CMS_ROOMNAME);
                    }
            });
            
        }              
    } 

    module.exports = Recording;