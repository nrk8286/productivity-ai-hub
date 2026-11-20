const assert = require('node:assert/strict');
const test = require('node:test');
const config = require('../next.config.js');

test('CORS stays same-origin by default and permits only a configured exact origin', async () => {
  const original = process.env.ALLOWED_ORIGINS;
  try {
    delete process.env.ALLOWED_ORIGINS;
    assert.deepEqual(await config.headers(), []);
    process.env.ALLOWED_ORIGINS = 'https://frontend.example.test';
    const [{ headers }] = await config.headers();
    assert.equal(headers.find(h => h.key === 'Access-Control-Allow-Origin').value, process.env.ALLOWED_ORIGINS);
    assert.equal(headers.find(h => h.key === 'Access-Control-Allow-Credentials').value, 'true');
    for (const invalid of ['*', 'https://one.example,https://two.example', 'https://example.test/path']) {
      process.env.ALLOWED_ORIGINS = invalid;
      await assert.rejects(config.headers());
    }
  } finally {
    if (original === undefined) delete process.env.ALLOWED_ORIGINS;
    else process.env.ALLOWED_ORIGINS = original;
  }
});
