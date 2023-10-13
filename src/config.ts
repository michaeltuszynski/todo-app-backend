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
    NODEPORT: process.env.NODEPORT,
    PROJECT_ID: process.env.PROJECT_ID,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY
}