const mongoose=require('mongoose');

const db_link = "mongodb+srv://samarthya777:AMirZR2Y0tawLKED@cluster0.1pcf65w.mongodb.net/?retryWrites=true&w=majority";

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
        },
      ],
});

const userModel= mongoose.model("userModel",userSchema);

module.exports=userModel;