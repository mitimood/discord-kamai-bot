const schedule = require('node-schedule');

const config_secret = require("../config_secret")
const uri = `mongodb+srv://kamaibot:${config_secret.mongo_password}@cluster0.ysdvr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const { MongoClient } = require("mongodb");
const MongodbClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Replace the uri string with your MongoDB deployment's connection string.

const job = schedule.scheduleJob('* 4 * * *', async function(){
const nodejsondb = require("node-json-db").JsonDB;



try{
  console.log("Backup iniciado")
  await MongodbClient.connect()

  const database = MongodbClient.db('kamaibot');
  const members_adm = database.collection('member_management');
  const members_admb = new nodejsondb(`./mongo_backup/members_adm`, true, true);
  
  const activitypoems = database.collection('activitypoems');
  const activitypoemsb = new nodejsondb(`./mongo_backup/activitypoems`, true, true);
  
  const activitykaraoke = database.collection('activitykaraoke');
  const activitykaraokeb = new nodejsondb(`./mongo_backup/activitykaraoke`, true, true);
  
  const activityarte = database.collection('activityarte');
  const activityarteb = new nodejsondb(`./mongo_backup/activityarte`, true, true);
  

  members_adm.find().forEach(doc=>{
    members_admb.push(`/${doc["_id"]}/`, doc, true)

  })

  activitypoems.find().forEach(doc=>{
    activitypoemsb.push(`/${doc["_id"]}/`, doc, true)

  })

  activitykaraoke.find().forEach(doc=>{
    activitykaraokeb.push(`/${doc["_id"]}/`, doc, true)

  })

  activityarte.find().forEach(doc=>{
    activityarteb.push(`/${doc["_id"]}/`, doc, true)

  })
  console.log("Backup Terminado com sucesso!")
}catch(err){
  console.log("Ouve um erro no backup")
    console.log(err)
}finally{
}
    }
);