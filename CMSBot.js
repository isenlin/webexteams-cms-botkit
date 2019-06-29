//
// Copyright (c) 2019 VEGA Taiwan
//

//You need to install the Git component yourself.
//npm install dotenv
//npm install xml2js

//require
require('dotenv').config();
var xml2js = require('xml2js').parseString;
var Botkit = require('botkit');
var request = require('request');
var express = require('express');
var app = express();
var fs = require("fs");
const bodyParser = require('body-parser');

//module
var GetRoomID = require("./GetRoom.js");
var SetRoomID = require("./SetRoom.js");
var Recording = require("./Recording.js");
GetRoomID=new GetRoomID();
SetRoomID=new SetRoomID();
Recording=new Recording();

//Buffer String
var listtxt = '';
var cmserror = '，執行成功';
//Codec Number Default
var callcodec = '';
//REST API GET
var options2
function getoption2(){
  options2 = { method: 'GET',
  url: process.env.CMS_HTTPS + "/api/v1/calls/" + process.env.CMS_ROOM_ID + "/participants",
  auth: {
    username: process.env.CMS_USERNAME,
    password: process.env.CMS_PASSWORD
  },
  form: { remoteParty: callcodec }
};
}

//connect config
var accessToken = process.env.ACCESS_TOKEN || process.env.SPARK_TOKEN 
if (!accessToken) {
    console.log("Please specify an access token via an ACCESS_TOKEN environment variable");
    process.exit(2);
}
var port = process.env.PORT || 3000;
// Websocket Intialization
var UnsupportedWebSocketLibrary = require('ciscospark-websocket-events');
websocket = new UnsupportedWebSocketLibrary(accessToken);
websocket.connect(function (err, res) {
    if (!err) {
        websocket.setWebHookURL("http://localhost:" + port + "/webhook");
    }
    else {
        console.log("Error starting up websocket: " + err);
    }
})
//////// Botkit //////
var Botkit = require('botkit');
var controller = Botkit.sparkbot({
    debug: true,
    log: true,
    public_address: "https://localhost",
    ciscospark_access_token: accessToken
});
var bot = controller.spawn({
});
controller.setupWebserver(port, function (err, webserver) {

    //setup incoming webhook handler
    webserver.post('/webhook', function (req, res) {
        res.sendStatus(200);
        controller.handleWebhookPayload(req, res, bot);
    });
});
/////BotKit////

//
// Help command
//
controller.hears(['^help'], 'direct_message,direct_mention', function(bot, message) {
    bot.reply(message, "Hi, I am the Quick CMS Control Bot !\n\n Type `joinroom [room_name]` to join a CMS Room. \n\nType `setroom [room_name]` to creat a Meeting Room ID. \n\n Type `getlist` to get the name of the person in the CMS meeting \n\n Type `call [number or IP or SIP URI]` to dial to the video host (simplified or IP) . \n\n You can Type `hello` to find me");
});

//
// My contact commands
//
controller.hears(['^hello'], 'direct_message,direct_mention', function(bot, message) {
    var email = message.user; // Webex Teams User that created the message orginally 
    bot.reply(message, "Hi~ If you have any questions, you can send a letter to "+ process.env.owner);
});

//
// Get Participant list commands
//
controller.hears(['^getlist'], 'direct_message,direct_mention', function(bot, message) {
    getoption2()
        listtxt = ""
    request(options2, function (error, response, body) {
        //Get request error
        if (error) throw new Error(error);
            switch(response.statusCode) {
                case 200:
                        cmserror = "，execution succeed";
                        break;
                    case 400:
                        cmserror = "，Error 400!";
                        break;
                    case 404:
                        cmserror = "，Error 404!";
                        break;
                    default:
                        cmserror = "，Unable to judge the error!";
                        break;  
            }
                xml2js(body, function (err, result) {
                    try {
                        console.dir(JSON.stringify(result));
                        //Determine if the meeting has started?
                        if (result.participants.participant!=null){
                        //Start listing all participants
                            for ( var X=0; X<result.participants.participant.length; X++){
                                //console.log(result.participants.participant[X].name[0]);
                                listtxt =listtxt  + X + "-" + result.participants.participant[X].name[0] + "\n\n";   
                                }
                                bot.reply(message, listtxt);
                            }
                            else{bot.reply(message, process.env.CMS_ROOMNAME + "nmeeting room without participant");
                        }
                    } catch (error) {
                        bot.reply(message, "Room error ; Please execute `setroom`");
                }
                });
    });    

    
});

// CMS Recording
//
controller.hears(['^recstart'], 'direct_message,direct_mention', function(bot, message) {
    function msg(msg) {
        bot.reply(message,msg);
    }
    Recording.start("recstart",msg);
});

controller.hears(['^recstop'], 'direct_message,direct_mention', function(bot, message) {
    function msg(msg) {
        bot.reply(message,msg);
    }
    Recording.stop("recstart",msg);
});

//
// Fallback command
//
controller.hears(['(.*)'], 'direct_message,direct_mention', function (bot, message) {
    //Split instructions
    var gotxt = message.text.split(" ");
    //Direct dialing *
    if (gotxt[0] == "call") {
        callcodec = gotxt[1];
        var options = { method: 'POST',
        url: process.env.CMS_HTTPS + "/api/v1/calls/" + process.env.CMS_ROOM_ID + "/participants",
        auth: {
            username: process.env.CMS_USERNAME,
            password: process.env.CMS_PASSWORD
        },
        form: { remoteParty: callcodec, nameLabelOverride: callcodec }
        };
        request(options, function (error, response, body) {
            cmserror = "，execution succeed"
            if (error) throw new Error(error);
                switch(response.statusCode) {
                    case 200:
                        cmserror = "，execution succeed";
                        break;
                    case 400:
                        cmserror = "，Error 400!";
                        break;
                    case 404:
                        cmserror = "，Error 404!";
                        break;
                    default:
                        cmserror = "，Unable to judge the error!";
                        break;  
                }
        });
        bot.reply(message, "Command:" + message.text + cmserror );
    }
    //Bot Join CMS Room and get the Room ID
    else if (gotxt[0] == "joinroom") {
        function xx(xxx) {
            if (xxx=="getok"){
            bot.reply(message,"Bot has already attended the `" + gotxt[1] + "` \n\n The Room ID:`" + process.env.CMS_ROOM_ID + "`");
            }
            else {
                bot.reply(message,"You neet use `setroom` \n\n Please type `help`");
            }
        }
        if (gotxt[1] != null) {
        GetRoomID.GetID(gotxt[1],xx);
        }
        else {
            bot.reply(message,"Please input CMS Room Name，Like `vmsuser1.Room`");  
        }
    }
    //Wake up a Room and set a CMS Room ID
    else if (gotxt[0] == "setroom"){
        function yy(xxx) {
            if (xxx=="setok"){
            bot.reply(message,"Bot has set up the `" + gotxt[1] + "` \n\n You can type `joinroom` to join");
            }
            else {
                bot.reply(message,"You neet use `setroom` \n\n Please type `help`");
            }
        }
        if (gotxt[1] != null) {
        SetRoomID.SetID(gotxt[1],yy);
        }
        else {
            bot.reply(message,"Please input CMS Room Name，Like `vmsuser1.Room`");  
        }
    }
    else {
        bot.reply(message, "Sorry，I don't know what you type `" + message.text + "`\n\n Please type `help` to view all command" );
    }

});



function checkroom(xxx) {
   if (xxx=="getok"){
    GetRoomID.GetID(gotxt[1],checkroom);
   }
   else if (xxx=="setid"){
    SetRoomID.SetID(gotxt[1],checkroom);
   }
   else if (xxx=="error"){
    bot.reply(message,"error");
    break
    }
   else {
    xx(process.env.CMS_ROOMNAME);
   }
}

//
// Welcome message 
// Fired as the bot is added to a space
//
controller.on('bot_space_join', function (bot, message) {
    bot.reply(message, "Hi, I am the Everrich bot!\n\n You can type `help` to get the description", function (err, newMessage) {
    });
});

