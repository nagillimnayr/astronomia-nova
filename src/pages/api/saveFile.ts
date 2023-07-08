import type { NextApiRequest, NextApiResponse } from 'next';
import z from 'zod';

const RequestSchema = z.object({
  title: z.string(),
  body: z.string(),
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const reqData = RequestSchema.safeParse(req.body);

  if (!reqData.success) {
    console.error('error:', reqData.error);
    return;
  }

  const { title, body } = reqData.data;
  console.log('Parsed request:', body);

  res.status(200);
}
