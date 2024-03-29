const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { changePoints } = require("../../mongodb");
const logger = require("../../utils/logger");
const config = require("../../config");


const caps = config.roles.teams.caps
const permissions = []

for (const key in caps) {
    if (Object.hasOwnProperty.call(caps, key)) {
        const element = caps[key];
        permissions.push({
            id: element,
            type: 'ROLE',
            permission: true,
        })
    }
}


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
    .setDefaultMemberPermissions(0),
    name: "remover-ponto",
    aliases: ["removerponto"],
    description: "Remove pontos de troféu",
    permissions: permissions,

    async execute(msg) {
        try {
            const userId = msg.options._hoistedOptions[0].value

            const pointsAdd = msg.options._hoistedOptions[1].value

            await changePoints(userId, -pointsAdd)

            await msg.followUp({embeds:[new EmbedBuilder().setTitle(`⛔PONTOS REMOVIDOS⛔`)
                                                        .setDescription(`<@${userId}> perdeu ${pointsAdd} pontinhos`)
                                                        .setColor(config.color.red)
                                        ]
                                })

        } catch (error) {
            logger.error(error)
        }
        
    
    }
}