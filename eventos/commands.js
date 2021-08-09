const {client} = require(`../index`)
const fs = require(`fs`)
const config = require(`../config`)


client.on("messageCreate", msg=>{

    if(!msg.author.bot && msg.guild && msg.content.startsWith(config.prefixo)){
    var command =  msg.content.toLowerCase().split(" ")[0].substr(config.prefixo.length)
    console.log(`[${command}] ${msg.author.tag}`)
    // Staffs commands
    if (msg.member.roles.cache.find(role => [config.roles.staff.admin, config.ban_recover.staff_adm].includes(role.id))){
        const admcmd = fs.readdirSync(`./admcmd`).filter(file => file.endsWith(`.js`));
        admcmd.forEach(command_file_name => {
            let adm_module = require(`../admcmd/${command_file_name}`);
            if(command == adm_module.name || adm_module.aliases.includes(command)){
                adm_module.execute(msg)
            }
        })

        const modcmd = fs.readdirSync(`./modcmd`).filter(file => file.endsWith(`.js`));
        modcmd.forEach(command_file_name => {
            let mod_module = require(`../modcmd/${command_file_name}`);
            if(command == mod_module.name || mod_module.aliases.includes(command)){
                mod_module.execute(msg)
            }
        })

        const staffcmd = fs.readdirSync(`./staffcmd`).filter(file => file.endsWith(`.js`));
        staffcmd.forEach(command_file_name => {
            let staff_module = require(`../staffcmd/${command_file_name}`);
            if(command == staff_module.name || staff_module.aliases.includes(command)){
                staff_module.execute(msg)
            }
        })

        const capcmd = fs.readdirSync(`./capcmd`).filter(file => file.endsWith(`.js`));
        capcmd.forEach(command_file_name => {
            let cap_module = require(`../capcmd/${command_file_name}`);
            if(command == cap_module.name || cap_module.aliases.includes(command)){
                cap_module.execute(msg)
            }
        })

        const pubcmd = fs.readdirSync(`./commandpub`).filter(file => file.endsWith(`.js`));
        pubcmd.forEach(command_file_name => {
            let pub_module = require(`../commandpub/${command_file_name}`);
            if(command == pub_module.name || pub_module.aliases.includes(command)){
                pub_module.execute(msg)
            }
        })    

    //mod commands
    }else if(msg.member.roles.cache.find(role => [config.roles.staff.mod].includes(role.id))){
        const modcmd = fs.readdirSync(`./modcmd`).filter(file => file.endsWith(`.js`));
        modcmd.forEach(command_file_name => {
            let mod_module = require(`../modcmd/${command_file_name}`);
            if(command == mod_module.name || mod_module.aliases.includes(command)){
                mod_module.execute(msg)
            }
        })

        const staffcmd = fs.readdirSync(`./staffcmd`).filter(file => file.endsWith(`.js`));
        staffcmd.forEach(command_file_name => {
            let staff_module = require(`../staffcmd/${command_file_name}`);
            if(command == staff_module.name || staff_module.aliases.includes(command)){
                staff_module.execute(msg)
            }
        })

        const pubcmd = fs.readdirSync(`./commandpub`).filter(file => file.endsWith(`.js`));
        pubcmd.forEach(command_file_name => {
            let pub_module = require(`../commandpub/${command_file_name}`);
            if(command == pub_module.name || pub_module.aliases.includes(command)){
                pub_module.execute(msg)
            }
        })  

    //staff commands
    }else if (msg.member.roles.cache.find(role => [config.roles.staff.staff_call].includes(role.id))){
        const staffcmd = fs.readdirSync(`./staffcmd`).filter(file => file.endsWith(`.js`));
        staffcmd.forEach(command_file_name => {
            let staff_module = require(`../staffcmd/${command_file_name}`);
            if(command == staff_module.name || staff_module.aliases.includes(command)){
                staff_module.execute(msg)
            }
        })

        const pubcmd = fs.readdirSync(`./commandpub`).filter(file => file.endsWith(`.js`));
        pubcmd.forEach(command_file_name => {
            let pub_module = require(`../commandpub/${command_file_name}`);
            if(command == pub_module.name || pub_module.aliases.includes(command)){
                pub_module.execute(msg)
            }
        })  

    //cap commands
    }else if (msg.member.roles.cache.find(role => Object.values(config.roles.teams.caps).includes(role.id))){

        const capcmd = fs.readdirSync(`./capcmd`).filter(file => file.endsWith(`.js`));
        capcmd.forEach(command_file_name => {
            let cap_module = require(`../capcmd/${command_file_name}`);
            if(command == cap_module.name || cap_module.aliases.includes(command)){
                cap_module.execute(msg)
            }
        })
        
        const pubcmd = fs.readdirSync(`./commandpub`).filter(file => file.endsWith(`.js`));
        pubcmd.forEach(command_file_name => {
            let pub_module = require(`../commandpub/${command_file_name}`);
            if(command == pub_module.name || pub_module.aliases.includes(command)){
                pub_module.execute(msg)
            }
        })  

    //public commands
    }else{
        const pubcmd = fs.readdirSync(`./commandpub`).filter(file => file.endsWith(`.js`));
        pubcmd.forEach(command_file_name => {
            let pub_module = require(`../commandpub/${command_file_name}`);
            if(command == pub_module.name || pub_module.aliases.includes(command)){
                pub_module.execute(msg)
            }
        })  
    }

    }
})