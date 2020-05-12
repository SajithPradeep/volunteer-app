const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    list: [{
        itemName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            default: "numbers"
        }
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


const Item = mongoose.model("Item", itemSchema)

module.exports = Item;