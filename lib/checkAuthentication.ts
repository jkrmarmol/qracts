import { auth } from '@/auth';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function checkAuthentication(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await auth(req, res);
  if (session === null)
    return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
}
