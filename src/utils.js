const isObject = (obj) => {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

const getSizeOfStringInBytes = (string) => {
  return Buffer.byteLength(string, 'utf8');
}

const uniqueArray = (array) => {
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  return array.filter(onlyUnique);
}

module.exports = {
  isObject,
  getSizeOfStringInBytes,
  uniqueArray,
}
