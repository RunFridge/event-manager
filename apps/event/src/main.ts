import { NestFactory } from "@nestjs/core";
import { EventModule } from "./event.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ReflectionService } from "@grpc/reflection";
import { HealthImplementation } from "grpc-health-check";
import { protobufPackage } from "proto/event";
import { DEFAULT_HOST, EVENT_DEFAULT_PORT } from "@constants/index";
import type { PackageDefinition } from "@grpc/proto-loader";
import type { Server } from "@grpc/grpc-js";

async function bootstrap() {
  const PORT = process.env.PORT || EVENT_DEFAULT_PORT;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EventModule,
    {
      transport: Transport.GRPC,
      options: {
        package: protobufPackage,
        protoPath: "proto/event.proto",
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
