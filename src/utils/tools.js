// 合并json对像， 不增加属性
export function mergeLeft(obj1, obj2) {
  Object.keys(obj1).forEach(key => {
    if (obj2[key]) obj1[key] = obj2[key];
  });
  return obj1;
}

// url 解析
export function param2Obj(url) {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"') +
    '"}',
  );
}