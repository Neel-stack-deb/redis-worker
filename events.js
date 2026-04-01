import { QueueEvents } from 'bullmq';

const QUEUE_NAME = 'demo-queue';
const queueEvents = new QueueEvents(QUEUE_NAME);

await queueEvents.waitUntilReady();

queueEvents.on('waiting', ({ jobId }) => {
  console.log(`A job with ID ${jobId} is waiting`);
});

queueEvents.on('active', ({ jobId, prev }) => {
  console.log(`Job ${jobId} is now active; previous status was ${prev}`);
});

queueEvents.on('completed', ({ jobId, returnvalue }) => {
  console.log(`Job ${jobId} has completed and returned`, returnvalue);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.log(`Job ${jobId} has failed with reason`, failedReason);
});

process.on('SIGINT', async () => {
  console.log('Closing QueueEvents...');
  await queueEvents.close();
  process.exit(0);
});