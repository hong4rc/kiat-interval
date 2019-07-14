/**
 * @param {()=>Promise} action
 * @param {()=>number} getNext time delay each promise
 * @param {boolean} immediate run action in first time
 * @return {()=>void} stop timeout
 */
module.exports = (action, getNext, immediate = true) => {
  let isRunning = true;
  let timeoutId = 0;

  let next;
  if (typeof getNext !== 'function') {
    const delta = Number(getNext) || 0;
    next = () => delta;
  } else {
    next = getNext;
  }
  const runner = () => {
    timeoutId = setTimeout(() => {
      action().finally(() => {
        if (isRunning) {
          runner();
        }
      });
    }, next());
  };

  const stop = () => {
    isRunning = false;
    clearTimeout(timeoutId);
  };
  (immediate ? action() : Promise.resolve({})).finally(runner);
  return stop;
};
