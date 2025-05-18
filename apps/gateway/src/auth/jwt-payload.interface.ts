import { Role } from "../roles/role.enum";

export interface JwtPayload {
  username: string;
  role: Role;
  isExpired?: boolean;
}
