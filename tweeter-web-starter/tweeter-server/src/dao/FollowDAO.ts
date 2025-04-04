export interface FollowDAO {
    Follow(CurrentUserAlias: string, UserToFollowAlias: string): Promise<void>
    Unfollow(CurrentUserAlias: string, UserToFollowAlias: string): Promise<void>
    GetIsFollowerStatus(CurrentUserAlias: string, UserToGetStatus: string): Promise<boolean>
    GetFolloweeCount(userAlias: string): Promise<number>
    GetFollowerCount(userAlias: string): Promise<number>
}