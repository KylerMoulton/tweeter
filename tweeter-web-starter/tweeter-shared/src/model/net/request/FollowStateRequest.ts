import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface FollowStateRequest extends TweeterRequest {
    readonly user: UserDto
}