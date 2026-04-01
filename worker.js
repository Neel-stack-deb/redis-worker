import { Worker, QueueScheduler } from 'bullmq';
import IORedis from 'ioredis';

const QUEUE_NAME = 'demo-queue';
const connection = new IORedis({ maxRetriesPerRequest: null });

// QueueScheduler is recommended in production to handle stalled jobs and retries
const scheduler = new QueueScheduler(QUEUE_NAME, { connection });

const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    console.log(`Processing job ${job.id} (${job.name}) with data:`, job.data);
    // Example: return a value for the 'completed' event
    if (job.name === 'failJob') throw new Error('Intentional failure');
    return { processedAt: new Date().toISOString() };
  },
  { connection, concurrency: 5 },
);

worker.on('completed', (job, returnvalue) => {
  console.log(`Job ${job.id} completed ->`, returnvalue);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err?.message || err);
});

async function shutdown(signal) {
  console.log(`Worker shutting down (${signal})...`);
  try {
    await worker.close();
    await scheduler.close();
    await connection.disconnect();
  } catch (err) {
    console.error('Error during worker shutdown', err);
  }
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));