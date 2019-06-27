# Webexteams Quick Control Cisco Meeting Server

Applicable conditions: Temporary meeting is very urgent or the meeting order of the officer
>Function: 
>* 1.The fastest way to pull in people or video hosts
>* 2.Can quickly know if the participants are ready

# Main documents:
>* 1.everrichbot.js : main program
>* 2.env : Parameter content

# Requirements
> node.js
> dotenv
> xmi2js
> botkit

# Installation
Clone the repo git clone https://github.com/ciscocms/auto-dial.git
Install the node modules used in the project npm install
Edit config.js with your deployment specific details
Alternately you can set the following environment variables to configure the service. CMS_HOST CMS_API_USERNAME CMS_API_PASSWORD API_PORT MONGO_HOST E.g.; export CMS_HOST="cms.empire.net:444"
Start the service node app.js

# If you want to change the CMS Server parameters, you change the .env file.
