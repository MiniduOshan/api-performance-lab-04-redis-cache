import http from "k6/http";

export let options = {
  vus: 50,
  duration: "10s",
};

export default function () {
  http.get("http://localhost:3000/products"); // change to 3001
}