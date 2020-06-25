export const modelValueValidator = (arr: string[]): boolean => {
  let allString: boolean = arr.every(elem => typeof elem === 'string');
  !allString && console.error(`
    В массиве значений для checkbox должны использоваться строки, 
    сейчас присутствует - ${typeof arr.find((elem: any): boolean => typeof elem !== 'string')}
  `)
  return allString;
}