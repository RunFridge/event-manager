import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ReflectionService } from "@grpc/reflection";
import { HealthImplementation } from "grpc-health-check";
import { protobufPackage } from "proto/auth";
import { AUTH_DEFAULT_PORT, DEFAULT_HOST } from "@constants/index";
import type { PackageDefinition } from "@grpc/proto-loader";
import type { Server } from "@grpc/grpc-js";

async function bootstrap() {
  const PORT = process.env.PORT || AUTH_DEFAULT_PORT;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.GRPC,
      options: {
        package: protobufPackage,
        protoPath: "proto/auth.proto",
        url: `${DEFAULT_HOST}:${PORT}`,
        onLoadPackageDefinition: (pkg: PackageDefinition, server: Server) => {
          const healthImpl = new HealthImplementation({ "": "UNKNOWN" });
          healthImpl.addToServer(server);
          healthImpl.setStatus("", "SERVING");
          new ReflectionService(pkg).addToServer(server);
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
