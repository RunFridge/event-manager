import { NestFactory } from "@nestjs/core";
import { EventModule } from "./event.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ReflectionService } from "@grpc/reflection";
import { HealthImplementation } from "grpc-health-check";
import { DEFAULT_HOST, EVENT_DEFAULT_PORT } from "@constants/index";
import { EVENT_PACKAGE_NAME } from "proto/event";
import { AUDIT_PACKAGE_NAME } from "proto/audit";
import { REWARD_PACKAGE_NAME } from "proto/reward";
import type { PackageDefinition } from "@grpc/proto-loader";
import type { Server } from "@grpc/grpc-js";

async function bootstrap() {
  const PORT = process.env.PORT || EVENT_DEFAULT_PORT;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EventModule,
    {
      transport: Transport.GRPC,
      options: {
        package: [EVENT_PACKAGE_NAME, REWARD_PACKAGE_NAME, AUDIT_PACKAGE_NAME],
        protoPath: [
          "proto/event.proto",
          "proto/reward.proto",
          "proto/audit.proto",
        ],
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
