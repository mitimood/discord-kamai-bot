const config = require("../../config");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {fetch} = require('cross-fetch')
const {MessageEmbed} = require('discord.js');
const logger = require("../../utils/logger");

module.exports={
    data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Bota sua música em loop')
    .addStringOption((o)=>o.setName('modo').setDescription('Define o modo do loop').setRequired(true)
                        .addChoices([['playlist','playlist'],['musica', 'song'], ['desabilitar', 'disable']])),
    name: "loop",
    aliases: [],
    description: "Bota sua música em loop",
    async execute(msg) {
        try {
            let loop;

            if(msg.type === "APPLICATION_COMMAND"){
                loop = msg.options._hoistedOptions[0].value
    
            }else{
                return await msg.followUp('Utilize esse comando com "/" antes')
            }
            let botId
    
            try {
                botId = getBotId(msg)
    
            } catch (error) {
                if(error == 'not in voice'){
                    return await msg.followUp({content: 'Nenhum bot no seu canal'})
    
                }else{
                    return await msg.followUp({content: 'Erro ao chamar bot'})
                }
            }

            const res = await mandaGerenteBot({botId:botId, loop: loop ,action: 'LOOP'})
    
            await msg.followUp({content: `${loop=='song'? 'A mesma música de novo de novo de novo de novo de novo' : (loop=='playlist'? 'Vai escutar essa playlist de novo? Ai ta bom, ta ai o replay ↩':( loop=='disable' ? 'Loop desabilitado' : ' Error'))}`})
        
        } catch (error) {
            logger.error(error)
        }
    }
}


function getBotId(msg){
    const bots = Object.values(config.music.bots)

    let botId = msg?.member?.voice?.channel?.members?.find((v,k)=> bots?.find(id=> k==id))?.id
        
    if(!botId)  throw 'not in voice'

    return botId
}

async function mandaGerenteBot(obj){
    try {
        return await fetch('http://localhost:4205', {body:JSON.stringify(obj),'method': 'POST'}).then(r=>r.json())

    } catch (error) {
        logger.error(error)
    }
}