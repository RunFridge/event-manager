import { EVENT_MODEL, MONGO_CONNECTION } from "@constants/mongo";
import { Provider } from "@nestjs/common";
import { EventSchema } from "database/schemas/event.schema";
import { Connection } from "mongoose";

export const eventProviders: Provider[] = [
  {
    provide: EVENT_MODEL,
    useFactory: (connection: Connection) =>
      connection.model("Event", EventSchema),
    inject: [MONGO_CONNECTION],
  },
];
