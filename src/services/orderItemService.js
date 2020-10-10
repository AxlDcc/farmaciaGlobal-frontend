import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/orderitems";

function orderItems(id) {
  return `${apiEndpoint}/${id}`;
}
export function getOrderItems() {
  return http.get(apiEndpoint);
}

export function getOrderItem(id) {
  return http.get(orderItems(id));
}

export function saveOrderItem(item) {
  if (item.order_item_id) {
    const body = { ...item };
    delete body.order_item_id;
    return http.put(orderItems(item.order_item_id), body);
  }
  return http.post(apiEndpoint, item);
}
export function deleteOrderItem(id) {
  return http.delete(orderItems(id));
}
