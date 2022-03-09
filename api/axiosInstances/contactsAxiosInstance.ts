import Axios from 'axios';
import https from 'https';

import { config } from 'dotenv';
import {envPath} from "../../confs/envPath";

config({ path: envPath });

const axios = Axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  baseURL: process.env.API_URL
})

export default axios;
