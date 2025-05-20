import { REWARD_MODEL } from "@constants/mongo";
import { Controller, Inject } from "@nestjs/common";
import { dateToTimestamp } from "@utils/date";
import { RewardDocument } from "database/schemas/reward.schema";
import { Model } from "mongoose";
import {
  CommonResponse,
  CreateRewardRequest,
  DeleteRewardRequest,
  ListRewardRequest,
  ListRewardResponse,
  RewardServiceController,
  RewardServiceControllerMethods,
  UpdateRewardRequest,
} from "proto/reward";

@Controller("reward")
@RewardServiceControllerMethods()
export class RewardController implements RewardServiceController {
  constructor(
    @Inject(REWARD_MODEL) private rewardModel: Model<RewardDocument>,
  ) {}

  async listReward(request: ListRewardRequest): Promise<ListRewardResponse> {
    const { page = 1, limit = 10, filterActive, filterType } = request;
    const offset = (page - 1) * limit;
    const filter: { active?: boolean; type?: string } = {};
    if (filterActive) filter.active = filterActive;
    if (filterType) filter.type = filterType;
    const rawList =
      (await this.rewardModel
        .find(filter)
        .select({ rewards: 0 })
        .skip(offset)
        .limit(limit)) || [];
    const total = await this.rewardModel.countDocuments(filter);
    return {
      total,
      page,
      limit,
      filterActive,
      filterType,
      list: rawList.map((r) => ({
        rewardId: r._id.toString(),
        type: r.type,
        title: r.title,
        description: r.description,
        active: r.active,
        point: r.point || 0,
        coupons: r.coupons || [],
        items: r.items || [],
        createdAt: dateToTimestamp(r.createdAt),
        updatedAt: dateToTimestamp(r.updatedAt),
      })),
    };
  }

  async createReward(request: CreateRewardRequest): Promise<CommonResponse> {
    const createdReward = await this.rewardModel.create({
      type: request.type,
      title: request.title,
      description: request.description,
      point: request.point,
      coupons: request.coupons,
      items: request.items,
      active: false,
    });
    return {
      result: true,
      rewardResponse: {
        rewardId: createdReward._id.toString(),
        type: createdReward.type,
        title: createdReward.title,
        description: createdReward.description,
        active: createdReward.active,
        point: createdReward.point || 0,
        coupons: createdReward.coupons || [],
        items: createdReward.items || [],
        createdAt: dateToTimestamp(createdReward.createdAt),
        updatedAt: dateToTimestamp(createdReward.updatedAt),
      },
    };
  }

  async updateReward(request: UpdateRewardRequest): Promise<CommonResponse> {
    const { rewardId, ...updateData } = request;
    const updatedReward = await this.rewardModel.findOneAndUpdate(
      { _id: rewardId },
      {
        ...updateData,
      },
      { new: true },
    );
    if (!updatedReward) return { result: false, message: "Reward not found" };
    return {
      result: true,
      rewardResponse: {
        rewardId: updatedReward._id.toString(),
        type: updatedReward.type,
        title: updatedReward.title,
        description: updatedReward.description,
        active: updatedReward.active,
        point: updatedReward.point || 0,
        coupons: updatedReward.coupons || [],
        items: updatedReward.items || [],
        createdAt: dateToTimestamp(updatedReward.createdAt),
        updatedAt: dateToTimestamp(updatedReward.updatedAt),
      },
    };
  }

  async deleteReward(request: DeleteRewardRequest): Promise<CommonResponse> {
    const deletedReward = await this.rewardModel.findOneAndDelete(
      { _id: request.rewardId },
      { new: true },
    );
    if (!deletedReward) return { result: false, message: "Reward not found" };
    return { result: true, message: "Reward deleted" };
  }
}
