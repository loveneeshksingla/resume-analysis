export async function retry(fn, options = {}) {
  const {
    retries = 3,
    baseDelay = 300,
    factor = 2,
    shouldRetry = () => true,
    onRetry = () => {},
  } = options;

  let attempt = 0;

  while (attempt <= retries) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries || !shouldRetry(error)) {
        throw error;
      }

      const delay = baseDelay * Math.pow(factor, attempt);

      onRetry(error, attempt + 1);

      await sleep(delay);

      attempt++;
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}