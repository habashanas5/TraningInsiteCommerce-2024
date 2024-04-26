const urlTest = new RegExp("^(((?:[a-z]+:)?//)|(mailto:))", "i");

const isRelativeUrl = (url: string) => {
    return !urlTest.test(url);
};

export default isRelativeUrl;
