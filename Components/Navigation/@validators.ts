import {navigationObject} from './@types';

export const navigationValidator = (array: navigationObject[]): boolean => {
  let checkKeys: boolean = array.every(elem => elem.href && elem.text);
  let checkTypes: boolean = array.every(elem => typeof elem.href === 'string' && typeof elem.text === 'string');
  if(!checkKeys) {
    let incorrectObjectKeys: any = array.find(elem => !elem.href || !elem.text) ?? {};
    let incorrectKey: string = Object.keys(incorrectObjectKeys).join(', ');
    console.error(`
      Ключи объекта должны быть href & text, 
      сейчас - ${incorrectKey}
    `);
  } 
  if(!checkTypes) {
    let incorrectObjectTypes: any = array.find(elem => typeof elem.href !== 'string' || typeof elem.text !== 'string') ?? {};
    if (typeof incorrectObjectTypes === 'object') {
      if (incorrectObjectTypes instanceof Array) {
        console.error(`
          Массив передаваемых значений должен содержать объекты, 
          сейчас присутствует массив.
        `);        
      } else {
        let incorrectType: string = Object.values(incorrectObjectTypes)
          .map((elem: any): string => typeof elem)
          .filter(elem => elem !== 'string')
          .join(', ');
        console.error(`
          Тип значений в объекте должен быть string, 
          сейчас - ${incorrectType}
        `);
      }
    } else {
      console.error(`
        Тип значений в массиве navigationObject, 
        сейчас - ${typeof incorrectObjectTypes}
      `);      
    }
  }
  return true;
}