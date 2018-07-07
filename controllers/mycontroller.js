// Load Services  
var myserv = require('../services/myservices')  ; 
let MyServes = new myserv();
module.exports = {
    test: async function(req, res){
        console.log('this is controller:')
       // res.send("hi hr");
        try {
            // const data = await getData({ id: '123' })
            const data = await MyServes.testServices("Hello");
            res.status(200).send(data)
        } catch (e) {
            //this will eventually be handled by your error handling middleware
            // next(e) 
            res.status(200).send("Error"+e)
        }

    }
}



async function getData(data){
    console.log("Data",data)
    return "Data"+data.id;
}
    // res.status(200).send({
    //     data: {
    //       token: service.getUserToken().token,
    //       profile: service.getUser()
    //     }
    //   })