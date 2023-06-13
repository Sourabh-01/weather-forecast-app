import ToastService from "react-material-toast";

const utility = {
  checkIsZip,
  successToast,
  failureToast,
  trimSpaces,
  formatText,
};
export default utility;

const toast = ToastService.new({
  place: "topRight",
  duration: 2,
  maxCount: 3,
});

function checkIsZip(value) {
  let valueArr = String(value).trim().split("");
  for (let i = 0; i < valueArr.length; i++) {
    if (!isNaN(parseInt(valueArr[i]))) return true;
  }
  return false;
}

function successToast(message) {
  toast.success(message);
}

function failureToast(message) {
  toast.error(message);
}

function trimSpaces(string) {
  return string.map((value) => String(value).trim());
}

function formatText(message) {
  return (
    String(message).charAt(0).toUpperCase() +
    String(message).slice(1).toLowerCase()
  );
}
