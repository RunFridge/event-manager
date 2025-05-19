export enum Role {
  ALL = "all",
  USER = "user",
  OPERATOR = "operator",
  AUDITOR = "auditor",
  ADMIN = "admin",
  INVALID = "invalid",
}

export const roleFrom = (rawRole: string): Role => {
  switch (rawRole) {
    case "user":
      return Role.USER;
    case "operator":
      return Role.OPERATOR;
    case "auditor":
      return Role.AUDITOR;
    case "admin":
      return Role.ADMIN;
    default:
      return Role.INVALID;
  }
};
