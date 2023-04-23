import axios from 'axios';

const baseURL = process.env.NODE_ENV === "production" ? 'https://vueboards.onrender.com' : "http://localhost:3001";
// const baseURL = 'https://vueboards.onrender.com';
const request = axios.create({
  baseURL,
});

// const sleep = (delay) => {
//   return new Promise(function(resolve) {
//     setTimeout(resolve, delay);
//   });
// }

// request.interceptors.response.use(async function (response) {
//   await sleep(500)
//   return response;
// }, function (error) {
//   console.error(error)
//   return Promise.reject(error);
// });

export default request;