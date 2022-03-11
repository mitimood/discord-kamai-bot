const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { client, log } = require("./index.js");
const config = require("../../config");
const { commands } = require("./commandsModules");
const { Collection } = require("discord.js");

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

client.commands = new Collection()

const commandsSlash = []

commands.forEach(events => {
    try {
        const com = require(events.path);
    
        if(com.data) commandsSlash.push(com.data.toJSON());
    
        client.commands.set(com.name, com)
    } catch (error) {
        log.error(error)
    }

    
})

async function loadSlash(){
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationGuildCommands(client.application.id, config.guild_id),
            { body: commandsSlash },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

async function loadSlashPermissions(){
    try {
        if (!client.application?.owner) await client.application?.fetch();

        const commandsApp = await client.guilds.cache.get(config.guild_id)?.commands.fetch();
        
    } catch (error) {
        log.error(error)
    }

    for(const [key, value] of commandsApp.entries()){

        commands.forEach(c=>{
            try {
                if(c?.data?.name == value.name && c.hasOwnProperty("permissions")){
                    const permissions = c.permissions
    
                    commandsApp.get(key).permissions.set({permissions})
                }
            } catch (error) {
                log.error(error)   
            }
        })
    }
}

loadSlash().then(()=>loadSlashPermissions())

module.exports = { 1:2}