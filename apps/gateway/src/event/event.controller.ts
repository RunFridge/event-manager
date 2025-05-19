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
import { Roles } from "../roles/role.decorator";
import { Role } from "../roles/role.enum";
import { ApiSecurity } from "@nestjs/swagger";
import { CreateEventRequestDto } from "../dtos/create-event-request.dto";
import { EventListQueryDto } from "../dtos/event-list-query.dto";
import { UpdateEventRequestDto } from "../dtos/update-event-request.dto";
import { EventService } from "./event.service";
import { firstValueFrom } from "rxjs";
import { EventDto, EventListDto } from "../dtos/event.dto";
import { timestampToDate } from "@utils/date";
import { CommonResponseDto } from "../dtos/common-response.dto";

@Controller("event")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /**
   * 신규 이벤트 생성
   */
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiSecurity({ allowed: [Role.ADMIN, Role.OPERATOR] })
  @Post()
  async createEvent(@Body() request: CreateEventRequestDto): Promise<EventDto> {
    const createObservable = this.eventService.createEvent(request);
    const { result, message, eventResponse } =
      await firstValueFrom(createObservable);
    if (!result) throw new BadRequestException(message);
    if (!eventResponse) throw new BadRequestException(message);

    return {
      eventId: eventResponse.eventId,
      type: eventResponse.type,
      title: eventResponse.title,
      description: eventResponse.description,
      targetCriteria: eventResponse.targetCriteria,
      active: eventResponse.active,
      rewards: eventResponse.rewards,
      createdAt: timestampToDate(eventResponse.createdAt!),
      updatedAt: timestampToDate(eventResponse.updatedAt!),
    };
  }

  /**
   * 이벤트 목록 조회
   */
  @Roles(Role.ADMIN, Role.OPERATOR, Role.AUDITOR)
  @ApiSecurity({ allowed: [Role.ADMIN, Role.OPERATOR, Role.AUDITOR] })
  @Get()
  async listEvents(@Query() query: EventListQueryDto): Promise<EventListDto> {
    const listEventsObservable = this.eventService.listEvents({
      page: query.page || 1,
      limit: query.limit || 10,
      filterActive: query.filterActive,
      filterType: query.filterType,
    });
    const res = await firstValueFrom(listEventsObservable);
    return {
      page: res.page,
      limit: res.limit,
      total: res.total,
      filterActive: res.filterActive,
      filterType: res.filterType,
      list: res.list.map((e) => ({
        eventId: e.eventId,
        type: e.type,
        title: e.title,
        active: e.active,
        targetCriteria: e.targetCriteria,
        rewards: [],
        description: e.description,
        createdAt: timestampToDate(e.createdAt!),
        updatedAt: timestampToDate(e.updatedAt!),
      })),
    };
  }

  /**
   * 이벤트 상세 조회
   */
  @Roles(Role.ADMIN, Role.OPERATOR, Role.AUDITOR)
  @ApiSecurity({ allowed: [Role.ADMIN, Role.OPERATOR, Role.AUDITOR] })
  @Get(":eventId")
  async getEvent(@Param("eventId") eventId: string): Promise<EventDto> {
    const getEventObservable = this.eventService.getEvent({ eventId });
    const { result, message, eventResponse } =
      await firstValueFrom(getEventObservable);
    if (!result) throw new BadRequestException(message);
    if (!eventResponse) throw new BadRequestException(message);
    return {
      eventId: eventResponse.eventId,
      active: eventResponse.active,
      type: eventResponse.type,
      title: eventResponse.title,
      description: eventResponse.description,
      targetCriteria: eventResponse.targetCriteria,
      rewards: eventResponse.rewards,
      createdAt: timestampToDate(eventResponse.createdAt!),
      updatedAt: timestampToDate(eventResponse.updatedAt!),
    };
  }

  /**
   * 이벤트 수정
   */
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiSecurity({ allowed: [Role.ADMIN, Role.OPERATOR] })
  @Put(":eventId")
  async updateEvent(
    @Param("eventId") eventId: string,
    @Body() request: UpdateEventRequestDto,
  ) {}

  /**
   * 이벤트 삭제
   */
  @Roles(Role.ADMIN, Role.OPERATOR)
  @ApiSecurity({ allowed: [Role.ADMIN, Role.OPERATOR] })
  @Delete(":eventId")
  async deleteEvent(
    @Param("eventId") eventId: string,
  ): Promise<CommonResponseDto> {
    const deleteEventObservable = this.eventService.deleteEvent({ eventId });
    const { result, message } = await firstValueFrom(deleteEventObservable);
    if (!result) throw new BadRequestException(message);
    return { result, message };
  }
}
