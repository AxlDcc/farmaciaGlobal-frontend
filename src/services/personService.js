import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/persons";

function personsUrl(id) {
  return `${apiEndpoint}/${id}`;
}
export function getPersons() {
  return http.get(apiEndpoint);
}

export function getPerson(id) {
  return http.get(personsUrl(id));
}

export function savePerson(item) {
  if (item.person_id) {
    const body = { ...item };
    delete body.person_id;
    return http.put(personsUrl(item.person_id), body);
  }
  return http.post(apiEndpoint, item);
}
export function deletePerson(id) {
  return http.delete(personsUrl(id));
}
