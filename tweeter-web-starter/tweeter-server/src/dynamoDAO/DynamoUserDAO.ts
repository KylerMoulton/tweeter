import { UserDAO } from "../dao/UserDAO";
import {
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
        const command = new GetCommand({
            TableName: this.tableName,
            Key: { alias: alias }
        });

        const result = await this.client.send(command);
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

        await this.client.send(new PutCommand({
            TableName: this.tableName,
            Item: {firstName, lastName, alias, imageUrl, password}

        }));


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
            throw new Error(`Item ${item} is null or password ${item?.password} is null`)
            return null
        }
        if (!(await bcrypt.compare(password, item.password))) {
            throw new Error(`Password ${password} does not match data base password ${item.password}`)
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
}
