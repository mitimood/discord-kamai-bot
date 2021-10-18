const Discord = require("discord.js");
const client = new Discord.Client({ intents: 1735, makeCache: Discord.Options.cacheWithLimits({ MessageManager: 20000 }) })
const config_secret = require("./config_secret")
const fs = require("fs");
const Database = require("./localdb");
const LocalDb = new Database();
const mongodb = require("./mongodb")
const mongoClientSite = require("./mongoDbSite.js")


const selfbotDB = require("./db/selfbotRegister");
const selfbotRegister = new selfbotDB();

const Database2 = require("./dbEmbeds");
const config = require("./config");
const embDb = new Database2();
client.login(config_secret.TOKEN);

//Load all the events
module.exports = { client, LocalDb, embDb, Discord, selfbotRegister }

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

        // //VERIFY CACHE AND BAN
        // const banmemb = client.guilds.cache.get(config.guild_id).members.cache.filter(async m=> {
        //     if(m.user.username.toLowerCase().match(/milena[0-9]+|^! cd17z\W*\w*|Bruninhaa+|Amandaa+|Amandinhaa+|Larinhaa+|Thalitaa+|clarinhaa+|Plyss|! Baixinhaa*|Safiraa+|Mirelinha dos pack/ig)){
        //         setTimeout(async()=>{
        //             const { ban_member_send_message } = require("./funções/funções");
        //             let test = await ban_member_send_message(m.id, "Selfbot", client.guilds.cache.get(config.guild_id), client.user)
        //             console.log(`${m.user.toString()}   ${m.id}`)
        //             selfbotRegister.selfbotAdd(Date.now().valueOf(), m.avatar, m.id, m.user.tag, m.user.createdTimestamp, m.joinedTimestamp)
        //         },1000)
        //     }
        // })
        

    }catch(err){
        console.log(err)
    }

    console.log("Cliente iniciado")
})
