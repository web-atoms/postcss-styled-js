import styled from "../styled.js";

export default function() {


    const node = styled.css `
       body: {
          font-weight: bold;
       }
    `

    console.log(node.toStringWithSourceMap().map.toJSON());


}
