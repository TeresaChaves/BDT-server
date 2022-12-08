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
    // maxHours: {
    //   type: Number,
    //   required: [true, 'Introduzca el nº de horas semanales que dedicará al banco de tiempo']
    // },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER'
    },
    bankAccountTime: [{
      minutes: Number,
      //bonus para el histórico y el desglose de qué ha solicitado// service: {
      //   type: Schema.Types.ObjectId,
      //   ref: 'Service'
      // },
    }]
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;