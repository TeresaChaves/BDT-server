const { Schema, model } = require("mongoose");

const serviceSchema = new Schema({
  name: {
    type: String,
    required: [true, "Es necesario darle un nombre al servicio."],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Es necesaria la descripción del servicio."],
    lowercase: true,
    trim: true,
  },
  image: {
    type: String,
  },
  owner: {
    type: Schema.ObjectId,
    ref: "User",
  },

  serviceDuration: {
    type: Number,
  },
  serviceDate: {
    type: Date,
  },

  costumer: {
    type: Schema.ObjectId,
    ref: "User",
  },

  disponibility: {
    type: String,
  },
  ratings: [
    {
      client: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        trim: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Service = model("Service", serviceSchema);
// Virtual para calcular el promedio de rating
serviceSchema.virtual("averageRating").get(function () {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const total = this.ratings.reduce((acc, r) => acc + r.rating, 0);
  return (total / this.ratings.length).toFixed(1);
});

// Virtual para contar cuántas valoraciones tiene
serviceSchema.virtual("ratingCount").get(function () {
  return this.ratings?.length || 0;
});

// Activar virtuals al convertir a JSON u objeto
serviceSchema.set("toObject", { virtuals: true });
serviceSchema.set("toJSON", { virtuals: true });

module.exports = Service;
