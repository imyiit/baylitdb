const fs = require("fs");

Array.prototype.subtract = function (elem) {
  if (this.length == 0) return this;
  const index = this.indexOf(elem);
  if (index !== -1) this.splice(index, 1);
  return this;
};

module.exports = class Baylit {
  constructor({ dbName = "baylit", dbFolder = "databases", min = true }) {
    /**
     * @private
     */
    this._FOLDER = function () {
      return dbFolder.toString() + "/" + dbName.toString();
    };
    if (!fs.existsSync(`./${dbFolder}`)) fs.mkdirSync(`./${dbFolder}`);
    if (!fs.existsSync(`./${this._FOLDER()}.json`))
      fs.writeFileSync(`./${this._FOLDER()}.json`, "{}");
    /**
     * @private
     */
    this.db = JSON.parse(fs.readFileSync(`./${this._FOLDER()}.json`));
    /**
     * @private
     */
    this._saveFile = function (data) {
      if (min) {
        return fs.writeFileSync(`./${this._FOLDER()}.json`, JSON.stringify(data));
      } else {
        return fs.writeFileSync(`./${this._FOLDER()}.json`, JSON.stringify(data, null, 2));
      }
    };
  }
  get(key) {
    if (!key) return false;
    let a = this.db,
      b = a,
      c = key
        .split(".")
        .slice(0, -1)
        .reduce((d, t) => {
          if (d[t] === undefined) d[t] = {};
          return d[t];
        }, b);
    return c[key.split(".").slice(-1)[0]];
  }
  set(key, value) {
    if (!key) return false;
    if (typeof value === "function")
      throw new TypeError("Cant save any function in JSON file.");
    let a = this.db,
      b = a,
      c = key
        .split(".")
        .slice(0, -1)
        .reduce((d, t) => {
          if (d[t] === undefined) d[t] = {};
          return d[t];
        }, b);
    c[key.split(".").slice(-1)[0]] = value;
    this._saveFile(a);
    return true;
  }
  add(key, value) {
    if (typeof value === "function")
      throw new TypeError("Can't save any function in JSON file.");
    let db = this.get(key);
    db = !db ? 0 + (value ? value : 1) : db + (value ? value : 1);
    return this.set(key, db);
  }
  subtract(key, value) {
    if (typeof value === "function")
      throw new TypeError("Can't save any function in JSON file.");
    let db = this.get(key);
    db = !db ? 0 - (value ? value : 1) : db - (value ? value : 1);
    return this.set(key, db);
  }
  push(key, value) {
    if (typeof value === "function")
      throw new Error("Can't save any function in JSON file.");
    const db = this.get(key) || [];
    if (!Array.isArray(db)) throw new TypeError("It's not an array.");
    db.push(value);
    return this.set(key, db);
  }
  unpush(key, value) {
    if (typeof value === "function")
      throw new TypeError("Can't save any function in JSON file.");
    let db = this.get(key);
    if (!Array.isArray(db)) throw new TypeError("It's not an array.");
    db = db.subtract(value);
    return this.set(key, db);
  }
  has(key) {
    return !!this.get(key);
  }
  all() {
    return this.db;
  }
  delete(key) {
    if (!key) return false;
    if (!this.get(key)) return false;
    let a = this.db,
      b = a,
      c = key
        .split(".")
        .slice(0, -1)
        .reduce((a, b) => {
          return a[b];
        }, b);
    delete c[key.split(".").slice(-1)[0]];
    if (!a) a = {}
    this._saveFile(a);
    return true;
  }
  deleteAll() {
    fs.writeFileSync(`./${this._FOLDER()}.json`, "{}");
    return true;
  }
  type(key) {
    const data = this.get(key);
    if (Array.isArray(data)) return "array";
    return (typeof data).toString();
  }
};
