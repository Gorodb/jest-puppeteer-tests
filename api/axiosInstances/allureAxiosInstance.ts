import Axios from 'axios';
import https from 'https';

import { config } from 'dotenv';
import {envPath} from "../../confs/envPath";

config({ path: envPath });

const apiUri = process.env.API_ALLURE_URL;

export default Axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  baseURL: apiUri,
  maxContentLength: Infinity,
  maxBodyLength: Infinity
});
