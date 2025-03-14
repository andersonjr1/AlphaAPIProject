import RocksDB from "rocksdb";
import path from "path";
const __dirname = path.resolve();

class DataBase {
  constructor(dbName) {
    this.dataBase = null;
    this.dataBasePath = path.resolve(__dirname, `./db_data`, dbName);
    this.open((err) => {
      if (err) {
        console.error(`Error occurred when opening the data base`, err);
      }
    });
  }

  open(callback) {
    this.dataBase = new RocksDB(this.dataBasePath);
    this.dataBase.open(callback);
  }

  close(callback) {
    if (this.dataBase) {
      this.dataBase.close(callback);
    }
  }

  readAllData(callback) {
    if (!this.dataBase) {
      return callback(new Error("The data base is not open"));
    }

    const iterator = this.dataBase.iterator();
    const data = [];

    // Recursive function to iterate through the database
    function loop() {
      iterator.next((err, key, value) => {
        if (err) {
          iterator.end(() => {
            callback(err);
          });
          return;
        }

        if (!key && !value) {
          iterator.end(() => {
            callback(null, data);
          });
          return;
        }
        data.push({ key: key.toString(), value: JSON.parse(value.toString()) });
        loop();
      });
    }
    loop();
  }

  // Method to find a record by a specific value in the database
  async findByValue(searchValueValue, searchValueKey, callback) {
    if (!this.dataBase) {
      return callback(new Error("The database not open"));
    }

    const iterator = this.dataBase.iterator();

    // Recursive function to iterate through the database
    function loop() {
      iterator.next((err, key, value) => {
        if (err) {
          iterator.end(() => {
            callback(err);
          });
          return;
        }

        if (!key && !value) {
          iterator.end(() => {
            callback(null, null);
          });
          return;
        }

        value = JSON.parse(value.toString());

        if (value[searchValueKey] === searchValueValue) {
          iterator.end(() => {
            callback(null, {
              key: key.toString(),
              value: value,
            });
          });
          return;
        }
        loop();
      });
    }
    loop();
  }

  put(key, value, callback) {
    if (!this.dataBase) {
      return callback(new Error("The database is not open"));
    }
    this.dataBase.put(key, value, callback);
  }

  get(key, callback) {
    if (!this.dataBase) {
      return callback(new Error("The database is not open"));
    }
    this.dataBase.get(key, callback);
  }

  del(key, callback) {
    if (!this.dataBase) {
      return callback(new Error("The database is not open"));
    }
    this.dataBase.del(key, callback);
  }
}

const enrollmentDataBase = new DataBase("enrollment");
const userDataBase = new DataBase("user");
const activityDataBase = new DataBase("activity");

export { enrollmentDataBase, userDataBase, activityDataBase };
