import { AuthTokenDAO } from "../dao/AuthTokenDAO";
import { UserDAO } from "../dao/UserDAO";
import { DynamoAuthTokenDAO } from "../dynamoDAO/DynamoAuthTokenDAO";
import { DynamoUserDAO } from "../dynamoDAO/DynamoUserDAO";

export class DAOFactory {
    static getDynamoUserDAO(): UserDAO {
        return new DynamoUserDAO();
    }
    static getDynamoAuthTokenDAO(): AuthTokenDAO {
        return new DynamoAuthTokenDAO();
    }
}
