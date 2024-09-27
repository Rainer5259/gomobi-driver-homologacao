/* @flow */
import NetworkRequest from './NetworkRequest';
export default function Connection(
  timeout: number = 20000,
  url: string = 'https://google.com',
): Promise<boolean> {
  return new Promise((resolve: (value: boolean) => void) => {
    NetworkRequest({
      method: 'HEAD',
      url,
      timeout,
    })
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
}