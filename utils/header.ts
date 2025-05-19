import { BadRequestException } from "@nestjs/common";

export const parseAuthorizationHeader = (authorizationHeader: string) => {
  const [type, accessToken] = authorizationHeader.split(" ");
  if (type !== "Bearer") {
    throw new BadRequestException("Invalid authorization header type.");
  }
  if (!accessToken) {
    throw new BadRequestException("Access token is required.");
  }
  return accessToken;
};
