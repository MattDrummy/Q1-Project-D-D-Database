var url = 'https://galvanize-cors-proxy.herokuapp.com/http://dnd5eapi.co/api/classes/'
var classArray = [
  'barbarian',
  'bard',
  'cleric',
  'druid',
  'fighter',
  'monk',
  'paladin',
  'ranger',
  'rogue',
  'sorcerer',
  'warlock',
  'wizard'
];
for (var i = 0; i < classArray.length; i++) {
  if (!localStorage.getItem(`${classArray[i]}Data`)) {
    $.get(`${url}${classArray[i]}`).then(populateClass)
  } else {
    var classData = JSON.parse(localStorage.getItem(`${classArray[i]}Data`));
    populateClass(classData);
  }
}

function populateClass(data) {
  localStorage.setItem(`${data.name}Data`, JSON.stringify(data))
  var className = data.name;
  var hitDie = data.hit_die;
  var skillProficienciesArray = data.proficiency_choices[0].from;
  var skillChoices = data.proficiency_choices[0].choose;
  var otherProficienciesArray = data.proficiencies;
  var savingThrowsArray = data.saving_throws;
  var $mainClass = $(`#${className.toLowerCase()}`);
  var $classInfo = $(`#${className.toLowerCase()}Info`);
  var url = 'https://galvanize-cors-proxy.herokuapp.com/http://dnd5eapi.co/api/classes/'
  var levelsAPI = `${url}${className.toLowerCase()}/levels/`

  $classInfo.append(`<p>Hit Die: ${hitDie}</p>`);
  var tempStr = ""
  for (var i = 0; i < otherProficienciesArray.length; i++) {
    tempStr += ` [${otherProficienciesArray[i].name}] `;
  }
  $classInfo.append(`<p>Proficiencies: ${tempStr}`)
  var tempStr = ""
  for (var i = 0; i < skillProficienciesArray.length; i++) {
    tempStr += ` [${skillProficienciesArray[i].name}] `;
  }
  $classInfo.append(`<p>Choose ${skillChoices}: ${tempStr}`)
  var tempStr = "";
  for (var i = 0; i < savingThrowsArray.length; i++) {
    tempStr += ` [${savingThrowsArray[i].name}] `;
  }
  $classInfo.append(`<p>Saving Throws: ${tempStr}`);

  if (!localStorage.getItem(`${data.name}levelData`)) {
    $.get(levelsAPI).then(populateClassLevel)
  } else {
    var levelData = JSON.parse(localStorage.getItem(`${data.name}levelData`));
    populateClassLevel(levelData);
  }
}

function populateClassLevel(levelData) {
  localStorage.setItem(`${levelData[0].class.name}LevelData`, JSON.stringify(levelData));
  var className = levelData[0].class.name;
  var $classLevel = $(`#${className.toLowerCase()}Level`);
  var $thisHeader = $(
    `<tr>
      <th class="cellLevel">Level</th>
      <th class="cellAbility">Ability Bonus</th>
      <th class="cellProf">Prof-Bonus</th>
      <th class="cellSpec">Class Specifics</th>
      <th class="cellFeatures">Features</th>`);
  $classLevel.append($thisHeader);
  for (var i = 0; i < levelData.length; i++) {
    var $thisLevel = $('<tr></tr>');
    var level = levelData[i].level;
    $thisLevel.append(`<td class="cellLevel">${level}</td>`);
    var abilityBonus = levelData[i].ability_score_bonuses;
    $thisLevel.append(`<td class="cellAbility">${abilityBonus}</td>`);
    var profBonus = levelData[i].prof_bonus;
    $thisLevel.append(`<td class="cellProf">${profBonus}`);
    var classSpecificObject = levelData[i].class_specific;
    var tempArray = []
    for (var variable in classSpecificObject) {
      tempArray.push(variable);
    }
    var $tempTd = $('<td class="cellSpec"></td>');
    if (tempArray.length > 0) {
      tempArray.forEach(function(element) {

        switch (element) {
          case 'martial_arts':
            $tempTd.append(
              `<p>
                <u>${element}</u><br>
                ${classSpecificObject[element].dice_count}d${classSpecificObject[element].dice_value}
              </p>`)
            break;
          case 'aura_range':
            $tempTd.append(`<p></p>`);
            break;
          case 'creating_spell_slots':
            if (classSpecificObject[element].length > 0) {
              $tempTd.append(`
                <p><u>${element}</u></p>
                `)
              for (var i = 0; i < classSpecificObject[element].length; i++) {
                $tempTd.append(
                  `<p>
                    level: ${classSpecificObject[element][i].spell_slot_level}
                    cost: ${classSpecificObject[element][i].sorcery_point_cost}
                  </p>`
                )
              }
            }
            break;
          case 'sneak_attack':
            $tempTd.append(
              `<p>
                <u>${element}</u><br>
                ${classSpecificObject[element].dice_count}d${classSpecificObject[element].dice_value}
              </p>`)
            break;
          default:
            $tempTd.append(
              `<p><u>${element}</u><br>
            ${classSpecificObject[element]}</p>`)
        }
      })
    }
    $thisLevel.append($tempTd)
    var featuresArray = levelData[i].features;
    if (featuresArray.length > 0) {
      var tempStr = "";
      featuresArray.forEach(function(element) {
        if (element.name !== undefined) {
          tempStr += `${element.name}<br>`;
        }
      })
      $thisLevel.append(`<td class="cellFeatures"><p>${tempStr}</p></td>`);
    } else {
      $thisLevel.append(`<td class="cellFeatures"></td>`)
    }
    $classLevel.append($thisLevel)
  }
}
