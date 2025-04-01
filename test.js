const { readFileSync } = require("fs");
const postcss = require("postcss");

const css = readFileSync("./manual-test/body-main.css");

postcss([
    require("./dist/postcss-js").default()
]).process(css, {
    from: "manual-test/body-main.css",
    to: "manual-test/body.css"
}).then((result) => {
    console.log(result.css);
    console.log(result.log);
})