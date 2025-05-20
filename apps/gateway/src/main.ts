import fs from "fs/promises";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { GATEWAY_PORT } from "@config/env.schema";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Event Manager")
    .setDescription("이벤트/보상 관리 시스템")
    .addBearerAuth()
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, documentFactory);

  const doc = SwaggerModule.createDocument(app, swaggerConfig);
  const json = JSON.stringify(doc, null, 2);
  await fs.writeFile("swagger.json", json, "utf-8");
  Logger.log("swagger.json created");

  await app.listen(config.get<number>(GATEWAY_PORT) ?? 3000);
}
bootstrap();
