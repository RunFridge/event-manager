import { MONGO_CONNECTION, USER_REWARD_MODEL } from "@constants/mongo";
import { Provider } from "@nestjs/common";
import { UserRewardSchema } from "database/schemas/user-reward.schema";
import { Connection } from "mongoose";

export const userRewardProviders: Provider[] = [
  {
    provide: USER_REWARD_MODEL,
    useFactory: (connection: Connection) =>
      connection.model("UserReward", UserRewardSchema),
    inject: [MONGO_CONNECTION],
  },
];
