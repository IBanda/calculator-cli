const chalk = require('chalk');

function checkSubcommand(values) {
  const hasEven = values.includes('even');
  const hasOdd = values.includes('odd');
  if (hasEven && hasOdd) {
    throw Error('Include a single sub-command');
  } else if (hasEven) {
    return 'even';
  } else if (hasOdd) {
    return 'odd';
  } else {
    return null;
  }
}

function checkIfMatchSubCommand(subCommand, valueArray) {
  let isValid;
  if (subCommand == 'even' && valueArray.every((value) => value % 2 === 0)) {
    isValid = true;
  } else if (
    subCommand == 'odd' &&
    valueArray.every((value) => value % 2 !== 0)
  ) {
    isValid = true;
  }
  return isValid;
}

function checkInputValidity(cmd, valueArray, isFloats) {
  let copyArray = valueArray.slice();
  if (copyArray.some((value) => String(value).includes('neg'))) {
    copyArray = removeNegativeTag(copyArray);
  }
  const invalidValue = copyArray.find(
    (value) => typeof value !== 'number' && value !== 'even' && value !== 'odd'
  );
  if (invalidValue) throw Error(`${invalidValue} is not supported`);
  let subCommand = checkSubcommand(copyArray);
  if (subCommand) {
    copyArray = copyArray.filter(
      (value) => value !== 'even' && value !== 'odd'
    );
    if (!checkIfMatchSubCommand(subCommand, copyArray)) {
      throw Error('Values must match the set Sub-Command');
    }
  }
  if (copyArray.length < 2 && cmd !== 'sqrt')
    throw Error('Values must be 2 or more');
  if (!isFloats && copyArray.some((num) => !Number.isInteger(num))) {
    throw Error("Set '-f' flag to use floating numbers");
  }
  return copyArray;
}

function printHelp(command) {
  console.log(`
      Usage: ${command || '[command]'} [values] [sub-commands]
      ${
        !command
          ? `Commands:
          add: Addition
          subtract: Subtraction
          multiply: Multiplication
          divide: Division`
          : ''
      }
  
      Sub-commands:
          even: ${command || 'Operations'} on even numbers only
          odd: ${command || 'Operations'} on odd numbers only
  
      `);
}

function tagNegative(args) {
  let copyArgs = args.slice();
  copyArgs.forEach((arg, index) => {
    let num = Number(arg);
    if (arg.includes('-') && typeof num === 'number' && num === num) {
      let [sign, ...digits] = arg.split('');
      copyArgs[index] = `${digits.join('')}-neg`;
    }
  });
  return copyArgs;
}
function removeNegativeTag(valuesArray) {
  copyValuesArray = valuesArray.slice();
  copyValuesArray.forEach((value, index) => {
    if (String(value).includes('neg')) {
      copyValuesArray[index] = Number(`-${value.split('-')[0]}`);
    }
  });
  return copyValuesArray;
}
function printAnswer(answer) {
  console.log(`${chalk.whiteBright.bgGreenBright.bold('Answer:')} ${answer}`);
}

module.exports = {
  checkInputValidity,
  tagNegative,
  printHelp,
  printAnswer,
};
