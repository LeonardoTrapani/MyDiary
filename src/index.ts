import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.json('test');
});

app.listen(3000);
