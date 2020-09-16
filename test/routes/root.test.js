'use strict'

const { test } = require('tap')
const { build } = require('../helper')
const messages = require('../../returnMessages')

const _ID = '5f6070b96a363a1719f080fa'
const WRONG_ID = '5f6170b96a363a1719f080fa'
const body = {
  _id: _ID,
  title: 'The title',
  number: 988677,
  author: 'Autorone'
}

const postNews = async (app) => {
  await app.inject({
    method: 'POST',
    url: '/news',
    body
  })
}

const cleanDb = async (app) => {
  // await clean(app.mongo.client.db('testdb'))
  await app.inject({
    method: 'DELETE',
    url: '/dropnews',
  })
}

// ======================= GET ================================

// get all news and check that return the news
test('GET/news', async (t) => {
  const app = build(t)
  await cleanDb(app)
  await postNews(app)

  t.tearDown(() => app.close())

  const getAllNews = await app.inject({
    method: 'GET',
    url: '/news'
  })

  const allNews = JSON.parse(getAllNews.payload)
  const news = allNews[0]
  t.deepEquals(news, body)
})

// get all news and check that don't return the news
test('GET/news but empty', async (t) => {
  const app = build(t)
  // postNews(app)
  await cleanDb(app)
  // non butta giù il db
  t.tearDown(() => app.close())

  const getAllNews = await app.inject({
    method: 'GET',
    url: '/news'
  })

  const allNews = JSON.parse(getAllNews.payload)
  t.deepEquals(allNews, messages.notFoundMessage)
})

test('GET/newsById', async (t) => {
  const app = build(t)
  await cleanDb(app)
  await postNews(app)

  t.tearDown(() => app.close())

  const getNews = await app.inject({
    method: 'GET',
    url: `/news/${_ID}`
  })

  const news = JSON.parse(getNews.payload)
  console.log(news);
  t.deepEquals(news, body)
})

test('GET/byIdNoReturnNews', async (t) => {
  const app = build(t)
  await postNews(app)

  t.tearDown(() => app.close())

  const getNews = await app.inject({
    method: 'GET',
    url: `/news/${WRONG_ID}`
  })

  const news = JSON.parse(getNews.payload)
  t.match(news, messages.notFoundMessage)
})

test('GET/byIdWrongId', async (t) => {
  const app = build(t)
  await postNews(app)

  t.tearDown(() => app.close())

  const getNews = await app.inject({
    method: 'GET',
    url: `/news/wrong`
  })

  const news = JSON.parse(getNews.payload)
  t.match(news, messages.wrongIdMessage)
})
// ======================= GET ================================

// ======================= POST ================================
test('POST/postNormalNews', async (t) => {
  const app = build(t)
  await cleanDb(app)

  t.tearDown(() => app.close())

  const getNews = await app.inject({
    method: 'POST',
    url: `/news`,
    body
  })

  const news = JSON.parse(getNews.payload)
  t.match(news, body)
})

test('POST/postNormalNewsNoTitle', async (t) => {
  const app = build(t)

  await cleanDb(app)

  const newBody = body;
  delete newBody.title

  t.tearDown(() => app.close())

  const getNews = await app.inject({
    method: 'POST',
    url: `/news`,
    body: newBody
  })

  const news = JSON.parse(getNews.payload)
  t.match(news, messages.noTitleMessage)
})

test('POST/postNormalNewsNoBody', async (t) => {
  const app = build(t)
  delete body.title

  t.tearDown(() => app.close())

  const getNews = await app.inject({
    method: 'POST',
    url: `/news`
  })

  const news = JSON.parse(getNews.payload)
  t.match(news, messages.wrongBodyMessage)
})
// ======================= POST ================================

// ======================= PATCH ================================

test('PATCH/patchNews', async (t) => {
  const app = build(t)
  await postNews(app)

  const newBody = body;
  newBody.title = 'New super title'

  t.tearDown(() => app.close())

  const getNews = await app.inject({
    method: 'PATCH',
    url: `/news/${_ID}`,
    body: newBody
  })

  const news = JSON.parse(getNews.payload)
  t.match(news, newBody)
  await cleanDb(app)
})

test('PATCH/patchWithoutBody', async (t) => {
  const app = build(t)
  await postNews(app)

  t.tearDown(() => app.close())

  const getNews = await app.inject({
    method: 'PATCH',
    url: `/news/${_ID}`,
  })

  const news = JSON.parse(getNews.payload)
  t.match(news, {})
  await cleanDb(app)
})

test('PATCH/patchWrongId', async (t) => {
  const app = build(t)
  await postNews(app)

  t.tearDown(() => app.close())

  const getNews = await app.inject({
    method: 'PATCH',
    url: `/news/wrongid`,
    body
  })

  const news = JSON.parse(getNews.payload)
  t.match(news, messages.wrongIdMessage)
  await cleanDb(app)
})

test('PATCH/patchNoId', async (t) => {
  const app = build(t)
  await postNews(app)

  t.tearDown(() => app.close())

  const getNews = await app.inject({
    method: 'PATCH',
    url: `/news/${WRONG_ID}`,
    body
  })

  const news = JSON.parse(getNews.payload)
  t.match(news, messages.nullToJSONMessage)
  await cleanDb(app)
})
// ======================= PATCH ================================

// ======================= DELETE ================================

test('DELETE/deleteNews', async (t) => {
  const app = build(t)
  await cleanDb(app)
  await postNews(app)

  t.tearDown(() => app.close())

  const getNews = await app.inject({
    method: 'DELETE',
    url: `/news/${_ID}`
  })

  const news = JSON.parse(getNews.payload)
  t.match(news, {})
})

test('DELETE/deleteNewsNoId', async (t) => {
  const app = build(t)
  await cleanDb(app)
  await postNews(app)

  t.tearDown(() => app.close())

  const getNews = await app.inject({
    method: 'DELETE',
    url: `/news/${WRONG_ID}`
  })

  const news = JSON.parse(getNews.payload)
  t.match(news, messages.notFoundMessage)
})

test('DELETE/deleteNewsWrongId', async (t) => {
  const app = build(t)
  await cleanDb(app)
  await postNews(app)

  t.tearDown(() => app.close())

  const getNews = await app.inject({
    method: 'DELETE',
    url: `/news/wrongid`
  })

  const news = JSON.parse(getNews.payload)
  t.match(news, messages.wrongIdMessage)
})