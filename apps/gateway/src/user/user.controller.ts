import {
  BadRequestException,
  Controller,
  Get,
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
  @Roles(Role.OPERATOR)
  @ApiSecurity({ allowed: [Role.OPERATOR] })
  @Get()
  async listUsers(@Query() query: UserListQueryDto): Promise<UserListDto> {
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
        lastLoginAt: u.lastLoginAt ? timestampToDate(u.lastLoginAt) : undefined,
      })),
    };
  }

  /**
   * 사용자 상세 정보를 조회합니다.
   */
  @Roles(Role.OPERATOR)
  @ApiSecurity({ allowed: [Role.OPERATOR] })
  @Get(":userId")
  async getUser(@Param("userId") userId: string): Promise<UserDto> {
    const getUserObservable = this.userService.getUser({ userId });
    const { result, userResponse, message } =
      await firstValueFrom(getUserObservable);
    if (!result) throw new BadRequestException(message);
    if (!userResponse) throw new BadRequestException(message);
    return {
      id: userResponse.userId,
      role: userResponse.role,
      username: userResponse.username,
      active: userResponse.active,
      createdAt: timestampToDate(userResponse.createdAt!),
      updatedAt: timestampToDate(userResponse.updatedAt!),
      lastLoginAt: userResponse.lastLoginAt
        ? timestampToDate(userResponse.lastLoginAt)
        : undefined,
      condition: {
        loginStreakDays: userResponse.condition?.loginStreakDays || 0,
        referralCount: userResponse.condition?.referralCount || 0,
      },
      inventory: {
        point: userResponse.inventory?.point || 0,
        coupons: userResponse.inventory?.coupons || [],
        items: userResponse.inventory?.items || [],
      },
    };
  }

  /**
   * 유저를 활성 상태를 토글합니다.
   */
  @Roles(Role.OPERATOR)
  @ApiSecurity({ allowed: [Role.OPERATOR] })
  @Patch(":userId/toggle-activate")
  async activateUser(@Param("userId") userId: string): Promise<UserDto> {
    const toggleObservable = this.userService.toggleUserActive({
      userId,
    });
    const { result, message, userResponse } =
      await firstValueFrom(toggleObservable);
    if (!result) throw new BadRequestException(message);
    if (!userResponse) throw new BadRequestException(message);

    return {
      id: userResponse.userId,
      role: userResponse.role,
      username: userResponse.username,
      active: userResponse.active,
      createdAt: timestampToDate(userResponse.createdAt!),
      updatedAt: timestampToDate(userResponse.updatedAt!),
      lastLoginAt: userResponse.lastLoginAt
        ? timestampToDate(userResponse.lastLoginAt)
        : undefined,
    };
  }

  /**
   * 유저의 역할을 변경합니다.
   */
  @Roles(Role.ADMIN)
  @ApiSecurity({ allowed: [Role.ADMIN] })
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
      lastLoginAt: userResponse.lastLoginAt
        ? timestampToDate(userResponse.lastLoginAt)
        : undefined,
    };
  }
}
