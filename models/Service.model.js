const { Schema, model } = require("mongoose")

const serviceSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Es necesario darle un nombre al servicio.'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Es necesaria la descripción del servicio.'],
            lowercase: true,
            trim: true
        },
        image: {
            type: String
        },
        owner: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        serviceDuration: {
            type: Number,
        },
        serviceDate: {
            type: Date
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },

        costumer: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    }
);

const Service = model("Service", serviceSchema);

module.exports = Service
