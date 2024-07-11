import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const session = await auth(req, res);
    if (session === null)
      return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
    const userId = session.user && session.user.id;
    if (!userId)
      return res
        .status(500)
        .json({ message: 'Something went wrong', statusCode: 500 });
    const { name } = req.body;
    const checkExistName = await prisma.sections.findFirst({ where: { name } });
    if (checkExistName)
      return res
        .status(409)
        .json({ message: 'Name Already Exist', statusCode: 409 });
    const response = await prisma.sections.create({
      data: { name, usersId: userId }
    });
    return res.json(response);
  }
  return res
    .status(500)
    .json({ message: 'Internal Server Error', status: 500 });
}
