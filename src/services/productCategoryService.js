import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/typesProducts";

function typesProductUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getCategories() {
  return http.get(apiEndpoint);
}

export function saveTypesProduct(typesProduct) {
  if (typesProduct.type_products_id) {
    const body = { ...typesProduct };
    delete body.type_products_id;
    return http.put(typesProductUrl(typesProduct.type_products_id), body);
  }
  return http.post(apiEndpoint, typesProduct);
}
