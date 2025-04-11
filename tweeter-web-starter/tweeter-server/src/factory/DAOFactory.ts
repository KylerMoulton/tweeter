import { AuthTokenDAO } from "../dao/AuthTokenDAO";
import { FollowDAO } from "../dao/FollowDAO";
import { StatusDAO } from "../dao/StatusDAO";
import { UserDAO } from "../dao/UserDAO";
import { DynamoAuthTokenDAO } from "../dynamoDAO/DynamoAuthTokenDAO";
import { DynamoFollowDAO } from "../dynamoDAO/DynamoFollowDAO";
import { DynamoStatusDAO } from "../dynamoDAO/DynamoStatusDAO";
import { DynamoUserDAO } from "../dynamoDAO/DynamoUserDAO";

export class DAOFactory {
    static getDynamoUserDAO(): UserDAO {
        return new DynamoUserDAO();
    }
    static getDynamoAuthTokenDAO(): AuthTokenDAO {
        return new DynamoAuthTokenDAO();
    }
    static getDynamoStatusDAO(): StatusDAO {
        return new DynamoStatusDAO();
    }
    static getDynamoFollowDAO(): FollowDAO {
        return new DynamoFollowDAO();
    }
}
