import * as dotenv from "dotenv";

let path;
switch (process.env.NODE_ENV) {
    case "development" || "test":
        path = `${__dirname}/../.env.development`
        dotenv.config({ path: path })
        break;
    default:
        path = "";
        break;
}

export default {
    DB_ENDPOINT: process.env.DB_ENDPOINT,
    NODEPORT: process.env.NODEPORT,
    DOMAIN: process.env.DOMAIN,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
    COSMOSDB_CONNECTION_STRING: process.env.COSMOSDB_CONNECTION_STRING
}