const schemas = require('./schemas')
const news = schemas.news

const opts = {
    newsGetOpts: {
        schema: {
            response: {
                200: {
                    type: 'array',
                    items: news
                }
            }
        }
    },
    newsResponse: {
        200: {
            type: 'object',
            properties: news.properties
        }
    },
    newsGetByIdOpts: {
        schema: {
            response: {
                200: {
                    type: 'array',
                    items: news
                }
            }
        }
    },
    newsPostOpts: {
        schema: {
            response: {
                200: {
                    type: 'array',
                    items: news
                }
            },
            body: news
        }
    },
    newsPatchOpts: {
        schema: {
            response: {
                200: {
                    type: 'array',
                    items: news
                }
            },
            body: news
        }
    },
    newsDeleteOpts: {
        schema: {
            response: {
                200: {
                    type: 'array',
                    items: news
                }
            }
        }
    },
}

module.exports = opts