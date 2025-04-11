import { LoginRegisterResponse, RegisterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: RegisterRequest): Promise<LoginRegisterResponse | TweeterResponse> => {
    const userService = new UserService();

    try {
        const [user, authToken] = await userService.register(
            request.firstName, 
            request.lastName, 
            request.alias, 
            request.password,
            request.userImageBytes,
            request.imageFileExtension
        );

        return {
            success: true,
            message: null,
            user: user,
            authToken: authToken
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message ?? "An unknown error occurred.",
        };
    }
};
