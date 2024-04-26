import { createHandlerChainRunner, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import updatePriceBreakPrice from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/UpdatePriceBreakPrice";

type HandlerType = HandlerWithResult<
    {
        index: number;
        calculationMethod: string;
        percent: number;
    },
    {
        priceWithDiscount: number;
    }
>;

export const CalculatePrice: HandlerType = props => {
    const pricingRfq = props.getState().pages.rfqQuoteDetails.quoteLineForCalculation?.pricingRfq;
    if (!pricingRfq) {
        return false;
    }

    const { calculationMethod, percent } = props.parameter;
    let basePrice: number;
    let priceWithDiscount = 0;
    if (calculationMethod === "List") {
        basePrice = pricingRfq.listPrice;
        priceWithDiscount = basePrice - (percent / 100) * basePrice;
    } else if (calculationMethod === "Customer") {
        basePrice = pricingRfq.customerPrice;
        priceWithDiscount = basePrice - (percent / 100) * basePrice;
    } else if (calculationMethod === "Margin") {
        basePrice = pricingRfq.unitCost;
        priceWithDiscount = basePrice === 0 ? -1 : basePrice / (1 - percent / 100);
    }

    props.result = { priceWithDiscount: Number(priceWithDiscount.toFixed(2)) };
};

export const UpdatePrice: HandlerType = ({
    dispatch,
    getState,
    parameter: { index },
    result: { priceWithDiscount },
}) => {
    updatePriceBreakPrice({ index, price: priceWithDiscount })(dispatch, getState);
};

export const chain = [CalculatePrice, UpdatePrice];

const applyPriceBreakDiscount = createHandlerChainRunner(chain, "ApplyPriceBreakDiscount");
export default applyPriceBreakDiscount;
