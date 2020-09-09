const lsLoad = (item, persist = true) => {
  const storage = !persist ? sessionStorage : localStorage;
  try {
    const serializedState = storage.getItem(item);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const lsStore = (key, item, persist = true) => {
  const storage = !persist ? sessionStorage : localStorage;
  try {
    const stringified = JSON.stringify(item);
    if (stringified === null) {
      return null;
    }
    storage.setItem(key, stringified);
  } catch (error) {
    storage.setItem(key, item);
  }
};

export { lsLoad, lsStore };
