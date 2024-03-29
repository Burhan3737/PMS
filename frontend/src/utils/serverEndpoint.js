export function getServerEndpoint() {
  let serverEndpoint = /*"127.0.0.1:4001/";*/ /*'localhost:3005/'*/ /* 'iahmed:3005/' */ "127.0.0.1:4001/";
  if (process.env.NODE_ENV === "production") {
    serverEndpoint = window.location.host + "/"; //window.location.protocol + '//'+ window.location.host +'/';
  }

  return serverEndpoint;
}
