import { Registration } from "../types/Registration";

export function userRegistration(registration: Registration) {
  const url = "/";
  const body = JSON.stringify(registration);
  const error = "Registration fail";
  const reponse = post(url, body, error);

  reponse.then((res: any) => {
    console.log({res});
    window.alert('Send to server OK');
  }).catch((error) => {
    window.alert(error);
  });
}

function post(req: string, body: any, textErr: string) {
  const request = new Request(req, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: body,
  });

  const res = fetch(request).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error(textErr);
    }
  }).catch((error) => {
    throw error;
  });

  return res;
}