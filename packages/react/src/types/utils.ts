export type RemoveReadonly<Test> = {
  -readonly [key in keyof Test]: Test[key];
};
