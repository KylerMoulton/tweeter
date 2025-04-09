import { LoginRegisterResponse, LoginRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: LoginRequest): Promise<LoginRegisterResponse | TweeterResponse> => {
    const userService = new UserService();

    try {
        const [user, authToken] = await userService.login(request.alias, request.password);

        return {
            success: true,
            message: null,
            user: user,
            authToken: authToken
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message ?? "An unexpected error occurred during login."
        };
    }
};
