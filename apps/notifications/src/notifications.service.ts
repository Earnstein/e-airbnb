import { Injectable } from "@nestjs/common";
import { NotifyEmailDto } from "./dto/notify-email.dto";
import * as nodemailer from "nodemailer";
import { EMAIL_TEMPLATE } from "./email-template/email";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NotificationsService {
  private readonly transporter = nodemailer.createTransport({
    host: this.configService.get<string>("MAILTRAP_HOST"),
    port: this.configService.get<number>("MAILTRAP_PORT"),
    auth: {
      user: this.configService.get<string>("MAILTRAP_USER"),
      pass: this.configService.get<string>("MAILTRAP_PASS"),
    },
  });
  constructor(private readonly configService: ConfigService) {}
  async notifyEmail(data: NotifyEmailDto) {
    await this.transporter.sendMail({
      from: "e-airbnb Notification <no-reply@e-airbnb.com>",
      to: data.email,
      subject: "e-airbnb Notification",
      html: data.text,
    });
    console.log(data);
  }
}
