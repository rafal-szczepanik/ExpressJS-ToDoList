const {readFile, writeFile} = require('fs').promises;
const {join} = require('path');
const {v4: uuid} = require('uuid');

class DB {
  constructor(dataFileName) {
    this.dataFileName = join(__dirname, '../data', dataFileName);
    this._load();
  }

  async _load() {
    this._data = JSON.parse(await readFile(this.dataFileName, 'utf8'));
  }

  async _save() {
    await writeFile(this.dataFileName, JSON.stringify(this._data), 'utf8');
  }

  async create(obj) {
    const id = uuid();
    this._data.push({
      id,
      ...obj
    });
    await this._save();
  }

  async getAll() {
    return await this._data;
  }

  async getOne(id) {
    return this._data.find(obj => obj.id === id);
  }

  async update(id, newObj) {
    this._data = this._data.map(oneObj => (
      oneObj.id === id ? {
        ...oneObj,
        ...newObj
      } : oneObj
    ));
    await this._save();
  }

  async delete(id) {
    this._data = this._data.filter(obj => obj.id !== id);
    await this._save();
  }

  getTasksNum() {
    return this._data.length;
  }
}

const db = new DB('db.json');

module.exports = {
  db,
};


