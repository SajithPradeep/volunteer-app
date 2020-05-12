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
        trim: true,
        default: "Volunteer",
        validate(value) {
            if (value !== "Volunteer" && value !== "Provider" && value !== "Admin") {
                console.log(value)
                throw new Error("Only user types Volunteer and Provider are allowed")
            }
        }
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true,
});

userSchema.virtual("items", {
    ref: "Item",
    localField: "_id",
    foreignField: "owner"
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({
        _id: user._id.toString()
    }, "secretkeyforvolunteer");
    user.tokens = user.tokens.concat({
        token
    });
    await user.save()
    return token;
}

userSchema.methods.isAdmin = async function () {
    const user = this;
    if (user.userType !== 'Admin') {
        return false
    }
    return true
}

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens
    return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    });
    if (!user) {
        throw new Error("Unable to login")
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Unable to login");
    }
    return user;
}

userSchema.pre("save", async function () {
    const user = this;

    if (user.isModified("password")) {
        return (user.password = await bcrypt.hash(user.password, 8));
    }
})

const User = mongoose.model("User", userSchema);
module.exports = User;