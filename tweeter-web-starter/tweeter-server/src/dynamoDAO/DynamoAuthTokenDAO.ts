import { AuthToken, AuthTokenDto } from "tweeter-shared";
import { AuthTokenDAO } from "../dao/AuthTokenDAO";
import { DynamoDBClientSingleton } from "../factory/DynamoDBClientSingleton";
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    DeleteCommand,
    UpdateCommand
} from "@aws-sdk/lib-dynamodb";

export class DynamoAuthTokenDAO implements AuthTokenDAO {
        private readonly client = DynamoDBClientSingleton.getClient();
        private readonly tableName = "AuthTokens";
    async create(alias: string): Promise<AuthTokenDto> {
        const authToken = AuthToken.Generate()
        await this.client.send(new PutCommand({
                    TableName: this.tableName,
                    Item: {token: authToken.token, timestamp: authToken.timestamp, alias: alias}
        
                }));
        return authToken.dto
    }
    async validate(token: string): Promise<boolean> {
        const result = await this.client.send(new GetCommand({
            TableName: this.tableName,
            Key: { token: token }
        }));

        const storedTimestamp = result.Item!.timestamp;
        const currentTime = Date.now();

        if (currentTime - storedTimestamp < 600000) {
            await this.client.send(new UpdateCommand({
                TableName: this.tableName,
                Key: { token: token },
                ExpressionAttributeNames: { '#ts' : 'timestamp'},
                UpdateExpression: "SET #ts = :newTimestamp",
                ExpressionAttributeValues: { ":newTimestamp": currentTime }
            }));
    
            return true;
        }
        return false

        
    }
    async getUserAliasFromToken(token:string): Promise<string> {
        const result = await this.client.send(new GetCommand({
            TableName: this.tableName,
            Key: { token: token }
        }));
        return result.Item!.alias
    }
    async delete(token: string): Promise<void> {
        await this.client.send(new DeleteCommand({
            TableName: this.tableName,
            Key: { token: token }
        }));
    }
    
}