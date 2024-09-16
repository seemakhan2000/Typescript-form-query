import mongoose, { Schema, Document } from "mongoose";

interface IOtp extends Document {
  phone: string;
  otp: string;
  otpExpiration: Date;
}

const OtpSchema: Schema = new Schema({
  phone: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  otpExpiration: { type: Date, required: true },
});

const OtpModel = mongoose.model<IOtp>("Otp", OtpSchema);

export default OtpModel;
