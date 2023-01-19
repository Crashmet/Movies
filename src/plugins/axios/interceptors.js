function setParams(config) {
  const params = config.params || {};
  config.params = Object.assign(params, {
    apikey: process.env.VUE_APP_API_KEY,
    plot: 'full',
  });

  return config;
}
// настройка запроса api с сервера

function returnData(res) {
  return res.data;
}
// преображение данных для удобства использования

export default function (axios) {
  axios.interceptors.request.use(setParams);
  axios.interceptors.response.use(returnData);
}
