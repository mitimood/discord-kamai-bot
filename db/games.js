const config = require("../config")
const config_secret = require("../config_secret")
const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb+srv://kamaibot:${config_secret.mongo_password}@cluster0.ysdvr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const MongodbClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



module.exports = class db {
    constructor() {
        this.memberManagament = MongodbClient.db(config.mongo.db_geral).collection("member_management"),
        this.reports = MongodbClient.db(config.mongo.db_geral).collection("reports")
    }

    async legal(){
        try {
            await MongodbClient.connect()


            
        } catch (error) {
            console.log(error)

        }finally{
            MongodbClient.close()
        }

    }

    async daily_set(id){
        try{
            await MongodbClient.connect()

          
            let dailyDoc =  await this.memberManagament.findOne( { "_id":id } )
            
            if ( dailyDoc?.economy?.daily?.last + 172800000 >= Date.now().valueOf() && dailyDoc?.economy?.daily?.last + 86400000 <= Date.now().valueOf() ){
                
                let streak = 1 + dailyDoc.economy.daily.streak
                let money = parseInt( Math.log10(streak) * config.rewards.daily ) + config.rewards.daily
                let newStreak = 1 
                
                await this.memberManagament.updateOne( { "_id":id }, { "$setOnInsert":{ "_id":id }, "$set":{ "economy.daily.last": Date.now().valueOf() },"$inc":{ "economy.money":money, "economy.daily.streak": newStreak } }, { upsert: true } )
        
                return { money: money, streak: streak}
            
            } else{
                
                let money = config.rewards.daily
                let streak = 1
                
                await this.memberManagament.updateOne( { "_id":id }, { "$setOnInsert":{ "_id":id }, "$set":{ "economy.daily": { "last" : Date.now().valueOf(),  streak: streak } }, "$inc":{ "economy.money":money } }, { upsert: true } )
        
                return { money: money, streak: streak }
        
            }
      
        }catch(err){
            console.log(err)
        }finally{
            MongodbClient.close()
        }
        
      }
      
      async daily_get(id){
        
        try{
            await MongodbClient.connect()

            
            let dailyDoc = await this.memberManagament.findOne( { "_id":id } )
            
            if ( dailyDoc?.economy?.daily?.last ){
                return dailyDoc.economy.daily.last
        
            }else{
                return null 
        
            }
        }catch(err){
            console.log(err)
      
        }finally{
            MongodbClient.close()
        }
      
      }
      
      
      async moneyAdd(id, money){
        try{
            await MongodbClient.connect()

      
            await this.memberManagament.updateOne( { "_id":id }, { "$setOnInsert": { "_id":id }, "$inc":{ "economy.money":money } }, { upsert: true } )
            await databaseSite.siteMoneyAdd(id, money)
        }catch(err){
          console.log(err)
        }finally{
            MongodbClient.close()

        }
      
      }
      
      async moneyRemove(id, money){
        try{
            await MongodbClient.connect()

      
            await this.memberManagament.updateOne({"_id":id}, { "$inc": { "economy.money": -money } } )
      
        }catch(err){
            console.log(err)
        }finally{
            MongodbClient.close()
        }
      }
      
      async moneyGet(id){
        try{
            await MongodbClient.connect()

            const moneyDoc = await this.memberManagament.findOne( { "_id": id } )
            return moneyDoc?.economy?.money
        }catch(err){
          console.log(err)
        }finally{
            MongodbClient.close()
        }
      }
      
}
