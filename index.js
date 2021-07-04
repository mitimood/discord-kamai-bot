const Discord = require("discord.js");
const config = require("./config");
const client = new Discord.Client();
const fs = require("fs");   
client.commands = new Discord.Collection();
const Database = require("./db");
const db = new Database();

const Database2 = require("./dbEmbeds");
const embDb = new Database2();

module.exports = { client, db, embDb, Discord }

const commandAdm = fs.readdirSync(`./admcmd`).filter(file => file.endsWith(`.js`));
const commandMod = fs.readdirSync(`./modcmd`).filter(file => file.endsWith(`.js`));
const commandPub = fs.readdirSync(`./commandpub`).filter(file => file.endsWith(`.js`));
const commandCap = fs.readdirSync(`./capcmd`).filter(file => file.endsWith(`.js`));

const eventos = fs.readdirSync(`./eventos`).filter(file => file.endsWith(`.js`));

console.log(commandAdm,commandMod,commandPub,eventos)



commandAdm.forEach(admcmd => {
    require(`${__dirname}/admcmd/${admcmd}`);})
    
commandMod.forEach(modcmd => {
    require(`${__dirname}/modcmd/${modcmd}`);})

commandPub.forEach(pubcmd =>{
    require(`${__dirname}/commandpub/${pubcmd}`);})

commandCap.forEach(capcmd => {
    require(`${__dirname}/capcmd/${capcmd}`);})

eventos.forEach(events => {
    require(`${__dirname}/eventos/${events}`);})



    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = dd + '/' + mm + '/' + yyyy;
    

    client.on("ready",() => {
        fs.writeFile('./selfbotid.txt',"\n "+today, { flag: 'a' }, err => {});
        console.log("Cliente iniciado")
    })

client.login(config.TOKEN);