import axiosInstance from '../axiosInstances/contactsAxiosInstance'
import ApiService from '../apiService'

const axios = new ApiService(axiosInstance)

export default class AdminApi {
  static async clearDb() {
    return await axios.postRequest(`/api/secret/clear`)
  }
}
