import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/users";

export function register(user) {
  return http.post(apiEndpoint, {
    user_type_id: user.user_type_id,
    email: user.email,
    password: user.password,
    status: user.status,
    createdBy: user.createdBy
  });
}
