import axios from "axios";

class Request {
  instance;

  constructor(config) {
    this.instance = axios.create(config);

    const { request, response } = this.instance.interceptors;

    // 请求拦截
    request.use(
      (config) => {
        config.headers = {
          "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzb2wiLCJleHAiOjE3NDE2ODMzODcsImF1ZCI6InVzZXIiLCJuYmYiOjE3NDEwNzg1ODcsImlhdCI6MTc0MTA3ODU4NywidWlkIjo0LCJ1c2VyIjp0cnVlfQ.Z2CperBCnfkjqTDx94UfgDRxqloD9kNTwksoj1j4E18",
        };
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );

    // 响应拦截
    response.use(
      (res) => {
        const { data, config } = res;
        return config.isReturnAll ? res : data;
      },
      (err) => {
        return Promise.reject(err);
      }
    );
  }

  request(config) {
    return this.instance.request(config);
  }

  get(url, params, config) {
    return this.request({ ...config, method: "get", url, params });
  }

  post(url, data, config) {
    return this.request({ ...config, data, method: "post", url });
  }

  del(url, config) {
    return this.request({ ...config, method: "delete", url });
  }

  put(url, data, config) {
    return this.request({ ...config, data, method: "put", url });
  }
}

export default Request;
