const messages = {
    wrongIdMessage: { message: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters' },
    notFoundMessage: { message: 'News not found' },
    noTitleMessage: { message: "body should have required property 'title'" },
    wrongBodyMessage: { message: 'body should be object' },
    nullToJSONMessage: { message: "Cannot read property 'toJSON' of null" }
}

module.exports = messages