const { Schema, model } = require("mongoose")

const serviceSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Es necesario el nombre.'],
            lowercase: true,
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
        // owner: {
        //     type: Schema.ObjectId,
        //     ref: 'User'
        // },
        totalHours: {
            type: Number,
        },
        date: {
            type: Date
        },
        status: {
            type: String,
            enum: ['pending', 'complete'],
        },

        // costumer: {
        //     type: Schema.ObjectId,
        //     ref: 'User'
        // }
    }
);

const Service = model("Service", serviceSchema);

module.exports = Service
