import Request from "./base";

const request = new Request({
  baseURL: "",
  // timeout: 20000,
  // showLoading: true,
});

// 绑定组件实例，抽离方法
let { get, post, del, put } = request;
get = get.bind(request);
post = post.bind(request);
del = del.bind(request);
put = put.bind(request);
export default request;

export { get, post, del, put };
