import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '@/lib/cloudinary';
import { Formidable, Files } from 'formidable';
import nodemailer from 'nodemailer';
import { hash } from 'bcryptjs';
import QRCode from 'qrcode';

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
  if (req.method === 'POST') {
    const session = await auth(req, res);
    if (session === null) return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
    const userId = session.user && session.user.id;
    if (!userId) return res.status(500).json({ message: 'Something went wrong', statusCode: 500 });

    const { fields, files } = await parseForm(req);
    if (!fields.studentNo || !fields.firstName || !fields.middleName || !fields.lastName || !fields.email || !fields.birthDate || !files.images)
      return res.status(404).json({ message: 'All Field Required', statusCode: 404 });

    const checkEmailExist = await prisma.students.findFirst({ where: { email: fields.email[0] } });
    if (checkEmailExist) return res.status(409).json({ message: 'Email Already Exist', statusCode: 409 });

    const generatePinCode = Math.random().toString().substr(2, 4);
    const hashedPinCode = await hash(generatePinCode, 12);

    // Start Upload Image into Cloudinary
    const uploadImageCloud = await cloudinary.uploader.upload(files.images[0].filepath, {
      folder: '/villanueva-school-atttendance'
    });
    if (!uploadImageCloud) return res.status(500).json({ message: 'Something went wrong', statusCode: 500 });
    // End Upload Image into Cloudinary
    const data = {
      firstName: fields.firstName[0],
      middleName: fields.middleName[0],
      lastName: fields.lastName[0],
      birthDate: new Date(fields.birthDate[0]),
      studentNo: fields.studentNo[0],
      email: fields.email[0],
      pinCode: hashedPinCode,
      images: uploadImageCloud.secure_url
    };
    const createStudent = await prisma.students.create({ data });

    // Start Send Node Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const option = {
      from: 'School Attendance <hello@gmail.com>',
      to: fields.email[0],
      subject: 'School Attendance OTP',
      html: `
        <p>Pin Code:</p> : ${generatePinCode} <br />

      `,
      attachments: [
        {
          filename: `qr-code${fields.lastName}-${fields.firstName}-${new Date()}.png`,
          content: await QRCode.toBuffer(createStudent.id),
          contentType: 'image/png'
        }
      ],
      headers: {
        priority: 'high',
        importance: 'high'
      }
    };

    const transEmail = await transporter.sendMail(option);
    if (!transEmail.accepted[0]) {
      return res.status(500).json({ message: 'Something went wrong', statusCode: 500 });
    }
    // End Send Node Email

    return res.json({ message: 'Student Created', statusCode: 200 });
  }
  if (req.method === 'GET') {
    const session = await auth(req, res);
    if (session === null) return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
    const userId = session.user && session.user.id;
    if (!userId) return res.status(500).json({ message: 'Something went wrong', statusCode: 500 });
    const data = await prisma.students.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        studentNo: true,
        email: true,
        images: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return res.json(data);
  }
  return res.status(500).json({ message: 'Internal Server Error', status: 500 });
}
