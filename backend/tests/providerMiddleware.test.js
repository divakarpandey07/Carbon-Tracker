const test = require('node:test');
const assert = require('node:assert/strict');
const { requireVerifiedProvider } = require('../middleware/providerMiddleware');

test('allows verified provider accounts to access provider routes even if role remains user', () => {
  const req = {
    user: {
      role: 'user',
      providerStatus: 'verified',
    },
  };

  let statusCode;
  let responseBody;
  let nextCalled = false;

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      responseBody = body;
      return this;
    },
  };

  requireVerifiedProvider(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(statusCode, undefined);
  assert.equal(responseBody, undefined);
});
