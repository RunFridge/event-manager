import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { catchError, Observable, throwError } from "rxjs";
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  CommonResponse,
  LoginRequest,
  RegisterRequest,
} from "proto/auth";

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: AuthServiceClient;
  constructor(@Inject(AUTH_SERVICE_NAME) private authClient: ClientGrpc) {}
  onModuleInit() {
    this.authService =
      this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
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
}
