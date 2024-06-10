// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

function clearDevice() {
  window.poleAPI.clear();
}

function resetDevice() {
  window.poleAPI.reset();
}

function writeDevice() {
  const upper = document.getElementById('upper').value;
  const lower = document.getElementById('lower').value;
  window.poleAPI.write({upper, lower});
}

function connectDevice() {
  const port = document.getElementById('port').value;
  if (port) {
    window.poleAPI.connect(port);
  }
}

document.getElementById('clear').addEventListener('click', clearDevice);
document.getElementById('reset').addEventListener('click', resetDevice);
document.getElementById('write').addEventListener('click', writeDevice);
document.getElementById('connect').addEventListener('click', connectDevice);

window.poleAPI.display((event, details) => {
  console.log(details)
  document.getElementById('upperText').innerText = details.upper;
  document.getElementById('lowerText').innerText = details.lower;
  if (details.port) {
    document.getElementById('port').value = details.port;
  }
  if (details.error) {
    document.getElementById('error').innerText = details.error;
  } else {
    document.getElementById('error').innerText = '';
  }
})