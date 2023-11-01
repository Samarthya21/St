const express=require('express')
const app=express()
const port=8080;
const cors= require('cors');
const bodyParser = require('body-parser');
app.use(express.json())
const userModel=require("/Users/samarthyaalok/Desktop/sticky_notes_server/userModel.js");

app.use(cors());

//signup
app.post("/api/home",async (req,res)=>{
    console.log("Received post request from signup")
    let obj=req.body;
    let user= await userModel.create(obj);
    console.log({message:obj});
    res.json({
      message: "user signup done",
      data: obj,
    });
    
})

//
app.post("/api/login", async (req,res)=>{
    console.log("Received post request from login");
    try{
    let email=req.body.email;
    let password=req.body.password;
    let user=await userModel.findOne({email:email});
    
   
    if(user){
        let uid=user._id;
        if(password==user.password){
            console.log("Successful login");
            
            res.json({
                user:true,
                unique_id:uid
            })

        }
        else{
            console.log("User credentials wrong");
            
            res.json({
                user:false,
                
            });
            
        }
    }
    else{
        console.log("User not found");
        
        res.json({
            user:false
        })
    }
   
}
catch(err){
    console.log(err);
}


});

app.post("/api/read", async (req,res)=>{
    console.log("Received request from submit button");
    try{
        
        let obj = req.body;
        const {unique_email,title,content}=req.body;
        console.log(obj);
        const user= await userModel.findOne({email:obj.unique_email});
        console.log(user);
        if(user){
            console.log("User found");
            user.notes.push({title:title,content:content});
            await user.save();
        }
        else{
            console.log("User not found");
        }
        res.json({
            message:"Content received"
        })
    }
    catch(err){

    }
});

app.post("/api/create",async (req,res)=>{
    console.log("Post request to create api")
    let email=req.body.unique_email;
    
    
    const user= await userModel.findOne({email:email});
    if(user){
        const notes=user.notes
        
        res.json(notes)

    }
    else{
        res.json({
            message:"Error"
        })
    }

});


app.listen(port,()=>{
    console.log("Server started on port 8080");
})