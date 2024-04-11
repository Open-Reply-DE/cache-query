const waitForExpect = function waitForExpect(
  expectation: () => void | Promise<void>,
  options: { timeout: number; interval: number } = {
    timeout: 4500,
    interval: 50,
  }
) {
  const { timeout, interval: optionInterval } = options;
  const interval = optionInterval < 1 ? 1 : optionInterval;

  const maxTries = Math.ceil(timeout / interval);
  let tries = 0;
  return new Promise<void>((resolve, reject) => {
    const rejectOrRerun = (error: Error) => {
      if (tries > maxTries) {
        reject(error);
        return;
      }
      setTimeout(runExpectation, interval);
    };
    function runExpectation() {
      tries += 1;
      try {
        Promise.resolve(expectation())
          .then(() => resolve())
          .catch(rejectOrRerun);
      } catch (error) {
        rejectOrRerun(error as Error);
      }
    }
    setTimeout(runExpectation, 0);
  });
};

export default waitForExpect;
