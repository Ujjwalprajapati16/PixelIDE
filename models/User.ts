import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export interface IUSER {
    _id? : mongoose.Types.ObjectId,
    name : string,
    email : string,
    picture : string,
    password : string,
    refreshToken : string,
    createdAt? : Date,
    updatedAt? : Date,
}

const userSchema = new mongoose.Schema<IUSER>({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    picture : {
        type : String,
        default : "",
    },
    password : {
        type : String,
        required : true,
    },
    refreshToken : {
        type : String,
        default : "",
    },
}, {
    timestamps : true,
});

userSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

const UserModel = mongoose.models.User || mongoose.model<IUSER>("User", userSchema);

export default UserModel;