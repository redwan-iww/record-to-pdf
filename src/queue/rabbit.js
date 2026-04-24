// rabbitmq connection + queue setup
import amqp from "amqplib";
import { RABBIT_URL, QUEUE_NAME, DLX, DLQ } from "../config.js";

let conn = null;

async function connect() {
  if (conn) return conn;
  conn = await amqp.connect(RABBIT_URL);

  conn.on("close", () => {
    console.log("rabbit connection closed");
    conn = null;
  });
  conn.on("error", (err) => {
    console.error("rabbit error:", err.message);
  });

  return conn;
}

export async function close() {
  if (conn) {
    try {
      await conn.close();
    } catch (e) {
      // already closed
    }
    conn = null;
  }
}

// creates the channel and sets up all the queues / dead letter exchange
export async function createChannel() {
  const connection = await connect();
  const ch = await connection.createChannel();

  // dead letter setup so failed jobs don't just disappear
  await ch.assertExchange(DLX, "direct", { durable: true });
  await ch.assertQueue(DLQ, { durable: true });
  await ch.bindQueue(DLQ, DLX, "dead");

  await ch.assertQueue(QUEUE_NAME, {
    durable: true,
    deadLetterExchange: DLX,
    deadLetterRoutingKey: "dead",
  });

  return ch;
}
