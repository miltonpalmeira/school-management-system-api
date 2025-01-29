const express = require('express');
const config = require('./config/index.config.js');
const Cortex = require('ion-cortex');
const ManagersLoader = require('./loaders/ManagersLoader.js');

const mongoDB = config.dotEnv.MONGO_URI
  ? require('./connect/mongo')({
      uri: config.dotEnv.MONGO_URI,
    })
  : null;

const cache = require('./cache/cache.dbh')({
  prefix: config.dotEnv.CACHE_PREFIX,
  url: config.dotEnv.CACHE_REDIS,
});

const cortex = new Cortex({
  prefix: config.dotEnv.CORTEX_PREFIX,
  url: config.dotEnv.CORTEX_REDIS,
  type: config.dotEnv.CORTEX_TYPE,
  state: () => {
    return {};
  },
  activeDelay: '50ms',
  idlDelay: '200ms',
  redisOptions: {
    retryStrategy: (times) => {
      const MAX_RETRIES = 3;
      console.log('times: ', times);
      if (times > MAX_RETRIES) {
        console.log('Max retries reached. No more attempts.');
        return null; 
      }
      const delay = 100;
      console.log(`Retrying Cortex Redis connection in ${delay / 1000} sec...`);
      return delay;
    },
  },
});

const managersLoader = new ManagersLoader({ config, cache, cortex });
const managers = managersLoader.load();

managers.userServer.run();

const app = express();

app.get('/status', (req, res) => {
  res.json({
    mongo: mongoDB ? 'Connected' : 'Not connected',
    cache: cache ? 'Connected' : 'Not connected',
    cortex: cortex ? 'Connected' : 'Not connected',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
