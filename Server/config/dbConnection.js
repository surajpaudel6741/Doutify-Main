const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config();

const connectDb = async ()=>{
    try{
        const connect= await mongoose.connect(process.env.DB_CONNECTION_STRING || 'mongodb+srv://Nepmine:Nepmine@nepmine.scpxvov.mongodb.net/Doubtify?retryWrites=true&w=majority&appName=Nepmine');
        console.log("[T] Connection to the database is successful :",connect.connection.name,"with host :",connect.connection.host)
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}



module.exports = connectDb;