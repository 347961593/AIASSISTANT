import axios from "axios";
import { useCozeStore } from "@stores";
const store = useCozeStore();

class Request {
  instance;
  constructor(config) {
    this.instance = axios.create(config);
    const { request, response } = this.instance.interceptors;
    // 请求拦截
    request.use(
      (config) => {
        if (config.url.includes("api")) {
          let token = localStorage.getItem("token");
          if (token) config.headers["token"] = token;
        } else if (config.url.includes("minimax")) {
          config.headers["authorization"] = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiLljJfkuqznvqTlrqLkv6Hmga_mioDmnK_mnInpmZDlhazlj7giLCJVc2VyTmFtZSI6IuS9leWtmeaXuiIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxODA1OTA4MDM2MTU0Mjk4Njk4IiwiUGhvbmUiOiIxNzczMjg1MTgzNyIsIkdyb3VwSUQiOiIxODA1OTA4MDM2MTQ1OTEwMDkwIiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoiIiwiQ3JlYXRlVGltZSI6IjIwMjQtMTEtMDYgMTA6MjI6MTAiLCJpc3MiOiJtaW5pbWF4In0.gsvgBarzdJoM-vxWj4JOIOFvHk9Lsl44qc0aW8Pbi0Ozk_8TnYciaRBltifaYa3H2HIgWgSja_Mm9TfhvR0i3AU0j2imoKzSf_roCErKlCFDQFALviRk1qINnPoUAELeYbYEOxS6pA8tg_V821A96xCvFdbNI1ENOiIIKEJNXK4_Oo4H74HrfE8Bxfx6SMXlnlYl8k9v0PSGxOnNf88sXOF2QXDFccr3kJgjzq-XyVRoGJJ7Ml1deRNhj7HdNnetxRVFRjcW1jWL-FHJZY0eTAwbF23Bu05FuilHGRbfzrdQXh7WMzioWLSNST94rBuEmDsSNblqwApsp2xOJyy8SA";
          config.headers["content-type"] = "application/json";
          config.headers["accept"] = "application/json, text/plain, */*";
        }else if (config.url.includes("v1") || config.url.includes("v3")) {
          config.headers["Authorization"] = "Bearer "+store.authorization;
          config.headers["Content-Type"] = "application/json";
        }

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
