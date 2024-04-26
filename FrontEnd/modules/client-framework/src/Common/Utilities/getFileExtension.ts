const getFileExtension = (fileName: string) => {
    const splitFileName = fileName.split(".");
    return splitFileName.length > 0 ? splitFileName[splitFileName.length - 1].toLowerCase() : "";
};

export default getFileExtension;
