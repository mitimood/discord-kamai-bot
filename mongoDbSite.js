const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://sitekamai:uIH6W2b8vJdlUJVS@cluster0.2gmdz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = class dbsite {
    constructor() {
    }

    addDaily (id, money, streak) {
        client.connect(async err => {
            const member_management = client.db("Site").collection("member_management");

            await member_management.updateOne( { "_id":id }, { "$inc":{ "economy.money":money }, "$set": {"economy.daily.streak": streak} }, {upsert:true} )
            client.close();
          });
    
    }
    


}

