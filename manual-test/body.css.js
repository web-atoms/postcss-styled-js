import styled from "../dist/styled.js";

const animations = [["div", "yellow"], ["section", "green"]].map(([name, color]) =>
    styled.css `
        & ${name} {
            color: ${color};
        }
`);

export default styled.css `

    @import "./vars/a.css";

    body {
        font-weight: 500;
        ${animations}
    }

`