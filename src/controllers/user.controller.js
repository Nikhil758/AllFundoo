import HttpStatus from 'http-status-codes';
import * as UserService from '../services/user.service';
import createTopic from '../kafka/admin';
import { produceMessage } from '../kafka/producer';
import runConsumer from '../kafka/consumer';

const TOPIC_NAME = 'user-registration';

/**
 * Controller to create a new user
 * @param  {object} req - request object
 * @param {object} res - response object
 * @param {Function} next
 */
export const newUserRegister = async (req, res, next) => {
  try {
    const data = await UserService.newUserRegister(req.body);
    const { first_name, last_name, email } = data;
    const message = JSON.stringify({
      message: 'User created successfully',
      user: { first_name, last_name, email }
    });
    await createTopic(TOPIC_NAME);
    await produceMessage(TOPIC_NAME, message);
    await runConsumer(TOPIC_NAME).catch(console.error);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'User created successfully',
      data: {
        first_name,
        last_name,
        email
      }
    });
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req, res) => {
  try {
    const data = await UserService.userLogin(req.body);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'User found in database',
      data: data
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`
    });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const data = await UserService.forgetPassword(req.body);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Reset Password Link is sent',
      data: data
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const data = await UserService.resetPassword(
      res.locals.user._id,
      res.locals.user.email,
      req.body
    );
    const { _id, first_name, last_name, email } = data;
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Password updated in dataBase',
      data: {
        _id,
        first_name,
        last_name,
        email
      }
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`
    });
  }
};
