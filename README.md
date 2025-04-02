# PostCSS Styled JS
Import JavaScript file which exports `styled.css`

## Why, Why, Why another tool?
Some how CSS post processing are little complicated, and do not provide best editing experience and we cannot debug what is being generated.

# Benefits
1. You 

## Getting Started
### Installation
1. `npm install -D postcss-styled-js
2. Add `postcss-styled-js` as a plugin
```js
module.exports = (ctx) => ({
    map: { ... ctx.options.map, sourcesContent: false },
    plugins: [
        require("postcss-styled-js")(), // <-- this one
        require('postcss-preset-env')(),
        require("postcss-import")(),
        require("postcss-import-ext-glob")(),
        require("postcss-nested")(),
        require("cssnano")()
    ]
});
```


## Examples


main.css
```css

@import-styled-js "./**/*.css.js";

```

### Sample CSS JS File

body.css.js
```js
import styled from "postcss-styled-js";

const animations = Object.entries({
    div: "red",
    span: "blue"
}).map(([name, color]) =>
    styled.css `
        & ${name} {
            color: ${color};
        }
`);

export default styled.css `
    body {
        font-weight: 500;
        ${animations}
    }

`;
```

Above code will be transpiled as,

```css
body {
    font-weight: 500;

    & div {
        color: red;
    }
    & span {
        color: blue;
    }
}
```

# What is happening?

`postcss-styled-js` will compile all `.css.js` files to `.css` file and import the generated file in the target main css file.