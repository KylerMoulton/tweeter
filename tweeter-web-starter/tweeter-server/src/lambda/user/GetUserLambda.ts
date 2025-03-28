import { GetUserResponse, TweeterUserAliasRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: TweeterUserAliasRequest): Promise<GetUserResponse> => {
        const userService = new UserService();
        const user = await userService.getUser(request.token, request.userAlias)

        return {
            success: true,
            message: null,
            user: user
        }
}