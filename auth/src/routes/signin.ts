import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '@ticketingproj/common';
import { validateRequest } from '@ticketingproj/common';
import { User } from '../models/user';
import { BadRequestError } from '@ticketingproj/common';
import { Password } from '../services/password'
import jwt from 'jsonwebtoken';

const router = express.Router(); 

router.post('/api/users/signin',
[
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must provide a password')
],
validateRequest,
async (req: Request, res: Response) => {
  //using the validateRequest middleware we can delete all the commented validators
  // const errors = validationResult(req);
  // console.log(errors);
  
  // if (!errors.isEmpty()) {
  //   throw new RequestValidationError(errors.array());
  // } 

  const { email, password } = req.body;
  
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new BadRequestError('Invalid credentials');
  }

  const passwordMatch = await Password.compare(existingUser.password, password);

  if (!passwordMatch) {
    throw new BadRequestError('Invalid credentiels');
  }

   //Generate JWT
  const userJwt = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  }, process.env.JWT_KEY!);  //the process.env has two acceptable types either strin 
                            //or undefined the exclamation mark says to typscript don't
                            //worry we has verified this variable and it cannot be the both

  //store it on session object
  req.session = {
    jwt: userJwt
  };

  res.status(200).send(existingUser);

});

export { router as signinRouter };
