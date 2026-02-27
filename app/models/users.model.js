import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    phone : Number
})

const UserModel = mongoose.models.usertbl || mongoose.model('usertbl',userSchema);

export default UserModel;