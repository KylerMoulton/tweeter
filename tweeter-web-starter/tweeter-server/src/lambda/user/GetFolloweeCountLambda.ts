import { FollowCountRequest, FollowCountResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: FollowCountRequest): Promise<FollowCountResponse> => {
    const userService = new UserService();
    const count = await userService.getFolloweeCount(request.token, request.user)

    return {
        success: true,
        message: null,
        count: count
    }
}