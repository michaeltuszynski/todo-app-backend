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
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
}