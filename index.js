
// import dataService
const dataService = require('./services/dataServices')
// to import express inside js

const express = require('express')

// import cors
const cors = require('cors')

// import jsonwebtoken
const jwt = require('jsonwebtoken')

//create server app using express 

const server = express()

// use cors to define origin 
server.use(cors({
    origin: 'http://localhost:4200'
}))

// to parse json data 
server.use(express.json())

//set up port number for server app
server.listen(3000, () => {
    console.log('server start at 3000');
})

// get http api call (req/res - request/response)
server.get('/', (req, res) => {
    res.send('get method')
})

// post reuest
server.post('/', (req, res) => {
    res.send('post method')
})

// put reuest
server.put('/', (req, res) => {
    res.send('put method')
})

// delete reuest
server.delete('/', (req, res) => {
    res.send('delete method')
})
// application specific middleware
const appMiddleware = (req, res, next) => {
    console.log('Inside application specific middleware');
    next()
}
server.use(appMiddleware)
// bankapp front end request resolving

// token verify middleware 
const jwtMiddleware = (req, res, next) => {
    // get token from request headers
    const token = req.headers['access-token']
    console.log(token)
    try {// verify token
        const data = jwt.verify(token,'supersecretkey123')
        console.log(data);
        req.fromAcno = data.currentAcno
        console.log('valid token');
        next()
    }
    catch {
        console.log('Invalid token');
        res.status(401).json({
            message: 'please Login'
        })



    }
}

// register api call 
server.post('/register', (req, res) => {
    console.log('inside register function ');
    console.log(req.body);
    // // asynchronus function
    dataService.register(req.body.uname, req.body.acno, req.body.pswd)
        .then((result) => {
            res.status(result.statusCode).json(result)

        })
})

// register api call 
server.post('/register', (req, res) => {
    console.log('inside register function ');
    console.log(req.body);
    // // asynchronus function
    dataService.register(req.body.uname, req.body.acno, req.body.pswd)
        .then((result) => {
            res.status(result.statusCode).json(result)

        })
})

// register api call 
server.post('/register', (req, res) => {
    console.log('inside register function ');
    console.log(req.body);
    // // asynchronus function
    dataService.register(req.body.uname, req.body.acno, req.body.pswd)
        .then((result) => {
            res.status(result.statusCode).json(result)

        })
})


// register api call 
server.post('/register', (req, res) => {
    console.log('inside register function ');
    console.log(req.body);
    // // asynchronus function
    dataService.register(req.body.uname, req.body.acno, req.body.pswd)
        .then((result) => {
            res.status(result.statusCode).json(result)

        })
})

// login api call resolving
server.post('/login', (req, res) => {
    console.log('inside login api ');
    console.log(req.body);
    // // asynchronus function
    dataService.login(req.body.acno, req.body.pswd)
        .then((result) => {
            res.status(result.statusCode).json(result)

        })
})

// getBalance
server.get('/getBalance/:acno', jwtMiddleware, (req, res) => {
    console.log('inside getBalance api ');
    console.log(req.params.acno);
    // // asynchronus function
    dataService.getBalance(req.params.acno)
        .then((result) => {
            res.status(result.statusCode).json(result)

        })
})

// deposit api
server.post('/deposit', jwtMiddleware, (req, res) => {
    console.log('inside deposit api ');
    console.log(req.body);
    // // asynchronus function
    dataService.deposit(req.body.acno,req.body.amount)
        .then((result) => {
            res.status(result.statusCode).json(result)

        })
})
// fundtransfer api
server.post('/fundTransfer',jwtMiddleware,(req,res)=>{
    console.log('Inside fundTransfer Api');
    console.log(req.body);
    // asynchronus
    dataService.fundTransfer(req,req.body.toAcno,req.body.pswd,req.body.amount)
    .then((result) => {
        res.status(result.statusCode).json(result)

    })
})

// getAllTranscation
server.get('/all-transcations',jwtMiddleware,(req,res)=>{
    console.log("inside getAllTranscations api");
    dataService.getAllTranscations(req)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

// deleteAccount
server.delete('/delete-account/:acno', jwtMiddleware, (req, res) => {
    console.log('inside delete-account api ');
    console.log(req.params.acno);
    // // asynchronus function
    dataService.deleteMyAccount(req.params.acno)
        .then((result) => {
            res.status(result.statusCode).json(result)

        })
})