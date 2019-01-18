export function actionTypeHelper<T>(nameSpace: string, object: T): T {
  Object.keys(object).forEach(key => {
    (object as any)[key] = `${nameSpace}/${key}`;
  });
  return object;
}
