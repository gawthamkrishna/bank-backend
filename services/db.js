// import mongoose
const mongoose = require('mongoose')


// using mongoose define a connection string
mongoose.connect('mongodb://localhost:27017/bank',()=>{
    console.log('mongodb connected successfully');
})


// create model for project

// collectin -users
const user = mongoose.model('User',{
    username:String,
    acno:Number,
    password:String,
    balance:Number,
    transaction:[]
})

// export model inorder to use them in other files
module.exports={user}