import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import {
  AssignRoleRequest,
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  CommonResponse,
  GetUserRequest,
  ListUserRequest,
  ToggleUserActiveRequest,
  UserListResponse,
} from "proto/auth";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class UserService implements OnModuleInit {
  private authService: AuthServiceClient;
  constructor(@Inject(AUTH_SERVICE_NAME) private authClient: ClientGrpc) {}
  onModuleInit() {
    this.authService =
      this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  toggleUserActive(
    request: ToggleUserActiveRequest,
  ): Observable<CommonResponse> {
    return this.authService.toggleUserActive(request).pipe(
      catchError((error: unknown) => {
        console.error("Activate user error: ", error);
        return throwError(() => error);
      }),
    );
  }

  assignRole(request: AssignRoleRequest): Observable<CommonResponse> {
    return this.authService.assignRole(request).pipe(
      catchError((error: unknown) => {
        console.error("Assign role error: ", error);
        return throwError(() => error);
      }),
    );
  }

  getUser(request: GetUserRequest): Observable<CommonResponse> {
    return this.authService.getUser(request).pipe(
      catchError((error: unknown) => {
        console.error("Get user error: ", error);
        return throwError(() => error);
      }),
    );
  }

  listUsers(request: ListUserRequest): Observable<UserListResponse> {
    return this.authService.listUsers(request).pipe(
      catchError((error: unknown) => {
        console.error("List users error: ", error);
        return throwError(() => error);
      }),
    );
  }
}
