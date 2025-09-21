import { Router } from "express";
import cors from "cors";
import parser from "body-parser";
import compression from "compression";
import express = require("express");
import { join } from "path";
import appRoot from 'app-root-path';
const requestContext = require('request-context');

export const handleRequestContext = (router: Router) => {
  router.use(requestContext.middleware('request'));
};

export const handleCors = (router: Router) =>
  router.use(cors({ credentials: true, origin: true }));

export const handleBodyRequestParsing = (router: Router) => {
  router.use(parser.urlencoded({ extended: true }));
  router.use(parser.json());
};

export const handleCompression = (router: Router) => {
  router.use(compression());
};

export const serveStaticFiles = (router: Router) => {
  router.use("/public", express.static(`${appRoot}/public`));
};