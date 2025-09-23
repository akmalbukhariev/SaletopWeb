import { get, post, put } from "@/core/auth/api/apiClient";
import { ENDPOINTS } from "@/core/auth/api/endpoints";

class UserAPI {
  async getAllUsers(data: object) {
    // {
    //   "offset": 0,
    //   "pageSize": 10
    // }
    return await post(ENDPOINTS.USERS.PAGINATED_LIST, data);
  }

  async getUserByPhoneNum(phone_number: string | number) {
    return await get(ENDPOINTS.USERS.BY_PHONE_NUM(phone_number));
  }

  async changeUserDeletionStatus(data: object) {
    // {
    //   "deleted": true,
    //   "phone_number": "string"
    // }
    return await put(ENDPOINTS.USERS.CHANGE_DELETION_STATUS, data);
  }

  async changeUserStatus(id: string | number, data: object) {
    // data = {
    //           "phone_number": "string",
    //           "status": "ACTIVE"
    //         }
    return await put(ENDPOINTS.USERS.CHANGE_STATUS, data);
  }
}

export default new  UserAPI();


