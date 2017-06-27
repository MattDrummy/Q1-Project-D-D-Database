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
    try {
      var $removeMe = $('#newForm');
      var $submitButton = $('#submitButton');
      var $resetButton = $('#resetButton');
      $removeMe.remove();
      $submitButton.remove();
      $resetButton.remove();
    } catch (e) {

    }
    var equipment = createEquipment($equipmentCategory.val());
    var resultArray = filterForm(data, equipment);
    $formSearch.append($('<div id="newForm" class="form-group"><label for="lesserCategory"><h3>Lesser Category</h3><p>Next, choose from this list of lesser categories.</p></label><select name="lesserCategory" id="lesserCategory"></div>'));
    $formSearch.append($('<button id="submitButton" type="submit" class="formBtn btn btn-default">Search</button>'));
    $formSearch.append($('<button id="resetButton" class="formBtn btn btn-default" type="reset" name="reset">Reset</button>'));
    var $newForm = $('#lesserCategory');
    $newForm.append('<option value="" disabled selected>Choose One</option>');
    for (var i = 0; i < resultArray.length; i++) {
      $newForm.append('<option value="' + resultArray[i] + '">' + resultArray[i] + '</option>');
    }
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

function filterForm(data, equipment) {
  var result = data.filter(function(element) {
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
    tempArray.push(variable);
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
    var $lesserCategory = $('#lesserCategory');
    var newData = searchDataByForm(
      data,
      $equipmentCategory.val(),
      $lesserCategory.val(),
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
  var lesserEquipment = createEquipment($equipmentCategory.val());
  /* This is the filtering for the equipment Page */
  result = result.filter(function(element) {
    if (element !== undefined || element !== null) {
      if (element.equipment_category === category1) {
        return element;
      }
    }
  })
  result = result.filter(function(element) {
    if (element !== undefined || element !== null) {
      if (element[lesserEquipment].name !== undefined) {
        if (element[lesserEquipment].name === category2) {
          return element;
        }
      } else {
        if (element[lesserEquipment] === category2) {
          return element;
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
      if (item['armor_category:'].name !== undefined) {
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
    if (item.damage !== undefined) {
      if (item.damage.dice_count !== undefined && item.damage.dice_value !== undefined) {
        if (item.damage.damage_type !== undefined) {
          $listData.append('<p>Damage : ' + item.damage.dice_count + "d" + item.damage.dice_value + " - " + item.damage.damage_type.name + '</p>');
        } else if (item.damage.type !== undefined) {
          $listData.append('<p>Damage : ' + item.damage.dice_count + "d" + item.damage.dice_value + " - " + item.damage.type.name + '</p>');
        }
      }
    }
    if (item.armor_class !== undefined) {
      $listData.append('<p>Armor Class: ' + item.armor_class.base + ' - MaxDex: ' + item.armor_class.max_bonus + ' - DexBonus: ' + item.armor_class.dex_bonus + '</p>');
    }
    if (item.str_minimum !== undefined) {
      $listData.append('<p>Minimum Strength Required: ' + item.str_minimum + '</p>');
    }
    if (item.stealth_disadvantage !== undefined) {
      $listData.append('<p>Stealth Disadvantage: ' + item.stealth_disadvantage + '</p>');
    }
    if (item.weight !== undefined) {
      $listData.append('<p>Weight: ' + item.weight + ' lbs</p>');
    }

    if (item.desc !== undefined && Array.isArray(item.desc)) {
      $listData.append('<p>Description</p>');
      item.desc.forEach(function(element) {
        if (element !== undefined && typeof element === 'string') {
          $listData.append('<p>' + element + '</p>');
        }
      });
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
