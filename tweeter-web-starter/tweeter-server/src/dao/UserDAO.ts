import { AuthTokenDto, UserDto } from "tweeter-shared";

export interface UserDAO {
    getUser(
        alias: string
    ): Promise<UserDto | null>;
    register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<UserDto>;
    login(
        alias: string,
        password: string
    ): Promise<UserDto | null>;
  }