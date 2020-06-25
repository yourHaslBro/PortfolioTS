import {selectOptions} from './@types';

export const selectOptionsValidator = (array: selectOptions[]): boolean => {
  return array.every((obj, index) => {
    let objKeys: string[] = Object.keys(obj)
    let correctKeys: boolean = (objKeys[0] === 'value' && objKeys[1] === 'text');
    let objValues: string[] = Object.values(obj);
    let str: boolean = objValues.every(elem =>  typeof elem === 'string');
    if (!correctKeys || !str) console.error(`Ошибка в элементе номер ${index}.`);
    if (!correctKeys) console.error(`Ключи объекта должны быть - {value, text}, сейчас - {${objKeys.join()}}`);
    if (!str) {
      let incorrectElem: any = objValues.find((elem: any): boolean => typeof elem !== 'string');
      console.error(`В значениях объекта допускаются только строки, сейчас присутствует ${typeof incorrectElem}`);
    }
    return correctKeys && str;
  });
};