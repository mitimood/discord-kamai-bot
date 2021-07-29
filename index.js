const Discord = require("discord.js");
const config = require("./config");
const config_secret = require("./config_secret")
const client = new Discord.Client();
const fs = require("fs");   
client.commands = new Discord.Collection();
const Database = require("./localdb");
const LocalDb = new Database();
const mongodb = require("./mongodb")


const Database2 = require("./dbEmbeds");
const embDb = new Database2();

module.exports = { client, LocalDb, embDb, Discord }

const commandAdm = fs.readdirSync(`./admcmd`).filter(file => file.endsWith(`.js`));
const commandMod = fs.readdirSync(`./modcmd`).filter(file => file.endsWith(`.js`));
const commandPub = fs.readdirSync(`./commandpub`).filter(file => file.endsWith(`.js`));
const commandCap = fs.readdirSync(`./capcmd`).filter(file => file.endsWith(`.js`));
const commandStaff = fs.readdirSync(`./staffcmd`).filter(file => file.endsWith(`.js`));


const eventos = fs.readdirSync(`./eventos`).filter(file => file.endsWith(`.js`));


const ban_recover = fs.readdirSync(`./events_ban_recover`).filter(file => file.endsWith(`.js`));
console.log(commandAdm,commandMod,commandPub,eventos)



commandAdm.forEach(admcmd => {
    require(`${__dirname}/admcmd/${admcmd}`);})
    
commandMod.forEach(modcmd => {
    require(`${__dirname}/modcmd/${modcmd}`);})

commandPub.forEach(pubcmd =>{
    require(`${__dirname}/commandpub/${pubcmd}`);})

commandCap.forEach(capcmd => {
    require(`${__dirname}/capcmd/${capcmd}`);})

commandStaff.forEach(commandStaff => {
    require(`${__dirname}/staffcmd/${commandStaff}`);})

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

        client.guilds.cache.get(config.guild_id).roles.cache.get(config.storage_role.troph1).members.forEach(m=>{
        mongodb.role_register_add(m.id, config.storage_role.troph1)})

        client.guilds.cache.get(config.guild_id).roles.cache.get(config.storage_role.troph2).members.forEach(m=>{
        mongodb.role_register_add(m.id, config.storage_role.troph2)})

        client.guilds.cache.get(config.guild_id).roles.cache.get(config.storage_role.troph3).members.forEach(m=>{
        mongodb.role_register_add(m.id, config.storage_role.troph3)})  

        client.guilds.cache.get(config.guild_id).roles.cache.get(config.storage_role.troph4).members.forEach(m=>{
        mongodb.role_register_add(m.id, config.storage_role.troph4)})  

        client.guilds.cache.get(config.guild_id).roles.cache.get(config.storage_role.troph5).members.forEach(m=>{
        mongodb.role_register_add(m.id, config.storage_role.troph5)})  

        
    })

client.login(config_secret.TOKEN);