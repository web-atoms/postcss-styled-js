const all = require("./dist/postcss-js");
const styled = require("./dist/styled");
all.default.css = styled.default ? styled.default.css : styled.css;
module.exports = all.default;