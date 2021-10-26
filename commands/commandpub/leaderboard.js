const { TrimMsg } = require("../../funções/funções");

const {fetch} = require("cross-fetch");
const config = require("../../config");
const { MessageEmbed } = require("discord.js");


module.exports={
    name: " ",
    aliases: ["lb", "ldb"],
    description: "Exibe o placar do servidor",

    async execute(msg) {
        
        const msgArgs = TrimMsg(msg)
        if(msgArgs[1].toLowerCase() == "xp"){
            let page = 0
            if(msgArgs[2] && msgArgs[2].match(/[0-9]/)){
                page = parseInt(msgArgs[2]) + 1
            }
            let membs = {}
            try {
                const emb = new MessageEmbed()

                let desc = ""
                membs = await fetch(`https://www.kamaitachi.com.br/api/leaderboard/xp/${page}`).then(r=>r.json())
                for(const [i, user] of membs.entries()){
                    desc += `**${1 + i + page * 10}** => ${user.user.username} \`[ LVL ${user.xp.global.level} ]\`\n`
                 }
                 emb.setTitle("Tabela de xp")
                 emb.setColor(config.color.blurple)
                 emb.setDescription(desc)
                 emb.setFooter(`Página ${page}`)
                 msg.channel.send({content:msg.author.toString(), embeds:[emb]})
            } catch (error) {
                console.log(error)
            }


        }else if(msgArgs[1].toLowerCase() == "money"){
            
            let page = 0
            if(msgArgs[2] && msgArgs[2].match(/[0-9]/)){
                page = parseInt(msgArgs[2]) + 1
            }

            let membs = {}

            try {
                membs = await fetch(`https://www.kamaitachi.com.br/api/leaderboard/money/${page}`).then(r=>r.json())
                const emb = new MessageEmbed()
                emb.setTitle("Tabela de xp")
                emb.setTitle("PLACAR DE MONEY")
                let desc = ""
                
                for(const [i, user] of membs.entries()){
                   desc += `**${1 + i + page * 10}** => [<a:Coin:881915668499398686> **${user.economy.money}**] ${user.user.username}\n`
                }
                emb.setColor(config.color.blurple)
                emb.setDescription(desc)
                emb.setFooter(`Página ${page}`)
                msg.channel.send({content:msg.author.toString(), embeds:[emb]})
            } catch (error) {
                console.log(error)

            }

        }else{
            msg.reply({content:"Escolha entre lb xp / lb money"})
        }
    }
}
