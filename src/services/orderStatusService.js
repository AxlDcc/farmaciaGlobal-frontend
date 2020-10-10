import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/orderstatus";

function orderStatus(id) {
  return `${apiEndpoint}/${id}`;
}
export function getOrderStatuses() {
  return http.get(apiEndpoint);
}

export function getOrderStatus(id) {
  return http.get(orderStatus(id));
}

export function saveOrderStatus(item) {
  if (item.order_status_id) {
    const body = { ...item };
    delete body.order_status_id;
    return http.put(orderStatus(item.order_status_id), body);
  }
  return http.post(apiEndpoint, item);
}
export function deleteOrderStatus(id) {
  return http.delete(orderStatus(id));
}
