import { createClient } from "redis";


export const client = createClient();

export const connectRedis = async () => {
    await client.connect();

    client.on("error", (error) => {
        console.log(error);
    })

    client.on("connect", () => {
        console.log("Redis connected");
    });
}