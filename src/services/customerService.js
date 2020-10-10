import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/customer";

function customerUrl(id) {
  return `${apiEndpoint}/${id}`;
}
export function getCustomers() {
  return http.get(apiEndpoint);
}

export function getCustomer(id) {
  return http.get(customerUrl(id));
}

export function saveCustomer(item) {
  if (item.customer_id) {
    const body = { ...item };
    delete body.customer_id;
    return http.put(customerUrl(item.customer_id), body);
  }
  return http.post(apiEndpoint, item);
}
export function deleteCustomer(id) {
  return http.delete(customerUrl(id));
}
