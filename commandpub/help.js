const { TrimMsg } = require("../funções/funções")
const fs = require(`fs`)
const config = require("../config")

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

        const admcmd = fs.readdirSync(`./admcmd`).filter(file => file.endsWith(`.js`));
        admcmd.forEach(command_file_name => {
            let adm_module = require(`../admcmd/${command_file_name}`);
            if(help_name == adm_module.name || adm_module.aliases.includes(help_name)){
                help_desc = adm_module.description
                aliases = adm_module.aliases.join(" ")
            }
        })

        const modcmd = fs.readdirSync(`./modcmd`).filter(file => file.endsWith(`.js`));
        modcmd.forEach(command_file_name => {
            let mod_module = require(`../modcmd/${command_file_name}`);
            if(help_name == mod_module.name || mod_module.aliases.includes(help_name)){
                help_desc = mod_module.description
                aliases = mod_module.aliases.join(" ")
            }
        })

        const staffcmd = fs.readdirSync(`./staffcmd`).filter(file => file.endsWith(`.js`));
        staffcmd.forEach(command_file_name => {
            let staff_module = require(`../staffcmd/${command_file_name}`);
            if(help_name == staff_module.name || staff_module.aliases.includes(help_name)){
                help_desc = staff_module.description
                aliases = staff_module.aliases.join(" ")
            }
        })

        const capcmd = fs.readdirSync(`./capcmd`).filter(file => file.endsWith(`.js`));
        capcmd.forEach(command_file_name => {
            let cap_module = require(`../capcmd/${command_file_name}`);
            if(help_name == cap_module.name || cap_module.aliases.includes(help_name)){
                help_desc = cap_module.description
                aliases = cap_module.aliases.join(" ")
            }
        })

        const pubcmd = fs.readdirSync(`./commandpub`).filter(file => file.endsWith(`.js`));
        pubcmd.forEach(command_file_name => {
            let pub_module = require(`../commandpub/${command_file_name}`);
            if(help_name == pub_module.name || pub_module.aliases.includes(help_name)){
                help_desc = pub_module.description
                aliases = pub_module.aliases.join(", ")
            }
        })
        console.log(help_desc)

            if(help_desc){
                console.log(1)
                msg.channel.send({embeds:[{description: `**${help_name}** [${aliases}] 
                ${help_desc}` }]})
                
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

    const admcmd = fs.readdirSync(`./admcmd`).filter(file => file.endsWith(`.js`));
    help_commands.push({adm_cmd:{name: "Administração"}})
    admcmd.forEach(command_file_name => {
        let adm_module = require(`../admcmd/${command_file_name}`);
        help_commands[0].adm_cmd[adm_module.name] = {aliases: adm_module.aliases ? adm_module.aliases.join(" ") : null, description: adm_module.description ? adm_module.description: null}
    })
    
    const modcmd = fs.readdirSync(`./modcmd`).filter(file => file.endsWith(`.js`));
    help_commands.push({mod_cmd:{name: "Moderação"}})
    modcmd.forEach(command_file_name => {
        let mod_module = require(`../modcmd/${command_file_name}`);
        help_commands[1].mod_cmd[mod_module.name] = {aliases: mod_module.aliases ? mod_module.aliases.join(" ") : null, description: mod_module.description ? mod_module.description: null}
    })

    const staffcmd = fs.readdirSync(`./staffcmd`).filter(file => file.endsWith(`.js`));
    help_commands.push({staff_cmd:{name: "Staff"}})
    staffcmd.forEach(command_file_name => {
        let staff_module = require(`../staffcmd/${command_file_name}`);
        help_commands[2].staff_cmd[staff_module.name] = {aliases: staff_module.aliases ? staff_module.aliases.join(" ") : null, description: staff_module.description ? staff_module.description: null}
    })

    const capcmd = fs.readdirSync(`./capcmd`).filter(file => file.endsWith(`.js`));
    help_commands.push({cap_cmd:{name: "Capitães"}})
    capcmd.forEach(command_file_name => {
        let cap_module = require(`../capcmd/${command_file_name}`);
        help_commands[3].cap_cmd[cap_module.name] = {aliases: cap_module.aliases ? cap_module.aliases.join(" ") : null, description: cap_module.description ? cap_module.description: null}  
    })

    const pubcmd = fs.readdirSync(`./commandpub`).filter(file => file.endsWith(`.js`));
    help_commands.push({pub_cmd:{name: "Públicos"}})
    pubcmd.forEach(command_file_name => {
        let pub_module = require(`../commandpub/${command_file_name}`);
        help_commands[4].pub_cmd[pub_module.name] = {aliases: pub_module.aliases ? pub_module.aliases.join(" ") : null, description: pub_module.description ? pub_module.description: null}
    })
    let emb_description = ""
    for(const i of help_commands){

        for(const command_type in i){
            for(const command_name in i[command_type] ){
                if(typeof(i[command_type][command_name]) != typeof("")){
                    emb_description += `↳ ${command_name}: ${i[command_type][command_name].description}\n`

                }else{
                    emb_description += `**${i[command_type][command_name]}**\n`
                }
            }
        }
    }
    msg.channel.send({embeds:[{description: emb_description, color: config.color.blurple}]})
}