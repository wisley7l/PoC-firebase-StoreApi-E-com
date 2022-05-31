import * as functions from "firebase-functions";
import axios from "axios";
import {storeId, myId, apiKeyV1} from "./__env";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const server = functions.region("southamerica-east1");

const onRequest = server.https.onRequest;

const console = functions.logger;

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

const productId = "5f7fa540b2161709fa3d1c3b";
const baseURLV2 = "https://ecomplus.io/v2";
const baseURLV1 = "https://api.e-com.plus/v1";

const axiosV2 = axios.create({
  baseURL: baseURLV2,
});

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

// const helloWorld = onRequest(async (request, response) => {
//   // console.info("Hello logs!", {structuredData: true});
//   const resp = await checkToken();
//   response.send(`Hello ${resp}`);
// });


const getProductV2 = async () => {
  const url = `${baseURLV2}/:${storeId}/products/${productId}`;
  const now = new Date().getTime();
  try {
    await axiosV2({method: "get", url});
  } catch (e) {
    console.error(e);
  }
  const took = new Date().getTime() - now;
  return {took, url: `${url}`};
};


const getProductV1 = async () => {
  const url = `${baseURLV1}/products/${productId}.json`;
  const headers = headerApiV1(storeId, true);
  const now = new Date().getTime();
  try {
    await axiosV1({method: "get", url, headers});
  } catch (e) {
    console.error(e);
  }
  const took = new Date().getTime() - now;
  return {took, url: `${url}`};
};

const productV2 = onRequest(async (req, resp) => {
  const result = await getProductV2();
  resp.send({result});
});

const productV1 = onRequest(async (req, resp) => {
  await checkToken();
  const result = await getProductV1();
  resp.send({result});
});

export {productV2, productV1};
