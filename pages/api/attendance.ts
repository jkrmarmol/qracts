import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { compare } from 'bcrypt';
import { auth } from '@/auth';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    // if (req.method === 'GET') {
    //   const { sectionId } = req.query;
    //   if (sectionId === null) return res.status(500).json({ message: 'Missing, Section ID', statusCode: 500 });
    //   const idString = Array.isArray(sectionId) ? sectionId[0] : sectionId;
    //   const checkSectionExist = await prisma.sections.findFirst({ where: { id: idString } });
    //   if (checkSectionExist === null) return res.status(404).json({ message: 'Section Not Found', statusCode: 404 });
    //   return res.json({ message: 'Valid Section ID', statusCode: 200 });
    // }
    if (req.method === 'GET') {
      const session = await auth(req, res);
      if (session === null) return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
      const userId = session.user && session.user.id;
      if (!userId) return res.status(500).json({ message: 'Something went wrong', statusCode: 500 });

      const sections = await prisma.sections.findMany({
        where: {
          usersId: userId
        },
        select: {
          id: true
        }
      });

      const sectionIds = sections.map((section) => section.id);

      const response = await prisma.attendance.findMany({
        where: {
          sectionsId: {
            in: sectionIds
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const result = await Promise.all(
        response.map(async (record) => {
          const getName = await prisma.students.findFirst({ where: { id: record.studentsId } });
          const sectionName = await prisma.sections.findFirst({ where: { id: record.sectionsId } });
          return {
            id: record.id,
            studentsId: record.studentsId,
            studentName: `${getName?.lastName || ''}, ${getName?.firstName || ''} ${getName?.middleName || ''}`,
            sectionsId: record.sectionsId,
            sectionName: sectionName?.name || '',
            createdAt: record.createdAt,
            updatedAt: record.updatedAt
          };
        })
      );
      return res.json(result);
    }
    if (req.method === 'POST') {
      const { studentsId, sectionsId, pinCode } = req.body;
      if (studentsId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const checkStudentAttendanceToday = await prisma.attendance.findFirst({
          where: {
            studentsId,
            sectionsId,
            createdAt: {
              gte: today,
              lt: tomorrow
            }
          }
        });
        if (checkStudentAttendanceToday) {
          return res.status(409).json({ message: 'Already Attendance', statusCode: 409 });
        }

        const data = await prisma.attendance.create({ data: { studentsId, sectionsId } });
        return res.json(data);
      }
      if (pinCode) {
        const student = await prisma.students.findMany();
        const checkEveryPassword = await Promise.all(
          student.map(async (e) => {
            if (await compare(pinCode, e.pinCode)) {
              return e;
            }
            return 'not existing';
          })
        );
        const filterAccount: any = checkEveryPassword.filter((e) => e !== 'not existing');
        if (!filterAccount.length) return res.status(404).json({ message: 'Student Not Found', statusCode: 404 });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const checkStudentAttendanceToday = await prisma.attendance.findFirst({
          where: {
            studentsId: filterAccount[0].id,
            sectionsId,
            createdAt: {
              gte: today,
              lt: tomorrow
            }
          }
        });
        if (checkStudentAttendanceToday) {
          return res.status(409).json({ message: 'Already Attendance', statusCode: 409 });
        }

        const data = await prisma.attendance.create({ data: { studentsId: filterAccount[0].id, sectionsId } });
        return res.json(data);
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message, statusCode: 500 });
    }
  }
}
