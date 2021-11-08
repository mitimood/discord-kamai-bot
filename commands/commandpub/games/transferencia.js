const { SlashCommandBuilder } = require('@discordjs/builders');
const { TrimMsg } = require('../../../funções/funções');
const { moneyGet, moneyRemove, moneyAdd } = require('../../../mongodb');


module.exports={
    data: new SlashCommandBuilder()
		.setName('transferencia')
		.setDescription('Transfere kamaicoins')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Escolha a conta para transferir')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('quantidade')
        .setDescription('Escolha a quantidade de kamaicons para transferir')
        .setRequired(true)),
    name: "transferencia",
    aliases: ["transfer", "pay"],
    description: "Transfere seu dindin para outra pessoa",

    async execute(msg) {
      const interac = msg

      let userCmd = {}
      let userTransf = {}
      let moneyTransf = 0

      if (msg.type === "APPLICATION_COMMAND"){
        userCmd = interac.user
        userTransf = interac.options.getUser('usuario')
        moneyTransf = interac.options.getInteger('quantidade')

      }else{
        const msgArgs = TrimMsg(interac)
        userCmd = interac.author
        userTransf = msgArgs[1]
        moneyTransf = msgArgs[2]

        if(parseInt(moneyTransf)>0){
          moneyTransf = parseInt(moneyTransf)
        }else return interac.reply({content: "Quantidade invalida"})

        const {users} = await verificaArgsUser(userTransf, true)
        
        if(users.length) userTransf = users[0]
        else return interac.reply("Usuarios invalidos")
      }

      if(userCmd === userTransf) return interac.reply(`-Seu madruga, me vende um churros por favor?
      --Claro chavinho, foi para isso que te dei o dinheiro`)
  
      const userMoney = await moneyGet(userCmd.id)

      if(userMoney >= moneyTransf){
        await moneyRemove(userCmd.id, moneyTransf)
        await moneyAdd(userTransf.id, moneyTransf)

        interac.reply({content:`Você transferiu <:Coin_kamai:881917666829414430> ${moneyTransf}, para ${userTransf.toString()} `})
      }else{
          interac.reply({content:`Você não tem kamaicoins suficientes, faltam <:Coin_kamai:881917666829414430> ${ userMoney - moneyTransf}`})
      }
    
      async function verificaArgsUser(msgArgs, dontVerifyRole = false){
        let members = []
        let invalids = []
        let users = []
            arg = msgArgs
            arg = arg.replace(/\<|\>|\@|\!|\&/g, "")

            if(arg.match(/^[0-9]+$/) && toString(Date.now().valueOf()) >= arg){
              try {
                let user = await interac.client.users.fetch(arg)
                try {
                    let memb = await interac.guild.members.fetch(arg)
                    if(memb.roles.highest.position < interac.member.roles.highest.position || dontVerifyRole){
                        members.push(memb)
                        users.push(memb.user)
                    }else{
                        invalids.push(memb.user)
                    }

                } catch (error) {
                    users.push(user)
                }
              } catch (error) {
                invalids.push(arg)
              }  
            }else{
                invalids.push(arg)
            }
        
        return({users, members, invalids})
      }
    }
}

