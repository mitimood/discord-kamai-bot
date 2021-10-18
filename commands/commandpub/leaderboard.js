const { Discord } = require("../..");
const { TrimMsg } = require("../../funções/funções");

const fetch = require("cross-fetch");
const { Message, BaseMessageComponent, MessageManager, MessageCollector, MessageEmbed } = require("discord.js");
const config = require("../../config");

let loaded = false

let xpRaw 
let moneyRaw

function load (){

        if(!loaded){
            
            xpRaw =  fetch("https://kamaitachi.com.br/api/leaderboard/xp").then(r=>r.json())
            moneyRaw =  fetch("https://kamaitachi.com.br/api/leaderboard/money").then(r=>r.json())
            loaded = true
            setInterval(async()=>{
                xpRaw = await fetch("https://kamaitachi.com.br/api/leaderboard/xp").then(r=>r.json())
                moneyRaw = await fetch("https://kamaitachi.com.br/api/leaderboard/money").then(r=>r.json())
            },300000)
        }
    }
    



module.exports={
    name: "leaderboard",
    aliases: ["lb", "ldb"],
    description: "Exibe o placar do servidor",

    async execute(msg) {
        
        const msgArgs = TrimMsg(msg)
        load()

        if(msgArgs[1] == "xp"){

            const pages = divPages(await xpRaw)
            let page
            if(msgArgs[2] && msgArgs[2].match(/[0-9]/)){
                if(parseInt(msgArgs[2]) + 1 <= pages.length){
                    page = parseInt(msgArgs[2])
                }else{
                    page = pages.length - 1
                }
            }else{
                page = 0
            }
            const emb = new MessageEmbed()
            emb.setTitle("PLACAR DE XP")
            let desc = ""

            for(const [i, user] of pages[page].entries()){
               desc += `**${1 + i + page * 10}** => ${user.user.username} \`[ LVL ${user.xp.global.level} ]\`\n`
            }
            emb.setColor(config.color.blurple)
            emb.setDescription(desc)
            emb.setFooter(`Página ${page} de ${-1+pages.length}`)
            msg.channel.send({content:msg.author.toString(), embeds:[emb]})
        }
        if(msgArgs[1] == "money"){

            const pages = divPages(await moneyRaw)
            let page
            if(msgArgs[2] && msgArgs[2].match(/[0-9]/)){
                if(parseInt(msgArgs[2]) + 1 <= pages.length){
                    page = parseInt(msgArgs[2])
                }else{
                    page = pages.length - 1
                }
            }else{
                page = 0
            }
            const emb = new MessageEmbed()
            emb.setTitle("PLACAR DE MONEY")
            let desc = ""

            for(const [i, user] of pages[page].entries()){
               desc += `**${1 + i + page * 10}** => [<a:Coin:881915668499398686> **${user.economy.money}**] ${user.user.username}\n`
            }
            emb.setColor(config.color.blurple)
            emb.setDescription(desc)
            emb.setFooter(`Página ${page} de ${-1+pages.length}`)
            msg.channel.send({content:msg.author.toString(), embeds:[emb]})
        }
    }
}

function divPages(ldbRaw){
    
    let page = []
    let leaderboard = []
    for(const [ i, entry ] of ldbRaw.entries()){


        if(page.length < 10){
            if(entry.user){
                page.push(entry)
            }
        }else if( page.length == 10){
            leaderboard.push(page)
            page = []
        }

        if( i+1 == ldbRaw.length){
            leaderboard.push(page)
        }
    }

    

    return leaderboard
}