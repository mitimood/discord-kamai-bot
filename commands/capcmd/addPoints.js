const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { changePoints } = require("../../mongodb");
const logger = require("../../utils/logger");


module.exports={
    data: new SlashCommandBuilder()
    .setName('adicionar-ponto')
    .setDescription('Adiciona pontos de troféu')
    .addUserOption(i=>i.setName("usuario")
                       .setDescription("O usuário que deseja adicionar pontos")
                       .setRequired(true))
    .addIntegerOption(i=>i.setDescription("insira a quantidade de pontos")
                          .setName("pontos")
                          .setRequired(true))
    .setDefaultPermission(false),
    name: "adicionar-ponto",
    aliases: ["adicionarponto"],
    description: "Adiciona pontos de troféu",

    async execute(msg) {
        try {
            const userId = msg.options._hoistedOptions[0].value

            const pointsAdd = msg.options._hoistedOptions[1].value

            await changePoints(userId, pointsAdd)

            await msg.followUp({embeds:[new MessageEmbed().setTitle(`🎉PONTOS ADICIONADOS🎈`)
                                                        .setDescription(`<@${userId}> recebeu ${pointsAdd} pontinhos ✨`)
                                                        .setColor("YELLOW")
                                        ]
                                })

        } catch (error) {
            logger.error(error)
        }
        
    
    }
}