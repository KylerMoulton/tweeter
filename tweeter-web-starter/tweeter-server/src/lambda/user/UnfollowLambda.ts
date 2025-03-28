import { FollowStateRequest, FollowStateResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: FollowStateRequest): Promise<FollowStateResponse> => {
    const userService = new UserService();
    const [followerCount, followeeCount] = await userService.unfollow(request.token, request.user)

    return {
        success: true,
        message: null,
        followerCount: followerCount,
        followeeCount: followeeCount
    }
}