import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoDBClientSingleton {
    private static client: DynamoDBDocumentClient;

    public static getClient(): DynamoDBDocumentClient {
        if (!this.client) {
            this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
        }
        return this.client;
    }
}
