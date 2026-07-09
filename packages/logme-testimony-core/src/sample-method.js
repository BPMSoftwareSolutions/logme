function sampleMethod(firstName, lastName) {
  if (process.env.LOGME_AUDIT === '1') {
    const { LogMe } = require('./LogMe');
    LogMe(sampleMethod);
  }

  return `${firstName} ${lastName}`.trim();
}

module.exports = { sampleMethod };
