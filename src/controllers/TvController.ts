import { Request, Response } from 'express';

const TvController = {
  index: async (_req: Request, res: Response) => {
    res.render('tv');
  },
};

export default TvController;
