import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    const checkEmailExist = await prisma.users.findFirst({ where: { email } });
    if (checkEmailExist)
      return res.json({ message: 'Email Already Exist', status: 409 });
    const hashPassword = await hash(password, 12);
    const data = await prisma.users.create({
      data: { email, password: hashPassword }
    });
    return res.json(data);
  }
  return res
    .status(500)
    .json({ message: 'Internal Server Error', status: 500 });
}
