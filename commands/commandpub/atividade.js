const { SlashCommandBuilder } = require("@discordjs/builders");
const { InteractionType } = require("discord.js");
const client = require("../../utils/loader/discordClient");
const logger = require("../../utils/logger");

module.exports={
    data: new SlashCommandBuilder()
    .setName('atividade')
    .setDescription('Inicia uma atividade/jogo')
    .addStringOption(option => option.setName('tipo').setDescription('Exibe o placar de cada categoria').setRequired(true)
                                .addChoices(
                                    {name: '▶ Youtube', value:'youtube'},
                                    {name: '♠ Poker', value:'poker'},
                                    {name: '♟ Xadrez', value:'chess'},
                                    {name: '🎮 Checkers', value:'checkers'},
                                    {name: '🎮 Betrayal', value:'betrayal'},
                                    {name: '🎮 Fishing', value:'fishing'},
                                    {name: '🎮 Lettertile', value:'lettertile'},
                                    {name: '🎮 Wordsnack', value:'wordsnack'},
                                    {name: '🎮 Spellcast', value:'spellcast'},
                                    {name: '🎮 Awkword', value:'awkword'},
                                    {name: '🎮 Puttparty', value:'puttparty'},
                                    {name: '🎮 Sketchheads', value:'sketchheads'},
                                    {name: '🎮 Ocho', value:'ocho'}
                                )
                                .setRequired(true)
    ),
    name: "atividade",
    aliases: [],
    description: "Inicia uma atividade/jogo",

    async execute(msg) {
        try {
            if(msg.type != InteractionType.ApplicationCommand) return

            if(!msg?.member?.voice?.channel) return await msg.followUp({content:`Você precisa estar em um canal de voz primeiro`})

            const atv = msg.options._hoistedOptions[0].value
    
            const invite = await client.discordTogether.createTogetherCode(msg.member.voice.channel.id, atv)

            return await msg.followUp({content:`${invite.code}`});

        } catch (error) {
            logger.error(error)
        }
    }
}