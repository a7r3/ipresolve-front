const http = require('http');

const WebSocket = require('ws');
let ws = null;

const log = console.log;

const startButton = document.getElementById('start');
const hostnameInput = document.getElementById('hostname');
const portInput = document.getElementById('port');

let hostname = null;
let port = null;
let clientId = null;

startButton.addEventListener('click', () => {
  hostname = hostnameInput.value;
  port = portInput.value;
  port = parseInt(port);
  log({hostname, port});

  log('Starting WebSocket connection...');
  ws = new WebSocket('ws://localhost:8080');
  
  log('Registring client...');
  ws.on('open', () => {
    log('WebSocket connected.');
  });

  ws.on('error', (err) => {
    log('Some error: ', err);
  });

  ws.on('message', wsMessageHandler);

  ws.on('close', () => {
    log('WebSocket connection closed.');
  });
});

function wsMessageHandler (incomingMessage) {
  const msg = JSON.parse(incomingMessage);
  // log(msg);

  // REQUEST OBJECT PROPERTIES
  // type
  // reqId
  // headers
  // url
  // method

  if (msg.type === 'request') {
    incomingReqHandler(msg);
  } else {
    // other stuff, to be handled here
    clientId = msg.clientId;
  }
}

function incomingReqHandler (incomingReq) {
  log('request in here');
  // REQUEST OBJECT PROPERTIES
  // type
  // reqId
  // headers
  // url
  // method

  const outgoingReqOptions = {
    hostname: hostname,
    port: port,
    path: incomingReq.url,
    headers: incomingReq.headers,
    method: incomingReq.method,
  };
  outgoingReqOptions.headers.host = hostname+':'+port;
  log(outgoingReqOptions);
  // log(typeof incomingReq.headers, incomingReq.headers);

  const outgoingReq = http.request(outgoingReqOptions, (incomingRes) => {
    // RESPONSE OBJECT PROPERTIES
    // headers
    // url
    // method
    // statusCode
    // statusMessage

    let data = '';

    incomingRes.on('data', (chunk) => {
      log('getting chunks');
      data += chunk;
      log(chunk);
    });

    incomingRes.on('end', () => {
      console.log(data.toString());
      ws.send(data);
    });
  });

  outgoingReq.on('error', (err) => {
    console.log(err);
  });

  outgoingReq.on('connect', (msg) => {
    log('outgoing request connected');
    log(msg);
  });

  outgoingReq.end();
}

function incomingResHandler (incomingRes) {

}