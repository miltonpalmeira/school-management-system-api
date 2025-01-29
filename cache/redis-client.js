const Redis = require('ioredis');

const runTest = async (redis, prefix) => {
  try {
    const key = `${prefix}:test:${new Date().getTime()}`;
    await redis.set(key, 'Redis Test Done.');
    let data = await redis.get(key);
    console.log(`Cache Test Data: ${data}`);
    redis.del(key);
  } catch (error) {
    console.error('Failed to run Redis test:', error.message);
  }
};

const createClient = ({ prefix, url }) => {
  console.log({ prefix, url });
  let redis;

  try {
    redis = new Redis(url, {
      keyPrefix: prefix + ':',
      retryStrategy: (times) => {
        if (times > 3) return null;
        const delay = 1000;
        console.log(`Retrying Redis connection in ${delay / 1000}ms...`);
        return delay;
      },
    });

    //register client events
    redis.on('error', (error) => {
      console.log('error', error);
    });

    redis.on('end', () => {
      console.log('shutting down service due to lost Redis connection');
    });

    runTest(redis, prefix);

    return redis;
  } catch (error) {
    console.error('Failed to connect to Redis:', error.message);
    if (redis) {
      redis.disconnect();
    }
    throw new Error('Redis connection failed. Check your configuration.');
  }
};

exports.createClient = createClient;
