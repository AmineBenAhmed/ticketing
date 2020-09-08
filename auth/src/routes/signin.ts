import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';

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
(req: Request, res: Response) => {
  const errors = validationResult(req);
  console.log(errors);
  
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  res.send('valid')
});

export { router as signinRouter };
