import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  clearUser,
  getUserRefreshToken,
  getUserToken,
  saveUserRefreshToken,
  saveUserToken,
} from "../shared/localStorage/user";

const instance = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API || "",
});

instance.interceptors.request.use(
  function (config) {
    const authorization = getUserToken();
    const refreshToken = getUserRefreshToken();

    // console.log('auth toke', authorization)
    // console.log('refresh', refreshToken)

    if (authorization && refreshToken) {
      config.headers.setAuthorization(authorization);
      config.headers.set("refreshtoken", refreshToken);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  function (config) {
    const headers = config.headers;
    const authorization = headers.authorization;
    const refreshtoken = headers.refreshtoken;

    // console.log('override token', authorization, refreshtoken)
    if (authorization && refreshtoken) {
      saveUserToken(authorization);
      saveUserRefreshToken(refreshtoken);
      // console.log('override done')
    }
    return config;
  },
  function (error) {
    const { response } = error;
    if (response && response.status === 401) {
      // if (isSessionExpired()) {
      //   messageError("Your session is expired. Please login again !");
      //   clearAllGoalieToken();
      //   window.location.href = "/sign-in";
      //   return;
      // }
      clearUser();
      setTimeout(() => window.location.href = "/sign-in", 2000);
      return;

      // window.location.href = '/sign-out';

      // console.log('href', pathname)
      // if (pathname.includes('/sign-in') || pathname.includes('/sign-up')) {
      //   return;
      // }
      // window.location.href = `/sign-in?redirectUrl=${window.location.pathname}`;
    }
    const { stack, ...error_info } = error;
    console.log({ "intercept_error": error_info });
    return Promise.reject(response);
  },
);

const httpPost: <T = any, R = AxiosResponse<T, any>, D = any>(
  url: string,
  data?: D | undefined,
  config?: AxiosRequestConfig<D> | undefined,
) => Promise<R> = <T = any, R = AxiosResponse<T, any>, D = any>(
  url: string,
  data?: D | undefined,
  config?: AxiosRequestConfig<D> | undefined,
) => {
  const interceptData =
    data as (D & { columns: string[] | string; filter: string[] | string });
  if (
    Object.prototype.hasOwnProperty.call(interceptData, "columns") &&
    !!interceptData
  ) {
    const columns = interceptData["columns"];
    if (Array.isArray(columns)) {
      interceptData["columns"] = columns.join(",");
    }
  }
  // if (
  //   Object.prototype.hasOwnProperty.call(interceptData, "filter") &&
  //   !!interceptData
  // ) {
  //   const filter = interceptData["filter"];
  //   if (typeof filter !== "string") {
  //     interceptData["filter"] = `[${filter.join(",")}]`;
  //   }
  // }

  return req.post(url, interceptData, config) as Promise<R>;
};

const parseDateObject = (a: any) => {
  if (a instanceof Date) {
    return a.toISOString();
  }
  return a;
};

const httpFormWrapper = (reqFunction: any) =>
  function <T = any, R = AxiosResponse<T, any>, D = any>(
    url: string,
    data?: D | undefined,
    config?: AxiosRequestConfig<FormData> | undefined,
  ): Promise<R> {
    const formData = new FormData();
    if (!data) return reqFunction(url, formData, config);
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        const arrKey = `${key}`;
        value.forEach((subValue) => {
          formData.append(arrKey, parseDateObject(subValue));
        });
      } else {
        if (value instanceof Blob || typeof value === "string") {
          formData.append(key, value);
        } else {
          if (value == null) formData.append(key, "");
          else {
            formData.append(key, parseDateObject(value));
          }
        }
      }
    }
    return reqFunction(url, formData, config);
  };

export const req = instance;
export const httpGet = req.get;
// export const httpPost = req.post;
export { httpPost };
export const httpPostForm = httpFormWrapper(req.postForm);
export const httpPut = req.put;
export const httpDel = req.delete;
