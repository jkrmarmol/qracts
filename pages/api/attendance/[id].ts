import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { id } = req.query;
      if (id === null) return res.status(500).json({ message: 'Missing, Section ID', statusCode: 500 });
      const idString = Array.isArray(id) ? id[0] : id;
      const checkSectionExist = await prisma.sections.findFirst({ where: { id: idString } });
      if (checkSectionExist === null) return res.status(404).json({ message: 'Section Not Found', statusCode: 404 });
      return res.json({ message: 'Valid Section ID', statusCode: 200 });
    }
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message, statusCode: 500 });
    }
  }
}
