var $nameSearch = $('#nameSearch');
var $formSearch = $('#formSearch');

/* These variables are pertinent to the page */
var $equipmentCategory = $('#equipmentCategory')
var url = 'https://dnd-api.herokuapp.com/equipment'
/* Change these if using the code for another page */

var $searchResult = $('#searchResult');

$nameSearch.submit(nameSearchSubmit);
$formSearch.submit(formSearchSubmit);
$equipmentCategory.change(updateForm);

function updateForm(event) {
  $.get(url).then(function(data) {
    var equipment = createEquipment($equipmentCategory.val());
    var resultArray = filterForm(data);
    /* THIS IS WHERE YOU LEFT OFF */

    /* CONTINUE FROM HERE */

  })
}

function createEquipment(category) {
  var equipment = ''
  switch (category) {
    case 'Adventuring Gear':
      equipment = 'gear_category';
      break;
    case 'Tools':
      equipment = 'tool_category';
      break;
    case 'Mounts and Vehicles':
      equipment = 'vehicle_category';
      break;
    case 'Weapon':
      equipment = 'weapon_category:';
      break;
    case 'Armor':
      equipment = 'armor_category:';
      break;
    default:
  }
  return equipment;
}

function filterForm(data) {
  var result = result.filter(function(element) {
    if (element.equipment_category === $equipmentCategory.val()) {
      return element;
    }
  })
  var tempObj = {};
  for (var i = 0; i < result.length; i++) {
    if (result[i][equipment].name !== undefined) {
      tempObj[result[i][equipment].name] = true;
    } else {
      tempObj[result[i][equipment]] = true;
    }
  }
  var tempArray = [];
  for (var variable in tempObj) {
    tempArray.push(tempObj);
  }
  return tempArray;
}

function nameSearchSubmit(event) {
  event.preventDefault();
  window.location.hash = 'nameSearch'
  window.location.hash = 'searchResult';
  $.get(url).then(function(data) {
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
      $equipmentCategory.val(),
      $lesserCategory.val()
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

function searchDataByForm(data, category1, category2) {
  var result = data;
  console.log(result);
  /* This is the filtering for the equipment Page */
  result = result.filter(function(element) {
    if (element !== undefined || element !== null) {
      if (element.equipment_category === category1) {
        return element;
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
    $listData.css('display', 'none');
    $newListItem.append($listData);
    /*The following code represents the population of data, skip ahead to the next comment for the rest of the code*/
    // $listData.append('<p>' + item + '</p>');
    if (item.cost.quantity !== undefined && item.cost.unit !== undefined) {
      $listData.append('<p>Cost: ' + item.cost.quantity + item.cost.unit + '</p>');
    }
    if (item.category_range !== undefined) {
      $listData.append('<p>Weapon Category: ' + item.category_range + '</p>');
    } else if (item['armor_category:'] !== undefined) {
      if (item['armor_category'].name !== undefined) {
        $listData.append('<p>Armor Category: ' + item['armor_category:'].name + '</p>');
      } else {
        $listData.append('<p>Armor Category: ' + item['armor_category:'] + '</p>');
      }
      $listData.append('<p>Armor Category: ' + item['armor_category:'] + '</p>');
    } else if (item.vehicle_category !== undefined) {
      $listData.append('<p>Vehicle Category: ' + item.vehicle_category + '</p>')
    } else if (item.tool_category !== undefined) {
      $listData.append('<p>Tool Category: ' + item.tool_category + '</p>');
    } else if (item.gear_category !== undefined) {
      $listData.append('<p>Gear Category: ' + item.gear_category + '</p>');
    }
    if (item.damage.dice_count !== undefined && item.damage.dice_value !== undefined && item.damage.damage_type.name !== undefined) {
      $listData.append('<p>Damage : ' + item.damage.dice_count + "d" + item.damage.dice_value + ": " + item.damage.damage_type.name + '</p>');
    }
    if (item.weight !== undefined) {
      $listData.append('<p>Weight: ' + item.weight + ' lbs</p>');
    }

    /*This is the end of the data population, boy that's a lot of data...*/

    $newListItem.children('button').click(makeAppear);
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
