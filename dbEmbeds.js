var options = {
    // db_name: The name of the file that will save in the folder to hold all user warning data.
    db_name: "dbembeds",
    // timezone: The timezone to be used to save and list warnings in... Example format: "Australia/Brisbane"
}
const nodejsondb = require("node-json-db").JsonDB;


module.exports = class dbemb {
    constructor() {
        this.dbemb = new nodejsondb(options.db_name, true, true);
    }

    saveEmb(embed,embName,embCreator){

        var newEmb = {};
        if(this.dbemb.exists(`/embeds/last`))
        {
        newEmb.id = parseInt(this.dbemb.getObject(`/embeds/last`).id) +1
        }else{
            newEmb.id = 1
        }
        newEmb.embed = embed;
        newEmb.embName = embName;
        newEmb.embCreator = embCreator;
        
        this.dbemb.push(`/embeds/${parseInt(newEmb.id)}/embeds`,newEmb,true);
        newEmb.last = true
        this.dbemb.push(`/embeds/last/`,newEmb,true);
    }

    async getEmb(id){
        if(this.dbemb.exists(`/embeds/${id}/embeds`)){

            return await this.dbemb.getData(`/embeds/${id}/embeds`)
        }else{
            return null
        }
    }

    delEmb(id){

        if(this.dbemb.exists(`/embeds/${id}`)){
            this.dbemb.delete(`/embeds/${id}`)
        }else{
            return null
        }

    }    

    async EmbList(){
        if(this.dbemb.exists(`/embeds/`)){
            var embeds = await this.dbemb.getObject(`/embeds/`);
            var temp = Object.values(embeds);
            var embs = "---Lista de embeds---\n";
            
            for (var x=0;temp.length>x;x++){
                if(!temp[x].last){
               embs = embs + `ID: [${temp[x].embeds.id}]  ${temp[x].embeds.embName} Por:${temp[x].embeds.embCreator}\n`}
            }

        return embs
        }

        
     }
}