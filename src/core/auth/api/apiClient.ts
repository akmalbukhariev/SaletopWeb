import axios from "axios";

const service = axios.create({
  //baseURL: '/api',
  baseURL: "http://95.182.118.233:8088/ecoplatesadmin/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

service.defaults.withCredentials = false;

service.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token") || {};
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(new Error(error));
  }
);

service.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log("error: " + error);
    const status = error?.response?.status;
    switch (status) {
      case 400:
        console.log("400");
        break;
      case 401:
        console.log("401");
        break;
      case 403:
        console.log("403");
        //store.commit('removeToken')
        break;
      case 404:
        console.log("404");
        break;
      case 500:
        //  store.dispatch('logout')
        console.log("500");
        break;

      default:
        console.log(
          "There was an error with your request",
          error.response.status
        );
    }

    return Promise.reject(new Error(error));
  }
);

export const post = async (url: string, data = {}) => {
  return await service.post(url, data).then(res => {
    console.log("post:", res);
    return res.data;
  });
};

export const loginPost = async (url: string, data = {}) => {
  return await service.post(url, data).then(res => {
    return res;
  });
};

export const put = async (url: string, data = {}) => {
  return await service.put(url, data).then(res => {
    console.log("put:", res);
    return res.data;
  });
};

export const get = async (url: string, params = {}) => {
  return await service.get(url, { params }).then(res => {
    return res.data;
  });
};

export const remove = async (url: string, data = {}) => {
  return await service.delete(url, data).then(res => {
    console.log('get:', res);
    return res.data;
  });
};
