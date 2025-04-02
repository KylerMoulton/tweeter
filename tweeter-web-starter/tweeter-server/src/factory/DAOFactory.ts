import { UserDAO } from "../dao/UserDAO";
import { DynamoUserDAO } from "../dynamoDAO/DynamoUserDAO";

export class DAOFactory {
    static getDynamoUserDAO(): UserDAO {
        return new DynamoUserDAO();
    }
}
