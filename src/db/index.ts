import { createClient } from "redis";

console.log(`redis://${process.env.REDIS_HOST || "localhost"}:${process.env.REDIS_PORT || "6379"}`)


export const client = createClient({
    url: `redis://${process.env.REDIS_HOST || "localhost"}:${process.env.REDIS_PORT || "6379"}`,
});

export const connectRedis = async () => {
    await client.connect();

    client.on("error", (error) => {
        console.log(error);
    })

    client.on("connect", () => {
        console.log("Redis connected");
    });
}