import mongoose from "mongoose";
import { MONGO_CONNECTION } from "@constants/mongo";
import { ConfigService } from "@nestjs/config";

export const databaseProviders = [
  {
    provide: MONGO_CONNECTION,
    inject: [ConfigService],
    useFactory: async (config: ConfigService): Promise<typeof mongoose> => {
      const connectionString = config.get<string>("MONGO_CONNECTION_STRING");
      if (!connectionString) {
        throw new Error("MONGO_CONNECTION_STRING is not defined");
      }
      return mongoose.connect(connectionString);
    },
  },
];
