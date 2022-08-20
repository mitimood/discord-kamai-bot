const Discord = require("discord.js");
const config = require("../../config");
require('dotenv').config();
const client = new Discord.Client({ intents: 34503, makeCache: Discord.Options.cacheWithLimits({ MessageManager: 5000 }) })
const { DiscordTogether } = require('discord-together');

client.discordTogether = new DiscordTogether(client);

module.exports = client

client.login(process.env.TOKEN)

