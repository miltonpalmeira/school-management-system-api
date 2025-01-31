jest.doMock('./cache/cache.dbh', () => ({
  connect: jest.fn().mockResolvedValue(null),
  disconnect: jest.fn().mockResolvedValue(null),
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK'),
  del: jest.fn().mockResolvedValue(1),
}));

jest.doMock('./loaders/ManagersLoader.js', () => {
  return jest.fn().mockImplementation(() => ({
    load: jest.fn().mockReturnValue({
      userServer: {
        run: jest.fn(),
      },
    }),
  }));
});

jest.doMock('./app.js', () => {
  const express = require('express');
  const app = express();
  app.use(express.json());
  return app;
});

jest.resetModules();
