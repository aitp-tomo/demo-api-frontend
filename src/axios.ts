import axios, { AxiosInstance } from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

export const getAxiosInstance = async (): Promise<AxiosInstance> => {
  let axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_ROOT_URL,
  });

  await fetchAuthSession().then((session) => {
    const token = session.tokens?.idToken?.toString();
    if (token) {
      axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_ROOT_URL,
        headers: {
          Authorization: token,
        },
      });
    }
  });

  return axiosInstance;
};
