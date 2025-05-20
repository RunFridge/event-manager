import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { catchError, Observable, throwError } from "rxjs";
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  CommonResponse,
  LoginRequest,
  RegisterRequest,
} from "proto/auth";

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: AuthServiceClient;
  constructor(@Inject(AUTH_PACKAGE_NAME) private client: ClientGrpc) {}
  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  register(request: RegisterRequest): Observable<CommonResponse> {
    return this.authService.register(request).pipe(
      catchError((error: unknown) => {
        console.error("Register error: ", error);
        return throwError(() => error);
      }),
    );
  }

  login(request: LoginRequest): Observable<CommonResponse> {
    return this.authService.login(request).pipe(
      catchError((error: unknown) => {
        console.error("Login error: ", error);
        return throwError(() => error);
      }),
    );
  }

  refreshToken(
    accessToken: string,
    refreshToken: string,
  ): Observable<CommonResponse> {
    return this.authService.refreshToken({ accessToken, refreshToken }).pipe(
      catchError((error: unknown) => {
        console.error("Refresh token error: ", error);
        return throwError(() => error);
      }),
    );
  }

  logout(
    accessToken: string,
    refreshToken: string,
  ): Observable<CommonResponse> {
    return this.authService.revokeToken({ accessToken, refreshToken }).pipe(
      catchError((error: unknown) => {
        console.error("Logout error: ", error);
        return throwError(() => error);
      }),
    );
  }
}
