import { get, post, remove } from "@/core/auth/api/apiClient";
import { ENDPOINTS } from "@/core/auth/api/endpoints";

class AdminAPI {
  async getAllAdmin() {
    return await get(ENDPOINTS.ADMIN.ADMINS);
  }

  async getAdminById(Id: number | string) {
    return await post(ENDPOINTS.ADMIN.ADMIN_BY_ID(Id));
  }

  async deleteById(Id: string) {
    return await remove(ENDPOINTS.ADMIN.DELETE_BY_ID(Id));
  }

  async register(data: object) {
     return await post(ENDPOINTS.AUTH.REGISTER, data);
  }

}

export default new AdminAPI();
