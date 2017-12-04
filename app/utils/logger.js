import toastr from 'toastr';

// This logger wraps the toastr logger and also logs to console
// toastr.js is library by John Papa that shows messages in pop up toast.
// https://github.com/CodeSeven/toastr

toastr.options = {
  closeButton: true,
  progressBar: true,
  newestOnTop: true,
  timeOut: 3000,
  positionClass: 'toast-top-right',
  escapeHtml: true
};

function log(message){
  console.log(message); //eslint-disable-line no-console
}

function info(message){
  toastr.info(message);
  console.info(message); //eslint-disable-line no-console
}

function warn(message){
  toastr.warning(message, null, { timeOut: 10000 });
  console.warn(message); //eslint-disable-line no-console
}

function error(message){
  toastr.error(message, null, { timeOut: 10000 });
  console.error(message); //eslint-disable-line no-console
}

export default {
  log, info, warn, error
}
