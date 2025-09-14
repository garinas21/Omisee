import { Db, ObjectId } from "mongodb";
import { getMongoClientInstance } from "@/db/config/connection";
import { Product } from "./productModel";

export type WishlistModel = {
    _id: ObjectId;
    userId: ObjectId;
    productId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export type WishlistModelWithProduct = {
    _id: ObjectId;
    userId: ObjectId;
    productId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    product: Product
}

const DATABASE_NAME = process.env.MONGODB_DB_NAME || "test";
const COLLECTION_WISHLIST = "Wishlist";

export const getDb = async () => {
    const client = await getMongoClientInstance();
    const db: Db = client.db(DATABASE_NAME);

    return db;
};

const db = await getDb();

export const getWishlistsByUser = async (
    userId: string
): Promise<WishlistModel[]> => {
    const userObjectId = ObjectId.createFromHexString(userId);

    const wishlists = await db
        .collection(COLLECTION_WISHLIST)
        .find({ userId: userObjectId })
        .toArray();

    return wishlists as WishlistModel[];
};

export const getWishlistsWithProductsByUser = async (
    userId: string
): Promise<WishlistModelWithProduct[]> => {
    const userObjectId = new ObjectId(userId);

    const wishlists = await db
        .collection(COLLECTION_WISHLIST)
        .aggregate([
            { $match: { userId: userObjectId } },
            {
                $lookup: {
                    from: "Product",
                    let: { pid: "$productId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        "$_id",
                                        {
                                            $cond: [
                                                { $eq: [{ $type: "$$pid" }, "objectId"] },
                                                "$$pid",
                                                { $toObjectId: "$$pid" }
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                slug: 1,
                                name: 1,
                                price: 1,
                                tags: 1,
                                thumbnail: 1,
                                images: 1,
                                createdAt: 1,
                                updatedAt: 1,
                                description: 1,
                                experpt: 1
                            }
                        }
                    ],
                    as: "product"
                }
            },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: false } },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    productId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    product: 1
                }
            }
        ])
        .toArray();

    return wishlists as WishlistModelWithProduct[];
};


export const addWishlist = async (
    userId: string,
    productId: string
): Promise<WishlistModel> => {
    const userObjectId = ObjectId.createFromHexString(userId);
    const productObjectId = ObjectId.createFromHexString(productId);

    const existing = await db.collection(COLLECTION_WISHLIST).findOne({
        userId: userObjectId,
        productId: productObjectId,
    });

    if (existing) {
        throw new Error("Product already exists in wishlist.");
    }

    const newWishlist = {
        userId: userObjectId,
        productId: productObjectId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTION_WISHLIST).insertOne(newWishlist);
    return { _id: result.insertedId, ...newWishlist };
};

export const deleteWishlist = async (
    userId: string,
    productId: string
): Promise<boolean> => {
    const userObjectId = ObjectId.createFromHexString(userId);
    const productObjectId = ObjectId.createFromHexString(productId);

    const result = await db.collection(COLLECTION_WISHLIST).deleteOne({
        userId: userObjectId,
        productId: productObjectId,
    });

    return result.deletedCount > 0;
};