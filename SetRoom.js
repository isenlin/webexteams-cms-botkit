
require('dotenv').config();
var xml2js = require('xml2js').parseString;
var async = require('async');
var Botkit = require('botkit');
var request = require('request');
var express = require('express');
var app = express();
var fs = require("fs");
const bodyParser = require('body-parser');
var backid

//REST API POST for set Room ID
var PostRoomlist
function PostRoom(){
PostRoomlist = { method: 'POST',
url: process.env.CMS_HTTPS + "/api/v1/calls/",
auth: {
username: process.env.CMS_USERNAME,
password: process.env.CMS_PASSWORD
},
  form: { name: process.env.CMS_ROOMNAME}
};
}

    function SetRoomID() {
        this.SetID = function(nono,callback) {
            setid="";
            process.env.CMS_ROOMNAME=nono;
            PostRoom()
            request(PostRoomlist, function (error, response, body) {
                //Get request error
                if (error) throw new Error(error);
                    if(response.statusCode==200) {
                        setid="setok";
                        callback(setid);
                    }
                    else {
                        //建立常態RoomID
                        setid="error";
                        callback(setid);
                        //
                    }
            });
            
        }             
    } 

    module.exports = SetRoomID;