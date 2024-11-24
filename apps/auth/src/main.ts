import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";
import { Transport } from "@nestjs/microservices";
import { Logger } from "nestjs-pino";
async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: "0.0.0.0",
      port: configService.get<number>("TCP_PORT"),
    },
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  app.use(cookieParser());

  await app.startAllMicroservices();
  await app.listen(configService.get<number>("HTTP_PORT") ?? 8001, () => {
    console.log(
      `Auth service is running on port ${configService.get<number>("HTTP_PORT") ?? 8001}`,
    );
  });
}
bootstrap();
