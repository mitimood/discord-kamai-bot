const config = require("../../config");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {fetch} = require('cross-fetch')
const {MessageEmbed} = require('discord.js');
const logger = require("../../utils/logger");

module.exports={
    data: new SlashCommandBuilder()
    .setName('play-select')
    .setDescription('Pula para a música selecionada')
    .addIntegerOption(o=>o.setName('numero-da-musica').setDescription('Digite a posição da música na playlist para tocar ela direto, sem passar pela fila inteira🎼').setRequired(true)),
    name: "play-select",
    aliases: [],
    description: "Pula para a música selecionada",

    async execute(msg) {
        try {

            let musId;

            if(msg.type === "APPLICATION_COMMAND"){
                musId = msg.options._hoistedOptions[0].value

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

        const res = await mandaGerenteBot({botId:botId, action: 'PLAYSELECT', musId:musId})
        
        const emb = new MessageEmbed()

        if(res.status){
            emb
            .setThumbnail(res.bot.avatar)
            .setDescription(`Furei a fila 😎`)
            .setTitle('▶ ' + res.nowPlaying.original_title)
            .setColor('GREEN')
            .setFooter({'iconURL': res.bot.avatar ,text:res.bot.username})

        }else{
            emb
            .setThumbnail(res.bot.avatar)
            .setDescription(`'Não achei nenhuma música nessa posição :/'`)
            .setTitle('▶ ' + res.nowPlaying.original_title)
            .setColor('RED')
            .setFooter({'iconURL': res.bot.avatar ,text:res.bot.username})
        }
        
        await msg.followUp({embeds:[emb]})
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