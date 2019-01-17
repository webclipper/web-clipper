const USER_PREFERENCE = actionTypeReset('USER_PREFERENCE', {
  INIT_USER_PREFERENCE: ''
});

const USER_INFO = actionTypeReset('USER_INFO', {
  ASYNC_FETCH_USER_INFO: ''
});

function actionTypeReset<T>(nameSpace: string, object: T): T {
  Object.keys(object).forEach(key => {
    (object as any)[key] = `${nameSpace}/${key}`;
  });
  return object;
}

export { USER_PREFERENCE, USER_INFO };
