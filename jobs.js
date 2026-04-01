import { Queue } from 'bullmq';

// Producer example - demonstrates several real-world job types
const QUEUE_NAME = 'demo-queue';
const myQueue = new Queue(QUEUE_NAME);

async function addJobs() {
  console.log('Adding sample jobs to', QUEUE_NAME);

  // 1) Simple immediate job
  await myQueue.add('sendWelcomeEmail', { userId: 42, email: 'user@example.com' });

  // 2) Job with retries and backoff
  await myQueue.add(
    'processPayment',
    { orderId: 123 },
    { attempts: 3, backoff: { type: 'fixed', delay: 2000 } },
  );

  // 3) Delayed job (e.g., reminders)
  await myQueue.add('sendReminder', { userId: 42 }, { delay: 1000 * 60 * 5 });

  // 4) High-priority job
  await myQueue.add('generateReport', { reportId: 'r1' }, { priority: 1 });

  // 5) Repeatable job (every minute) - shows scheduling capability
  await myQueue.add(
    'cleanupTemp',
    { folder: '/tmp' },
    { repeat: { cron: '* * * * *' } },
  );

  console.log('All jobs added. Closing producer connection...');
}

await addJobs();

// Close the Queue's Redis connections so Node can exit cleanly
await myQueue.close();
console.log('Producer exited.');