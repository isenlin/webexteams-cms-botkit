# Webexteams Quick Control Cisco Meeting Server

Applicable conditions: Temporary meeting is very urgent or the meeting order of the officer
>Function: 
>* 1.The fastest way to pull in people or video hosts
>* 2.Can quickly know if the participants are ready

# Before use
> Before using BOT, please understand the following pages:
> See "Creating Chatbots for Webex Teams (Node.js)"
> https://developer.cisco.com/learning/tracks/collab-cloud

More advanced
> You can refer to the following URL:
> Reference "The Business Value of Cloud Collaboration APIs"
> https://developer.cisco.com/learning/modules

# Main documents:
>* .CMSBot.js : main program
>* .env : Parameter content
>* SetRoom.js : Set up a temporary meeting and generate a RoomID
>* GetRoom.js : Bot uses RoomID to gain temporary meeting control
>* Recording.js : Bot control recording function

# Requirements
>* node.js
>* dotenv
>* xmi2js
>* botkit

# Installation
>* Clone the repo git clone https://github.com/isenlin/webexteams-cms-botkit.git
>* Install the node modules used in the project npm install
>* Edit env_needrenameto(.env) with your deployment specific details
>* Replace .env with env_needrenameto(.env)
>* Start the service "node CMSBot.js"
>* Bot will listen to Port 3000

# (Option)Environment Variables
If you don't want to set .env, you can use environment variables
>* ACCESS_TOKEN=XXXXXXXXXXXXXXX  //Bot ACCESS_TOKEN
>* DEBUG=sparkbot*,samples*
>* BOT_NICKNAME=CMSBot
>* SECRET=Not that secret !
>* PUBLIC_URL=https://XXX.XXX.XXX.XXX
>* CMS_ROOMNAME=vmsuser1.Room  //it`s just for default.unimportant.
>* CMS_USERNAME=test  //CMS WebAdmin UserName
>* CMS_PASSWORD=test  //CMS WebAdmin Password
>* CMS_HTTPS=https://vms.vega-global.com.tw:446   //CMS WebAdmin Address and Port

#Instruction Set
Use the `help` command to get all the instructions
