import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "../roles/role.enum";
import { ROLES_KEY } from "../roles/role.decorator";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "./public.decorator";
import { JwtPayload } from "./jwt-payload.interface";
import type { Request } from "express";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super();
  }

  canActivate(ctx: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;
    const requirdRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (requirdRoles) {
      const req = ctx.switchToHttp().getRequest<Request>();
      const authHeader = req.headers.authorization;
      if (!authHeader) return false;
      const [type, token] = authHeader.split(" ");
      if (type !== "Bearer") return false;
      if (!token) return false;

      try {
        const decodedToken = this.jwtService.verify<JwtPayload>(token);
        if (!decodedToken) return false;
        if (!decodedToken.role) return false;
        if (!requirdRoles.includes(decodedToken.role)) return false;
      } catch (err: unknown) {
        if (err instanceof TokenExpiredError) return false;
      }
    }

    return super.canActivate(ctx);
  }
}
