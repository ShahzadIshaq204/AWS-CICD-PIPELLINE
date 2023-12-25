import axios from "axios";
import authHeader from "./auth-header";
import { log } from "./environment";

//apply base url for axios
const BASE_URL = process.env.REACT_APP_BASEURL;

const axiosQueryApi = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosQueryApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

// used in react query
const get = (url, config = {}) =>
  axiosQueryApi
    .get(url, { ...config, ...{ headers: { ...authHeader() } } })
    .then(response => response.data);

// need remove this
const post = (url, data, config = {}, headersCustom = {}) =>
  axiosQueryApi
    .post(
      url,
      { ...data },
      { ...config, ...{ headers: { ...authHeader(), ...headersCustom } } }
    )
    .then(response => response.data);

/* mutation */
const axiosApi = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    //...authHeader(),
  },
});

const asyncGet = async (url, headers = {}) => {
  let data;
  await axiosApi
    .get(url, {
      headers: {
        ...headers,
        ...authHeader(),
      },
    })
    .then(res => {
      data = res;
    })
    .catch(err => {
      data = null;
      log(err.response);
    });

  return data;
};

const asyncPost = async (url, body, headers = {}) => {
  let data;
  await axiosApi
    .post(url, body, {
      headers: {
        ...headers,
        ...authHeader(),
      },
    })
    .then(res => {
      data = res;
    })
    .catch(err => {
      data = null;
      log(err.response);
    });

  return data;
};

const asyncPut = async (url, body, headers = {}) => {
  let data;
  await axiosApi
    .put(url, body, {
      headers: {
        ...headers,
        ...authHeader(),
      },
    })
    .then(res => {
      data = res;
    })
    .catch(err => {
      data = null;
      log(err.response);
    });

  return data;
};

const asyncDelete = async (url, headers = {}) => {
  let data;
  await axiosApi
    .delete(url, {
      headers: {
        ...headers,
        ...authHeader(),
      },
    })
    .then(res => {
      data = res;
    })
    .catch(err => {
      data = null;
      log(err.response);
    });

  return data;
};

export { get, post, asyncPost, asyncDelete, asyncPut, asyncGet };
