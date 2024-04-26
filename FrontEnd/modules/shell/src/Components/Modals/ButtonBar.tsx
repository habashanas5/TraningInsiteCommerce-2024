import styled from "styled-components";

const ButtonBar = styled.div`
    text-align: right;
    margin: 20px 15px 5px;
    button {
        cursor: pointer;
        display: inline-block;
        margin-right: 10px;
    }
    button:last-child {
        margin-right: 0;
    }
`;

export default ButtonBar;
