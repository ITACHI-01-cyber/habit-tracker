import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import { Contact } from '../models/Contact';

export class ContactService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async processContactMessage(data: { name: string; email: string; subject: string; message: string }) {
    const { name, email, subject, message } = data;
    let dbSaved = false;
    let emailSent = false;

    // 1. Database logic
    if (mongoose.connection.readyState === 1) {
      try {
        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();
        dbSaved = true;
        console.log('Message saved to MongoDB');
      } catch (dbError) {
        console.error('Failed to save to MongoDB:', dbError);
      }
    }

    // 2. Email logic
    const receiver = process.env.EMAIL_RECEIVER || process.env.EMAIL_USER;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && receiver) {
      try {
        const mailOptions = {
          from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
          to: receiver,
          subject: `New Message: ${subject}`,
          text: `You have a new message from your portfolio website:\n\n` +
                `Name: ${name}\n` +
                `Email: ${email}\n` +
                `Subject: ${subject}\n\n` +
                `Message:\n${message}\n\n` +
                `---\n` +
                `Database Status: ${dbSaved ? '✅ Saved' : '❌ Failed to save'}\n` +
                `Sent via Nodemailer/Gmail`,
        };

        await this.transporter.sendMail(mailOptions);
        emailSent = true;
        console.log('✅ Email sent successfully to:', receiver);
      } catch (emailError: any) {
        console.error('❌ Failed to send email:', emailError.message);
        if (emailError.message.includes('Invalid login') || emailError.message.includes('auth')) {
          console.error('CRITICAL GMAIL HINT:');
          console.error('1. You are using password: "Vi@060507". Gmail usually blocks direct password usage.');
          console.error('2. You MUST use an "App Password" instead.');
          console.error('3. Go to https://myaccount.google.com/apppasswords');
          console.error('4. Generate an app password for "Mail" and update EMAIL_PASS in your Secrets.');
        }
      }
    } else {
      console.warn('⚠️ Skipping email: EMAIL_USER or EMAIL_PASS not configured in Secrets.');
    }

    return { dbSaved, emailSent };
  }
}
