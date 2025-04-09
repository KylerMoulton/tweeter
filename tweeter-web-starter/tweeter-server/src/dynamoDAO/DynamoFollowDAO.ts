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

    async LoadMoreFollowersAlias(userAlias: string, pageSize: number, lastItem: string | null): Promise<[string[], boolean]> {
        console.log(`The userAlias that we are checking is ${userAlias}, the last item is ${lastItem}`)
        const params: any = {
            TableName: this.tableName,
            IndexName: this.followsIndex,
            KeyConditionExpression: "followee_handle = :alias",
            ExpressionAttributeValues: {
                ":alias": userAlias
            },
            Limit: pageSize,
            ProjectionExpression: "follower_handle",
            ScanIndexForward: true
        };
    
        if (lastItem) {
            params.ExclusiveStartKey = {
                followee_handle: userAlias,
                follower_handle: lastItem
            };
        }
    
        const result = await this.client.send(new QueryCommand(params));
        const followerAliases = result.Items?.map(item => item.follower_handle) || [];
        return [followerAliases, !!result.LastEvaluatedKey];
    }
    
    async LoadMoreFolloweesAlias(userAlias: string, pageSize: number, lastItem: string | null): Promise<[string[], boolean]> {
        const params: any = {
            TableName: this.tableName,
            KeyConditionExpression: "follower_handle = :alias",
            ExpressionAttributeValues: {
                ":alias": userAlias
            },
            Limit: pageSize,
            ScanIndexForward: true
        };
    
        if (lastItem) {
            params.ExclusiveStartKey = {
                follower_handle: userAlias,
                followee_handle: lastItem
            };
        }
    
        const result = await this.client.send(new QueryCommand(params));
        const followeeAliases = result.Items?.map(item => item.followee_handle) || [];
        return [followeeAliases, !!result.LastEvaluatedKey];
    }
    
    async LoadAllFollowers(userAlias: string): Promise<string[]> {
        const followers: string[] = [];
        let lastEvaluatedKey: any = undefined;
    
        do {
            const result = await this.client.send(new QueryCommand({
                TableName: this.tableName,
                IndexName: this.followsIndex,
                KeyConditionExpression: "followee_handle = :alias",
                ExpressionAttributeValues: {
                    ":alias": userAlias
                },
                ProjectionExpression: "follower_handle",
                ExclusiveStartKey: lastEvaluatedKey
            }));
    
            const batch = result.Items?.map(item => item.follower_handle) || [];
            followers.push(...batch);
            lastEvaluatedKey = result.LastEvaluatedKey;
    
        } while (lastEvaluatedKey);
    
        return followers;
    }
}
