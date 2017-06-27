var $nameSearch = $('#nameSearch');
var $formSearch = $('#formSearch');

/* These variables are pertinent to the page */
var $monsterSize = $('#monsterSize');
var $monsterType = $('#monsterType');
var $challengeRating = $('#challengeRating');
var $monsterAlignment = $('#monsterAlignment');
var url = 'https://dnd-api.herokuapp.com/monsters'
/* Change these if using the code for another page */

var $searchResult = $('#searchResult');

$nameSearch.submit(nameSearchSubmit);
$formSearch.submit(formSearchSubmit);

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
      $monsterSize.val(),
      $monsterType.val(),
      $challengeRating.val(),
      $monsterAlignment.val()
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

function searchDataByForm(data, size, type, cr, align) {
  var result = data;

  /* This is the filtering for the Monster Page */
  var result = result.filter(function(element) {
    if (element.size !== undefined) {
      if (element.size.toLowerCase().indexOf(size.toLowerCase(size)) !== -1) {
        return element;
      }
    }
  });
  result = result.filter(function(element) {
    if (element.type !== undefined) {
      if (element.type.toLowerCase().indexOf(type.toLowerCase(type)) !== -1) {
        return element;
      }
    }
  });
  if (cr !== "") {
    var result = result.filter(function(element) {
      cr = Math.floor(parseInt(cr));
      if (cr < 1) {
        if (element.challenge_rating < 1 || element.challenge_rating === undefined) {
          return element;
        }
      } else {
        if (element.challenge_rating === cr) {
          return element;
        }
      }
    });
  }
  result = result.filter(function(element) {
    if (align === "") {
      return element;
    } else {
      if (element.alignment.toLowerCase().indexOf(align.toLowerCase(align)) !== -1) {
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
    var $listSup = $('<article class="list"><button class="list listBtn btn btn-default">SPECIALS:</button></div>');
    var $listSupDiv = $('<div></div>');
    $listSupDiv.css('display', 'none');
    $listData.css('display', 'none');
    $newListItem.append($listData);

    /*The following code represents the population of data, skip ahead to the next comment for the rest of the code*/
    $listData.append('<p>Challenge Rating: ' + item.challenge_rating + '</p>');
    $listData.append('<p>Type: ' + item.type + ' - Subtype: ' + (item.subtype === "" ? 'none' : item.subtype) + '</p>');
    $listData.append('<p>Size: ' + item.size + '</p>');
    $listData.append('<p>Alignment: ' + (item.alignment === "" ? 'none' : item.alignment) + '</p>');
    $listData.append('<p>Armor Class: ' + item.armor_class + '</p>');
    $listData.append('<p>Health - HitDice: ' + item.hit_dice + ' - HitPoints: ' + item.hit_points + '</p>');
    $listData.append('<p>Condition Immunities: ' + (item.condition_immunities === "" ? 'none' : item.condition_immunities) + '</p>');
    $listData.append('<p>Damage Immunities: ' + (item.damage_immunities === "" ? 'none' : item.damage_immunities) + '</p>');
    $listData.append('<p>Damage Resistances: ' + (item.damage_resistances === "" ? 'none' : item.damage_resistances) + '</p>');
    $listData.append('<p>Damage Vulnerabilities: ' + (item.damage_vulnerabilities === "" ? 'none' : item.damage_vulnerabilities) + '</p>');
    $listData.append('<p>Senses: ' + item.senses + '</p>');
    $listData.append('<p>Speed: ' + item.speed + '</p>');
    $listData.append('<p>Strength: ' + item.strength + ' - Save: ' + item.strength_save + '</p>');
    $listData.append('<p>Dexterity: ' + item.dexterity + ' - Save: ' + item.dexterity_save + '</p>');
    $listData.append('<p>Constitution: ' + item.constitution + ' - Save: ' + item.constitution_save + '</p>');
    $listData.append('<p>Intelligence: ' + item.intelligence + ' - Save: ' + item.intelligence_save + '</p>');
    $listData.append('<p>Wisdom: ' + item.wisdom + ' - Save: ' + item.wisdom + '</p>');
    $listData.append('<p>Charisma: ' + item.charisma + ' - Save: ' + item.charisma_save + '</p>');
    $listData.append('<p>Perception: ' + item.perception + '</p>');
    $listData.append('<p>Languages: ' + item.languages + '</p>');
    $listData.append($listSup);
    $listSup.append($listSupDiv);
    if (item.actions !== undefined) {
      for (var a = 0; a < item.actions.length; a++) {
        $listSupDiv.append('<p>  Name: ' + item.actions[a].name + '</p>');
        $listSupDiv.append('<p>  Attack Bonus: ' + item.actions[a].attack_bonus + '</p>');
        $listSupDiv.append('<p>  Description: ' + item.actions[a].desc + '</p>');
        $listSupDiv.append('<p>--------------</p>');
      }
    }
    if (item.special_abilities !== undefined) {
      for (var a = 0; a < item.special_abilities.length; a++) {
        $listSupDiv.append('<p>  Name: ' + item.special_abilities[a].name + '</p>');
        $listSupDiv.append('<p>  Attack Bonus: ' + item.special_abilities[a].attack_bonus + '</p>');
        $listSupDiv.append('<p>  Description: ' + item.special_abilities[a].desc + '</p>');
        $listSupDiv.append('<p>--------------</p>');
      }
    }
    if (item.legendary_actions !== undefined) {
      for (var a = 0; a < item.legendary_actions.length; a++) {
        $listSupDiv.append('<p>  Name: ' + item.legendary_actions[a].name + '</p>');
        $listSupDiv.append('<p>  Attack Bonus: ' + item.legendary_actions[a].attack_bonus + '</p>');
        $listSupDiv.append('<p>  Description: ' + item.legendary_actions[a].desc + '</p>');
        $listSupDiv.append('<p>--------------</p>');
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
