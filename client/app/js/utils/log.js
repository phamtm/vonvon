const Logger = function(enabled) {
  this._enabled = enabled;
};

Logger.prototype.debug = function(msg) {
  if (this._enabled) {
    console.log(msg);
  }
};

Logger.prototype.info = function(msg) {
  if (this._enabled) {
    console.log(msg);
  }
};

Logger.prototype.warn = function(msg) {
  if (this._enabled) {
    console.log(msg);
  }
};

Logger.prototype.error = function(msg) {
  if (this._enabled) {
    console.log(msg);
  }
};

module.exports = new Logger(true);
