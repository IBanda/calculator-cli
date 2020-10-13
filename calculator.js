const parseArgs = require('minimist');
const chalk = require('chalk');
const {
  checkInputValidity,
  tagNegative,
  printHelp,
  printAnswer,
} = require('./utils');
function calculator(args) {
  const commands = ['add', 'subtract', 'multiply', 'divide', 'pow', 'sqrt'];

  if (
    args.some((arg) => arg.includes('-') && typeof Number(arg) === 'number')
  ) {
    args = tagNegative(args);
  }

  const argv = parseArgs(args, {
    boolean: ['f', 'h', 'help'],
  });
  let [command, ...rest] = argv._;
  if (argv.h || argv.help) {
    return printHelp(command);
  }
  let valueArray;
  try {
    if (!commands.includes(command)) throw Error('Invalid command');
    valueArray = checkInputValidity(command, rest, argv.f);
  } catch (e) {
    return console.log(chalk.white.bgRed.bold(`${e.message}!`));
  }
  let result;
  switch (command) {
    case 'add':
      printAnswer(valueArray.reduce((acc, current) => acc + current, 0));
      break;
    case 'subtract':
      result = valueArray[0] - valueArray[1];
      for (let i = 2; i < valueArray.length; i++) {
        result = result - valueArray[i];
      }
      printAnswer(result);
      break;
    case 'multiply':
      result = 1;
      valueArray.forEach((value) => {
        result *= value;
      });
      printAnswer(result);
      break;
    case 'divide':
      result = valueArray[0] / valueArray[1];
      for (let i = 2; i < valueArray.length; i++) {
        result = result / valueArray[i];
      }
      printAnswer(result);
      break;
    case 'pow':
      let base = valueArray[0];
      let exp = valueArray[1];
      printAnswer(Math.pow(base, exp));
      break;
    case 'sqrt':
      printAnswer(Math.sqrt(valueArray[0]));
      if (valueArray.length > 1)
        console.warn(
          chalk.black.bgYellowBright.bold(
            'Use a single value, only the first value is used !'
          )
        );
      break;
    default:
      break;
  }
}

module.exports = calculator;
