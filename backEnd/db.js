const mongoose= require('mongoose')
const database=mongoose.connect('mongodb://localhost:27017/jobGate',(error)=>{
    if(!error){
        console.log('mongodb connected succesfuly')
    }
    else{
        console.log('failed to connect with database'+error)
    }
})

module.exports=database