// import { client } from "../../index.js";
const fs =  require('fs')
const path = require('path')

// client.commands = new Collection();


const getAllFiles = function(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath)
  
    arrayOfFiles = arrayOfFiles || []
  
    files.forEach(function(file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
      } else {
        arrayOfFiles.push("../../" + path.relative(path.resolve("./utils/loader"), path.join(__dirname, dirPath, "/", file)).replace(/\\/g, "/"))
      }
    })
    return arrayOfFiles
}

const commands = getAllFiles("./commands").filter(p=> p.endsWith(".js")).map(p=>{
  const m = require(p)
  m.path = p
  return m
})

exports.commands = commands