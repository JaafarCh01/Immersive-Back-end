import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  });
  
  const UserModel = mongoose.model('user', UserSchema);
  
export default UserModel;