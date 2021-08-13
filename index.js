const Discord = require("discord.js");
const client = new Discord.Client({ intents: 1735 })
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
const eventos_folder = fs.readdirSync(`./eventos/xp`).filter(file => file.endsWith(`.js`));
const ban_recover = fs.readdirSync(`./events_ban_recover`).filter(file => file.endsWith(`.js`));


eventos.forEach(events => {
    require(`${__dirname}/eventos/${events}`);
})


ban_recover.forEach(recover_ev => {
    require(`${__dirname}/events_ban_recover/${recover_ev}`);
})


var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = dd + '/' + mm + '/' + yyyy;


client.on("ready", async () => {
    fs.writeFile('./selfbotid.txt', "\n " + today, { flag: 'a' }, err => { });
    await mongodb.MongodbClient.connect()
    eventos_folder.forEach(events => {
        require(`${__dirname}/eventos/xp/${events}`);
    })
    client.user.setPresence({ status: `idle` })
    for( let id_guild of client.guilds.cache.keys()){
        await client.guilds.cache.get(id_guild).members.fetch()
    }
    await mongodb.Check_all_mutes()
    console.log("Cliente iniciado")
})

client.login(config_secret.TOKEN);
