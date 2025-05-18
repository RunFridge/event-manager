import { MONGO_CONNECTION, USER_MODEL } from "@constants/mongo";
import { Provider } from "@nestjs/common";
import { UserSchema } from "database/schemas/user.schema";
import { Connection } from "mongoose";

export const userProviders: Provider[] = [
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model("User", UserSchema),
    inject: [MONGO_CONNECTION],
  },
];
