import { AuthTokenDto } from "tweeter-shared";

export interface AuthTokenDAO {
    create(alias: string): Promise<AuthTokenDto>
    validate(token: string): Promise<Boolean>
    getUserAliasFromToken(token: string): Promise<string>
    delete(token: string): Promise<void>
}