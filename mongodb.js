const mongoose =  require('mongoose')

mongoose.connect("mongodb://localhost:27017/admin", {useNewUrlParser:true, useUnifiedTopology:true},
(err)=>{
    if(!err){
        console.log("Connected Successfully")
    }
    else{
        console.log(err)
    }
})

// URL:mongodb+srv://Rohan:qLDuyvkIhRfJiI4w@cluster0-k8xya.mongodb.net/test?retryWrites=true&w=majority