import { type Db } from "mongodb";
import { getMongoClientInstance } from "../config/connection";

export type Product = {
    name: string;
    slug: string;
    description: string;
    experpt: string;
    price: number;
    tags: string[];
    thumbnail: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
};

const DATABASE_NAME = process.env.MONGODB_DB_NAME || "test";
const COLLECTION_PRODUCT = "Product";

export const getDb = async () => {
    const client = await getMongoClientInstance();
    const db: Db = client.db(DATABASE_NAME);

    return db;
};

const db = await getDb();

export const getProduct = async () => {
    const productsList = (await db
        .collection(COLLECTION_PRODUCT).find({}).toArray())


    return productsList
}

export const getProductBySlug = async (slug: string) => {
    const productBySlug = (await db.collection(COLLECTION_PRODUCT).findOne({
        slug: slug
    }))

    return productBySlug
}