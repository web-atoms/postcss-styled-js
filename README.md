# Styled-Compiler
Compiles Styled export to CSS at compile time

## Why, Why, Why another tool?
Some how CSS post processing are little complicated, and do not provide best editing experience and we cannot debug what is being generated.

## So what does this do?
Compiles a simple JavaScript file that exports default `styled.css` object into a CSS file with map file along with `nested` and `cssnano` plugins for postcss.

## Getting Started
### Installation
`npm install -D @web-atoms/styled-compiler`
### Run
`styled-compiler inputFile.css.js`



## Examples

body.css.js
```js
import styled from "@web-atoms/styled-compiler";

const animations = [["div", "yellow"], ["section", "green"]].map(([name, color]) =>
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

Command: `styled-compiler body.css.js`

This will generate following along with map.

body.css
```css
body{font-weight:500}body div{color:#ff0}body section{color:green}
/*# sourceMappingURL=body.css.map */
```

# Benefits
1. We can write most pre css logic in JavaScript where we have the best editing feature.
2. Load complex JavaScript objects via imports and write for each or any syntax that is available in JavaScript easily.
3. By prefixing tagged template with `styled.css` you get automatic intellisense if styled extensions are installed.
4. Source maps will correctly point to actual JavaScript that generated the css.

# Project Status - Beta
Though we are running this project for production, there may be some bugs or some improvements underway as they happen.

# Planned Features

1. Watch support

For now since we are using some sort of build tasks to compile files, we currently do not need this, but pull requests are welcome to add any features to support any file processing required for your build tools.
