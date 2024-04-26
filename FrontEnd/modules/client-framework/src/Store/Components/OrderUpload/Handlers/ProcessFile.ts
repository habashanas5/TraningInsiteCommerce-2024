import { createHandlerChainRunner, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import logger from "@insite/client-framework/Logger";
import { UploadedItem } from "@insite/client-framework/Store/Components/OrderUpload/OrderUploadState";
import { WorkBook } from "xlsx";

export interface ProcessFileParameter {
    data: ArrayBuffer;
    fileExtension: string;
    firstRowHeading: boolean;
}

export interface ProcessFileResult {
    uploadedItems: UploadedItem[];
    uploadLimitExceeded: boolean;
    isBadFile: boolean;
    isUploading: boolean;
    allowCancel: boolean;
}

type HandlerType = HandlerWithResult<ProcessFileParameter, ProcessFileResult>;

export const DispatchBeginProcessFile: HandlerType = props => {
    props.dispatch({
        type: "Components/OrderUpload/BeginProcessFile",
    });
};

export const CreateDefaultResult: HandlerType = props => {
    props.result = {
        uploadedItems: [],
        uploadLimitExceeded: false,
        isBadFile: false,
        isUploading: false,
        allowCancel: false,
    };
};

export const ProcessUploadedFile: HandlerType = async props => {
    const XLSX = await import(/* webpackChunkName: "xlsx" */ "xlsx");

    const data = fixData(props.parameter.data);
    try {
        if (props.parameter.fileExtension === "xls" || props.parameter.fileExtension === "xlsx") {
            const workbook = XLSX.read(btoa(data), { type: "base64" });
            if (workbook) {
                await processWorkBook(workbook, props.parameter.firstRowHeading, props.result);
            }
        } else if (props.parameter.fileExtension === "csv") {
            await processCsv(data, props.parameter.firstRowHeading, props.result);
        } else {
            props.result.isBadFile = true;
        }
    } catch (error) {
        logger.error(error);
        props.result.isBadFile = true;
    }

    if (!props.result.isBadFile && !props.result.uploadLimitExceeded) {
        props.result.allowCancel = true;
        props.result.isUploading = true;
    }
};

const fixData = (data: ArrayBuffer) => {
    let o = "";
    let l = 0;
    const w = 10240;
    for (; l < data.byteLength / w; ++l) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)) as any);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)) as any);

    return o;
};

const processWorkBook = async (workBook: WorkBook, firstRowHeading: boolean, result: ProcessFileResult) => {
    const XLSX = await import(/* webpackChunkName: "xlsx" */ "xlsx");

    result.uploadedItems = [];
    workBook.SheetNames.forEach((sheetName: string) => {
        const opts = { header: 1 };
        let rows = XLSX.utils.sheet_to_json<string>(workBook.Sheets[sheetName], opts);
        if (rows.length > 0) {
            if (firstRowHeading) {
                rows = rows.slice(1, rows.length);
            }

            rows = rows.filter(row => row[0] != null && row[0].length > 0);
            if (limitExceeded(rows.length, result)) {
                return;
            }

            result.uploadedItems = rows.map(row => ({
                name: row[0],
                qtyOrdered: parseFloat(row[1]) ? parseFloat(row[1]) : undefined,
                unitOfMeasure: row[2],
            }));
        }
    });
};

const processCsv = async (data: string, firstRowHeading: boolean, result: ProcessFileResult) => {
    const { parse } = await import(/* webpackChunkName: "papaparse" */ "papaparse");
    result.uploadedItems = [];
    const newLineIndex = data.lastIndexOf("\r\n");
    if (newLineIndex + 2 === data.length) {
        data = data.substr(0, newLineIndex);
    }

    const results = parse(data);
    if (results.errors.length > 0) {
        result.isBadFile = true;
        return;
    }

    let rows = results.data;
    if (firstRowHeading) {
        rows = rows.slice(1, rows.length);
    }

    if (limitExceeded(rows.length, result)) {
        return;
    }

    rows.forEach((s: (string | null)[]) => {
        if (s[0] == null || s[0].length === 0) {
            return;
        }

        const objectToAdd: UploadedItem = {
            name: s[0],
        };
        if (s[1]) {
            objectToAdd.qtyOrdered = parseFloat(s[1]) ? parseFloat(s[1]) : undefined;
        }

        if (s[2]) {
            objectToAdd.unitOfMeasure = s[2];
        }

        result.uploadedItems.push(objectToAdd);
    });
};

const limitExceeded = (rowsCount: number, result: ProcessFileResult) => {
    const maximumAllowedRowsCount = 500;
    result.uploadLimitExceeded = rowsCount > maximumAllowedRowsCount;
    return result.uploadLimitExceeded;
};

export const DispatchCompleteProcessFile: HandlerType = props => {
    props.dispatch({
        type: "Components/OrderUpload/CompleteProcessFile",
        result: props.result,
    });
};

export const chain = [DispatchBeginProcessFile, CreateDefaultResult, ProcessUploadedFile, DispatchCompleteProcessFile];

const processFile = createHandlerChainRunner(chain, "ProcessFile");
export default processFile;
