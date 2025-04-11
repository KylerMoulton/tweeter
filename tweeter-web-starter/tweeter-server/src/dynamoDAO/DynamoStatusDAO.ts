import { UserDto, PostSegment, StatusDto } from "tweeter-shared";
import { StatusDAO } from "../dao/StatusDAO";
import { DynamoDBClientSingleton } from "../factory/DynamoDBClientSingleton";
import { BatchWriteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export class DynamoStatusDAO implements StatusDAO {
	private readonly client = DynamoDBClientSingleton.getClient();
	private readonly storyTableName = "Story";
	private readonly feedTableName = "Feed";

	/**
	 * Updates the story table with a new status post.
	 */
	async updateStory(
		alias: string,
		post: string,
		user: UserDto,
		timestamp: number,
		segments: PostSegment[]
	): Promise<void> {
		await this.client.send(
			new BatchWriteCommand({
				RequestItems: {
					[this.storyTableName]: [
						{
							PutRequest: { Item: { alias, timestamp, post, user, segments } },
						},
					],
				},
			})
		);
	}

	/**
	 * Retrieves paginated statuses from the story table.
	 */
	async getStoryStatus(
		alias: string,
		pageSize: number,
		lastItem?: StatusDto | null
	): Promise<[statuses: StatusDto[], hasMoreItems: boolean]> {
		const params: any = {
			TableName: this.storyTableName,
			KeyConditionExpression: "alias = :alias",
			ExpressionAttributeValues: {
				":alias": alias,
			},
			Limit: pageSize,
			ScanIndexForward: false, // Get most recent posts first
		};

		if (lastItem) {
			params.ExclusiveStartKey = {
				alias: lastItem.user.alias,
				timestamp: lastItem.timestamp,
			};
		}
		const result = await this.client.send(new QueryCommand(params));
		const statuses = result.Items!.map((item) => ({
			post: item.post,
			user: item.user, // user contains alias already
			timestamp: item.timestamp,
			segments: item.segments,
		})) as StatusDto[];

		return [statuses, !!result.LastEvaluatedKey];
	}

	/**
	 * Updates the feed table with a new status for each follower.
	 */
    async updateFeed(
        followerAliases: string[],
        post: string,
        user: UserDto,
        timestamp: number,
        segments: PostSegment[]
      ): Promise<void> {
        const putRequests = followerAliases.map((alias) => {
          return {
            PutRequest: {
              Item: {
                alias,
                timestamp,
                post,
                user: {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  alias: user.alias,
                  imageUrl: user.imageUrl,
                },
                segments: segments.map((segment) => ({
                  _text: segment.text,
                  _startPostion: segment.startPostion,
                  _endPosition: segment.endPosition,
                  _type: segment.type,
                })),
              },
            },
          };
        });
      
        console.log("Batching feed update for:", followerAliases);
        console.log("First batch item:", JSON.stringify(putRequests[0], null, 2));
      
        for (let i = 0; i < putRequests.length; i += 25) {
          const batch = putRequests.slice(i, i + 25);
          try {
            const result = await this.client.send(
              new BatchWriteCommand({
                RequestItems: {
                  [this.feedTableName]: batch,
                },
              })
            );
            console.log("Batch write result:", JSON.stringify(result, null, 2));
      
            if (result.UnprocessedItems && Object.keys(result.UnprocessedItems).length > 0) {
              console.warn("⚠️ UnprocessedItems found:", JSON.stringify(result.UnprocessedItems, null, 2));
            }
          } catch (err) {
            console.error("❌ Error during BatchWriteCommand:", err);
            throw err;
          }
        }
      }
      

	/**
	 * Retrieves paginated statuses from the feed table.
	 */
	async getFeedStatus(
		alias: string,
		pageSize: number,
		lastItem?: StatusDto | null
	): Promise<[StatusDto[], boolean]> {
		const params: any = {
			TableName: this.feedTableName,
			KeyConditionExpression: "alias = :alias",
			ExpressionAttributeValues: {
				":alias": alias,
			},
			Limit: pageSize,
			ScanIndexForward: false, // Get most recent posts first
		};

		if (lastItem) {
			params.ExclusiveStartKey = {
				alias: lastItem.user.alias,
				timestamp: lastItem.timestamp,
			};
		}

		const result = await this.client.send(new QueryCommand(params));
		const statuses = result.Items!.map((item) => ({
			post: item.post,
			user: item.user, // user contains alias already
			timestamp: item.timestamp,
			segments: item.segments,
		})) as StatusDto[];

		return [statuses, !!result.LastEvaluatedKey];
	}
}
