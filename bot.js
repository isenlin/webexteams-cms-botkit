//
// Copyright (c) 2019 VEGA Taiwan
//

//You need to install the Git component yourself.
//npm install dotenv
//npm install xml2js

require('dotenv').config();
var xml2js = require('xml2js').parseString;

var Botkit = require('botkit');
var request = require('request');
var express = require('express');
var app = express();
var fs = require("fs");
const bodyParser = require('body-parser');


//萬用文字
var listtxt = '';
var cmserror = '，執行成功';
//設定撥號位址
var callcodec = '';
//設定REST API POST內容

var options2 = { method: 'GET',
  url: process.env.cmsparticipant,
  auth: {
    username: process.env.CMS_USERNAME,
    password: process.env.CMS_PASSWORD
  },
  form: { remoteParty: callcodec }
};

// 以下為連線方式
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
    bot.reply(message, "Hi, I am the Everrich Bot !\n\nType `getcms` to get the name of the person in the CMS meeting \n\n Type `call *` to dial to the video host (simplified or IP) .");
});

//
// Bots commands here
//
controller.hears(['^hello'], 'direct_message,direct_mention', function(bot, message) {
    var email = message.user; // Webex Teams User that created the message orginally 
    bot.reply(message, "Hi~ If you have any questions, you can send a letter to "+ process.env.owner);
});

controller.hears(['^getcms'], 'direct_message,direct_mention', function(bot, message) {
    listtxt = ""
    request(options2, function (error, response, body) {
        //Get request error
        if (error) throw new Error(error);
            switch(response.statusCode) {
                case 200:
                    cmserror = "撥號完成";
                    break;
                case 400:
                    cmserror = "條件式錯誤400!";
                    break;
                case 404:
                    cmserror = "條件式錯誤404!";
                    break;
                default:
                    cmserror = "無法判斷的錯誤!";
                    break;  
            }
                xml2js(body, function (err, result) {
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
                        else{bot.reply(message, "此會議無人參加");
                    }
                });
    });    
});

//
// Fallback command
//
controller.hears(['(.*)'], 'direct_message,direct_mention', function (bot, message) {
    //Split instructions
    var gotxt = message.text.split(" ");
    //Direct dialing?
    if (gotxt[0] == "call") {
        callcodec = gotxt[1];
        var options = { method: 'POST',
        url: process.env.cmsparticipant,
        auth: {
            username: process.env.CMS_USERNAME,
            password: process.env.CMS_PASSWORD
        },
        form: { remoteParty: callcodec, nameLabelOverride: callcodec }
        };
        request(options, function (error, response, body) {
            cmserror = "，執行成功"
            if (error) throw new Error(error);
                switch(response.statusCode) {
                    case 200:
                        cmserror = "，執行成功";
                        break;
                    case 400:
                        cmserror = "條件錯誤400!";
                        break;
                    case 404:
                        cmserror = "條件錯誤404!";
                        break;
                    default:
                        cmserror = "無法判斷的錯誤!";
                        break;  
                }
        });
        bot.reply(message, "指令:" + message.text + cmserror );
    }
    else {
        bot.reply(message, "抱歉，我不知道你輸入的`" + message.text + "`代表什麼指令\n\n請使用`help`觀看所有指令" );
    }
});


//
// Welcome message 
// Fired as the bot is added to a space
//
controller.on('bot_space_join', function (bot, message) {
    bot.reply(message, "Hi, I am the Everrich bot!\n\n You can type `help` to get the description", function (err, newMessage) {
    });
});

