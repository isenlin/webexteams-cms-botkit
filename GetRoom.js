require('dotenv').config();
var xml2js = require('xml2js').parseString;
var request = require('request');
var getid

//REST API POST for get Room ID
var GetRoomlist = { method: 'GET',
url: process.env.CMS_HTTPS + "/api/v1/calls/",
auth: {
username: process.env.CMS_USERNAME,
password: process.env.CMS_PASSWORD
}
};

    function GetRoomID() {
        this.GetID = function(nono,callback) {
            getid=""
            request(GetRoomlist, function (error, response, body) {
                //Get request error
                if (error) throw new Error(error);
                    if(response.statusCode==200) {
                        xml2js(body, function (err, result) {
                            //console.dir(JSON.stringify(result));
                            //Determine if the meeting has started?
                            if (result.calls.call!=null){
                            //Start listing all participants
                            for ( var X=0; X<result.calls.call.length; X++){
                            //如果找到的會議室同名，就回應Room ID
                            process.env.CMS_ROOMNAME=nono
                            if (result.calls.call[X].name[0]==process.env.CMS_ROOMNAME){
                                process.env.CMS_ROOM_ID = result.calls.call[X]['$']['id'];
                                getid="getok";
                                callback(getid);
                                return
                            }
                            }
                                getid=("setid");
                                callback(getid);
                            }
                            else {
                                getid=("setid");
                                callback(getid);
                            }
                        })
                    }
            });
            
        }             
    } 

    module.exports = GetRoomID;