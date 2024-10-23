type EmptyCheckValue = string | number | boolean | null | undefined | object | any[];

export const isValueEmpty = (value: EmptyCheckValue): boolean => {
  switch (typeof value) {
    case 'boolean': return false;
    case 'number': return Number.isNaN(value);
    case 'string': return value.trim() === '';
    case 'object': 
      if (value === null) return true;
      if (Array.isArray(value)) return value.length === 0;
      return Object.keys(value).length === 0;
    default: 
      return false;
  }
}

export const areAllValuesEmpty = (...values: EmptyCheckValue[]): boolean => {
  return values.every(isValueEmpty);
}
