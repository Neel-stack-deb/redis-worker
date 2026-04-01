import express from 'express';
import { Queue } from 'bullmq';

const app = express();
const port = process.env.PORT || 3000;
const QUEUE_NAME = 'demo-queue';

app.use(express.json());

// Simple health endpoint
app.get('/health', (req, res) => res.json({ ok: true }));

// Enqueue a job via HTTP POST. Body: { name, data, opts }
const producerQueue = new Queue(QUEUE_NAME);
app.post('/enqueue', async (req, res) => {
  try {
    const { name = 'httpJob', data = {}, opts = {} } = req.body || {};
    const job = await producerQueue.add(name, data, opts);
    res.json({ id: job.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function shutdown(signal) {
  console.log(`Received ${signal}, closing server and queue...`);
  try {
    await producerQueue.close();
  } catch (e) {
    console.error('Error closing producer queue', e);
  }
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));