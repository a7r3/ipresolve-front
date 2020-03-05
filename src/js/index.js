const fs = require('fs');
const electron = require('electron');

const { ipcRenderer } = electron;
const remote = electron.remote;

const message = document.getElementById("message");
const email = document.getElementById("email");
const password = document.getElementById("password");
document.getElementById('login').addEventListener('click', () => {
  console.log('hello')
  ipcRenderer.send('login-user', { email: email.value, password: password.value });
});

ipcRenderer.on('login-callback', (event, arg) => {
  if (arg.status === 'success') {
    message.classList.remove('error');
    message.classList.add('success');
    message.innerText = 'Logging you in...';
    ipcRenderer.send('closing-login-window');
    remote.getCurrentWindow().close();
  } else {
    message.classList.remove('success');
    message.classList.add('error');
    message.innerText = 'Email or Password incorrect';
  }
});
