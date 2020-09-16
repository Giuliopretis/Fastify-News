'use strict'

// This file contains code that we reuse
// between our tests.

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const App = require('../app')
const path = require('path')
const AutoLoad = require('fastify-autoload')

// Fill in this config with all the configurations
// needed for testing the application
function config() {
  // configurazione db test
  const mongodbUrl = 'mongodb://localhost:27017/testdb'
  const isTest = true
  return { mongodbUrl, isTest }
}

// automatically build and tear down our instance
function build(t) {
  const app = Fastify()

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  app.register(fp(App), config())

  // tear down our app after we are done
  t.tearDown(app.close.bind(app))

  return app
}

module.exports = {
  config,
  build
}
