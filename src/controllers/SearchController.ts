import { Request, Response } from 'express';
import api from '../api';

const SearchController = {
  search: async (req: Request, res: Response) => {
    const term: string = <string>req.query.term;
    console.log(term);
    if (!term) {
      res.status(400).json({ message: 'No search term provided' });
      return;
    }
    const searchResponse = await api.search(term);
    res.json(searchResponse.results);
  },
};

export default SearchController;
