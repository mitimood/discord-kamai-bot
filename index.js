const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require("fs");
const Discord = require("discord.js");
const config = require("./config");
const {Collection} = require("discord.js")
require('dotenv').config();
const client = new Discord.Client({ intents: 1735, makeCache: Discord.Options.cacheWithLimits({ MessageManager: 5000 }) })
//const client = new Discord.Client({ intents: 1735 })


const log = require('./utils/logger')


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
const capcmd = fs.readdirSync(`./commands/capcmd`).filter(file => file.endsWith(`.js`));
const commandpub = fs.readdirSync(`./commands/commandpub`).filter(file => file.endsWith(`.js`));
const modcmd = fs.readdirSync(`./commands/modcmd`).filter(file => file.endsWith(`.js`));
const staffcmd = fs.readdirSync(`./commands/staffcmd`).filter(file => file.endsWith(`.js`));


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

const commands = []
client.commands = new Collection();

module.exports = { commands ,client, LocalDb, embDb, Discord, selfbotRegister, gamesDB }

const admcmd = fs.readdirSync(`./commands/admcmd`).filter(file => file.endsWith(`.js`));

admcmd.forEach(events => {
    const com = require(`${__dirname}/commands/admcmd/${events}`);
    
    if(com.data) commands.push(com.data.toJSON());

    client.commands.set(com.name, com)
    
})

const capcmd = fs.readdirSync(`./commands/capcmd`).filter(file => file.endsWith(`.js`));

capcmd.forEach(events => {
    const com = require(`${__dirname}/commands/capcmd/${events}`);
    
    if(com.data) commands.push(com.data.toJSON());

    client.commands.set(com.name, com)
    
})

const games = fs.readdirSync(`./commands/commandpub/games`).filter(file => file.endsWith(`.js`));

games.forEach(events => {
    const com = require(`${__dirname}/commands/commandpub/games/${events}`)
    
    if(com.data) commands.push(com.data.toJSON());
    
    client.commands.set(com.name, com)
})

const pub = fs.readdirSync(`./commands/commandpub`).filter(file => file.endsWith(`.js`));

pub.forEach(events => {
    const com = require(`${__dirname}/commands/commandpub/${events}`)
    
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

client.on("ready", async () => {

    await gamesDB.MongoGamesClient.connect()
    

    if (!client.application?.owner) await client.application?.fetch();

    const commandsF = await client.guilds.cache.get(config.guild_id)?.commands.fetch();

    for(const [key, value] of commandsF.entries()){

        if(value.name == 'ban'){
            const permissions = [
                {
                    id: config.roles.staff.admin,
                    type: 'ROLE',
                    permission: true,
                },
            ]
            commandsF.get(key).permissions.set({permissions})
        }

        if(value.name == ('adicionar-ponto' ) || value.name ==  "remover-ponto" ){

            const caps = config.roles.teams.caps
            const permissions = []

            for (const key in caps) {
                if (Object.hasOwnProperty.call(caps, key)) {
                    const element = caps[key];
                    permissions.push({
                        id: element,
                        type: 'ROLE',
                        permission: true,
                    })
                }
            }

            commandsF.get(key).permissions.set({permissions})
        }
    }
    
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

    // client.guilds.cache.get("612117634909208576").members.cache.filter(async m=>{
        
    //     if(m.nickname === "twitch.tv/say_cat_oficial"){
    //         console.log(m.nickname)
    //         m.ban({reason: "raid"})
    //     }
    // })

 // gamesDB.diceAdd("324730195863011328", { 1 : Date.now().valueOf(), 2 : Date.now().valueOf(), 3 : Date.now().valueOf(), 4 : Date.now().valueOf()})
    console.log("Cliente iniciado")
})
client.login(process.env.TOKEN);
