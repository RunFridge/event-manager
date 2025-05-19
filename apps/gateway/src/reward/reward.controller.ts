import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { RewardService } from "./reward.service";
import { Roles } from "../roles/role.decorator";
import { Role } from "../roles/role.enum";
import { CreateRewardRequestDto } from "../dtos/create-reward.dto";
import { RewardDto, RewardListDto } from "../dtos/reward.dto";
import { firstValueFrom } from "rxjs";
import { RewardListQueryDto } from "../dtos/reward-list-query.dto";
import { UpdateRewardRequestDto } from "../dtos/update-reward-request.dto";
import { CommonResponseDto } from "../dtos/common-response.dto";
import { timestampToDate } from "@utils/date";

@ApiTags("보상 관련")
@Controller("reward")
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  /**
   * 신규 보상 생성
   */
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiSecurity({ allowed: [Role.ADMIN, Role.OPERATOR] })
  @Post()
  async createReward(
    @Body() request: CreateRewardRequestDto,
  ): Promise<RewardDto> {
    const createObservable = this.rewardService.createReward(request);
    const { result, message, rewardResponse } =
      await firstValueFrom(createObservable);
    if (!result) throw new BadRequestException(message);
    if (!rewardResponse) throw new BadRequestException(message);

    return {
      rewardId: rewardResponse.rewardId,
      type: rewardResponse.type,
      title: rewardResponse.title,
      description: rewardResponse.description,
      active: rewardResponse.active,
      point: rewardResponse.point,
      coupons: rewardResponse.coupons,
      items: rewardResponse.items,
      createdAt: timestampToDate(rewardResponse.createdAt!),
      updatedAt: timestampToDate(rewardResponse.updatedAt!),
    };
  }

  /**
   * 보상 수정
   */
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiSecurity({ allowed: [Role.ADMIN, Role.OPERATOR] })
  @Put(":rewardId")
  async updateReward(
    @Param("rewardId") rewardId: string,
    @Body() request: UpdateRewardRequestDto,
  ): Promise<RewardDto> {
    const updateRewardObservable = this.rewardService.updateReward({
      rewardId,
      ...request,
    });
    const { result, message, rewardResponse } = await firstValueFrom(
      updateRewardObservable,
    );
    if (!result) throw new BadRequestException(message);
    if (!rewardResponse) throw new BadRequestException(message);
    return {
      rewardId: rewardResponse.rewardId,
      type: rewardResponse.type,
      title: rewardResponse.title,
      description: rewardResponse.description,
      active: rewardResponse.active,
      point: rewardResponse.point,
      coupons: rewardResponse.coupons,
      items: rewardResponse.items,
      createdAt: timestampToDate(rewardResponse.createdAt!),
      updatedAt: timestampToDate(rewardResponse.updatedAt!),
    };
  }

  /**
   * 보상 목록 조회
   */
  @Roles(Role.ADMIN, Role.OPERATOR, Role.AUDITOR)
  @ApiSecurity({ allowed: [Role.ADMIN, Role.OPERATOR, Role.AUDITOR] })
  @Get()
  async listReward(@Query() query: RewardListQueryDto): Promise<RewardListDto> {
    const listRewardsObservable = this.rewardService.listReward({
      page: query.page || 1,
      limit: query.limit || 10,
      filterActive: query.filterActive,
      filterType: query.filterType,
    });
    const res = await firstValueFrom(listRewardsObservable);
    return {
      page: res.page,
      limit: res.limit,
      total: res.total,
      filterActive: res.filterActive,
      filterType: res.filterType,
      list: res.list.map((r) => ({
        rewardId: r.rewardId,
        type: r.type,
        title: r.title,
        active: r.active,
        description: r.description,
        point: r.point,
        coupons: r.coupons,
        items: r.items,
        createdAt: timestampToDate(r.createdAt!),
        updatedAt: timestampToDate(r.updatedAt!),
      })),
    };
  }

  /**
   * 보상 삭제
   */
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiSecurity({ allowed: [Role.ADMIN, Role.OPERATOR] })
  @Delete(":rewardId")
  async deleteReward(
    @Param("rewardID") rewardId: string,
  ): Promise<CommonResponseDto> {
    const deleteRewardObservable = this.rewardService.deleteReward({
      rewardId,
    });
    const { result, message } = await firstValueFrom(deleteRewardObservable);
    if (!result) throw new BadRequestException(message);
    return { result, message };
  }
}
