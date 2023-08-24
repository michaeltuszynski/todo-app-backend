import * as dotenv from "dotenv";

let path;
switch (process.env.NODE_ENV) {
    case "production":
        path = `${__dirname}/../.env.production`
        console.log(path);
        break;
    default:
        path = `${__dirname}/../.env.development`
}
dotenv.config({ path: path })

export default {
    MONGODB_URI: process.env.MONGODB_URI,
    NODEPORT: process.env.NODEPORT
}