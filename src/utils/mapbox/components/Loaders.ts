export const loadJson = async (params: string) =>
  fetch(params).then((res) => res.json());
