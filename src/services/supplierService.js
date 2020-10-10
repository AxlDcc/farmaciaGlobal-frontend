import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/suppliers";

function purchaseUrl(id) {
  return `${apiEndpoint}/${id}`;
}
export function getSuppliers() {
  return http.get(apiEndpoint);
}

export function getSupplier(purchaseId) {
  return http.get(purchaseUrl(purchaseId));
}

export function saveSupplier(purchase) {
  if (purchase.supplier_id) {
    const body = { ...purchase };
    delete body.supplier_id;
    return http.put(purchaseUrl(purchase.supplier_id), body);
  }
  return http.post(apiEndpoint, purchase);
}
export function deleteSupplier(purchaseId) {
  return http.delete(purchaseUrl(purchaseId));
}
