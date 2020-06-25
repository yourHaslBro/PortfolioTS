import {selectOptions} from "../CustomSelect/@types";
import {selectOptionsValidator} from "../CustomSelect/@validators";
import {pickWindowObject} from './@types'

export const selectValidator = (array: selectOptions[] | undefined): boolean => {
  if (!array) return true;
  return selectOptionsValidator(array);
};

export const modelValueValidator = (value: string | string[]): boolean => {
  let checkTypes: boolean = typeof value === 'string' || (
    value.every(elem => typeof elem === 'string') || !value.length
  );
  !checkTypes && console.error(`
    Тип value должен быть string | string[].
  `);
  return checkTypes;
};

export const pickWindowValidator = (array: pickWindowObject[]): boolean => {
  return array.every((obj, index) => {
    let objKeys: string[] = Object.keys(obj)
    let correctKeys: boolean = (objKeys.includes('value') && objKeys.includes('id'));
    let objValues: string[] = Object.values(obj);
    let str: boolean = objValues.every(elem => typeof elem === 'string');
    if (!correctKeys || !str) console.error(`Ошибка в элементе номер ${index}.`);
    if (!correctKeys) console.error(`Ключи объекта должны быть - {id, value, sort(?)}, сейчас - {${objKeys.join()}}`);
    if (!str) {
      let incorrectElem: any = objValues.find((elem: any): any => typeof elem !== 'string');
      console.error(`В значениях объекта допускаются только строки или числа, сейчас присутствует ${typeof incorrectElem}`);
    }
    return correctKeys && str;
  });
};