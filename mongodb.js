const config = require("./config")
const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb+srv://kamaibot:${config.mongo_password}@cluster0.ysdvr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
module.exports={client,SetTempMute, SetUnmute, CheckMute }

async function SetTempMute(id,since, duration) {
  try {              
    const database = client.db('kamaibot');
    const members_adm = database.collection('member_management');
    let config = {"upsert":true}
    let insert = {"$set":{"_id":id,"muted":true,"duration":duration,"since":since}}
    let query = {"_id":id}
    await members_adm.updateOne(query, insert, config);
 
  } finally {
    // Ensures that the client will close when you finish/error
  }
}

async function SetUnmute(id) {
    try {              
      const database = client.db('kamaibot');
      const members_adm = database.collection('member_management');
      let config = {"upsert":true}
      let insert = {"$set":{"_id":id,"muted":false,"duration":null,"since":null}}
      let query = {"_id":id}
      await members_adm.updateOne(query, insert, config);
   
    } finally {
      // Ensures that the client will close when you finish/error
    }
  }

  async function CheckMute(id) {
    try {
        const database = client.db('kamaibot');
        const members_adm = database.collection('member_management');
        let query = {"_id":id}
        let doc = await members_adm.findOne(query);
        if(doc && doc.muted) return true
        else return false 
    } finally {
      // Ensures that the client will close when you finish/error
    }
  }