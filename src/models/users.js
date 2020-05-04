const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid");
            }
        },
    },
    userType: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (value.toLowerCase().includes("password") || value.length <= 6) {
                throw new Error("Password critiria not met");
            }
        }
    }
}, {
    timestamps: true,
});


userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;

    return userObject;
};

userSchema.pre("save", async function () {
    const user = this;

    if (user.isModified("password")) {
        return (user.password = await bcrypt.hash(user.password, 8));
    }
})

const User = mongoose.model("User", userSchema);
module.exports = User;