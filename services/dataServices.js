// import db.js
const db = require('./db')
// import jsonwebtoken
const jwt = require('jsonwebtoken')


// register
const register = (uname, acno, pswd) => {
    console.log('inside register function in data service');
    // asynchronus function
    // check acno already exist in mongoDB db.users.findOne()
    return db.user.findOne({
        acno
    }).then((result) => {
        console.log(result);
        if (result) {
            // acno alerady exist
            return {
                statusCode: 403,
                message: 'Account already exist!'
            }
        }
        else {
            // to add new user
            const newUser = new db.user({
                username: uname,
                acno,
                password: pswd,
                balance: 0,
                transaction: []
            })
            // to save new user in mongo db
            newUser.save()
            return {
                statusCode: 200,
                message: 'Registration successful !'
            }
        }
    })
}
// login
const login = (acno, pswd) => {
    console.log('inside login function body');

    // check acno & pswd in mongodb
    return db.user.findOne({
        acno,
        password: pswd

    }).then((result) => {
        if (result) {
            const token = jwt.sign({
                currentAcno: acno
            }, 'supersecretkey123')
            return {
                statusCode: 200,
                message: 'Login successfull',
                username: result.username,
                currentAcno: acno,
                token
            }
        }
        else {
            return {
                statusCode: 404,
                message: 'Invalid Account or Password '
            }
        }
    })

}
// getBalance
const getBalance = (acno) => {
    return db.user.findOne({ acno })
        .then((result) => {
            if (result) {
                return {
                    statusCode: 200,
                    balance: result.balance
                }
            }
            else {
                return {
                    statusCode: 404,
                    message: 'Invalid Account'
                }
            }
        }

        )


}
// deposit
const deposit = (acno, amt) => {
    let amount = Number(amt)
    return db.user.findOne({
        acno
    }).then((result) => {
        if (result) {
            // acno is present db
            result.balance += amount
            result.transaction.push({
                type: "Credit",
                fromAcno: acno,
                toAcno: acno,
                amount
            })
            // to update in mongodb
            result.save()
            return {
                statusCode: 200,
                message: `${amount} Successfully deposited`
            }
        }
        else {
            return {
                statusCode: 404,
                message: `Invalid account`
            }
        }
    })
}
// fundTransfer
const fundTransfer = (req, toAcno, pswd, amt) => {
    let amount = Number(amt)
    let fromAcno = req.fromAcno
    return db.user.findOne({
        acno: fromAcno,
        password: pswd
    }).then((result) => {
        console.log(result);
        if (result) {
            if (fromAcno == toAcno) {
                return {
                    statusCode: 401,
                    message: "transfer denied to the same account"
                }
            }

            // debit account details
            let fromAcnoBalance = result.balance
            if (fromAcnoBalance >= amount) {
                result.balance = fromAcnoBalance - amount
                //  credit account details
                return db.user.findOne({
                    acno: toAcno
                }).then(creditData => {
                    if (creditData) {
                        creditData.balance += amount
                        creditData.transaction.push({
                            type: "Credit",
                            fromAcno,
                            toAcno,
                            amount
                        })
                        creditData.save()
                        console.log(creditData);
                        result.transaction.push({
                            type: "Debit",
                            fromAcno,
                            toAcno,
                            amount
                        })
                        result.save()
                        console.log(result);
                        return {
                            statusCode: 200,
                            message: "fund transfer successful"
                        }
                    }
                    else {
                        return {
                            statusCode: 401,
                            message: "invalid credit account number"
                        }
                    }
                })


            }
            else {
                return {
                    statusCode: 403,
                    message: "Insufficient Balance"
                }
            }
        }

        else {
            return {
                statusCode: 401,
                message: "invalid debit account number / password"
            }
        }
    })




}

// getAllTranscation
const getAllTranscations = (req) => {
    let acno = req.fromAcno
    return db.user.findOne({
        acno
    }).then((result) => {
        if (result) {
            return {
                statusCode: 200,
                transaction: result.transaction
            }
        }
        else {
            return {
                statusCode: 401,
                message: "invalid account"
            }
        }
    })
}
// deleteMyAccount

const deleteMyAccount = (acno) => {
    return db.user.deleteOne({
        acno
    })
        .then((result) => {
            if (result) {
                return {
                    statusCode: 200,
                    message: "Account delete successfully"
                }
            }
            else {
                return {
                    statusCode: 401,
                    message: "Invalid Account"
                }
            }
        })
}



// export
module.exports = { register, login, getBalance, deposit, fundTransfer, getAllTranscations, deleteMyAccount }