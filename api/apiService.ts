import FormData from 'form-data';
import fs from 'fs';
import {build} from 'search-params';

export default class ApiService {
  constructor(private readonly axios: any) {
  }

  async postRequest(url: string, body = {}): Promise<any> {
    try {
      const {data} = await this.axios.post(url, body);
      return data;
    } catch (error: any) {
      console.error(error.response);
      return error.response;
    }
  }

  async sendFile(url: string, name: string, filePath: string, fileName: string): Promise<any> {
    let formData = new FormData();
    formData.append(name, fs.readFileSync(filePath), fileName);

    try {
      const {data} = await this.axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...formData.getHeaders(),
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        },
      });
      console.log(data)
      return data;
    } catch (error: any) {
      console.error(error);
      return error.response;
    }
  }

  async getRequest(
    url: string,
    params: { [index: string]: any } = {},
  ): Promise<any> {
    const queryParams = build(params);

    try {
      const {data} = await this.axios.get(`${url}?${queryParams}`);
      return data;
    } catch (error: any) {
      console.error(error.response);
      return error.response;
    }
  }

  async putRequest(url: string, body = {}): Promise<any> {
    try {
      const {data} = await this.axios.put(url, body);
      return data;
    } catch (error: any) {
      console.error(error.response);
      return error.response;
    }
  }

  async deleteRequest(url: string, body: any): Promise<any> {
    try {
      const {data} = await this.axios.delete(url, body);
      return data;
    } catch (error: any) {
      console.error(error.response);
      return error.response;
    }
  }

  async setAuthToken(token: string): Promise<void> {
    if (token) {
      this.axios.defaults.headers.common.authorization = `Bearer ${token}`;
    } else {
      delete this.axios.defaults.headers.common.authorization;
    }
  }
}
