import { NestFactory } from "@nestjs/core";
import { NotificationsModule } from "./notifications.module";
import { ConfigService } from "@nestjs/config";
import { Transport } from "@nestjs/microservices";
import { Logger } from "nestjs-pino";

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: "0.0.0.0",
      port: configService.get<number>("TCP_PORT") ?? 8002,
    },
  });
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  console.log(
    `Notifications service is running on port ${configService.get<number>("TCP_PORT") ?? 8002}`,
  );
}
bootstrap();
