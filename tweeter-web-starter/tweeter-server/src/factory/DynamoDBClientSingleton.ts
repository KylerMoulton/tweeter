import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoDBClientSingleton {
    private static client: DynamoDBDocumentClient;

    public static getClient(): DynamoDBDocumentClient {
        if (!this.client) {
            const baseClient = new DynamoDBClient();

            this.client = DynamoDBDocumentClient.from(baseClient, {
                marshallOptions: {
                    removeUndefinedValues: true
                }
            });
        }

        return this.client;
    }
}
