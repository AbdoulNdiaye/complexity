// @flow

const regexOptions = {
  uppercase: '.*[A-Z]',
  special: '.*[ !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~]',
  digit: '.*[0-9]',
  lowercase: '.*[a-z]',
  upperLower: '.*[a-zA-Z]',
  alphaNumeric: '.*[a-zA-Z0-9]',
};

const lengthOptions = {
  min: '.{n,}',
  max: '.{0,n}',
  range: '.{min,max}',
  exact: '.{n}',
  no_limit: '.*',
};

function isNumber(value: any) : boolean {
  return typeof value === 'number';
}

function repeat(value: string, number: number) : string {
  return new Array(number + 1).join(value);
}

export function create(options: any) : string {
  let regex = '^';
  Object.keys(regexOptions).forEach((key: string) => {
    if (isNumber(options[key])) {
      regex += `(?=${repeat(regexOptions[key], options[key])})`;
    }
  });
  if (isNumber(options.min) && isNumber(options.max)) {
    regex += lengthOptions.range.replace('min', options.min).replace('max', options.max);
  } else if (isNumber(options.max)) {
    regex += lengthOptions.max.replace('n', options.max);
  } else if (isNumber(options.min)) {
    regex += lengthOptions.min.replace('n', options.min);
  } else if (isNumber(options.exact)) {
    regex += lengthOptions.exact.replace('n', options.exact);
  } else {
    regex += lengthOptions.no_limit;
  }
  regex += '$';

  return regex;
}

export function check(str: string, options: any) : boolean {
  let regexString;
  if (typeof options === 'object') {
    regexString = create(options);
  } else {
    regexString = options;
  }

  const regex = new RegExp(regexString);

  return regex.test(str);
}

export function checkError(str: string, options: {
  min : number,
  max : number,
  exact : number
}) : {} {
  const tempOption = {};
  const optionLength = {
    min: options.min,
    max: options.max,
    exact: options.exact,
  };

  const returnObject = {};
  const testedString = str || '';

  Object.keys(regexOptions).forEach((key: string) => {
    if (isNumber(options[key])) {
      tempOption[key] = options[key];
      returnObject[key] = check(testedString, tempOption);
      delete tempOption[key];
    }
  });

  Object.keys(optionLength).forEach((key: string) => {
    if (isNumber(optionLength[key])) {
      tempOption[key] = optionLength[key];
      returnObject[key] = check(testedString, tempOption);
      delete tempOption[key];
    }
  });

  return returnObject;
}

export default {
  create,
  check,
  checkError,
};
