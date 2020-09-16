const schemas = {
    news: {
        type: 'object',
        properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            number: { type: 'number' },
            author: { type: 'string' },
            message: { type: 'string' }
        },
        required: ['title']
    }
}

module.exports = schemas