export const returnMatchFromRegex = (model: string) => {
    const regex = /<a.*?href="tel:[0-9\-\s]+?(%20)*?".*?>/g;
    return model.match(regex);
};

export const replaceMissingTargetAttr = (model: string, match: string[]) => {
    match.forEach(startingAnchorTag => {
        if (!startingAnchorTag.match(/target="_blank"/)) {
            const anchorArr = startingAnchorTag.split(" ");
            const lastItem = anchorArr[anchorArr.length - 1];
            anchorArr[anchorArr.length - 1] = 'target="_blank"';
            anchorArr.push(lastItem);
            model = model.replace(startingAnchorTag, anchorArr.join(" "));
        }
    });
    return model;
};

export default function addPhoneLinkTargetAttr(model: string) {
    const match = returnMatchFromRegex(model);

    if (match) {
        model = replaceMissingTargetAttr(model, match);
    }
    return model;
}
