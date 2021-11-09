const { TrimMsg } = require("../../funções/funções")
const fs = require(`fs`)
const config = require("../../config")

module.exports={
    name: "help",
    aliases: ["ajuda"],
    description: "Descreve os comandos",

    async execute (msg) {
        const msgArgs = TrimMsg(msg)
        if(msgArgs[1]){
        let help_name = msgArgs[1].toLowerCase()
        let help_desc = ""
        let aliases = ""

        const admcmd = fs.readdirSync(`./commands/admcmd`).filter(file => file.endsWith(`.js`));
        admcmd.forEach(command_file_name => {
            let adm_module = require(`../admcmd/${command_file_name}`);
            if(help_name == adm_module.name || adm_module.aliases.includes(help_name)){
                help_desc = adm_module.description
                aliases = adm_module.aliases.join(" ")
            }
        })

        const modcmd = fs.readdirSync(`./commands/modcmd`).filter(file => file.endsWith(`.js`));
        modcmd.forEach(command_file_name => {
            let mod_module = require(`../modcmd/${command_file_name}`);
            if(help_name == mod_module.name || mod_module.aliases.includes(help_name)){
                help_desc = mod_module.description
                aliases = mod_module.aliases.join(" ")
            }
        })

        const staffcmd = fs.readdirSync(`./commands/staffcmd`).filter(file => file.endsWith(`.js`));
        staffcmd.forEach(command_file_name => {
            let staff_module = require(`../staffcmd/${command_file_name}`);
            if(help_name == staff_module.name || staff_module.aliases.includes(help_name)){
                help_desc = staff_module.description
                aliases = staff_module.aliases.join(" ")
            }
        })

        const capcmd = fs.readdirSync(`./commands/capcmd`).filter(file => file.endsWith(`.js`));
        capcmd.forEach(command_file_name => {
            let cap_module = require(`../capcmd/${command_file_name}`);
            if(help_name == cap_module.name || cap_module.aliases.includes(help_name)){
                help_desc = cap_module.description
                aliases = cap_module.aliases.join(" ")
            }
        })

        const pubcmd = fs.readdirSync(`./commands/commandpub`).filter(file => file.endsWith(`.js`));
        pubcmd.forEach(command_file_name => {
            let pub_module = require(`../commandpub/${command_file_name}`);
            if(help_name == pub_module.name || pub_module.aliases.includes(help_name)){
                help_desc = pub_module.description
                aliases = pub_module.aliases.join(", ")
            }
        })

        const games = fs.readdirSync(`./commands/commandpub/games`).filter(file => file.endsWith(`.js`));
        games.forEach(command_file_name => {
            let pub_module = require(`../commandpub/games/${command_file_name}`);
            if(help_name == pub_module.name || pub_module.aliases.includes(help_name)){
                help_desc = pub_module.description
                aliases = pub_module.aliases.join(", ")
            }
        })

            if(help_desc){
                try {
                    await msg.channel.send({embeds:[{content: msg.author.toString(), color: config.color.blurple, description: `**${help_name}**` +  (aliases ? `[${aliases}] ` : "") + `
                    ${help_desc}` }]})
                    
                } catch (error) {
                    console.log(error)
                }

            }else{
                full_help(msg)
            }
        }else{
            full_help(msg)
        }
    }
}


function full_help(msg){
    let help_commands = []

    const admcmd = fs.readdirSync(`./commands/admcmd`).filter(file => file.endsWith(`.js`));
    help_commands.push({adm_cmd:{name: "Administração"}})
    admcmd.forEach(command_file_name => {
        let adm_module = require(`../admcmd/${command_file_name}`);
        help_commands[0].adm_cmd[adm_module.name] = {aliases: adm_module.aliases ? adm_module.aliases.join(" ") : null, description: adm_module.description ? adm_module.description: null}
    })
    
    const modcmd = fs.readdirSync(`./commands/modcmd`).filter(file => file.endsWith(`.js`));
    help_commands.push({mod_cmd:{name: "Moderação"}})
    modcmd.forEach(command_file_name => {
        let mod_module = require(`../modcmd/${command_file_name}`);
        help_commands[1].mod_cmd[mod_module.name] = {aliases: mod_module.aliases ? mod_module.aliases.join(" ") : null, description: mod_module.description ? mod_module.description: null}
    })

    const staffcmd = fs.readdirSync(`./commands/staffcmd`).filter(file => file.endsWith(`.js`));
    help_commands.push({staff_cmd:{name: "Staff"}})
    staffcmd.forEach(command_file_name => {
        let staff_module = require(`../staffcmd/${command_file_name}`);
        help_commands[2].staff_cmd[staff_module.name] = {aliases: staff_module.aliases ? staff_module.aliases.join(" ") : null, description: staff_module.description ? staff_module.description: null}
    })

    const capcmd = fs.readdirSync(`./commands/capcmd`).filter(file => file.endsWith(`.js`));
    help_commands.push({cap_cmd:{name: "Capitães"}})
    capcmd.forEach(command_file_name => {
        let cap_module = require(`../capcmd/${command_file_name}`);
        help_commands[3].cap_cmd[cap_module.name] = {aliases: cap_module.aliases ? cap_module.aliases.join(" ") : null, description: cap_module.description ? cap_module.description: null}  
    })

    const pubcmd = fs.readdirSync(`./commands/commandpub`).filter(file => file.endsWith(`.js`));
    help_commands.push({pub_cmd:{name: "Públicos"}})
    pubcmd.forEach(command_file_name => {
        let pub_module = require(`../commandpub/${command_file_name}`);
        help_commands[4].pub_cmd[pub_module.name] = {aliases: pub_module.aliases ? pub_module.aliases.join(" ") : null, description: pub_module.description ? pub_module.description: null}
    })

    const games = fs.readdirSync(`./commands/commandpub/games`).filter(file => file.endsWith(`.js`));
    help_commands.push({games:{name: "Jogos"}})
    games.forEach(command_file_name => {
        let pub_module = require(`../commandpub/games/${command_file_name}`);
        help_commands[5].games[pub_module.name] = {aliases: pub_module.aliases ? pub_module.aliases.join(" ") : null, description: pub_module.description ? pub_module.description: null}
    })

    let emb_description = ""
    for(const i of help_commands){

        for(const command_type in i){

            if(command_type == "adm_cmd" | command_type == "mod_cmd" | command_type == "staff_cmd" | command_type == "cap_cmd" && msg.member.roles.cache.find(role => [config.roles.staff.admin, config.ban_recover.staff_adm].includes(role.id))){
                commandAdd()
            }else
            if(command_type == "mod_cmd" | command_type == "staff_cmd"  && msg.member.roles.cache.find(role => [config.roles.staff.mod].includes(role.id))){
                commandAdd()
            }else
            if(command_type == "staff_cmd" && msg.member.roles.cache.find(role => [config.roles.staff.staff_call].includes(role.id))){
                commandAdd()
            }else
            if(command_type == "cap_cmd" && msg.member.roles.cache.find(role => Object.values(config.roles.teams.caps).includes(role.id))){
                commandAdd()
            }
            if(command_type == "pub_cmd"){
                commandAdd()
            }
            if(command_type == "games"){
                commandAdd()
            }

            function commandAdd (){
                for(const command_name in i[command_type] ){
                    if(typeof(i[command_type][command_name]) != typeof("")){
                        emb_description += `↳ ${command_name}: ${i[command_type][command_name].description}\n`
    
                    }else{
                        emb_description += `**${i[command_type][command_name]}**\n`
                    }
                }
            }
        }
    }
    try {
        await msg.channel.send({content: msg.author.toString() ,embeds:[{description: emb_description, color: config.color.blurple}]})

    } catch (error) {
        console.log(error)
    }
}