import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>("PORT") ?? 8001, () => {
    console.log(
      `Auth service is running on port ${configService.get<number>("PORT") ?? 8001}`,
    );
  });
}
bootstrap();
