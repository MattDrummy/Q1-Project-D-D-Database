var $nameSearch = $('#nameSearch');
var $formSearch = $('#formSearch');

/* These variables are pertinent to the page */
var $spellSchool = $('#spellSchool');
var $spellLevel = $('#spellLevel');
var $spellClass = $('#spellClass');
var url = 'https://dnd-api.herokuapp.com/spells'
/* Change these if using the code for another page */

var $searchResult = $('#searchResult');

$nameSearch.submit(nameSearchSubmit);
$formSearch.submit(formSearchSubmit);

function nameSearchSubmit(event) {
  event.preventDefault();
  window.location.hash = 'nameSearch'
  window.location.hash = 'searchResult';
  $.get(url).then(function(data) {
    console.log(data);
    var newData = searchDataByName(data, $('#nameSearch input').val());
    createList(newData);
  })
}

function formSearchSubmit(event) {
  event.preventDefault();
  window.location.hash = 'nameSearch'
  window.location.hash = 'searchResult';
  $.get(url).then(function(data) {

    /*This is the information gathered from the page*/
    var newData = searchDataByForm(
      data,
      $spellLevel.val(),
      $spellSchool.val(),
      $spellClass.val()
    );
    /*This data can be changed based on the page*/

    createList(newData);
  })
}

function searchDataByName(data, name) {
  var result = data.filter(function(element) {
    if (element.name !== undefined) {
      if (element.name.toLowerCase().indexOf(name.toLowerCase()) !== -1) {
        return element;
      }
    }
  });
  return result;
}

function searchDataByForm(data, spellLevel, spellSchool, spellClass) {
  var result = data;
  /* This is the filtering for the Monster Page */
  result = result.filter(function(element) {
    if (element.school.name !== undefined) {
      if (element.school.name.toLowerCase().indexOf(spellSchool.toLowerCase()) !== -1) {
        return element;
      }
    }
  });
  if (spellLevel !== "") {
    result = result.filter(function(element) {
      if (element.level !== undefined) {
        var num = parseInt(spellLevel);
        if (typeof num === 'number' && num >= 0 && num <= 9) {
          if (element.level === num) {
            return element;
          }
        }
      }
    });
  }
  result = result.filter(function(element) {
    if (element.classes !== undefined && Array.isArray(element.classes)) {
      for (var i = 0; i < element.classes.length; i++) {
        if (element.classes[i].name !== undefined) {
          if (element.classes[i].name.toLowerCase().indexOf(spellClass.toLowerCase()) !== -1) {
            return element;
          }
        }
      }
    }
  })
  /* You can change the information above to fit the page you're working for */

  return result;
}

function createList(newData) {
  $searchResult.empty();
  $searchResult.append('<ul></ul>')
  for (var i = 0; i < newData.length; i++) {
    var item = newData[i];
    var $newListItem = $('<li><button class="listBtn btn btn-default" type="button">' + item.name + '</button></li>');
    var $listData = $('<article class="list"></article>');
    var $listSup = $('<article class="list"><button class="list listBtn btn btn-default">DESCRIPTION:</button></div>');
    var $listSupDiv = $('<div></div>');
    $listSupDiv.css('display', 'none');
    $listData.css('display', 'none');
    $newListItem.append($listData);

    /*The following code represents the population of data, skip ahead to the next comment for the rest of the code*/
    // $listData.append('<p>' + '</p>');
    $listData.append('<p>School: ' + item.school.name + '</p>');
    $listData.append('<p>Level: ' + item.level + '</p>');
    $listData.append('<p>Casting Time: ' + item.casting_time + '</p>');
    $listData.append('<p>Duration: ' + item.duration + '</p>');
    $listData.append('<p>Concentration: ' + item.concentration + '</p>');
    $listData.append('<p>Ritual: ' + item.ritual + '</p>');
    var tempStr = "";
    for (var c = 0; c < item.classes.length; c++) {
      if (c === item.classes.length - 1) {
        tempStr += item.classes[c].name;
      } else {
        tempStr += item.classes[c].name + ", ";
      }
    }
    $listData.append('<p>Classes: ' + tempStr + '</p>');
    if (item.material) {
      $listData.append('<p>Materials: ' + item.material + '<p>');
    }
    if (item.page) {
      $listData.append('<p>Page Reference: ' + item.page + '</p>');
    }
    $listData.append($listSup);
    $listSup.append($listSupDiv);
    if (item.desc !== undefined && Array.isArray(item.desc)) {
      $listSupDiv.append('<p> Description: </p>');
      for (var d = 0; d < item.desc.length; d++) {
        $listSupDiv.append('<p>' + item.desc[d] + '</p>');
      }
    }
    if (item.higher_level && Array.isArray(item.higher_level)) {
      $listSupDiv.append('<p>Higher Level: </p>');
      for (var h = 0; h < item.higher_level.length; h++) {
        $listSupDiv.append('<p>' + item.higher_level[h] + '</p>');
      }
    }



    /*This is the end of the data population, boy that's a lot of data...*/

    $newListItem.children('button').click(makeAppear);
    $listSup.children('button').click(makeAppear);
    $('#searchResult ul').append($newListItem);
  }
}

function makeAppear(event) {
  if (this.parentNode.childNodes[1].style.display === 'none') {
    this.parentNode.childNodes[1].style.display = 'block';
  } else {
    this.parentNode.childNodes[1].style.display = 'none';
  }
}
