const { Schema, model, Types } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Es necesario el e-mail."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria."],
    },
    username: {
      type: String,
    },
    avatar: {
      type: String,
    },
    servicesContract: [
      {
        service: {
          type: Schema.Types.ObjectId,
          ref: "Service",
        },
        date: {
          type: Date,
          default: Date.now,
        },
        hours: {
          type: Number,
        },
        owner: {
          type: Schema.Types.ObjectId,
          ref: "User", // referencia al dueño del servicio
        },

        status: {
          type: String,
          enum: ["pendiente", "aceptado", "rechazado"],
          default: "pendiente",
        },
      },
    ],
    servicesReceived: [
      {
        client: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        service: {
          type: Schema.Types.ObjectId,
          ref: "Service",
        },
        date: {
          type: Date,
          default: Date.now,
        },
        hours: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ["pendiente", "aceptado", "rechazado"],
          default: "pendiente",
        },
      },
    ],

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    bankAccountTime: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next(); // solo re-hashea si cambió

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = model("User", userSchema);

module.exports = User;
