import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private readonly resendApiKey = process.env.RESEND_API_KEY;
  private readonly fromAddress =
    process.env.EMAIL_FROM || 'Krevvy <noreply@krevvy.in>';

  constructor() {
    if (this.resendApiKey) {
      this.logger.log('EmailService configured with Resend');
    } else {
      this.logger.warn(
        'EmailService initialized without RESEND_API_KEY. OTP emails will not be sent.',
      );
    }
  }

  async sendOtpEmail(to: string, otp: string): Promise<void> {
    const subject = 'Your Krevvy Login OTP';
    const text = `Your OTP code is ${otp}. It will expire in 10 minutes.`;

    if (!this.resendApiKey) {
      throw new Error('Email service is not configured');
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.fromAddress,
          to: [to],
          subject,
          text,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();

        this.logger.error(
          `Resend email request failed with status ${response.status}: ${errorBody}`,
        );

        throw new Error('Failed to send email');
      }

      this.logger.log(`OTP email sent successfully to ${to}`);
    } catch (error) {
      if (error instanceof Error && error.message === 'Failed to send email') {
        throw error;
      }

      this.logger.error(
        `Failed to send OTP email: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );

      throw new Error('Failed to send email');
    }
  }
}