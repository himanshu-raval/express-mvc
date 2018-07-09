'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');

class myservices {
    async testServices(data){
        console.log("My SErvices Worked");
        return "Data ->"+data
    }

    async addServices(data){
    	console.log("save Before");
		const user = new User({ title: 'Himanshu' });
		try {
		    // I'm awaiting the result of my save operation
		    const saveResult = await user.save();
		    // Return the created object as result	
		    	  console.log("My SErvices Record Saved! ");
		           return "Data ->"+saveResult;
		     
		  } catch(err) { // Something went wrong
		    // Pass back the error
		    return  err;
		  }

	console.log("save After");

    }


    async updateServices(data){
    	console.log("save Before");
		const user = new User({ title: 'shiv_tets' },{$set:{title:"Naomi"}});
		try {
		    // I'm awaiting the result of my save operation
		    const saveResult = await user.update();
		    // Return the created object as result	
		    	  console.log("My SErvices Record Updated! ");
		           return "Data ->"+saveResult;
		     
		  } catch(err) { // Something went wrong
		    // Pass back the error
		    console.log(err);
		    return  err;
		  }

	console.log("save After");

    }



}
module.exports  = myservices