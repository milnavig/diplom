
module.exports = function generatePackage() {
  const package = 
`{
  "name": "molecular",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "moleculer-runner --repl --hot services/**/*.service.js",
    "start": "moleculer-runner",
    "cli": "moleculer connect NATS",
    "ci": "jest --watch",
    "test": "jest --coverage",
    "dc:up": "docker-compose up --build -d",
    "dc:logs": "docker-compose logs -f",
    "dc:down": "docker-compose down"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "moleculer": "^0.14.19",
    "moleculer-db": "^0.8.17",
    "moleculer-db-adapter-sequelize": "^0.2.13",
    "moleculer-web": "^0.10.4",
    "nats": "^2.6.0",
    "pg": "^8.7.3",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.15.1"
  }
}
`;
  return package;
}
