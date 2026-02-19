import mongoose, {model, Schema} from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default:"user",
        trim: true
    },
}, { timestamps: true });


/* hashed password  */
userSchema.pre('save', async function () {
    /* "Password hashing should happen only when the password field is modified, using schema-level middlewarei*/
    if (!this.isModified('password')) return
    const hashedPass = await bcrypt.hash(this.password.toString(), 12);
    this.password = hashedPass;
    
});

const UserModel = model("User", userSchema);
export default UserModel;
