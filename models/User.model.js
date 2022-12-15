const { Schema, model } = require("mongoose");
const bcrypt = require('bcrypt')

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
    bankAccountTime: {
      type: Number,
    }
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', function (next) {

  const saltRounds = 10
  const salt = bcrypt.genSaltSync(saltRounds)
  const hashedPassword = bcrypt.hashSync(this.password, salt)
  this.password = hashedPassword

  next()
})



const User = model("User", userSchema);

module.exports = User;