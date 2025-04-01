import { TweeterResponse } from "./TweeterResponse";

export interface FollowStateResponse extends TweeterResponse {
    readonly followerCount: number
    readonly followeeCount: number
}