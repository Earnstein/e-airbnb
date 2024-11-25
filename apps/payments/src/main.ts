import { NestFactory } from "@nestjs/core";
import { PaymentsModule } from "./payments.module";
import { ConfigService } from "@nestjs/config";
import { Logger } from "nestjs-pino";
import { Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: "0.0.0.0",
      port: configService.get<number>("TCP_PORT") ?? 8003,
    },
  });
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  await app.listen(configService.get<number>("PORT") ?? 3000, () => {
    console.log(
      `Payments service is running on port ${configService.get<number>("PORT") ?? 8003}`,
    );
  });
}
bootstrap();
