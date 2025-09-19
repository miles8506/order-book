function stringify(
  value: any,
  replacer?: (this: any, key: string, value: any) => any,
  space?: string | number,
) {
  return JSON.stringify(value, replacer, space)
}

function parse<T>(text: string, reviver?: (this: any, key: string, value: any) => any): T {
  return JSON.parse(text, reviver)
}

export { stringify, parse }
