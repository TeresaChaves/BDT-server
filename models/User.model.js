const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Es necesario el e-mail.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria.']
    },
    username: {
      type: String,
    },

    avatar: {
      type: String,
    },
    maxHoursToOffer: {
      type: Number,
    },
    bankAccountTime: {
      type: Number,
    }


  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
