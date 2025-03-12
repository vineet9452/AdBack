const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/Box')
.then(()=>console.log('DB connected to mongoDB'))
.catch((err)=>console.log(err))

const empSchema = new mongoose.Schema({
    firstName:{ type:String,require:true},
    lastName:{type:String,require:true},
    email:{type:String,unique:true,require:true,},
    password:{type:String,require:true}

})

const Worker = mongoose.model('Worker',empSchema)

app.post('/signup',async(req,res)=>{
    const {firstName,lastName,email,password} = req.body

    const existingEmp = await Worker.findOne({email});
    if(existingEmp){
        return res.send('User already exist')
        
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);


    const newEmp = new Worker({
        firstName,
        lastName,
        email,
        password:hashedPassword
    })

       await newEmp.save()
    //   console.log(savedEmp);
      res.send('User created successfully')

})


app.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    const user = await Worker.findOne({email})
    // console.log(user);
    if(!user){
        return res.send({message:'User not found'})
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.send({message:'Invalid credentials'})
    }
    res.send({
        message:'Login Successful',
        firstName:user.firstName,
        lastName:user.lastName

    })
})


app.listen(10101,()=>{
    console.log('Server is running on port 10101');
})