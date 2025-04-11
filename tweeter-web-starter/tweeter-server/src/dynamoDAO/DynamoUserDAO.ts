import { UserDAO } from "../dao/UserDAO";
import {
    BatchGetCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { UserDto, AuthTokenDto, AuthToken } from "tweeter-shared";
import bcrypt from "bcryptjs";
import { DynamoDBClientSingleton } from "../factory/DynamoDBClientSingleton";


export class DynamoUserDAO implements UserDAO {
    private readonly client = DynamoDBClientSingleton.getClient();
    private readonly tableName = "Users";
    private readonly s3 = new S3Client();

    async getUser(alias: string): Promise<UserDto | null> {
        const sanitizedAlias = alias.startsWith("@") ? alias.slice(1) : alias;
        const command = new GetCommand({
            TableName: this.tableName,
            Key: { alias: sanitizedAlias }
        });

        const result = await this.client.send(command);
        if (!result.Item) {
            throw new Error(`The getUser request failed, looking for ${sanitizedAlias}, got ${result.Item}`)
        }
        return result.Item as UserDto || null;
    }

    async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<UserDto> {
        const imageUrl = await this.uploadImage(imageBytes, imageFileExtension, alias)
        const user: UserDto = {
            firstName,
            lastName,
            alias,
            imageUrl
        };

        try {
            await this.client.send(new PutCommand({
                TableName: this.tableName,
                Item: { firstName, lastName, alias, imageUrl, password }
            }));
        } catch (error) {
            throw new Error("[Bad Request] User already exists");
        }
        return user;
    }

    async login(alias: string, password: string): Promise<UserDto | null> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: { alias: alias }
        });
    
        const result = await this.client.send(command);
        const item = result.Item;
        if (!item || !item.password) {
            throw new Error(`[Bad Request] Invalid alias or password`)
        }
        if (!(await bcrypt.compare(password, item.password))) {
            throw new Error(`[Bad Request] Invalid alias or password`)
        }
        
        const { firstName, lastName, imageUrl } = item;
        return { firstName, lastName, alias, imageUrl } as UserDto;
    }

    async uploadImage (userImageBytes: Uint8Array, imageFileExtension: string, username: string): Promise<string> {
        const key = `${username}.${imageFileExtension}`
        await this.s3.send(new PutObjectCommand({
            Bucket: 'tweeterimageskyler',
            Key: key,
            Body: userImageBytes,
            ContentType: `image/${imageFileExtension}`
        }));
        return `https://tweeterimageskyler.s3.us-east-1.amazonaws.com/${key}`
    }

    async LoadMoreUsers(usersAliasToLoad: string[]): Promise<UserDto[]> {
        if (usersAliasToLoad.length === 0) return [];
    
        const keys = usersAliasToLoad.map(alias => ({ alias }));
    
        const result = await this.client.send(new BatchGetCommand({
            RequestItems: {
                [this.tableName]: {
                    Keys: keys
                }
            }
        }));
    
        const users = result.Responses?.[this.tableName] || [];
    
        return users.map(user => {
            const { firstName, lastName, alias, imageUrl } = user;
            return { firstName, lastName, alias, imageUrl } as UserDto;
        });
    }
}
