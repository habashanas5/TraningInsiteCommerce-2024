const hoverBlock = (rules: string) => () =>
    `
    transform: perspective(1px);
    &:hover{
        ${rules}
    }
`;

const hoverAnimations = {
    none: hoverBlock(""),
    grow: hoverBlock("transform: perspective(1px) scale(1.1);"),
    shrink: hoverBlock("transform: perspective(1px) scale(0.9);"),
    float: hoverBlock("transform: perspective(1px) translateY(-0.5em);"),
};

export default hoverAnimations;
