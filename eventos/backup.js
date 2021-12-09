const schedule = require('node-schedule');
require('dotenv').config();
const uri = `mongodb+srv://kamaibot:${process.env.mongo_password}@cluster0.ysdvr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const { MongoClient } = require("mongodb");
const fs = require('fs');

const MongodbClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Replace the uri string with your MongoDB deployment's connection string.

const job = schedule.scheduleJob('0 3 * * *', async function(){
  const nodejsondb = require("node-json-db").JsonDB;
    try{
      console.log("Backup iniciado " + new Date() )
      await MongodbClient.connect()

      const database = MongodbClient.db('kamaibot');
      const members_adm = database.collection('member_management');
      const members_admb = new nodejsondb(`./mongo_backup/members_adm`, false, true);
      
      const activitypoems = database.collection('activitypoems');
      const activitypoemsb = new nodejsondb(`./mongo_backup/activitypoems`, false, true);
      
      const activitykaraoke = database.collection('activitykaraoke');
      const activitykaraokeb = new nodejsondb(`./mongo_backup/activitykaraoke`, false, true);
      
      const activityarte = database.collection('activityarte');
      const activityarteb = new nodejsondb(`./mongo_backup/activityarte`, false, true);
      

      const arrayMember = await members_adm.find().toArray()
      const arrayPoems = await activitypoems.find().toArray()
      const arrayKaraoke = await activitykaraoke.find().toArray()
      const arrayArte = await activityarte.find().toArray()

      console.log("Download concluido MONGODB CONCLUIDO")
      console.log("Salvando...")

      members_admb.resetData()
      arrayMember.forEach(doc=>{
        members_admb.push(`/${doc["_id"]}/`, doc, true)

      })
      members_admb.save()
      

      activitypoemsb.resetData()
      arrayPoems.forEach(doc=>{
        activitypoemsb.push(`/${doc["_id"]}/`, doc, true)

      })
      activitypoemsb.save()

      activitykaraokeb.resetData()
      arrayKaraoke.forEach(doc=>{
        activitykaraokeb.push(`/${doc["_id"]}/`, doc, true)

      })
      activitykaraokeb.save()

      activityarteb.resetData()
      arrayArte.forEach(doc=>{
        activityarteb.push(`/${doc["_id"]}/`, doc, true)

      })
      activityarteb.save()

      console.log("Começando a zippar")
      
      const path = require('path')

      const zipper = require('adm-zip');
      const zip = new zipper()
      
      fs.readdirSync(`./`).filter(file => {
        if( ".git" != file && ".gitattributes"  != file && "node_modules" != file && "LICENSE" != file && "Dockerfile" != file && "docker-compose.yml" != file && "resourceRegistry.log" != file){
            if( fs.statSync(path.resolve(__dirname, `../${file}`)).isFile() ){
              zip.addLocalFile(path.resolve(__dirname, `../${file}`))
            
            }else{
              zip.addLocalFolder(path.resolve(__dirname, `../${file}`), `${file}/`)
      
            }
        }
      });
      zip.writeZip(path.resolve(__dirname, `../backup.zip`))
      
      console.log("Arquivos zipados com sucesso")

      var nodemailer = require('nodemailer'); 
      console.log(process.env.emailUser)
      console.log(process.env.emailPassword)
      const mail = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.emailUser,
            pass: process.env.emailPassword
          }
      });


      var Transfer = require('transfer-sh')
    
      /* Encrypt and Upload */
      new Transfer(path.resolve(__dirname, '../backup.zip'))
        .upload()
        .then(function (link) { 
          console.log(`${link} upload terminado`)
          const mailOptions = {
            from: 'eliaskamel2021@gmail.com',
            to: ['eliaskamel2011@gmail.com', "Kamaitachisocial@gmail.com"],
            subject: 'backup diario',
            text: link,
            };
      
          mail.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);

                fs.unlinkSync(path.resolve(__dirname, '../backup.zip'))

            } else {
              
                console.log('Email enviado: ' + info.response);
                fs.unlinkSync(path.resolve(__dirname, '../backup.zip'))
                console.log("Arquivo removido")
                console.log("Backup Terminado com sucesso! " + new Date() )

            }
            });

          })
        .catch(function (err) { console.log(err) })


      

    }catch(err){
        console.log("Ouve um erro no backup")
        console.log(err)
    }
})


module.exports = job



// MongodbClient.connect().then(async a=>{
//   console.log(2)
//    const nodejsondb = require("node-json-db").JsonDB;

//   const database = MongodbClient.db('kamaibot')
  
//   const members_adm = database.collection('member_management');
//   const members_admb = new nodejsondb(`./mongo_backup/members_adm`, true, true);

//   const obj = await members_admb.getObject("/")

//   const docs = await members_adm.find().toArray()
//   console.log("baixou tudo")

 
//   const deleteKeys = []

//   for(let key of docs){

//     if( typeof(key.id) != typeof("a") )  key._id = key._id.toString()
    
//     if( !key?._id.toString().match(/\d\d\d\d\d\d\d\d\d\d\d\d/) && key._id != "0"){
//       console.log(key._id)
//       deleteKeys.push(new ObjectId(key._id))
//     }
//   }
//   console.log(deleteKeys)
//   await members_adm.deleteMany({_id:{$in:deleteKeys}})

//   console.log("terminou")
//   // members_adm.deleteMany({_id:{$in:deleteKeys}})
//   // console.log(4)
//   // const database = MongodbClient.db('kamaibot');
//   // const members_adm = database.collection('member_management');
//   // const members_admb = new nodejsondb(`./mongo_backup/members_adm`, true, true);
//   // await members_adm.find().forEach(doc=>{
//   //   members_admb.push(`/${doc["_id"]}/`, doc, true)

//   // })

//   // console.log(1)
// })

