import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/purchasesItems";

function purchaseItemUrl(id) {
  return `${apiEndpoint}/${id}`;
}
export function getPurchaseItems() {
  return http.get(apiEndpoint);
}

export function getPurchaseItem(purchaseItemId) {
  return http.get(purchaseItemUrl(purchaseItemId));
}

export function savePurchaseItem(purchaseItem) {
  if (purchaseItem.purchase_item_id) {
    const body = { ...purchaseItem };
    delete body.purchase_item_id;
    return http.put(purchaseItemUrl(purchaseItem.purchase_item_id), body);
  }
  return http.post(apiEndpoint, purchaseItem);
}
export function deletePurchaseItem(purchaseItemId) {
  return http.delete(purchaseItemUrl(purchaseItemId));
}
