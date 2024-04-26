import isNumeric from "@insite/client-framework/Common/isNumeric";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { createHandlerChainRunnerOptionalParameter, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import { getBrandAlphabet } from "@insite/client-framework/Services/BrandService";
import { BrandAlphabetLetterModel, BrandAlphabetModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = HandlerWithResult<
    {},
    {
        apiResult: BrandAlphabetModel;
        brandAlphabetLetters?: BrandAlphabetLetterModel[];
    },
    {}
>;

export const DispatchBeginLoadBrandAlphabet: HandlerType = props => {
    props.dispatch({
        type: "Pages/Brands/BeginLoadBrandAlphabet",
    });
};
export const RequestDataFromApi: HandlerType = async props => {
    props.result = {
        apiResult: await getBrandAlphabet(),
    };
};

/**
 * Create Alphabet Array consolidating the numbers into '#' and splitting out any non-english alphabetString characters
 * @param props Used to pass result to next chain handler.
 */
export const SortDataFromApi: HandlerType = props => {
    const alphabetResult = props.result.apiResult;
    const defaultAlphabet: string[] = "abcdefghijklmnopqrstuvwxyz".split("");
    const customSort = (a: BrandAlphabetLetterModel, b: BrandAlphabetLetterModel) => a.letter.localeCompare(b.letter);
    const alphabetStringMap: SafeDictionary<true> = {};
    const numbers: BrandAlphabetLetterModel[] = [];
    const fromAlphabetString: BrandAlphabetLetterModel[] = [];
    const other: BrandAlphabetLetterModel[] = [];

    // This will prime the alphabetStringMap to always contains the default alphabet letters.
    defaultAlphabet.forEach(letter => {
        alphabetStringMap[letter] = true;
    });

    // This will filter the alphabetResult into number, defaultAlphabet, and other characters.
    for (let i = 0; i < alphabetResult.alphabet!.length; i = i + 1) {
        const alphabetItem = alphabetResult.alphabet![i];
        if (!alphabetItem.letter) {
            continue;
        }

        // Normalize the letter case
        alphabetItem.letter = alphabetItem.letter.toLowerCase();
        if (alphabetStringMap[alphabetItem.letter]) {
            delete alphabetStringMap[alphabetItem.letter];
            fromAlphabetString.push(alphabetItem);
        } else if (isNumeric(alphabetItem.letter)) {
            if (numbers.length === 0) {
                alphabetItem.letter = "#";
                numbers.push(alphabetItem);
            } else {
                numbers[0].count += alphabetItem.count;
            }
        } else {
            other.push(alphabetItem);
        }
    }

    // Loop through the left over letters and add them with a count of 0.
    for (const key in alphabetStringMap) {
        if (alphabetStringMap[key]) {
            fromAlphabetString.push({ letter: key, count: 0 });
        }
    }
    fromAlphabetString.sort(customSort);
    other.sort(customSort);

    props.result.brandAlphabetLetters = numbers.concat(fromAlphabetString).concat(other);
};

export const DispatchCompleteLoadBrandAlphabet: HandlerType = props => {
    props.dispatch({
        type: "Pages/Brands/CompleteLoadBrandAlphabet",
        result: props.result.brandAlphabetLetters || [],
    });
};

export const chain = [
    DispatchBeginLoadBrandAlphabet,
    RequestDataFromApi,
    SortDataFromApi,
    DispatchCompleteLoadBrandAlphabet,
];

const loadBrandAlphabet = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadBrandsAlphabet");
export default loadBrandAlphabet;
