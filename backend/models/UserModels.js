const mongoose = require("mongoose");
const argon2 = require("argon2");

//schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      require: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//! hash user password before saving

userSchema.pre("save", async function (next) {
  const user = this;

  // Only hash the password if it's modified (or new)
  if (!user.isModified("password")) return next();
  try {
    const hash = await argon2.hash(user.password, {
      type: argon2.argon2id,
      memoryCost: 19456, // ~19 MiB
      timeCost: 3,
      parallelism: 1,
    });
    user.password = hash;
    next();
  } catch (err) {
    next(err); // Pass error to Mongoose
  }
});

// Method to verify password (add to schema)
userSchema.methods.verifyPassword = async function (password) {
  return await argon2.verify(this.password, password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
