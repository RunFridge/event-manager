export enum Role {
  USER = "user",
  OPERATOR = "operator",
  AUDITOR = "auditor",
  ADMIN = "admin",
}

export const roleFrom = (
  rawRole: "user" | "operator" | "auditor" | "admin",
): Role => {
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
      return Role.USER;
  }
};
