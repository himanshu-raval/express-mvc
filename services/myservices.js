class myservices {
    async testServices(data){
        console.log("My SErvices Worked");
        return "Data ->"+data
    }
}
module.exports  = myservices