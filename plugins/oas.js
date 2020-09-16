'use strict'

const fp = require('fastify-plugin')
const oas = require('fastify-oas')

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(async function (fastify, opts) {
    fastify.register(oas, {
        routePrefix: '/documentation',
        swagger: {
            info: {
                title: 'Test openapi',
                description: 'testing the fastify swagger api',
                version: '0.1.0',
            },
            externalDocs: {
                url: 'https://swagger.io',
                description: 'Find more info here',
            },
            consumes: ['application/json'],
            produces: ['application/json'],
        },
        exposeRoute: true
    });

    fastify.ready(err => {
        if (err) throw err
        fastify.oas()
    })
})
