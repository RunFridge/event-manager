import { MONGO_CONNECTION, REWARD_MODEL } from "@constants/mongo";
import { Provider } from "@nestjs/common";
import { RewardSchema } from "database/schemas/reward.schema";
import { Connection } from "mongoose";

export const eventProviders: Provider[] = [
  {
    provide: REWARD_MODEL,
    useFactory: (connection: Connection) =>
      connection.model("Reward", RewardSchema),
    inject: [MONGO_CONNECTION],
  },
];
