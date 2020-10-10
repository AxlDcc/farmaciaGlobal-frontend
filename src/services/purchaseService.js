import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/purchases";

function purchaseUrl(id) {
  return `${apiEndpoint}/${id}`;
}
export function getPurchases() {
  return http.get(apiEndpoint);
}

export function getPurchase(purchaseId) {
  return http.get(purchaseUrl(purchaseId));
}

export function savePurchase(purchase) {
  if (purchase.purchase_number) {
    const body = { ...purchase };
    delete body.purchase_number;
    return http.put(purchaseUrl(purchase.purchase_number), body);
  }
  return http.post(apiEndpoint, purchase);
}
export function deletePurchase(purchaseId) {
  return http.delete(purchaseUrl(purchaseId));
}
