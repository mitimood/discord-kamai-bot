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
    .setName('adicionar-ponto')
    .setDescription('Adiciona pontos de troféu')
    .addUserOption(i=>i.setName("usuario")
                       .setDescription("O usuário que deseja adicionar pontos")
                       .setRequired(true))
    .addIntegerOption(i=>i.setDescription("insira a quantidade de pontos")
                          .setName("pontos")
                          .setRequired(true))
    .addUserOption(i=>i.setName("eligo")
                          .setDescription("O eligo que aplicou"))
    .setDefaultMemberPermissions(0),
    name: "adicionar-ponto",
    aliases: ["adicionarponto"],
    description: "Adiciona pontos de troféu",
    permissions: permissions,

    async execute(msg) {
        try {
            const userId = msg.options._hoistedOptions[0].value

            const pointsAdd = msg.options._hoistedOptions[1].value

            const eligo = msg.options?._hoistedOptions[2]?.value

            await changePoints(userId, pointsAdd)

            await msg.followUp({embeds:[new EmbedBuilder().setTitle(`🎉PONTOS ADICIONADOS🎈`)
                                                        .setDescription(`<@${userId}> recebeu ${pointsAdd} pontinhos ${ eligo ? `,dado por <@${eligo}>` : ""}✨`)
                                                        .setColor(config.color.yellow)
                                        ]
                                })

        } catch (error) {
            logger.error(error)
        }
        
    
    }
}