const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageButton, MessageEmbed, MessageActionRow } = require("discord.js");
const config = require("../../config");
const { getAllActivityarte: mongoAllActivityarte, getAllActivityKaraoke:  mongoAllActivityKaraoke,
        getAllActivityPoems: mongoAllActivityPoems, getAllMemberManagement: mongoAllMemberManagement,
        deleteAllMemberManagement, deleteAllActivityKaraoke, deleteAllActivityarte, deleteAllActivityPoems, insertMemberManagement, insertKaraoke, insertPoems, insertArte} = require("../../mongodb");
const logger = require("../../utils/logger");



module.exports={
    data: new SlashCommandBuilder()
    .setName('transferir-conta')
    .setDescription('Exibe o placar de cada categoria')
    .addUserOption(u=>u.setName('usuario').setDescription('Usuário que deseja transferir sua conta').setRequired(true)),
    name: "transferir-conta",
    aliases: [],
    description: "Passa seus status ( cargos, pontos, kamaicoins... ) para outra pessoa do servidor.",
    
    async execute(msg) {
        try {
            let memberManda;
            let memberRecebe;
    
            if(msg.type === "APPLICATION_COMMAND"){
                const memberRecebeId = msg.options._hoistedOptions[0].value
                
                memberRecebe = msg.guild.members.cache.get(memberRecebeId)
                memberManda = msg.member
    
            }else{
                return await msg.followUp('Utilize esse comando com "/" antes')
            }
    
    
            if(memberRecebe.id === memberManda.id) return msg.followUp({content:'Você não pode transferir a sua conta para você mesmo bobinho'})
    
            let dataManda = {}
            let dataRecebe = {}
    
            function getAllActivityarte({idManda, idRecebe}){
                try {
                    Object.assign(dataManda, {arte: mongoAllActivityarte(idManda)})
                    Object.assign(dataRecebe, {arte: mongoAllActivityarte(idRecebe)})                
                } catch (error) {
                    logger.error(error)
                }
            }
    
            function getAllActivityKaraoke({idManda, idRecebe}){
                try {
                    Object.assign(dataManda, {karaoke: mongoAllActivityKaraoke(idManda)})
                    Object.assign(dataRecebe, {karaoke: mongoAllActivityKaraoke(idRecebe)})
                } catch (error) {
                    logger.error(error)
                }
            }
    
            function getAllActivityPoems({idManda, idRecebe}){
                try {
                    Object.assign(dataManda, {poem: mongoAllActivityPoems(idManda)})
                    Object.assign(dataRecebe, {poem: mongoAllActivityPoems(idRecebe)})
                } catch (error) {
                    logger.error(error)
                }
            }
    
            function getAllMemberManagement({idManda, idRecebe}){
                try {
                    Object.assign(dataManda, {member: mongoAllMemberManagement(idManda)})
                    Object.assign(dataRecebe, {member: mongoAllMemberManagement(idRecebe)})
                } catch (error) {
                    logger.error(error)
                }
            }
            
            var row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("transferir")
                    .setStyle("SUCCESS")
                    .setLabel("TRANSFERIR"),
                new MessageButton()
                    .setCustomId("cancelar")
                    .setStyle("DANGER")
                    .setLabel("CANCELAR")
            )
    
            const embMandaApv = new MessageEmbed()
            .setDescription(`Você tem certeza que deseja transferir a sua conta para ${memberRecebe.toString()}?\n\nIsso irá apagar **TODOS** os seus dados dessa conta (dentro do servidor kamaitachi) e moverá para a conta selecionada`)
            .setTitle('Aguardando aprovação de ' + memberManda.displayName)
            .setColor('AQUA')
    
            const mandaAprova = await msg.followUp({embeds:[embMandaApv], components:[row]})
            
            try {
                var filter = (i)=> i.member.id === memberManda.id
    
                const mandaComp = await mandaAprova.awaitMessageComponent({filter, time: 120_00})
    
                var rowCancel = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("transferir")
                        .setStyle("SUCCESS")
                        .setLabel("TRANSFERIR")
                        .setDisabled(true)
                        ,
                    new MessageButton()
                        .setCustomId("cancelar")
                        .setStyle("DANGER")
                        .setLabel("CANCELAR")
                        .setDisabled(true)
                )
    
                if(mandaComp.customId != 'transferir') return await mandaComp.reply({content:`Transferencia de ${memberManda.toString()} para ${memberRecebe.toString()} cancelada`})
                
                await mandaComp.reply({content:`Transferencia de ${memberManda.toString()} para ${memberRecebe.toString()} aprovada por ${memberManda.toString()}`})
                
                const embRecebeApv = new MessageEmbed()
                .setDescription(`${memberManda.toString()} quer transferir a conta dele para você ${memberRecebe.toString()}, isso incluira: cargos, pontos, kamaicoins...\n\nIsso irá apagar **TODOS** os seus dados dessa conta (dentro do servidor kamaitachi) e recebera os status da conta que esta transferindo`)
                .setTitle('Aguardando aprovação de ' + memberRecebe.displayName)
                .setColor('AQUA')
    
                
                const recebeAprova = await msg.followUp({embeds: [embRecebeApv], components:[row]})
    
                var filter = (i)=> i.member.id === memberRecebe.id
                const recebeComp = await recebeAprova.awaitMessageComponent({filter, time: 120_000})
    
                if(recebeComp.customId != 'transferir') return await recebeComp.reply({content:`Transferencia de ${memberManda.toString()} para ${memberRecebe.toString()} cancelada`})
                
                const embLoading = new MessageEmbed()
                    .setTitle('Iniciando transferencia!!')
                    .setImage('https://i.pinimg.com/originals/97/e9/42/97e942ce7fc4e9d4ea6d844a382f251f.gif')
                    .setColor('BLURPLE')
    
                await recebeComp.reply({embeds:[embLoading]})
    
                getAllMemberManagement({idManda: memberManda.id, idRecebe: memberRecebe.id})
                getAllActivityKaraoke({idManda: memberManda.id, idRecebe: memberRecebe.id})
                getAllActivityPoems({idManda: memberManda.id, idRecebe: memberRecebe.id})
                getAllActivityarte({idManda: memberManda.id, idRecebe: memberRecebe.id})
                
                const rolesManda = memberManda.roles.cache.filter(r=> ![config.roles.nitro, config.guild_id].includes(r.id) )
    
                const rolesRecebe = memberRecebe.roles.cache.filter(r=> ![config.roles.nitro, config.guild_id].includes(r.id) )
                            
                dataManda.member = await dataManda.member
                dataManda.karaoke = await dataManda.karaoke
                dataManda.poem = await dataManda.poem
                dataManda.arte = await dataManda.arte
    
    
                dataRecebe.member = await dataRecebe.member
                dataRecebe.karaoke = await dataRecebe.karaoke
                dataRecebe.poem = await dataRecebe.poem
                dataRecebe.arte = await dataRecebe.arte
                
    
                // delete from member receiving 
                if(dataRecebe?.member?._id){
                    await deleteAllMemberManagement(memberRecebe.id)
                }
    
                if(dataRecebe?.karaoke?._id){
                    await deleteAllActivityKaraoke(memberRecebe.id)
                }
    
                if(dataRecebe?.poem?._id){
                    await deleteAllActivityPoems(memberRecebe.id)
                }
    
                if(dataRecebe?.arte?._id){
                    await deleteAllActivityarte(memberRecebe.id)
                }
    
                
                // delete from member sending and insert on member receiving
                if(dataManda?.member?._id){
                    deleteAllMemberManagement(memberManda.id)
                    
                    dataManda.member._id = memberRecebe.id
                    
                    insertMemberManagement(dataManda.member)
                }
    
                if(dataManda?.karaoke?._id){
                    deleteAllActivityKaraoke(memberManda.id)
    
                    dataManda.karaoke._id = memberRecebe.id
    
                    insertKaraoke(dataManda.karaoke)
                }
    
                if(dataManda?.poem?._id){
                    deleteAllActivityPoems(memberManda.id)
    
                    dataManda.poem._id = memberRecebe.id
    
                    insertPoems(dataManda.poem)
                }
    
                if(dataManda?.arte?._id){
                    deleteAllActivityarte(memberManda.id)
    
                    dataManda.arte._id = memberRecebe.id
    
                    insertArte(dataManda.arte)
                }
    
                const enrolando = new Promise((res, rej)=>setTimeout(()=> res(true) ,7000))
                
                await enrolando
    
                await memberManda.roles.remove(rolesManda)
    
                await memberRecebe.roles.remove(rolesRecebe)
    
                await memberRecebe.roles.add(rolesManda)
    
                const embFinal = new MessageEmbed()
                .setTitle('Transferencia feita')
                .setImage('https://i.pinimg.com/originals/4f/22/82/4f2282d8bf56ede01b21bbe236fc23f2.gif')
                .setColor('GREEN')
    
                msg.followUp({embeds: [embFinal]})
    
            } catch (error) {
                
            }
        } catch (error) {
            logger.error(error)
        }
    }
}