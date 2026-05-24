import { createClient } from "redis";

export const redisConnection = {
  host: "127.0.0.1",
  port: 6379,
};

// Optional: test connection
export async function connectRedis() {
  const client = createClient({
    url: `redis://${redisConnection.host}:${redisConnection.port}`,
  });

  client.on("error", (err) => console.error("Redis Error:", err));

  await client.connect();
  console.log("✅ Redis Connected");

  return client;
}