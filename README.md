# BaylitDB

BaylitDB is JSON database system.

## Installation

```bash
npm install baylitdb
```

## Usage

```js
const baylit = require("baylitdb");
const db = new baylit({ dbFolder: "DB", dbName: "baylit" });

//Set any string or number in database.
db.set("baylit", "database"); // true

// Get database element from id.
db.get("baylit"); // database

//Add number.
db.add("number", 1); // 1
//Substract number.
db.subtract("number", 1); // 0

//Push element into the array.
db.push("array", 1); // [1]
//Unpush element from array.
db.unpush("array", 1); // []

//Asset control.
db.has("baylit"); // true

//Get all database element.
db.all(); // {baylit : "database", number: 1, array: []}

//Delete one element.
db.delete("baylit"); // true
//Delete all element.
db.deleteAll(); // true

//Get element value type.
db.type("baylit"); //String

```
#### Extra

```js
db.set("baylit.db", "json"); // {baylit : {db: "json"} }
```

_Discord_: **Yiit#9184**

## License
[MIT](https://choosealicense.com/licenses/mit/)