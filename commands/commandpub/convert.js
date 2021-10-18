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

        if(msg.member.roles.cache.has("834172082396332101")){
            await add_voice_xp([idFofo], 18250)
            xp += 18250

        }else if(msg.member.roles.cache.has("834172082396332100")){
            await add_voice_xp([idFofo], 4645)
            xp += 4645

        }else if(msg.member.roles.cache.has("834172082396332099")){
            await add_voice_xp([idFofo], 790)
            xp += 790

        }else if(msg.member.roles.cache.has("834172082396332098")){
            await add_voice_xp([idFofo], 500)
            xp += 500

        }

        if(msg.member.roles.cache.has("834172082396332096")){
            await add_chat_xp(idFofo, 18250)
            xp += 18250

        }else if(msg.member.roles.cache.has("834172082396332095")){
            await add_chat_xp(idFofo, 6200)
            xp += 6200

        }else if(msg.member.roles.cache.has("834172082396332094")){
            await add_chat_xp(idFofo, 687)
            xp += 687

        }else if(msg.member.roles.cache.has("899758685260230709")){
            await add_chat_xp(idFofo, 200)
            xp += 200
        }

        if (msg.member.roles.cache.has("834172082396332101")) cargos.add("834172082396332101")
        if (msg.member.roles.cache.has("834172082396332100")) cargos.add("834172082396332100")
        if (msg.member.roles.cache.has("834172082396332099")) roles.add("834172082396332099")
        if (msg.member.roles.cache.has("834172082396332098")) cargos.add("834172082396332098")
    
        if (msg.member.roles.cache.has("834172082396332096")) cargos.add("834172082396332096")
        if (msg.member.roles.cache.has("834172082396332095")) cargos.add("834172082396332095")
        if (msg.member.roles.cache.has("834172082396332094")) cargos.add("834172082396332094")
        if (msg.member.roles.cache.has("899758685260230709")) cargos.add("899758685260230709")
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
