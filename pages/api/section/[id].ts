import { auth } from '@/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const session = await auth(req, res);
    if (session === null) return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
    const userId = session.user && session.user.id;
    if (!userId) return res.status(500).json({ message: 'Something went wrong', statusCode: 500 });
    const { id } = req.query;
    if (!id || id === null) return res.status(409).json({ message: 'ID Query Required', statusCode: 401 });
    const idString = Array.isArray(id) ? id[0] : id; // Ensure id is a string
    const data = await prisma.sections.findFirst({
      where: { id: idString, usersId: userId }
    });
    if (data === null) return res.status(404).json({ message: 'Section Not Found', statusCode: 404 });
    return res.json(data);
  }

  if (req.method === 'PUT') {
    const session = await auth(req, res);
    if (session === null) return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
    const userId = session.user && session.user.id;
    if (!userId) return res.status(500).json({ message: 'Something went wrong', statusCode: 500 });
    const { id } = req.query;
    const { name } = req.body;
    if (!id || id === null) return res.status(409).json({ message: 'ID Query Required', statusCode: 401 });
    const idString = Array.isArray(id) ? id[0] : id; // Ensure id is a string
    const updateData = await prisma.sections.update({
      where: { id: idString },
      data: { name }
    });
    return res.json(updateData);
  }
  if (req.method === 'DELETE') {
    const session = await auth(req, res);
    if (session === null) return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
    const userId = session.user && session.user.id;
    if (!userId) return res.status(500).json({ message: 'Something went wrong', statusCode: 500 });
    const { id } = req.query;
    const { name } = req.body;
    if (!id || id === null) return res.status(409).json({ message: 'ID Query Required', statusCode: 401 });
    const idString = Array.isArray(id) ? id[0] : id;
    const checkExist = await prisma.sections.findFirst({
      where: { id: idString }
    });
    if (checkExist === null) return res.status(404).json({ message: 'Section Not Found', statusCode: 404 });
    await prisma.sections.delete({
      where: { id: idString }
    });
    return res.json({ message: 'Section Deleted', statusCode: 200 });
  }

  return res.status(500).json({ message: 'Internal Server Error', status: 500 });
}
