import {
  handleCors,
  handleBodyRequestParsing,
  handleCompression,
  serveStaticFiles,
  handleRequestContext
} from "./common";

import { handleAPIDocs } from "./apiDocs";
import { handlelogs } from "./logger";

export default [
  handleRequestContext,
  handleCors,
  handleBodyRequestParsing,
  handleCompression,
  handleAPIDocs,
  handlelogs,
  serveStaticFiles
];  