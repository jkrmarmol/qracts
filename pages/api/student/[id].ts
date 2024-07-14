import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '@/lib/cloudinary';
import { Formidable, Files } from 'formidable';

export const config = {
  api: {
    bodyParser: false
  }
};

interface StudentFieldFormidableType {
  studentNo: Array<string>;
  firstName: Array<string>;
  middleName: Array<string>;
  lastName: Array<string>;
  birthDate: Array<Date>;
  email: Array<string>;
}

interface StudentFileFormidableType {
  images: Array<{
    size: string;
    newFilename: string;
    filepath: string;
    mimetype: string;
    mtime: Date;
    originalFilename: string;
  }>;
}

export const parseForm = async (req: NextApiRequest): Promise<{ fields: StudentFieldFormidableType; files: StudentFileFormidableType | Files }> => {
  return await new Promise<{
    err: any;
    fields: any;
    files: StudentFileFormidableType | Files;
  }>((resolve, reject) => {
    const form = new Formidable();

    return form.parse(req, (err, fields, files) => {
      if (err) reject({ err });
      resolve({ err, fields, files });
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const session = await auth(req, res);
    if (session === null) return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
    const userId = session.user && session.user.id;
    if (!userId) return res.status(500).json({ message: 'Something went wrong', statusCode: 500 });
    const { fields, files } = await parseForm(req);
    const { id } = req.query;
    if (!fields.studentNo || !fields.firstName || !fields.middleName || !fields.lastName || !fields.email || !fields.birthDate || !files.images)
      return res.status(404).json({ message: 'All Field Required', statusCode: 404 });
    if (!id || id === null) return res.status(409).json({ message: 'ID Query Required', statusCode: 401 });
    const idString = Array.isArray(id) ? id[0] : id;
    const checkIdExist = await prisma.students.findFirst({ where: { id: idString } });
    if (!checkIdExist) return res.status(404).json({ message: 'ID Not Existing', statusCode: 404 });
    const uploadImageCloud = await cloudinary.uploader.upload(files.images[0].filepath, {
      folder: '/villanueva-school-atttendance'
    });
    const data = {
      firstName: fields.firstName[0],
      middleName: fields.middleName[0],
      lastName: fields.lastName[0],
      birthDate: new Date(fields.birthDate[0]),
      studentNo: fields.studentNo[0],
      email: fields.email[0],
      images: uploadImageCloud.secure_url
    };
    const response = await prisma.students.update({ where: { id: idString }, data });
    return res.json(response);
  }

  if (req.method === 'DELETE') {
    const session = await auth(req, res);
    if (session === null) return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
    const userId = session.user && session.user.id;
    if (!userId) return res.status(500).json({ message: 'Something went wrong', statusCode: 500 });
    const { id } = req.query;
    if (!id || id === null) return res.status(409).json({ message: 'ID Query Required', statusCode: 401 });
    const idString = Array.isArray(id) ? id[0] : id; // Ensure id is a string
    const checkUserExisting = await prisma.students.findFirst({ where: { id: idString } });
    if (!checkUserExisting || checkUserExisting === null) return res.status(404).json({ message: 'User Not Found', statusCode: 404 });
    await prisma.students.delete({ where: { id: idString } });
    return res.status(200).json({ message: 'Student Profile Deleted', statusCode: 200 });
  }

  return res.status(500).json({ message: 'Internal Server Error', status: 500 });
}
