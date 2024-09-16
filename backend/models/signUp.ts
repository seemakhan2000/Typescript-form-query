import mongoose, { Schema, Document } from 'mongoose';

interface ISignup extends Document {
  username: string;
  email: string;
  phone: string;
  password: string;
}

const signupSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
  },
 password: {
    type: String,
    required: true,
  },
});

const SignupModel = mongoose.model<ISignup>('signup', signupSchema);
export default SignupModel;
