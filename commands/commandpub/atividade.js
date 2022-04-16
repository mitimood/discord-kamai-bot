const { SlashCommandBuilder } = require("@discordjs/builders");
const client = require("../../utils/loader/discordClient");
const logger = require("../../utils/logger");

module.exports={
    data: new SlashCommandBuilder()
    .setName('atividade')
    .setDescription('Inicia uma atividade/jogo')
    .addStringOption(option => option.setName('tipo').setDescription('Exibe o placar de cada categoria').setRequired(true)
                                .addChoices([
                                            ['▶youtube', 'youtube'],
                                            ['♠poker', 'poker'],
                                            ['♟chess', 'chess'],
                                            ['checkers', 'checkers'],
                                            ['betrayal', 'betrayal'],
                                            ['fishing', 'fishing'],
                                            ['lettertile', 'lettertile'],
                                            ['wordsnack', 'wordsnack'],
                                            ['spellcast', 'spellcast'],
                                            ['awkword', 'awkword'],
                                            ['puttparty', 'puttparty'],
                                            ['sketchheads', 'sketchheads'],
                                            ['ocho', 'ocho'],
                                            ])
                                .setRequired(true)
    ),
    name: "atividade",
    aliases: [],
    description: "Inicia uma atividade/jogo",

    async execute(msg) {
        try {
            if(msg.type != "APPLICATION_COMMAND") return

            if(!msg?.member?.voice?.channel) return await msg.followUp({content:`Você precisa estar em um canal de voz primeiro`})

            const atv = msg.options._hoistedOptions[0].value
    
            const invite = await client.discordTogether.createTogetherCode(msg.member.voice.channel.id, atv)

            return await msg.followUp({content:`${invite.code}`});

        } catch (error) {
            logger.error(error)
        }
    }
}