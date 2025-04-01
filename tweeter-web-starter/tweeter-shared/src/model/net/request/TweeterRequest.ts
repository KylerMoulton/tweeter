export interface TweeterRequest {
  readonly token: string;
}

export interface TweeterUserAliasRequest extends TweeterRequest{
    readonly userAlias: string;
}