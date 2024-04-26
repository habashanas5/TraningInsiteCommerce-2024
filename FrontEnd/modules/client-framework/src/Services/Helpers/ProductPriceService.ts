import { BreakPriceDto, ProductPriceDto } from "@insite/client-framework/Types/ApiModels";

interface PriceModel {
    price: number;
    priceDisplay: string;
}

export const getUnitNetPrice = (pricing: ProductPriceDto, qtyOrdered: number) => {
    const price = getPrice(
        pricing.unitRegularBreakPrices,
        pricing.unitNetPrice,
        pricing.unitNetPriceDisplay,
        qtyOrdered,
    );
    return { price: price.price, priceDisplay: price.priceDisplay } as PriceModel;
};

export const getUnitRegularPrice = (pricing: ProductPriceDto, qtyOrdered: number) => {
    const price = getPrice(
        pricing.unitRegularBreakPrices,
        pricing.unitRegularPrice,
        pricing.unitRegularPriceDisplay,
        qtyOrdered,
    );
    return { price: price.price, priceDisplay: price.priceDisplay } as PriceModel;
};

export const getUnitRegularPriceWithVat = (pricing: ProductPriceDto, qtyOrdered: number) => {
    const price = getPriceWithVat(
        pricing.unitRegularBreakPrices,
        pricing.unitRegularPriceWithVat,
        pricing.unitRegularPriceWithVatDisplay,
        qtyOrdered,
    );
    return { price: price.price, priceDisplay: price.priceDisplay } as PriceModel;
};

export const getUnitListPrice = (pricing: ProductPriceDto, qtyOrdered: number) => {
    const price = getPrice(
        pricing.unitListBreakPrices,
        pricing.unitListPrice,
        pricing.unitListPriceDisplay,
        qtyOrdered,
    );
    return { price: price.price, priceDisplay: price.priceDisplay } as PriceModel;
};

export const getUnitListPriceWithVat = (pricing: ProductPriceDto, qtyOrdered: number) => {
    const price = getPriceWithVat(
        pricing.unitListBreakPrices,
        pricing.unitListPriceWithVat,
        pricing.unitListPriceWithVatDisplay,
        qtyOrdered,
    );
    return { price: price.price, priceDisplay: price.priceDisplay } as PriceModel;
};

const getPrice = (breaks: BreakPriceDto[] | null, price: number, priceToDisplay: string, qty: any) => {
    const quantity = !qty || qty === "0" ? 1 : qty;
    if (conditionBreakPrice(breaks, quantity)) {
        return { price, priceDisplay: priceToDisplay } as PriceModel;
    }

    const breakPrice = getBreakPrice(breaks, quantity);
    if (!breakPrice || (breakPrice && price < breakPrice.breakPrice)) {
        return { price, priceDisplay: priceToDisplay } as PriceModel;
    }

    return { price: breakPrice.breakPrice, priceDisplay: breakPrice.breakPriceDisplay } as PriceModel;
};

const getPriceWithVat = (breaks: BreakPriceDto[] | null, price: number, priceToDisplay: string, qty: any) => {
    const quantity = !qty || qty === "0" ? 1 : qty;
    if (conditionBreakPrice(breaks, quantity)) {
        return { price, priceDisplay: priceToDisplay } as PriceModel;
    }

    const breakPrice = getBreakPrice(breaks, quantity);
    if (!breakPrice || (breakPrice && price < breakPrice.breakPrice)) {
        return { price, priceDisplay: priceToDisplay } as PriceModel;
    }

    return { price: breakPrice.breakPriceWithVat, priceDisplay: breakPrice.breakPriceWithVatDisplay } as PriceModel;
};

const conditionBreakPrice = (breaks: BreakPriceDto[] | null, count: number) => {
    return !breaks || breaks.length === 0 || count === 0;
};

export const getBreakPrice = (breaks: BreakPriceDto[] | null, count: number) => {
    if (!breaks) {
        return null;
    }

    const copyBreaks = breaks.slice();
    copyBreaks.sort((a, b) => {
        return b.breakQty - a.breakQty;
    });
    for (let i = 0; i < copyBreaks.length; i = i + 1) {
        if (copyBreaks[i].breakQty <= count) {
            return copyBreaks[i];
        }
    }

    return copyBreaks[copyBreaks.length - 1];
};
