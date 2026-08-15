import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    // If an email provider is configured, we set up the transporter here
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      this.logger.log('EmailService configured with SMTP');
    } else {
      this.logger.warn('EmailService initialized without SMTP credentials. Emails will only be logged.');
    }
  }

  async sendOtpEmail(to: string, otp: string): Promise<void> {
    const subject = 'Your Krevvy Login OTP';
    const text = `Your OTP code is ${otp}. It will expire in 10 minutes.`;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: process.env.SMTP_FROM || '"Krevvy" <noreply@krevvy.com>',
          to,
          subject,
          text,
        });
        this.logger.log(`Sent OTP email to ${to}`);
      } catch (error) {
        this.logger.error(`Failed to send email to ${to}`, error.stack);
        throw new Error('Failed to send email');
      }
    } else {
      // Development mode / Missing provider
      this.logger.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Body: ${text}`);
    }
  }
}
