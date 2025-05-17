import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { protobufPackage } from "proto/auth";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.GRPC,
      options: { package: protobufPackage, protoPath: "proto/auth.proto" },
    },
  );
  await app.listen();
}
bootstrap();
