function handleDTOerrors(dto) {
  for (const [key, value] of Object.entries(dto)) {
    if (!value) {
      throw new Error(`Please provide a valid ${key}`);
    }
  }
};

module.exports = {
  handleDTOerrors,
};
