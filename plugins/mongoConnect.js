const fastifyPlugin = require('fastify-plugin')
const MONGODB_URL = 'mongodb://localhost:27017/testdb'

async function dbConnector(fastify, options) {
    fastify.register(require('fastify-mongodb'), {
        url: options.mongodbUrl || MONGODB_URL
    })
}

module.exports = fastifyPlugin(dbConnector)