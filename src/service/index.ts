import axios from "axios";
import Cookies from "js-cookie";

const httpClient = axios.create({
  baseURL: "https://make-sens.herokuapp.com",
});

let isRefreshing = false;
let refreshSubscribers: Function[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.map((cb: any) => cb(token));
  refreshSubscribers = [];
}

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.response) {
      const {
        config,
        response: { status, data },
      } = error;
      const originalRequest = config;
      const refreshToken: string | undefined | null =
        Cookies.get("refresh-token");

      if (status === 401) {
        if (refreshToken) {
          if (!isRefreshing) {
            isRefreshing = true;
            axios
              .post("/v1.0/api/account/token-refresh/", {
                refresh: refreshToken,
              })
              .then((res) => {
                if (res) {
                  isRefreshing = false;
                  onRefreshed(res.data.access);
                  Cookies.set("token", res.data.access);
                  Cookies.set("refresh-token", res.data.refresh);
                }
              })
              .catch(() => {
                window.location.replace("/sign-in");
                isRefreshing = false;
                return Promise.reject(error);
              });
          }

          return new Promise((resolve) => {
            subscribeTokenRefresh((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axios(originalRequest));
            });
          });
        }
        Cookies.remove("token");
        Cookies.remove("refresh-token");
        isRefreshing = false;
      } else if (status === 400) {
        return Promise.reject(error);
      } else {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

httpClient.interceptors.request.use((config) => {
  const token: string | undefined = Cookies.get("token");

  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    return config;
  }
  delete config?.headers?.Authorization;
  return config;
});

export default httpClient;
