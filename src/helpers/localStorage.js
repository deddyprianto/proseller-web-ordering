const lsLoad = (item) => {
  try {
    const serializedState = localStorage.getItem(item);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const lsStore = (key, item) => {
  try {
    const stringified = JSON.stringify(item);
    if (stringified === null) {
      return null;
    }
    localStorage.setItem(key, stringified);
  } catch (error) {
    localStorage.setItem(key, item);
  }
};

export { lsLoad, lsStore };
