import axios from "axios";
import {storeId, productId} from "./__env";

const baseURLV2 = "https://ecomplus.io/v2";

const axiosV2 = axios.create({
  baseURL: baseURLV2,
});

const request = async (url: string) =>{
  let response = null;
  const now = new Date().getTime();
  try {
    response = (await axiosV2({method: "get", url})).data;
  } catch (e) {
    console.error(e);
  }
  const took = new Date().getTime() - now;
  return {took, url: `${url}`, response};
};

const getProductV2 = async () => {
  const url = `${baseURLV2}/:${storeId}/products/${productId}`;
  return request(url);
};

const getCatergoriesV2 = async () => {
  const url = `${baseURLV2}/:${storeId}/categories`;
  return request(url);
};

const getStoreV2 = async () => {
  const url = `${baseURLV2}/:${storeId}/stores/me`;
  return request(url);
};

const getStoreAllV2 = async () => {
  const urlProduct = `${baseURLV2}/:${storeId}/products/${productId}`;
  const urlCategories = `${baseURLV2}/:${storeId}/categories`;
  const urlStore = `${baseURLV2}/:${storeId}/stores/me`;
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

export {getProductV2, getCatergoriesV2, getStoreV2, getStoreAllV2};
