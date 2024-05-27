import express from 'express';
import * as userController from '../controllers/user.controller';
import {
  loginUserValidator,
  newUserValidator,
  resetPasswordValidator
} from '../validators/user.validator';
import { resetAuth } from '../middlewares/auth.middleware';
const router = express.Router();

//route to create a new user
router.post('/', newUserValidator, userController.newUserRegister);

router.post('/login', loginUserValidator, userController.userLogin);

router.post('/forget', userController.forgetPassword);

router.put(
  '/reset',
  resetPasswordValidator,
  resetAuth,
  userController.resetPassword
);

export default router;
