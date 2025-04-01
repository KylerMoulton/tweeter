import { UserDto } from "../../dto/UserDto";
import { TweeterUserAliasRequest } from "./TweeterRequest";

export interface PagedUserItemRequest extends TweeterUserAliasRequest{
  readonly pageSize: number;
  readonly lastItem: UserDto | null;
}