export interface hierarchicalA {
  color: string,
  title: string,
  a: string,
  router?: boolean,
  target?: string
}

export interface hierarchicalVal {
  val: string,
  a?: string,
  link?: string,
  target?: string
}

type hierarchicalPreArray = Omit<hierarchicalA, 'router' | 'a'>;

export interface hierarchicalArray extends hierarchicalPreArray {
  array: hierarchicalArray[] | hierarchicalVal[] | hierarchicalA[]
}

export type hierarchicalDeepObject = hierarchicalA | hierarchicalArray;