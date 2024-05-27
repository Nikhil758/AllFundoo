import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { setAllNotes } from '../utils/redis';
import { getAllNotes } from './notes.service';
// import sendEmail from '../utils/user.util';

//create new user
export const newUserRegister = async (body) => {
  body.email = await body.email.toLowerCase();
  let res = await User.findOne({ email: body.email });
  if (res !== null) {
    throw new Error('Email already exist');
  }
  body.password = await bcrypt.hash(body.password, 10);
  const data = await User.create(body);
  return data;
};

//Login
export const userLogin = async (body) => {
  let userObj = await User.findOne({ email: body.email });
  if (userObj === null) {
    throw new Error('Incorrect Email');
  }
  const isMatch = await bcrypt.compare(body.password, userObj.password);
  if (isMatch) {
    const token = jwt.sign(
      { _id: userObj._id, email: userObj.email },
      process.env.SECRETKEY,
      { expiresIn: '2h' }
    );
    const data = await getAllNotes(userObj._id);
    await setAllNotes(userObj._id, data);

    return token;
  } else {
    throw new Error('Incorrect Password');
  }
};

//Forget Password
export const forgetPassword = async (body) => {
  let userObj = await User.findOne({ email: body.email });
  if (userObj === null) {
    throw new Error('User does not exist');
  }
  const token = jwt.sign(
    { _id: userObj._id, email: userObj.email },
    process.env.SecretKey,
    { expiresIn: '1h' }
  );
  // const Email = userObj.email;
  // sendEmail({
  //   subject: "Reset Password Sent",
  //   text: token,
  //   to: Email,
  //   from: process.env.EMAIL
  // });
  return token;
};

//Reset Password
export const resetPassword = async (_id, email, body) => {
  let userObj = await User.findOne({ email });
  if (userObj === null) {
    throw new Error('User does not exist');
  }
  const isMatch = await bcrypt.compare(body.password, userObj.password);
  if (isMatch) {
    throw new Error('Password cannot be same as the old one');
  }
  body.password = await bcrypt.hash(body.password, 10);
  const data = await User.findByIdAndUpdate(
    {
      _id
    },
    body,
    {
      new: true
    }
  );
  return data;
};
