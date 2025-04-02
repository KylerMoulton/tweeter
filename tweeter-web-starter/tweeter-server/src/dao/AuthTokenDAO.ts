import { AuthTokenDto } from "tweeter-shared";

export interface AuthTokenDAO {
    create(): Promise<AuthTokenDto>
    validate(token: string): Promise<Boolean>
    delete(token: string): Promise<void>
}