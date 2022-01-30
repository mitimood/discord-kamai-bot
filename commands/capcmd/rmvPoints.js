const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { changePoints } = require("../../mongodb");
const logger = require("../../utils/logger");


module.exports={
    data: new SlashCommandBuilder()
    .setName('remover-ponto')
    .setDescription('Remove pontos de troféu')
    .addUserOption(i=>i.setName("usuario")
                       .setDescription("O usuário que deseja remover pontos")
                       .setRequired(true))
    .addIntegerOption(i=>i.setDescription("insira a quantidade de pontos")
                          .setName("pontos")
                          .setRequired(true))
    .setDefaultPermission(false),
    name: "remover-ponto",
    aliases: ["removerponto"],
    description: "Remove pontos de troféu",

    async execute(msg) {
        try {
            const userId = msg.options._hoistedOptions[0].value

            const pointsAdd = msg.options._hoistedOptions[1].value

            await changePoints(userId, -pointsAdd)

            await msg.followUp({embeds:[new MessageEmbed().setTitle(`⛔PONTOS REMOVIDOS⛔`)
                                                        .setDescription(`<@${userId}> perdeu ${pointsAdd} pontinhos`)
                                                        .setColor("RED")
                                        ]
                                })

        } catch (error) {
            logger.error(error)
        }
        
    
    }
}