const mongoose=require('mongoose');
const userModel = require('./userModel');
const schema=new mongoose.Schema({
   
});
userModel.discriminator('Admin',schema)
module.exports=mongoose.model('Admin')

