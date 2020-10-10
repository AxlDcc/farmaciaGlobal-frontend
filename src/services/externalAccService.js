import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/externalacc";

function externalAccUrl(id) {
  return `${apiEndpoint}/${id}`;
}
export function getExternalAccs() {
  return http.get(apiEndpoint);
}

export function getExternalAcc(id) {
  return http.get(externalAccUrl(id));
}

export function saveExternalAcc(item) {
  if (item.acc_number) {
    const body = { ...item };
    delete body.acc_number;
    return http.put(externalAccUrl(item.acc_number), body);
  }
  return http.post(apiEndpoint, item);
}
export function deleteExternalAcc(id) {
  return http.delete(externalAccUrl(id));
}
