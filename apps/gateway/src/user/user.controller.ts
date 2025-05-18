import { Controller, Get, Logger, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { firstValueFrom } from "rxjs";
import { UserListDto } from "../dtos/user.dto";
import { timestampToDate } from "@utils/date";
import { ApiTags } from "@nestjs/swagger";
import { UserListQueryDto } from "../dtos/user-list-query.dto";

@ApiTags("사용자 관리")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 사용자 목록을 조회합니다.
   */
  @Get()
  async listUsers(@Query() query: UserListQueryDto): Promise<UserListDto> {
    Logger.debug(query);
    const listUserObservable = this.userService.listUsers({
      page: query.page || 1,
      limit: query.limit || 10,
      filterActive: query.filterActive,
    });
    const res = await firstValueFrom(listUserObservable);
    return {
      page: res.page,
      limit: res.limit,
      total: res.total,
      filterActive: res.filterActive,
      list: res.list.map((u) => ({
        id: u.userId,
        username: u.username,
        active: u.active,
        role: u.role,
        createdAt: timestampToDate(u.createdAt!),
        updatedAt: timestampToDate(u.updatedAt!),
      })),
    };
  }
}
