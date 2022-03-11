const Discord = require("discord.js");
const config = require("../../config");
require('dotenv').config();
const client = new Discord.Client({ intents: 1735, makeCache: Discord.Options.cacheWithLimits({ MessageManager: 5000 }) })

client.login(process.env.TOKEN)

module.exports = client