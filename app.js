const express = require('express');
const config = require('./config/index.config.js');
const Cortex = require('ion-cortex');
const ManagersLoader = require('./loaders/ManagersLoader.js');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/auth.routes');
const classroomRoutes = require('./routes/classroom.routes');
const schoolRoutes = require('./routes/school.routes');
const studentRoutes = require('./routes/student.routes');
const userRoutes = require('./routes/user.routes.js');

const isTestEnvironment = process.env.NODE_ENV === 'test';
const PORT = isTestEnvironment ? 30001 : process.env.PORT || 3000;

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the School Management System', // API description
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Local Development Server',
      },
    ],
  },
  apis: ['./controllers/**/*.js', './models/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const mongoDB = config.dotEnv.MONGO_URI
  ? require('./connect/mongo')({
      uri: config.dotEnv.MONGO_URI,
    })
  : null;

const cache = isTestEnvironment
  ? {
      set: () => Promise.resolve(),
      get: () => Promise.resolve(null),
      del: () => Promise.resolve(),
    }
  : require('./cache/cache.dbh')({
      prefix: config.dotEnv.CACHE_PREFIX,
      url: config.dotEnv.CACHE_REDIS,
    });

const cortex = isTestEnvironment
  ? {
      run: () => {},
      load: () => {},
    }
  : new Cortex({
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
          if (times > MAX_RETRIES) {
            console.log('Max retries reached. No more attempts.');
            return null;
          }
          const delay = 100;
          console.log(
            `Retrying Cortex Redis connection in ${delay / 1000} sec...`
          );
          return delay;
        },
      },
    });

const managersLoader = new ManagersLoader({ config, cache, cortex });
const managers = managersLoader.load();

managers.userServer.run();

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/users', userRoutes);

app.get('/status', (req, res) => {
  res.json({
    mongo: mongoDB ? 'Connected' : 'Not connected',
    cache: cache ? 'Connected' : 'Not connected',
    cortex: cortex ? 'Connected' : 'Not connected',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});