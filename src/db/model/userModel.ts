import { getMongoClientInstance } from "@/db/config/connection";
import { hashPassword } from "@/utils/bcryptjs";
import { type Db, ObjectId } from "mongodb";

export type UserModel = {
    _id: ObjectId;
    name: string;
    username: string;
    email: string;
    password: string;
}

export type UserModelCreateInput = Omit<UserModel, "_id">;

const DATABASE_NAME = process.env.MONGODB_DB_NAME || "test";
const COLLECTION_USER = "User";

export const getDb = async () => {
    const client = await getMongoClientInstance();
    const db: Db = client.db(DATABASE_NAME);

    return db;
};

export const getUsers = async () => {
    const db = await getDb();

    const users = (await db
        .collection(COLLECTION_USER)
        .find({})
        .project({ password: 0 })
        .toArray()) as UserModel[];

    return users;
}

export const getUserById = async (id: string) => {
    const db = await getDb();
    const objectId = new ObjectId(id);

    const user = (await db.collection(COLLECTION_USER).findOne(
        { _id: objectId },
        {
            projection: {
                password: 0,
            },
        },
    )) as UserModel;

    return user;
};


export const getUserByEmail = async (email: string) => {
    const db = await getDb();
    const user = (await db
        .collection(COLLECTION_USER)
        .findOne({ email: email })) as UserModel;

    return user;
};

export const registerUser = async (user: UserModelCreateInput) => {

    const modifiedUser: UserModelCreateInput = {
        ...user,
        password: hashPassword(user.password),
    };

    const db = await getDb();
    const result = await db.collection(COLLECTION_USER).insertOne(modifiedUser);

    return result;
}
