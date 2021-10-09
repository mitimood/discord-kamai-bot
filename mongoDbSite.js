
const { MongoClient } = require('mongodb');
const config_secret = require('./config_secret');
const uri = `mongodb+srv://sitekamai:${config_secret.mongo_passwordSite}@cluster0.2gmdz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const mongoClientSite = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


module.exports = {mongoClientSite ,addDaily, addEvent, listEvent, removeEvent}


    async function addDaily (id, money, streak) {
        try{
            
                const member_management = mongoClientSite.db("Site").collection("member_management");
    
                await member_management.updateOne( { "_id":id }, { "$inc":{ "economy.money":money }, "$set": {"economy.daily.streak": streak} }, {upsert:true} )
              
        }catch(err){
            console.log(err)
        }
    }

    async function addEvent ( name , dateSnowflake , imageUrl ){
        try {
            const eventManagement = mongoClientSite.db("Site").collection("eventManagement");

            await eventManagement.updateOne({ "_id": 0 }, { "$inc": { "lastEventId": 1 } }, { "upsert": true })
            const doc = await eventManagement.findOne({ "_id": 0 })
            
            await eventManagement.insertOne( {"_id": doc.lastEventId, dateSnowflake: dateSnowflake, imageUrl: imageUrl, name: name} )
        
        } catch (error) {
            console.log(error)    
        }
        
    }

    async function listEvent() {
        try {
            const eventManagement = mongoClientSite.db("Site").collection("eventManagement");
            const events = await eventManagement.find().toArray()
            events.shift()
            return events
        } catch (error) {
            
        }
    }

    async function removeEvent(id){
        try{
            id = parseInt(id)
            const eventManagement = mongoClientSite.db("Site").collection("eventManagement");
            const doc = await eventManagement.findOne({"_id":id})
            await eventManagement.deleteOne({"_id":id})

            return doc
        }catch(error){
            console.log(error)
        }
    }

