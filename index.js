Error.stackTraceLimit = Infinity;

const loaded = require("./utils/loader/")

module.exports = loaded


console.log(Object.keys(loaded))