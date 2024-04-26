export const isSafe = (styleAttrib?: string) => {
    if (!styleAttrib) {
        return true;
    }
    const regex = /(\w*-?)+:[a-zA-Z0-9]*\(?[a-zA-Z0-9%,\.\s]+\)?$/;

    const stylesArray = styleAttrib
        .split(";")
        .map(singleStyle => singleStyle.replace(/\s/g, ""))
        .filter(singleStyle => !!singleStyle);

    return stylesArray.every(singleStyle => regex.exec(singleStyle));
};

export const extractStylesToArray = (html: string) => {
    const match = html.match(/style=".*?"/g);
    if (match) {
        return match.map(style => style.replace(/style="/, "")).map(style => style.replace(/"/, ""));
    }
    return [];
};
