/**
 * axios封装
 * redstone
 * 2022-03-11
 */
import axios from 'axios'

const request = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000
})
/**
* get方法，对应get请求
* @param {String} url [请求的url地址]
* @param {Object} params [请求时携带的参数]
*/
export function $get(url, params) {
  return new Promise((resolve, reject) => {
    request
      .get(url, params)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
 
/**
* post方法，对应post请求
* @param {*} url
* @param {*} params
* @returns
*/
export function $post(url, params) {
  return new Promise((resolve, reject) => {
    request
      .post(url, params)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
 
/**
* put方法，对应put请求
* @param {*} url
* @param {*} params
* @returns
*/
export function $put(url, params) {
  return new Promise((resolve, reject) => {
    request
      .put(url, params)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
* patch方法，对应patch请求
* @param {*} url
* @param {*} params
* @returns
*/
export function $patch(url, params) {
  return new Promise((resolve, reject) => {
    request
      .patch(url, params)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
 
/**
* delete方法，对应delete请求
* @param {*} url
* @param {*} params
* @returns
*/
export function $delete(url, params) {
  return new Promise((resolve, reject) => {
    request
      .delete(url, params)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export default request
 