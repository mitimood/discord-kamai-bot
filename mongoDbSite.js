const { MongoClient } = require('mongodb');
const config_secret = require('./config_secret');
const uri = `mongodb+srv://sitekamai:${config_secret.mongo_passwordSite}@cluster0.2gmdz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const mongoClientSite = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


module.exports = {mongoClientSite ,addDaily}


    async function addDaily (id, money, streak) {
        try{
            
                const member_management = client.db("Site").collection("member_management");
    
                await member_management.updateOne( { "_id":id }, { "$inc":{ "economy.money":money }, "$set": {"economy.daily.streak": streak} }, {upsert:true} )
              
        }catch(err){
            console.log(err)
        }
    }

