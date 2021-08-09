const Discord = require("discord.js");
const {Client, Intents} = require("discord.js");
const client = new Client({intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]})
const config = require("./config");
const config_secret = require("./config_secret")
const fs = require("fs");   
const Database = require("./localdb");
const LocalDb = new Database();
const mongodb = require("./mongodb")

const Database2 = require("./dbEmbeds");
const embDb = new Database2();

module.exports = { client, LocalDb, embDb, Discord }
//Load all the events

const eventos = fs.readdirSync(`./eventos`).filter(file => file.endsWith(`.js`));
const ban_recover = fs.readdirSync(`./events_ban_recover`).filter(file => file.endsWith(`.js`));


eventos.forEach(events => {
    require(`${__dirname}/eventos/${events}`);})

ban_recover.forEach(recover_ev => {
    require(`${__dirname}/events_ban_recover/${recover_ev}`);})


    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = dd + '/' + mm + '/' + yyyy;
    

    client.on("ready",async () => {
        fs.writeFile('./selfbotid.txt',"\n "+today, { flag: 'a' }, err => {});
        console.log("Cliente iniciado")
        await mongodb.MongodbClient.connect()
        client.user.setPresence({status:`idle`})
        mongodb.Check_all_mutes()
    })

client.login(config_secret.TOKEN);