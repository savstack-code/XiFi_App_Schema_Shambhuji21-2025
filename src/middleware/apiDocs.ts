import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import Joi from "joi";
import { parseToSwagger } from "./joitoswagger";
import { IRouteInfo } from "./schemaValidator";

export const defaultResponseSchema = Joi.object({
  "200": Joi.object({
    success: Joi.boolean().required(),
    result: Joi.object({}),
    statusCode: Joi.string().valid("200").required(),
    errors: Joi.array().items(Joi.string()),
  }),
});

const defaultRespJoi: { [k: string]: any } = {};
const j2sResp: any = parseToSwagger(defaultResponseSchema);
if (j2sResp !== false) {
  for (const [name, jschema] of Object.entries(j2sResp.swagger.properties)) {
    defaultRespJoi[name] = {
      description: "Response structure",
      schema: jschema,
    };
  }
}
const apiURL =
  process.env.NODE_ENV === "production"
    ? `xifi-janwani.com:${process.env.SSL_PORT}`
    : `localhost:${process.env.PORT}`;

const swaggerObj: { [n: string]: any } = {
  basePath: "/",
  info: {
    title: "XIFI API Documentation",
    version: "1.0.0",
    description: "",
  },
  schemes: ["https", "http"],
  produces: ["application/json"],
  consumes: ["application/json", "multipart/form-data"],
  definitions: {},
  swagger: "2.0",
  externalDocs: {
    url: apiURL,
  },
  // securityDefinitions: {
  //   Bearer: {
  //     type: "apiKey",
  //     name: "Authorization",
  //     in: "header",
  //     description:
  //       "Authorization Tokens to be sent to the server in the format 'Bearer ${token}'",
  //   },
  // },
  // security: [
  //   {
  //     Bearer: [],
  //   },
  // ],
  paths: {},
};
export function convertToSwagger({
  path,
  tags,
  method,
  responses,
  validationSchema,
  description,
  summary,
  jwtAuth,
}: IRouteInfo) {
  path = path.replace(/\:(.*)/i, `{$1}`);
  const { params, query, body, files } = validationSchema || {
    params: undefined,
    query: undefined,
    body: undefined,
    files: undefined,
  };

  const parameters: {
    name?: string;
    in?: string;
    schema?: any;
    type?: string;
    required?: boolean;
    [k: string]: any;
  }[] = [];
  const reqMehtod = method || "get";
  if (jwtAuth) {
    parameters.push({
      type: "string",
      description: "JWT token",
      name: "Authorization",
      in: "header",
      // required: true,
    });
  }

  if (params) {
    const sResp1 = parseToSwagger(params);
    // logger.log("sresp1 in params", sResp1)
    if (sResp1 && sResp1.swagger) {
      // logger.log("params properties: ", sResp1.swagger.properties)
      const requiredParams: string[] = sResp1.swagger.required || [];
      const prop = sResp1.swagger.properties || {};
      for (const [name, schema] of Object.entries(prop)) {
        parameters.push({
          name,
          in: "path",
          type: "string",
          schema,
          description: schema.description,
          required: requiredParams.includes(name),
        });
      }
    }
  }

  if (query) {
    const sResp1 = parseToSwagger(query);
    // logger.log("query: ", sResp1)

    if (sResp1 && sResp1.swagger) {
      // logger.log("params properties: ", sResp1.swagger.properties)
      const requiredParams: string[] = sResp1.swagger.required || [];
      const prop = sResp1.swagger.properties || {};
      for (const [name, schema] of Object.entries(prop)) {
        parameters.push({
          name,
          in: "query",
          type: "string",
          schema,
          description: schema.description,
          required: requiredParams.includes(name),
        });
      }
    }
  }

  if (body) {
    const sResp1 = parseToSwagger(body);
    parameters.push({
      name: "body",
      in: "body",
      schema: sResp1 && sResp1.swagger,
    });
  }

  if (files) {
    const sRespFile = parseToSwagger(files);
    if (sRespFile && sRespFile.swagger && sRespFile.swagger.properties) {
      for (const [fldname] of Object.entries(sRespFile.swagger.properties)) {
        parameters.push({
          name: fldname,
          in: "formData",
          description: "File to upload",
          required:
            sRespFile.swagger.required &&
            sRespFile.swagger.required.indexOf(fldname) > -1,
          type: "file",
          format: "binary",
        });
      }
    }
  }

  if (typeof swaggerObj.paths[path] === "undefined") {
    swaggerObj.paths[path] = {};
  }

  swaggerObj.paths[path][reqMehtod] = {
    tags: tags || ["Others"],
    parameters,
    description,
    summary,
  };
  if (typeof responses !== "undefined") {
    const j2sResp: any = parseToSwagger(responses);
    if (j2sResp !== false) {
      const responses1: { [k: string]: any } = {};
      for (const [name, jschema] of Object.entries(
        j2sResp.swagger.properties
      )) {
        responses1[name] = {
          description: "Response structure",
          schema: jschema,
        };
      }
      swaggerObj.paths[path][reqMehtod].responses = responses1;
    }
  } else {
    swaggerObj.paths[path][reqMehtod].responses = defaultRespJoi;
  }
}

export const handleAPIDocs = (router: Router) => {
  // swaggerObj.host = `${process.env.HOST}:${process.env.PORT}`;
  router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerObj));
};
