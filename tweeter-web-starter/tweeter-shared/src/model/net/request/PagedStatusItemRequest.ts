import { StatusDto } from "../../dto/StatusDto";
import { TweeterUserAliasRequest } from "./TweeterRequest";

export interface PagedStatusItemRequest extends TweeterUserAliasRequest{
      readonly pageSize: number;
      readonly lastItem: StatusDto | null;
}