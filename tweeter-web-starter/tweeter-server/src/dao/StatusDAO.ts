import { PostSegment, StatusDto, UserDto } from "tweeter-shared";

export interface StatusDAO {
    updateFeed(
        followerAliases: string[],
        post: string,
        user: UserDto,
        timestamp: number,
        segments: PostSegment[],
    ): Promise<void>
    getFeedStatus(alias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean ]>
    updateStory(
        alias: string,
        post: string,
        user: UserDto,
        timestamp: number,
        segments: PostSegment[]
    ): Promise<void>
    getStoryStatus(alias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>
}