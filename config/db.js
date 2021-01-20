/*
    MongoDB Connection
*/

const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

// Create async/await when connecting to the DB, 
// Put it inside try/catch which tries to return a promise or catches an error
const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });

        console.log('MongoDB Connected...');
    } catch(err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;