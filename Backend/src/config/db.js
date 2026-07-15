const mongoose = require('mongoose');
async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://ishankkoshik_db_user:cuhPYGd0z1Z9dZUM@ishank-1st-cluster.ud3pyyk.mongodb.net/Usernotes")
        console.log("Database Connected Successfully");}
    catch (error) {
        console.log("Error in DB Connection", error);
    }
}
module.exports = connectDB;