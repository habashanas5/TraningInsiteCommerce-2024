const urlTest = new RegExp("^(?:[a-z]+:)?//", "i");

const isUrl = (url: string) => {
    return urlTest.test(url);
};

export default isUrl;
