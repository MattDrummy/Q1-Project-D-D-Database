var fs = require('fs');
var path = require('path');
var request = require('request');
var monsterPath = path.join(__dirname + '/monsters.json');
var spellsPath = path.join(__dirname + '/spells.json');
var equipmentPath = path.join(__dirname + '/equipment.json');

function getListItemById(url, id) {
  return new Promise(function(resolve, reject) {
    request(url + id, function(error, response, body) {
      if (error) {
        reject(error);
        reject(response);
      } else {
        resolve(body);
      }
    })
  })
}

function getApiList(url) {
  return new Promise(function(resolve, reject) {
    request(url, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    })
  })
}


function createJson(url, path) {
  var list = Promise.resolve(getApiList(url));
  list.then(function(data) {
    var cnt = JSON.parse(data).count;
    console.log(url + ' produced: ' + cnt + ' results.');
    var array = [];
    for (let i = 1; i <= cnt; i++) {
      array.push(getListItemById(url, i)
        .catch(function(error) {
          console.log("ERROR: item " + i + " for: " + url + " has produced and error!!!");
          // this is the error that shows when we get an ENOTFOUND ERROR
          console.log(error);
        }));
    }

    Promise.all(array).then(function(data) {
      fs.writeFile(path, JSON.stringify(data), function(error) {
        console.log(error);
      })
    })
  })
  return;
}

// WARNING: do not run this unless you want 1000 api calls to run, they are commented out
// so that you don't accidentally run them.
//   createJson('http://dnd5eapi.co/api/monsters/', monsterPath);
//   createJson('http://dnd5eapi.co/api/spells/', spellsPath);
//   createJson('http://dnd5eapi.co/api/equipment/', equipmentPath);
