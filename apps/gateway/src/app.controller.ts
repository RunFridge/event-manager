import { Body, Controller, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { LoginRequest, TokenResponse } from "proto/auth";
import { Observable } from "rxjs";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  login(@Body() request: LoginRequest): Observable<TokenResponse> {
    return this.appService.login(request);
  }
}
