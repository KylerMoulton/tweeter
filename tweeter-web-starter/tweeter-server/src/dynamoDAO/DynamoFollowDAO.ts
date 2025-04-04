import { PutCommand, QueryCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { FollowDAO } from "../dao/FollowDAO";
import { DynamoDBClientSingleton } from "../factory/DynamoDBClientSingleton";
import { Select } from "@aws-sdk/client-dynamodb";

export class DynamoFollowDAO implements FollowDAO {
    private readonly client = DynamoDBClientSingleton.getClient();
    private readonly tableName = "follows";
    private readonly followsIndex = "follows_index";

    async Follow(CurrentUserAlias: string, UserToFollowAlias: string): Promise<void> {
        await this.client.send(new PutCommand({
            TableName: this.tableName,
            Item: {
                follower_handle: CurrentUserAlias,
                followee_handle: UserToFollowAlias
            }
        }));
    }

    async Unfollow(CurrentUserAlias: string, userToUnfollow: string): Promise<void> {
        await this.client.send(new DeleteCommand({
            TableName: this.tableName,
            Key: {
                follower_handle: CurrentUserAlias,
                followee_handle: userToUnfollow
            }
        }));
    }

    async GetIsFollowerStatus(CurrentUserAlias: string, UserToGetStatus: string): Promise<boolean> {
        const result = await this.client.send(new GetCommand({
            TableName: this.tableName,
            Key: {
                follower_handle: CurrentUserAlias,
                followee_handle: UserToGetStatus
            }
        }));
    
        return !!result.Item;
    }

    async GetFolloweeCount(userAlias: string): Promise<number> {
        const result = await this.client.send(new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: "follower_handle = :alias",
            ExpressionAttributeValues: {
                ":alias": userAlias
            },
            Select: Select.COUNT
        }));

        return result.Count ?? 0;
    }

    async GetFollowerCount(userAlias: string): Promise<number> {
        const result = await this.client.send(new QueryCommand({
            TableName: this.tableName,
            IndexName: this.followsIndex,
            KeyConditionExpression: "followee_handle = :alias",
            ExpressionAttributeValues: {
                ":alias": userAlias
            },
            Select: Select.COUNT
        }));

        return result.Count ?? 0;
    }
}
