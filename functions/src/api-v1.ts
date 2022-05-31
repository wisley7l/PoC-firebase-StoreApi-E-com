import axios from "axios";
import {storeId, myId, apiKeyV1, productId} from "./__env";

const baseURLV1 = "https://api.e-com.plus/v1";

type HeaderApiV1 = {
  "Content-type": string,
  "X-Store-ID": string,
  "X-Access-Token"?: string,
  "X-My-ID"?: string,
};

type TokenApiV1 = {
  "access_token": string,
  [key: string]: string,
};


let token: TokenApiV1 | undefined;

const axiosV1 = axios.create({
  baseURL: baseURLV1,
});


const headerApiV1 = (storeId: string | undefined, useToken: boolean) => {
  const header: HeaderApiV1 = {
    "Content-type": "application/json",
    "X-Store-ID": `${storeId}`,
  };
  if (useToken && token) {
    header["X-Access-Token"] = `${token["access_token"]}`;
    header["X-My-ID"] = `${myId}`;
  }
  return header;
};

const getToken = async () => {
  console.log("Request token");
  const data = {
    _id: myId,
    api_key: apiKeyV1,
  };
  const url = "https://api.e-com.plus/v1/_authenticate.json";
  const headers = headerApiV1(storeId, false);
  const request = await axios({method: "post", url, data, headers});
  return request.data;
};

const checkToken = async () => {
  const now = new Date();
  if (!token || (now > new Date(token["expires"]))) {
    token = await getToken();
  }
  return (token && token["expires"]) ? true : false;
};

const request = async (url: string) => {
  const headers = headerApiV1(storeId, true);
  let response = null;
  const now = new Date().getTime();
  try {
    response = (await axiosV1({method: "get", url, headers})).data;
  } catch (e) {
    console.error(e);
  }
  const took = new Date().getTime() - now;
  return {took, url: `${url}`, response};
};

const getProductV1 = async () => {
  await checkToken();
  const url = `${baseURLV1}/products/${productId}.json`;
  return request(url);
};

const getCatergoriesV1 = async () => {
  await checkToken();
  const url = `${baseURLV1}/categories.json`;
  return request(url);
};

const getStoreV1 = async () => {
  await checkToken();
  const url = `${baseURLV1}/stores/me.json`;
  return request(url);
};

const getStoreAllV1 = async () => {
  await checkToken();
  const urlProduct = `${baseURLV1}/products/${productId}.json`;
  const urlCategories = `${baseURLV1}/categories.json`;
  const urlStore = `${baseURLV1}/stores/me.json`;
  const now = new Date().getTime();
  const result = await Promise.all([
    request(urlProduct),
    request(urlCategories),
    request(urlStore),
  ]);
  const took: number = (new Date().getTime() - now);
  const url: Array<string> = [];
  const response: Array<object> = [];
  result.forEach(
      (request) => {
        url.push(request.url);
        response.push(request);
      });

  const api = {
    took,
    url,
    response,
  };

  return api;
};

export {getProductV1, getCatergoriesV1, getStoreV1, getStoreAllV1};
