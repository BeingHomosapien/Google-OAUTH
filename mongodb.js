const mongoose =  require('mongoose')

mongoose.connect("mongodb+srv://Rohan:qLDuyvkIhRfJiI4w@cluster0-k8xya.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser:true, useUnifiedTopology:true},
(err)=>{
    if(!err){
        console.log("Connected Successfully")
    }
    else{
        console.log(err)
    }
})