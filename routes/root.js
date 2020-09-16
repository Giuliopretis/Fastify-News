'use strict'

const schemas = require('../schemas')

// const opts = require('./optionsRoute')

module.exports = async function (fastify, opts) {
  const collection = fastify.mongo.db.collection('news')
  const newsSchema = schemas.news
  const properties = newsSchema.properties

  // inserted cors to get data in ionic app
  const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100'
  ];

  fastify.register(require('fastify-cors'), {
    allowedOrigins
  })

  const response = {
    200: {
      type: 'object',
      properties
    }
  }

  const getOpts = {
    schema: {
      response: {
        200: {
          type: 'array',
          items: newsSchema
        }
      }
    }
  }

  const getByIdOpts = {
    schema: {
      response
    }
  }

  const postOpts = {
    schema: {
      response,
      body: newsSchema
    }
  }

  const patchOpts = {
    schema: {
      response,
      body: newsSchema
    }
  }

  const deleteOpts = {
    schema: {
      response
    }
  }

  fastify.get('/', async function (request, reply) {
    return { message: 'Welcome to news app' }
  })

  fastify.get('/news', getOpts, async (request, reply) => {
    const result = await collection.find().toArray()
    if (result.length === 0) {
      return { message: 'There is no news' }
    }
    return result
  })

  fastify.get('/news/:id', getByIdOpts, async (request, reply) => {
    const _id = getIdFromParams(request)

    const result = await collection.findOne({ _id })

    if (result) {
      return result
    }

    return { message: 'News not found' }
  })

  fastify.post('/news', postOpts, async (request, reply) => {
    const news = request.body
    // for tests
    // when i test i create the id as string and not an objectid
    // so i need to convert it 
    if (request.body._id) {
      request.body._id = fastify.mongo.ObjectId(request.body._id)
    }
    const result = await collection.insertOne(news)
    return result.ops[0]
  })

  fastify.patch('/news/:id', patchOpts, async (request, reply) => {
    const _id = getIdFromParams(request)
    const title = request.body.title

    const result = await collection.findOneAndUpdate({
      _id
    }, {
      $set: { title }
    }, {
      returnOriginal: false
    })

    return result.value
  })

  fastify.delete('/news/:id', deleteOpts, async (request, reply) => {
    const _id = getIdFromParams(request)
    try {
      const result = await collection.findOneAndDelete({ _id })
      return result
    } catch (error) {
      console.log(error);
      return error
    }
  })

  fastify.delete('/dropnews', deleteOpts, async (request, reply) => {
    try {
      const result = await collection.deleteMany({})
      return result
    } catch (error) {
      console.log(error);
      return error
    }
  })

  const getIdFromParams = (request) => {
    const _id = fastify.mongo.ObjectId(request.params.id)
    return _id
  }

}
