module.exports = function generateService(msName, actions, methods, hasDB, dbName, meta, events) {
  const version = 1;
  const fileData = 
` ${hasDB ? `const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
` : null}
module.exports = {
  name: ${msName},
  version: ${version},
  //requestTimeout: 3000,

  ${hasDB ? `mixins: [DbService],` : null}
  settings: {
    //port: 8080,
  },

  metadata: {
${
meta.map(m => 
`    "${m.name}": "${m.value}",`).join('\n')
}
  },
${hasDB ? `
  adapter: new SqlAdapter(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres', //'mysql'|'sqlite'|'postgres'|'mssql'

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },

    noSync: true // If true, the model will not be synced by Sequelize
  }),
  model: {
    /* name: "patients",
    define: {
      id: { 
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      //name: Sequelize.STRING,
      //surname: Sequelize.STRING,
      age: Sequelize.INTEGER,
      //status: Sequelize.BOOLEAN
    },
    options: {
      // Options from http://docs.sequelizejs.com/manual/tutorial/models-definition.html
    } */
  },

  afterConnected() {
    this.logger.info("Connected successfully");
  },

  entityCreated(json, ctx) {
    this.logger.info("New entity created!");
  },

  entityUpdated(json, ctx) {
    // You can also access to Context
  },

  entityRemoved(json, ctx) {
    this.logger.info("Entity removed", json);
  },` : null}

  actions: {
${
  actions.map(action =>
`    ${action.name}: {
      params: {
${action.parameters.map(parameter => 
`        "${parameter.name}": "${parameter.type}",`).join('\n')}
      },
      handler(ctx) {
        console.log('${msName}.${action.name} was called');
${
          action.calls.map(c => c.type === 'balanced_event' ?
`        await ctx.call("${c.microservice}.${c.action}", {}, { meta: {

        }});` 
            :
`        await ctx.broadcast("${c.microservice}.${c.action}", {}, { meta: {

        }});`)
}
        return '${msName}.${action.name} was called';
      }
    },`).join('\n')
    }
  },

  methods: {
    // Subscribe to event
${
      methods.map(method => 
`    ${method.name}: {
      params: {
        ${method.parameters.map(parameter => 
`         "${parameter.name}": "${parameter.type}",`).join('\n')}
      },
      handler(ctx) {
        console.log('${msName}.${method.name} was called');
        return '${msName}.${method.name} was called';
      }
    },
      `).join('\n')
    }
  },

  events: {
${
    events.map(event => 
`    "${event.name}"(ctx) {
      console.log('Event ${event.name} was triggered on ${msName} service');
    },`
    ).join('\n')}
  },

  created() {
    // Fired when the service instance created
  },

  async started() {
    // Fired when broker starts this service
  },

  async stopped() {
    // Fired when broker stops this service
  },
}
  `;

  return fileData;
}
