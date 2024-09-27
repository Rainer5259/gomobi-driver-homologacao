
/**
 * Utility that promisifies XMLHttpRequest in order to have a nice API that supports cancellation.
 * @param method
 * @param url
 * @param params -> This is the body payload for POST requests
 * @param headers
 * @param timeout -> Timeout for rejecting the promise and aborting the API request
 * @returns {Promise}
 */
export default function NetworkRequest(
  { method = 'get', url, params, headers = {}, timeout = 10000 } = {},
) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    const tOut = setTimeout(() => {
      xhr.abort();
      reject('timeout');
    }, timeout);

    xhr.open(method, url);
    xhr.onload = function onLoad() {
      if (this.status >= 200 && this.status < 300) {
        clearTimeout(tOut);
        resolve(xhr.response);
      } else {
        clearTimeout(tOut);
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function onError() {
      clearTimeout(tOut);
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    };
    if (headers) {
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });
    }
    let requestParams = params;


    if (requestParams && typeof requestParams === 'object') {
      requestParams = Object.keys(requestParams)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(

              requestParams[key],
            )}`,
        )
        .join('&');
    }
    xhr.send(params);
  });
}
