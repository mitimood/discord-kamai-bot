const { TrimMsg } = require("../../utils/auxiliarFunctions");

const {fetch} = require("cross-fetch");
const config = require("../../config");
const { EmbedBuilder, InteractionType } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const logger = require("../../utils/logger");


module.exports={
    data: new SlashCommandBuilder()
    .setName('placar')
    .setDescription('Exibe o placar de cada categoria')
    .addStringOption(option => option.setName('tipo').setDescription('Exibe o placar de cada categoria').setRequired(true)
                                .addChoices(
                                    {name:'kamaicoins', value:'money'},
                                    {name:'xp', value:'xp'},
                                    {name:'pontos-trofeu', value:'points'},
                                )
                                .setRequired(true)
                    )
    .addIntegerOption(opt=> opt.setName("paginas")
                                .setDescription("Quer acessar alguma pagina especifica? Manda ae")),
    name: "placar",
    aliases: ["lb", "ldb", "leaderboard"],
    description: "Exibe o placar do servidor, utilize com a continuação de xp ou money",

    async execute(msg) {
        try {
            let msgArgs = [];

            if(msg.type === InteractionType.ApplicationCommand){
                msgArgs[0] = "lb"
                msgArgs[1] = msg.options._hoistedOptions[0].value

                if (msg.options._hoistedOptions[1])msgArgs[2] = msg.options._hoistedOptions[1].value.toString()
            
            }else{
                msg.reply(msg.author.toString()+', use /placar')

            }

            if(msgArgs[1]?.toLowerCase() == "xp"){
                let page = 1
                if(msgArgs[2] && msgArgs[2].match(/[0-9]/)){
                    page = parseInt(msgArgs[2])
                }
                let membs = {}

                const emb = new EmbedBuilder()

                let desc = ""
                membs = await fetch(`https://kamaitachi-mitimood.vercel.app/api/leaderboard/xp/${--page}`).then(r=>r.json())
                
                for(const [i, user] of membs.entries()){
                    desc += `**${1 + i + page * 10}** => ${user.user.username} \`[ LVL ${user.xp.global.level} ]\`\n`
                }

                emb.setTitle("Tabela de xp")
                emb.setColor(config.color.blurple)
                emb.setDescription(desc)
                emb.setFooter({text:`Página ${page + 1}`})
                
                await msg.followUp({embeds:[emb]})
                

            }else if(msgArgs[1]?.toLowerCase() == "money"){
                
                let page = 1
                if(msgArgs[2] && msgArgs[2].match(/[0-9]/)){
                    page = parseInt(msgArgs[2])
                }

                let membs = {}

                membs = await fetch(`https://www.kamaitachi.com.br/api/leaderboard/money/${--page}`).then(r=>r.json())
                const emb = new EmbedBuilder()
                emb.setTitle("PLACAR DE MONEY")
                let desc = ""
                
                for(const [i, user] of membs.entries()){
                desc += `**${1 + i + page * 10}** => [<a:Coin:881915668499398686> **${user.economy.money}**] ${user.user.username}\n`
                }
                
                emb.setColor(config.color.blurple)
                emb.setDescription(desc)
                emb.setFooter({text:`Página ${page + 1}`})
                
                await msg.followUp({embeds:[emb]})

            }else if(msgArgs[1]?.toLowerCase() == "points"){
                let page = 1
                
                if(msgArgs[2] && msgArgs[2].match(/[0-9]/)){
                    page = parseInt(msgArgs[2])
                }

                let membs = {}

                membs = await fetch(`https://www.kamaitachi.com.br/api/leaderboard/points/${--page}`).then(r=>r.json())
                
                const emb = new EmbedBuilder()
                
                emb.setTitle("PLACAR DE TROFÉUS")
                
                let desc = ""
                
                for(const [i, user] of membs.entries()){
                desc += `**${1 + i + page * 10}** => [🏆 **${user.trophies.points}**] ${user.user.username}\n`
                }
                
                emb.setColor(config.color.blurple)
                emb.setDescription(desc)
                emb.setFooter({text:`Página ${page + 1}`})
                
                await msg.followUp({embeds:[emb]})

            }else{
                await msg.reply({content:"Escolha entre lb xp / lb money"})
            }
        } catch (error) {
            logger.error(error)
        }
        
    }
}
