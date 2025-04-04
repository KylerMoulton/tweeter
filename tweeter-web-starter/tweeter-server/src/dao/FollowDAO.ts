export interface FollowDAO {
    Follow(CurrentUserAlias: string, UserToFollowAlias: string): Promise<void>
    GetFolloweeCount(userAlias: string): Promise<number>
    GetFollowerCount(userAlias: string): Promise<number>
}