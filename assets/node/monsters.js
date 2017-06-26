var $nameSearch = $('#nameSearch');
var $formSearch = $('#formSearch');
var $monsterSize = $('#monsterSize');
var $monsterType = $('#monsterType');
var $challengeRating = $('#challengeRating');
var $monsterAlignment = $('#monsterAlignment');
var $searchResult = $('#searchResult');
var url = 'https://dnd-api.herokuapp.com/monsters'

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
    var newData = searchDataByForm(
      data,
      $monsterSize.val(),
      $monsterType.val(),
      $challengeRating.val(),
      $monsterAlignment.val()
    );
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
  return result;
}

function createList(newData) {
  $searchResult.empty();
  $searchResult.append('<ul></ul>')
  for (var i = 0; i < newData.length; i++) {
    var $newListItem = $('<li><button class="monsterBtn btn btn-default" type="button">' + newData[i].name + '</button></li>');
    var $monsterData = $('<article class="monster"></article>');
    var $monsterAction = $('<article class="monster"><button class="monster monsterBtn btn btn-default">SPECIALS:</button></div>');
    var $monsterActionDiv = $('<div></div>');
    $monsterActionDiv.css('display', 'none');
    $monsterData.css('display', 'none');
    $newListItem.append($monsterData);

    /*The following code represents the population of data, skip ahead to the next comment for the rest of the code*/
    $monsterData.append('<p>Challenge Rating: ' + newData[i].challenge_rating + '</p>');
    $monsterData.append('<p>Type: ' + newData[i].type + ' - Subtype: ' + (newData[i].subtype === "" ? 'none' : newData[i].subtype) + '</p>');
    $monsterData.append('<p>Size: ' + newData[i].size + '</p>');
    $monsterData.append('<p>Alignment: ' + (newData[i].alignment === "" ? 'none' : newData[i].alignment) + '</p>');
    $monsterData.append('<p>Armor Class: ' + newData[i].armor_class + '</p>');
    $monsterData.append('<p>Health - HitDice: ' + newData[i].hit_dice + ' - HitPoints: ' + newData[i].hit_points + '</p>');
    $monsterData.append('<p>Condition Immunities: ' + (newData[i].condition_immunities === "" ? 'none' : newData[i].condition_immunities) + '</p>');
    $monsterData.append('<p>Damage Immunities: ' + (newData[i].damage_immunities === "" ? 'none' : newData[i].damage_immunities) + '</p>');
    $monsterData.append('<p>Damage Resistances: ' + (newData[i].damage_resistances === "" ? 'none' : newData[i].damage_resistances) + '</p>');
    $monsterData.append('<p>Damage Vulnerabilities: ' + (newData[i].damage_vulnerabilities === "" ? 'none' : newData[i].damage_vulnerabilities) + '</p>');
    $monsterData.append('<p>Senses: ' + newData[i].senses + '</p>');
    $monsterData.append('<p>Speed: ' + newData[i].speed + '</p>');
    $monsterData.append('<p>Strength: ' + newData[i].strength + ' - Save: ' + newData[i].strength_save + '</p>');
    $monsterData.append('<p>Dexterity: ' + newData[i].dexterity + ' - Save: ' + newData[i].dexterity_save + '</p>');
    $monsterData.append('<p>Constitution: ' + newData[i].constitution + ' - Save: ' + newData[i].constitution_save + '</p>');
    $monsterData.append('<p>Intelligence: ' + newData[i].intelligence + ' - Save: ' + newData[i].intelligence_save + '</p>');
    $monsterData.append('<p>Wisdom: ' + newData[i].wisdom + ' - Save: ' + newData[i].wisdom + '</p>');
    $monsterData.append('<p>Charisma: ' + newData[i].charisma + ' - Save: ' + newData[i].charisma_save + '</p>');
    $monsterData.append('<p>Perception: ' + newData[i].perception + '</p>');
    $monsterData.append('<p>Languages: ' + newData[i].languages + '</p>');
    $monsterData.append($monsterAction);
    $monsterAction.append($monsterActionDiv);
    if (newData[i].actions !== undefined) {
      for (var a = 0; a < newData[i].actions.length; a++) {
        $monsterActionDiv.append('<p>  Name: ' + newData[i].actions[a].name + '</p>');
        $monsterActionDiv.append('<p>  Attack Bonus: ' + newData[i].actions[a].attack_bonus + '</p>');
        $monsterActionDiv.append('<p>  Description: ' + newData[i].actions[a].desc + '</p>');
        $monsterActionDiv.append('<p>--------------</p>');
      }
    }
    if (newData[i].special_abilities !== undefined) {
      for (var a = 0; a < newData[i].special_abilities.length; a++) {
        $monsterActionDiv.append('<p>  Name: ' + newData[i].special_abilities[a].name + '</p>');
        $monsterActionDiv.append('<p>  Attack Bonus: ' + newData[i].special_abilities[a].attack_bonus + '</p>');
        $monsterActionDiv.append('<p>  Description: ' + newData[i].special_abilities[a].desc + '</p>');
        $monsterActionDiv.append('<p>--------------</p>');
      }
    }
    if (newData[i].legendary_actions !== undefined) {
      for (var a = 0; a < newData[i].legendary_actions.length; a++) {
        $monsterActionDiv.append('<p>  Name: ' + newData[i].legendary_actions[a].name + '</p>');
        $monsterActionDiv.append('<p>  Attack Bonus: ' + newData[i].legendary_actions[a].attack_bonus + '</p>');
        $monsterActionDiv.append('<p>  Description: ' + newData[i].legendary_actions[a].desc + '</p>');
        $monsterActionDiv.append('<p>--------------</p>');
      }
    }
    /*This is the end of the data population, boy that's a lot of data...*/

    $newListItem.children('button').click(makeAppear);
    $monsterAction.children('button').click(makeAppear);
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
