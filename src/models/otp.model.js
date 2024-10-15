import mongoose from "mongoose";
import { sendVerificationEmail } from "../utils/mailSender.js";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 5, // Document expires after 5 minutes
    },
  },
  { timestamps: true }
);

// Pre-save hook to trigger OTP email when a new document is saved
otpSchema.pre("save", async function (next) {
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp); // Trigger email sending via mailSender
  }
  next();
});

// Create and export the Otp model
const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
