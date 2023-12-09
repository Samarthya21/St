const express=require('express')
const app=express()
const port= process.env.PORT  || 8080;
const cors= require('cors');
const bodyParser = require('body-parser');
app.use(express.json())
const userModel=require("./userModel.js");
const validator= require("validator")
const bcrypt = require('bcrypt')

app.use(cors());

//signup
app.post("/api/home",async (req,res)=>{
    console.log("Received post request from signup")
    let obj=req.body;
    let {email,password}=req.body;
    if(!email || !password ){
        console.log("Password or Email is empty");
        res.json({
            message:"Email or Password is empty",
            data:obj
        })
        return;
    }
    else if(!validator.isEmail(email)){
        console.log("Invalid Email");
        res.json({
            message:"This is not the format of an email",
            data:obj
        })
        return;
    }
    else{
        
        if(await userModel.findOne({email:email})){
            console.log("Email already in database , no need to signup")
            res.json({
                message:"User already in the database",
                data:obj
            })
            return;
        }
        else{
        console.log("User signup successful");
        //Encryption of password using salt and hashing - bcrypt library
        const salt = await bcrypt.genSalt(10);
        const hash= await bcrypt.hash(password,salt);
        let user= await userModel.create({email,password:hash});
        console.log({message:obj});
        res.json({
          message: "user signup done",
          data: obj,
        });
        return;

        }
        

    }
   
//    
})

//
app.post("/api/login", async (req,res)=>{
    console.log("Received post request from login");
    try{
    let email=req.body.email;
    let password=req.body.password;
    if(!email || !password){
        res.json({
            message:"NULL ENTRY"
        })
        return;
    }
    let user=await userModel.findOne({email:email});
    
   
    if(user){
        let uid=user._id;
        //Checking encrypted password using bcrypt library
        let match= await bcrypt.compare(password,user.password);

        if(match){
            console.log("Successful login");
            
            res.json({
                user:true,
                unique_id:uid,
                message:"Successfull Login"

            })
            return

        }
        else{
            console.log("User credentials wrong");
            
            res.json({
                user:false,
                message:"Incorrect Credentials"
                
            });
            return;
            
        }
    }
    else{
        console.log("User not found");
        
        res.json({
            user:false
        })
        return;
    }
   
}
catch(err){
    console.log(err);
}


});
//succesfully created update 
app.post("/api/read", async (req,res)=>{
    console.log("Received request from submit button");
    try{
        
        let obj = req.body;
        const {unique_email,title,content,key_read}=req.body;
        //console.log(obj);
        const user= await userModel.findOne({email:obj.unique_email});
        //console.log(user);
        if(user){
            console.log("User found");
            
            const stringKeyRead = String(key_read);
            const existingNote = user.notes.find(note => note.key === stringKeyRead);
            //console.log(existingNote)
            if(existingNote){
               console.log("Updating user")
               existingNote.title=title;
               existingNote.content=content;
                
                  
            }
            else{
                //new note here
                console.log("New note added in db")
                user.notes.push({key:key_read,title:title,content:content});
                
            }
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

//sucessfully created delete function
app.post("/api/del", async (req,res)=>{
    console.log("Post request to delete api")
    try{
    let obj=req.body;
    let user=await userModel.findOne({email:obj.unique_email})
    if(user){
        console.log("User found")
        const stringKeyRead = String(obj.key_read);
        await userModel.updateOne(
            { email: obj.unique_email },
            { $pull: { notes: { key: stringKeyRead } } }
        );

        res.json({
            message: "Note deleted successfully",
        });
    }
}
catch(err){
    console.log(err)
}
})


app.listen(port,()=>{
    console.log("Server started on port 8080");
})
