const { Discord } = require("../..");
const { TrimMsg } = require("../../funções/funções");
const { add_chat_xp, add_voice_xp } = require("../../mongodb");

module.exports={
    name: "convert",
    aliases: ["cv", "cvt", "converter"],
    description: "Converter o xp antigo para o novo",

    async execute(msg) {
        let cargos = new Set()

        const idFofo = msg.author.id
        let xp = 0

        if(msg.member.roles.cache.has("817542947418800148")){
            await add_voice_xp([idFofo], 18250)
            xp += 18250

        }else if(msg.member.roles.cache.has("817539471607070720")){
            await add_voice_xp([idFofo], 4645)
            xp += 4645

        }else if(msg.member.roles.cache.has("817539465597550633")){
            await add_voice_xp([idFofo], 790)
            xp += 790

        }else if(msg.member.roles.cache.has("817539238278725663")){
            await add_voice_xp([idFofo], 500)
            xp += 500

        }

        if(msg.member.roles.cache.has("612132316646604800")){
            await add_chat_xp(idFofo, 18250)
            xp += 18250

        }else if(msg.member.roles.cache.has("612132315493171210")){
            await add_chat_xp(idFofo, 6200)
            xp += 6200

        }else if(msg.member.roles.cache.has("612119287771168799")){
            await add_chat_xp(idFofo, 687)
            xp += 687

        }else if(msg.member.roles.cache.has("848359768786599956")){
            await add_chat_xp(idFofo, 200)
            xp += 200
        }

        if (msg.member.roles.cache.has("817542947418800148")) cargos.add("817542947418800148")
        if (msg.member.roles.cache.has("817539471607070720")) cargos.add("817539471607070720")
        if (msg.member.roles.cache.has("817539465597550633")) cargos.add("817539465597550633")
        if (msg.member.roles.cache.has("817539238278725663")) cargos.add("817539238278725663")
    
        if (msg.member.roles.cache.has("612132316646604800")) cargos.add("612132316646604800")
        if (msg.member.roles.cache.has("612132315493171210")) cargos.add("612132315493171210")
        if (msg.member.roles.cache.has("612119287771168799")) cargos.add("612119287771168799")
        if (msg.member.roles.cache.has("848359768786599956")) cargos.add("848359768786599956")
        let roles = []
        for(const cargo of cargos.keys()){
            roles.push(cargo)
        }
    
        if(roles){
            msg.member.roles.remove(roles)
        }
        if(xp){
            msg.channel.send(`Você ganhou **${xp}** de xp! User \`&info\` para verificar`)
        }else{
            msg.channel.send(`Você não tem nada para trocar comigo`)
        }
    }
}
