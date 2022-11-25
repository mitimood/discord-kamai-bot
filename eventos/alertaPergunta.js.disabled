const schedule = require('node-schedule');
const config = require('../config');
const client = require('../utils/loader/discordClient');
const logger = require('../utils/logger');

let usersToSend = ["233744977258217473", "562749430223077398"]

const hoursToAlert = [10,15,20,22]

class RuleSp{
    constructor(hour){
        const rule = new schedule.RecurrenceRule()

       const keys = Object.keys(rule)

       keys.forEach(k=>{
        this[k] = rule[k]
       })

       this.tz = 'America/Sao_Paulo'
       this.minute = 0
       this.hour = hour
    }
}

let rules = hoursToAlert.map((h)=>new RuleSp(h))

rules.forEach(r=>schedule.scheduleJob(r, ()=>verificaPergunta(r.hour)))


async function verificaPergunta(hour){
    try {
        const pergunta = await client.channels.fetch(config.channels.pergunta)

        const options = {year: 'numeric', month: 'numeric', day: 'numeric'};

        const dLastPergunta = await (await pergunta.messages.fetch({limit:1}, {force:true})).first().createdAt.toLocaleString("en-US", {timeZone: "America/Sao_Paulo", ...options})
        
        const today = new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo", ...options})
    
        if(dLastPergunta == today) return
    
        let avisoEquipe = false
    
        if(hour === hoursToAlert[hoursToAlert.length-1]) avisoEquipe = true
    
        mandaAlerta(avisoEquipe)
    } catch (error) {
        logger.error(error)
    }

}


async function mandaAlerta(avisoEquipe){



    try {
        let usersToSendAux = []

        for (const user of usersToSend) {
            usersToSendAux.push(await client.users.fetch(user)) 
        }
    
        usersToSend = usersToSendAux
    
        for (const user of usersToSend) {
            await user.send("Esse é o aviso da pergunta do dia, ta na hora da perguntaaaaaa")
        }
    
        if(!avisoEquipe) return

        const staffChannel = await client.channels.fetch(config.channels.acacus)

        await staffChannel.send(`<@&${config.roles.staff.admin}>, ta sem pergunta caralhoo!! Pergunta como ta o papagaio deles`)

    } catch (error) {
        logger.error(error)
    }
}
