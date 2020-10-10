import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/brands";

function brandUrl(id) {
  return `${apiEndpoint}/${id}`;
}
export function getBrands() {
  return http.get(apiEndpoint);
}
export function saveBrand(brand) {
  if (brand.brand_id) {
    const body = { ...brand };
    delete body.brand_id;
    return http.put(brandUrl(brand.brand_id), body);
  }
  return http.post(apiEndpoint, brand);
}
