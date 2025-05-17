import { NestFactory } from "@nestjs/core";
import { EventModule } from "./event.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EventModule,
    {
      transport: Transport.GRPC,
    },
  );
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
