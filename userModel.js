const mongoose=require('mongoose');
require('dotenv').config();


const db_link = process.env.DATABASE;
mongoose.connect(db_link)
.then(function(db){
    console.log("db connected");
})
.catch(function(err){
    console.log(err);
})

const userSchema= mongoose.Schema({
    email:
    {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    notes: [
        {
          title: {
            type: String,
            required: false, 
          },
          content: {
            type: String,
            required: false, 
          },
          key:{
            type:String,
            required:false
          }
        },
      ],
});

const userModel= mongoose.model("userModel",userSchema);

module.exports=userModel;