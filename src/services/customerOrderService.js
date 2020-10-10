import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/customerorders";

function customerOrderUrl(id) {
  return `${apiEndpoint}/${id}`;
}
export function getCustomersOrders() {
  return http.get(apiEndpoint);
}

export function getCustomerOrder(id) {
  return http.get(customerOrderUrl(id));
}

export function saveCustomerOrder(item) {
  if (item.order_id) {
    const body = { ...item };
    delete body.order_id;
    return http.put(customerOrderUrl(item.order_id), body);
  }
  return http.post(apiEndpoint, item);
}
export function deleteCustomerOrder(id) {
  return http.delete(customerOrderUrl(id));
}
