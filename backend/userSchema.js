const mongoose = require('./dbConnection') 

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});


const User = mongoose.model('User', userSchema);
 module.exports = User;