import { Module } from "@nestjs/common";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import * as Joi from "joi";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "@app/common";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        TCP_PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        MAILTRAP_USER: Joi.string().required(),
        MAILTRAP_PASS: Joi.string().required(),
        MAILTRAP_HOST: Joi.string().required(),
        MAILTRAP_PORT: Joi.number().required(),
      }),
    }),
    LoggerModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule { }
