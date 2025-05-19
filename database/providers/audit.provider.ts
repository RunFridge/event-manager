import { AUDIT_MODEL, MONGO_CONNECTION } from "@constants/mongo";
import { Provider } from "@nestjs/common";
import { AuditSchema } from "database/schemas/audit.schema";
import { Connection } from "mongoose";

export const auditProviders: Provider[] = [
  {
    provide: AUDIT_MODEL,
    useFactory: (connection: Connection) =>
      connection.model("Audit", AuditSchema),
    inject: [MONGO_CONNECTION],
  },
];
