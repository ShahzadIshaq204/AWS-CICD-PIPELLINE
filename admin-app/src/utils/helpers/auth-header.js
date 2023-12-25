export default function authHeader() {
  const token = localStorage.getItem("token") || "fake-token"; // todo fixme

  if (token) {
    return { Authorization: "Bearer " + token };
  } else {
    return {};
  }
}
