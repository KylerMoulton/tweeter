import { AuthToken, AuthTokenDto } from "tweeter-shared";
import { AuthTokenDAO } from "../dao/AuthTokenDAO";
import { DynamoDBClientSingleton } from "../factory/DynamoDBClientSingleton";
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    DeleteCommand
} from "@aws-sdk/lib-dynamodb";

export class DynamoAuthTokenDAO implements AuthTokenDAO {
        private readonly client = DynamoDBClientSingleton.getClient();
        private readonly tableName = "AuthTokens";
    async create(): Promise<AuthTokenDto> {
        const authToken = AuthToken.Generate()
        await this.client.send(new PutCommand({
                    TableName: this.tableName,
                    Item: {token: authToken.token, timestamp: authToken.timestamp}
        
                }));
        return authToken.dto
    }
    validate(token: string): Promise<Boolean> {
        throw new Error("Method not implemented.");
    }
    async delete(token: string): Promise<void> {
        await this.client.send(new DeleteCommand({
            TableName: this.tableName,
            Key: { token: token }
        }));
    }
    
}