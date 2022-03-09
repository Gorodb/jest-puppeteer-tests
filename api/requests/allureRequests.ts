import ApiService from '../apiService';
import allureAxiosInstance from '../axiosInstances/allureAxiosInstance';

const allureAxios = new ApiService(allureAxiosInstance);

export default class AllureRequests {
  static async allureSend(name: string, path: string, fileName: string) {
    await allureAxios.sendFile(`api/allure/upload`, name, path, fileName)
  }

  static async createProject(project: string, platform: string, description: string) {
    await allureAxios.postRequest(`api/allure/project`, {
      project,
      platform,
      description
    })
  }
}
