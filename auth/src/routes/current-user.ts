import express, { Response, Request } from 'express';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

router.get('/api/users/currentuser', currentUser,(req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null }); //the currentUser property is defined in the current-user middleware
});

export { router as currentUserRouter };
