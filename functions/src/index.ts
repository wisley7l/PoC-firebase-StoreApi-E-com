import * as functions from "firebase-functions";
import {getProductV1, getCatergoriesV1,
  getStoreV1, getStoreAllV1} from "./api-v1";
import {getProductV2, getCatergoriesV2,
  getStoreV2, getStoreAllV2} from "./api-v2";

import express = require("express");
import cors = require("cors");

const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const firebase = functions.region("southamerica-east1", "us-east1");

const onRequest = firebase.https.onRequest;

const console = functions.logger;

// const helloWorld = onRequest(async (request, response) => {
//   // console.info("Hello logs!", {structuredData: true});
//   const resp = await checkToken();
//   response.send(`Hello ${resp}`);
// });

app.get("/", async (req, res) => {
  const resources = [
    "product_v1",
    "categories_v1",
    "store_v1",
    "storeAll_v1",
    "product_v2",
    "categories_v2",
    "store_v2",
    "storeAll_v2",
  ];
  res.send({resources});
});

app.get("/product_v1", async (req, res) => {
  console.info("Products V1");
  const result = await getProductV1();
  res.send(result);
});

app.get("/categories_v1", async (req, res) => {
  console.info("Products V1");
  const result = await getCatergoriesV1();
  res.send(result);
});

app.get("/store_v1", async (req, res) => {
  console.info("Products V1");
  const result = await getStoreV1();
  res.send(result);
});

app.get("/storeAll_v1", async (req, res) => {
  console.info("Products V1");
  const result = await getStoreAllV1();
  res.send(result);
});

// API V2

app.get("/product_v2", async (req, res) => {
  console.info("Products V2");
  const result = await getProductV2();
  res.send(result);
});

app.get("/categories_v2", async (req, res) => {
  console.info("Products V1");
  const result = await getCatergoriesV2();
  res.send(result);
});

app.get("/store_v2", async (req, res) => {
  console.info("Products V1");
  const result = await getStoreV2();
  res.send(result);
});

app.get("/storeAll_v2", async (req, res) => {
  console.info("Products V1");
  const result = await getStoreAllV2();
  res.send(result);
});

const server = onRequest(app);

export {server};
