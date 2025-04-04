import { Controller, ValidationPipe, UsePipes } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { EventPattern, Payload } from "@nestjs/microservices";
import { NotifyEmailDto } from "./dto/notify-email.dto";

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  @EventPattern("notify_email")
  async notifyEmail(@Payload() data: NotifyEmailDto) {
    await this.notificationsService.notifyEmail(data);
  }
}
