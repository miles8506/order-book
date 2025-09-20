// function numberFormatter(locales?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions) {
//   return new Intl.NumberFormat(
//     locales ?? 'en-US',
//     options ?? { minimumFractionDigits: 0, maximumFractionDigits: 0 },
//   )
// }

const numberFormatter = (
  value: number,
  options = {
    locales: 'en-US',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  } as Partial<Intl.NumberFormatOptions & { locales: Intl.LocalesArgument }>,
): string => {
  const { locales, ...elseOptions } = options
  return value.toLocaleString(locales, elseOptions)
}

export { numberFormatter }
