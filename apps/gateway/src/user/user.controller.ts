import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { firstValueFrom } from "rxjs";
import { UserDto, UserListDto } from "../dtos/user.dto";
import { timestampToDate } from "@utils/date";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { UserListQueryDto } from "../dtos/user-list-query.dto";
import { Role } from "../roles/role.enum";
import { Roles } from "../roles/role.decorator";

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

  /**
   * 유저를 활성화합니다.
   */
  @Roles(Role.ADMIN)
  @ApiSecurity(Role.ADMIN)
  @Patch(":userId/activate")
  async activateUser(@Param("userId") userId: string): Promise<UserDto> {
    const activateUserObservable = this.userService.activateUser({ userId });
    const { result, message, userResponse } = await firstValueFrom(
      activateUserObservable,
    );
    if (!result) throw new BadRequestException(message);
    if (!userResponse) throw new BadRequestException(message);

    return {
      id: userResponse.userId,
      role: userResponse.role,
      username: userResponse.username,
      active: userResponse.active,
      createdAt: timestampToDate(userResponse.createdAt!),
      updatedAt: timestampToDate(userResponse.updatedAt!),
    };
  }

  /**
   * 유저의 역할을 변경합니다.
   */
  @Roles(Role.ADMIN)
  @ApiSecurity(Role.ADMIN)
  @Patch(":userId/role")
  async assignRole(
    @Param("userId") userId: string,
    @Query("role") role: string,
  ): Promise<UserDto> {
    const assignRoleObservable = this.userService.assignRole({
      userId,
      role,
    });
    const { result, message, userResponse } =
      await firstValueFrom(assignRoleObservable);
    if (!result) throw new BadRequestException(message);
    if (!userResponse) throw new BadRequestException(message);

    return {
      id: userResponse.userId,
      role: userResponse.role,
      username: userResponse.username,
      active: userResponse.active,
      createdAt: timestampToDate(userResponse.createdAt!),
      updatedAt: timestampToDate(userResponse.updatedAt!),
    };
  }
}
