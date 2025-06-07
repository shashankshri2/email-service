const Logger = {
  info(msg) {
    console.log('[INFO]', msg);
  },
  warn(msg) {
    console.warn('[WARN]', msg);
  },
  error(msg) {
    console.error('[ERROR]', msg);
  },
  success(msg) {
    console.log('[SUCCESS]', msg);
  }
};

module.exports = { Logger };
