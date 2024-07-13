import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const session = await auth(req, res);
    if (session === null) return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
    const userId = session.user && session.user.id;
    if (!userId) return res.status(500).json({ message: 'Something went wrong', statusCode: 500 });
    const totalSection = await prisma.sections.count({ where: { usersId: userId } });
    const totalStudent = await prisma.students.count();

    // Start Total Attendance
    const sections = await prisma.sections.findMany({
      where: {
        usersId: userId
      },
      select: {
        id: true
      }
    });

    const sectionIds = sections.map((section) => section.id);
    const totalAttendance = await prisma.attendance.count({
      where: { sectionsId: { in: sectionIds } }
    });
    // End Total Attendance

    return res.json({
      data: {
        totalSection,
        totalStudent,
        totalAttendance
      }
    });
  }
  return res.status(500).json({ message: 'Internal Server Error', status: 500 });
}
