import packageJson from '../package.json';

const config = {
  port: process.env.PORT,
  db: {
    uri: process.env.DB_URI,
  },
};

export const swaggerSettings = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FlashCards API',
      version: packageJson.version,
    },
    servers: [{ url: `http://localhost:${config.port}` }],
  },
  apis: ['**/*.yaml'],
};

export default config;
