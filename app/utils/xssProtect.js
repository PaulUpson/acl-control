var htmlEncode = function (html) {
    return document.createElement("a").appendChild(
        document.createTextNode(html)).parentNode.innerHTML;
};

var removeChars = function (string) {
    return String(string).replace(/[&<>"'#\\]/g, "");
};

export default {
    htmlEncode: htmlEncode,
    removeChars: removeChars
};