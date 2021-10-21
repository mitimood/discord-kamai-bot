
const { client } = require("..");
const { add_chat_xp, add_voice_xp, get_xp } = require("../mongodb");

client.on("interactionCreate", async (interac)=>{
    if(!interac.isButton()) return
    if(interac.customId == "Conversor-de-xp"){
        let cargos = new Set()

        const idFofo = interac.user.id
        let xp = 0

        if(interac.member.roles.cache.has("817542947418800148")){
            await add_voice_xp([idFofo], 18250)
            xp += 18250

        }else if(interac.member.roles.cache.has("817539471607070720")){
            await add_voice_xp([idFofo], 4645)
            xp += 4645

        }else if(interac.member.roles.cache.has("817539465597550633")){
            await add_voice_xp([idFofo], 790)
            xp += 790

        }else if(interac.member.roles.cache.has("817539238278725663")){
            await add_voice_xp([idFofo], 500)
            xp += 500

        }

        if(interac.member.roles.cache.has("612132316646604800")){
            await add_chat_xp(idFofo, 18250)
            xp += 18250

        }else if(interac.member.roles.cache.has("612132315493171210")){
            await add_chat_xp(idFofo, 6200)
            xp += 6200

        }else if(interac.member.roles.cache.has("612119287771168799")){
            await add_chat_xp(idFofo, 687)
            xp += 687

        }else if(interac.member.roles.cache.has("848359768786599956")){
            await add_chat_xp(idFofo, 200)
            xp += 200
        }

        if (interac.member.roles.cache.has("817542947418800148")) cargos.add("817542947418800148")
        if (interac.member.roles.cache.has("817539471607070720")) cargos.add("817539471607070720")
        if (interac.member.roles.cache.has("817539465597550633")) cargos.add("817539465597550633")
        if (interac.member.roles.cache.has("817539238278725663")) cargos.add("817539238278725663")
    
        if (interac.member.roles.cache.has("612132316646604800")) cargos.add("612132316646604800")
        if (interac.member.roles.cache.has("612132315493171210")) cargos.add("612132315493171210")
        if (interac.member.roles.cache.has("612119287771168799")) cargos.add("612119287771168799")
        if (interac.member.roles.cache.has("848359768786599956")) cargos.add("848359768786599956")
        let roles = []
        for(const cargo of cargos.keys()){
            roles.push(cargo)
        }
    
        if(roles){
            interac.member.roles.remove(roles)
        }
        if(xp){
            let xpDb = {}

            try {
                xpDb = await get_xp(idFofo)
                await interac.reply({ephemeral:true, content: `${interac.user.toString()} Você ganhou **${xp}** de xp! Seu novo level global agora é **${xpDb.global.level}**. **O cargo do seu perfil ira se atualizar aos poucos**`})
            } catch (error) {
                console.log(error)
                interac.reply({ephemeral:true, content: `${interac.user.toString()} Você ganhou **${xp}** de xp! **Seus cargos serão atualizados aos poucos**`})

            }
        }else{
            interac.reply({ephemeral:true, content:`${interac.user.toString()} Você não tem cargos para converter!`})
        }
    }   
})
