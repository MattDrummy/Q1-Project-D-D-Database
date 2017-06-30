var url = 'https://galvanize-cors-proxy.herokuapp.com/http://dnd5eapi.co/api/classes/';
var featureUrl = 'https://galvanize-cors-proxy.herokuapp.com/http://dnd5eapi.co/api/features/';
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

classArray.forEach(function(element) {
  if (!localStorage.getItem(`${element}Data`)) {
    $.get(`${url}${element}`).then(populateClass)
  } else {
    var classData = JSON.parse(localStorage.getItem(`${element}Data`));
    populateClass(classData);
  }
})

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
  $classInfo.append(`
    <h3>Basic Info</h3>
    `)
  $classInfo.append(`
    <p>Hit Die: ${hitDie}</p>
    `);
  var tempStr = ""
  for (var i = 0; i < otherProficienciesArray.length; i++) {
    if (i === otherProficienciesArray.length - 1) {
      tempStr += `${otherProficienciesArray[i].name}`;
    }
      tempStr += `${otherProficienciesArray[i].name}, `;
  }
  $classInfo.append(`
    <p>Proficiencies: ${tempStr}
    `)
  var tempStr = ""
  for (var i = 0; i < skillProficienciesArray.length; i++) {
    if (i === skillProficienciesArray.length - 1) {
      tempStr += `${skillProficienciesArray[i].name}`;
    }
      tempStr += `${skillProficienciesArray[i].name}, `;
  }
  $classInfo.append(`
    <p>Choose ${skillChoices}: ${tempStr}
    `)
  var tempStr = "";
  for (var i = 0; i < savingThrowsArray.length; i++) {
    if (i === savingThrowsArray.length - 1) {
      tempStr += `${savingThrowsArray[i].name}`;
    }
      tempStr += `${savingThrowsArray[i].name}, `;
  }
  $classInfo.append(`
    <p>Saving Throws: ${tempStr}
    `);

  if (!localStorage.getItem(`${data.name}levelData`)) {
    $.get(levelsAPI).then(populateClassLevel)
  } else {
    var levelData = JSON.parse(localStorage.getItem(`${data.name}levelData`));
    populateClassLevel(levelData);
  }
  $.get(`${featureUrl}${className.toLowerCase()}`).then(getClassFeatures);
}

function getClassFeatures(data) {
  data.results.forEach(function(element) {
    switch (element.name) {
      case 'Ability Score Improvement 3':
      case 'Ability Score Improvement 2':
      case 'Ability Score Improvement 1':
      case 'Ability Score Improvement 5':
      case 'Ability Score Improvement 4':
      case 'Ability Score Improvement 6':
      case 'Ability Score Improvement 7':
      case 'Choose: Additional Eldritch Invocation':
      case 'Mystic Arcanum (7th level)':
      case 'Mystic Arcanum (8th level)':
      case 'Mystic Arcanum (9th level)':
      case 'Choose: Expertise 2':
      case 'Choose: Expertise 1':
      case 'Evasion':
      case 'Spellcasting':
      case 'Choose: Additional Metamagic':
      case 'Choose: Fighting Style':
      case 'Unarmored Defense':
      case 'Extra Attack':
      case 'Favored Enemy (2 types)':
      case 'Favored Enemy (3 enemies)':
      case 'Natural Explorer (2 terrain types)':
      case 'Natural Explorer (3 terrain types)':
      case 'Domain Spells 2':
      case 'Domain Spells 3':
      case 'Domain Spells 4':
      case 'Domain Spells 5':
      case 'Bardic Inspiration (d8)':
      case 'Bardic Inspiration (d10)':
      case 'Bardic Inspiration (d12)':
      case 'Song of Rest (d8)':
      case 'Song of Rest (d10)':
      case 'Song of Rest (d12)':
      case 'Brutal Critical (2 dice)':
      case 'Brutal Critical (3 dice)':
      case 'Magical Secrets 2':
      case 'Magical Secrets 3':
      case 'Channel Divinity (3/rest)':
      case 'Destroy Undead (CR 1 or below)':
      case 'Destroy Undead (CR 2 or below)':
      case 'Destroy Undead (CR 3 or below)':
      case 'Destroy Undead (CR 4 or below)':
      case 'Wild Shape (CR 1/2 or below, no flying speed)':
      case 'Wild Shape (CR 1 or below)':
      case 'Action Surge (2 uses)':
      case 'Extra Attack (2)':
      case 'Extra Attack (3)':
      case 'Indomitable (2 uses)':
      case 'Indomitable (3 uses)':
      case 'Unarmored Movement 2':
      case 'Channel Divinity (2/rest)':
        break;
        break;
      default:
      if (!localStorage.getItem(`${element.name}FeatureData`)) {
        $.get(element.url).then(populateFeature)
      } else {
        var feature = JSON.parse(localStorage.getItem(`${element.name}FeatureData`));
        populateFeature(feature);
      }
    }
  })
}

function populateFeature(feature) {
  localStorage.setItem(`${feature.name}FeatureData`, JSON.stringify(feature))
  var $classFeatures = $(`#${feature.class.name.toLowerCase()}Features`)
  var name = ""
  switch (feature.name) {
    case 'Brutal Critical (1 die)':
      name = 'Brutal Critical';
      break;
    case 'Bardic Inspiration (d6)':
      name = 'Bardic Inspiration';
      break;
    case 'Song of Rest (d6)':
      name = 'Song of Rest';
      break;
    case 'Magical Secrets 1':
      name = 'Magical Secrets';
      break;
    case 'Domain Spells 1':
      name = 'Domain Spells';
      break;
    case 'Channel Divinity (1/rest)':
      name = 'Channel Divinity';
      break;
    case 'Destroy Undead (CR 1/2 or below)':
      name = 'Destroy Undead';
      break;
    case 'Wild Shape (CR 1/4 or below, no flying or swim speed)':
      name = 'Wild Shape';
      break;
    case 'Action Surge (1 use)':
      name = 'Action Surge';
      break;
    case 'Extra Attack (1)':
      name = 'Extra Attack';
      break;
    case 'Indomitable (1 use)':
      name = 'Indomitable';
      break;
    case 'Unarmored Movement 1':
      name = 'Unarmored Movement';
      break;
    case 'Favored Enemy (1 type)':
      name = 'Favored Enemy';
      break;
    case 'Natural Explorer (1 terrain type)':
      name = 'Natural Explorer';
      break;
    case 'Mystic Arcanum (6th level)':
      name = 'Mystic Arcanum';
      break;
    default:
    name = feature.name;
  }
  var descArray = feature.desc
    $classFeatures.append(`
      <h3><u>${name}</u></h3>
      `);
    descArray.forEach(function (element) {
      $classFeatures.append(`
        <p>${element}</p>
        `)
    })
}

function populateClassLevel(levelData) {
  localStorage.setItem(`${levelData[0].class.name}LevelData`, JSON.stringify(levelData));
  var className = levelData[0].class.name;
  var $classLevel = $(`#${className.toLowerCase()}Level`);
  if (className.toLowerCase() === 'paladin') {
    var $thisHeader = $(
      `<tr>
          <th class = "cellLevel">Level</th>
          <th class = "cellAbility">Ability Bonus</th>
          <th class = "cellProf">Prof-Bonus</th>
          <th class = "cellFeatures">Features</th>
      </tr>`);
  } else {
    var $thisHeader = $(
      `<tr>
        <th class = "cellLevel">Level</th>
        <th class = "cellAbility">Ability Bonus</th>
        <th class = "cellProf">Prof-Bonus</th>
        <th class = "cellSpec">Class Specifics</th>
        <th class = "cellFeatures">Features</th>
      </tr>`);
  }
  $classLevel.append($thisHeader);
  for (var i = 0; i < levelData.length; i++) {
    var $thisLevel = $('<tr></tr>');
    var level = levelData[i].level;
    $thisLevel.append(`
      <td class="cellLevel">${level}</td>
      `);
    var abilityBonus = levelData[i].ability_score_bonuses;
    $thisLevel.append(`
      <td class="cellAbility">${abilityBonus}</td>
      `);
    var profBonus = levelData[i].prof_bonus;
    $thisLevel.append(`
      <td class="cellProf">${profBonus}
      `);
    var classSpecificObject = levelData[i].class_specific;
    var tempArray = []
    for (var variable in classSpecificObject) {
      tempArray.push(variable);
    }
    if (className.toLowerCase() !== 'paladin') {
      var $tempTd = $('<td class="cellSpec"></td>');
      if (tempArray.length > 0) {
        tempArray.forEach(function(element) {

          switch (element) {
            case 'martial_arts':
              $tempTd.append(
                `<p>
                ${element}: ${classSpecificObject[element].dice_count}d${classSpecificObject[element].dice_value}
                </p>`)
              break;
            case 'aura_range':
              $tempTd.append(`<p></p>`);
              break;
            case 'creating_spell_slots':
              if (classSpecificObject[element].length > 0) {
                $tempTd.append(`
                  <p>${element}</p>
                  `)
                for (var i = 0; i < classSpecificObject[element].length; i++) {
                  $tempTd.append(`
                    <p>
                      level: ${classSpecificObject[element][i].spell_slot_level}
                      cost: ${classSpecificObject[element][i].sorcery_point_cost}
                    </p>
                    `)
                }
              }
              break;
            case 'sneak_attack':
              $tempTd.append(`
                <p>
                ${element}: ${classSpecificObject[element].dice_count}d${classSpecificObject[element].dice_value}
                </p>
                `)
              break;
            default:
              $tempTd.append(`
                <p>${element}: ${classSpecificObject[element]}</p>
              `)
          }
        })
      }
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
      $thisLevel.append(`
        <td class="cellFeatures"><p>${tempStr}</p></td>
        `);
    } else {
      $thisLevel.append(`
        <td class="cellFeatures"></td>
        `)
    }
    $classLevel.append($thisLevel)
  }
}
