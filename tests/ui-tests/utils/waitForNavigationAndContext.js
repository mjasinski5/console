/*
  This resolves an issue where puppeteer cannot interact with the page yet because
  a context is not defined. This is usually related to navigation.
  See also: https://github.com/GoogleChrome/puppeteer/issues/1325
*/

const promiseRetry = require('promise-retry');
const timeout = 1000;
const iv = 100;

module.exports = (page, maxTimeout = 120000) =>
  promiseRetry(
    async (retry, number) => {
      try {
        await page.evaluate(iv => {
          return new Promise((resolve, reject) => {
            checkReadyState();

            function checkReadyState() {
              if (document.readyState === 'complete') {
                resolve();
              } else {
                setTimeout(checkReadyState, iv);
              }
            }
          });
        }, iv);
      } catch (err) {
        if (
          err.message.indexOf(
            'Cannot find context with specified id undefined'
          ) !== -1
        ) {
          retry();
        } else {
          throw err;
        }
      }
    },
    {
      retries: Math.ceil(maxTimeout / timeout),
      minTimeout: timeout,
      maxTimeout: timeout
    }
  );
