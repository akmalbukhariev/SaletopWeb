import { post } from "@/core/auth/api/apiClient";
import { ENDPOINTS } from "@/core/auth/api/endpoints";

class AdminAPI {

getAdminById(Id: number | string){
        return post(ENDPOINTS.ADMIN.ADMIN_BY_ID(Id))
}

}

export default new AdminAPI();