import { Request, Response } from 'express';

const ActorController = {
  index: async (_req: Request, res: Response) => {
    res.render('actor');
  },
};

export default ActorController;
