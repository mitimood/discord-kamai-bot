const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require("fs");
const Discord = require("discord.js");
const config = require("./config");
const {Collection} = require("discord.js")
require('dotenv').config();
const client = new Discord.Client({ intents: 1735, makeCache: Discord.Options.cacheWithLimits({ MessageManager: 20000 }) })
// const client = new Discord.Client({ intents: 1735 })


const Database = require("./localdb");
const selfbotDB = require("./db/selfbotRegister");
const selfbotRegister = new selfbotDB();
const Database2 = require("./dbEmbeds");
const embDb = new Database2();
const gamesConst = require("./db/games")
const gamesDB = new gamesConst()

const LocalDb = new Database();
const mongodb = require("./mongodb")
const mongoClientSite = require("./mongoDbSite.js");

module.exports = Object.assign( module.exports, {client, gamesDB} )

//Load all the events

const eventos = fs.readdirSync(`./eventos`).filter(file => file.endsWith(`.js`));
const eventos_folder = fs.readdirSync(`./eventos/xp`).filter(file => file.endsWith(`.js`));
const ban_recover = fs.readdirSync(`./events_ban_recover`).filter(file => file.endsWith(`.js`));


/* 
const admcmd = fs.readdirSync(`./commands/admcmd`).filter(file => file.endsWith(`.js`));
const capcmd = fs.readdirSync(`./commands/capcmd`).filter(file => file.endsWith(`.js`));
const commandpub = fs.readdirSync(`./commands/commandpub`).filter(file => file.endsWith(`.js`));
const modcmd = fs.readdirSync(`./commands/modcmd`).filter(file => file.endsWith(`.js`));
const staffcmd = fs.readdirSync(`./commands/staffcmd`).filter(file => file.endsWith(`.js`));

admcmd.forEach(events => {
    require(`${__dirname}/commands/admcmd/${events}`);
})
capcmd.forEach(events => {
    require(`${__dirname}/commands/capcmd/${events}`);
})
commandpub.forEach(events => {
    require(`${__dirname}/commands/commandpub/${events}`);
})
modcmd.forEach(events => {
    require(`${__dirname}/commands/modcmd/${events}`);
})
staffcmd.forEach(events => {
    require(`${__dirname}/commands/staffcmd/${events}`);
})
*/

const games = fs.readdirSync(`./commands/commandpub/games`).filter(file => file.endsWith(`.js`));


const commands = []
client.commands = new Collection();

games.forEach(events => {
    const com = require(`${__dirname}/commands/commandpub/games/${events}`)
    
    if(com.data) commands.push(com.data.toJSON());
    client.commands.set(com.name, com)
})


module.exports = { commands ,client, LocalDb, embDb, Discord, selfbotRegister, gamesDB }

ban_recover.forEach(recover_ev => {
    require(`${__dirname}/events_ban_recover/${recover_ev}`);
})
eventos.forEach(events => {
    require(`${__dirname}/eventos/${events}`);
})

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = dd + '/' + mm + '/' + yyyy;


client.on("ready", async () => {

    await gamesDB.MongoGamesClient.connect()
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(client.application.id, config.guild_id),
                { body: commands },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
    
    eventos_folder.forEach(events => {
        require(`${__dirname}/eventos/xp/${events}`);
    })
    client.user.setPresence({ status: `idle` })
    for( let id_guild of client.guilds.cache.keys()){
        await client.guilds.cache.get(id_guild).members.fetch()
    }
    try{
        await mongoClientSite.mongoClientSite.connect()
        await mongoClientSite.listEvent()
        await mongodb.MongodbClient.connect()
        await mongodb.Check_all_mutes()
    }catch(err){
        console.log(err)
    }
    
    // gamesDB.diceAdd("324730195863011328", { 1 : Date.now().valueOf(), 2 : Date.now().valueOf(), 3 : Date.now().valueOf(), 4 : Date.now().valueOf()})
    console.log("Cliente iniciado")
})
client.login(process.env.TOKEN);
