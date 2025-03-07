import axios from "axios";

class Request {
  instance;
  constructor(config) {
    this.instance = axios.create(config);
    const { request, response } = this.instance.interceptors;
    // 请求拦截
    request.use(
      (config) => {
        console.log(config);
        
        let token = localStorage.getItem("token");
        if (token) config.headers.token = token;
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
