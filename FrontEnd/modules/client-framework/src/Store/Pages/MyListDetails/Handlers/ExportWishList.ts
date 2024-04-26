import waitFor from "@insite/client-framework/Common/Utilities/waitFor";
import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { getWishList, GetWishListApiParameter } from "@insite/client-framework/Services/WishListService";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import translate from "@insite/client-framework/Translate";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<
    { wishListId: string },
    {
        apiParameter: GetWishListApiParameter;
        apiResult: WishListModel;
        pricingLoaded?: true;
        dataForUnparse: { fields: Array<any>; data: string | Array<any> };
    }
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        wishListId: props.parameter.wishListId,
        expand: ["getAllLines"],
    };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getWishList(props.apiParameter);
};

export const LoadRealTimePrices: HandlerType = async props => {
    const { wishListLineCollection } = props.apiResult;
    if (!wishListLineCollection?.length) {
        props.pricingLoaded = true;
        return;
    }

    props.dispatch(
        loadRealTimePricing({
            productPriceParameters: wishListLineCollection.map(o => ({
                productId: o.productId,
                unitOfMeasure: o.unitOfMeasure,
                qtyOrdered: o.qtyOrdered,
            })),
            onComplete: realTimePricingProps => {
                if (realTimePricingProps?.apiResult?.realTimePricingResults) {
                    realTimePricingProps.apiResult.realTimePricingResults.forEach(pricing => {
                        for (let i = 0; i < wishListLineCollection.length; i++) {
                            const wishListLine = wishListLineCollection[i];
                            if (
                                wishListLine.productId === pricing.productId &&
                                wishListLine.unitOfMeasure === pricing.unitOfMeasure
                            ) {
                                wishListLine.pricing = pricing;
                            }
                        }
                    });
                }

                props.pricingLoaded = true;
            },
        }),
    );

    await waitFor(() => !!props.pricingLoaded);
};

export const CreateDataForUnparse: HandlerType = props => {
    const { wishListLineCollection } = props.apiResult;
    if (!wishListLineCollection?.length) {
        return;
    }

    props.dataForUnparse = {
        fields: [
            translate("Item #"),
            translate("MFG #"),
            translate("Quantity"),
            translate("Unit of Measure"),
            translate("Brand"),
            translate("Title"),
            translate("Price"),
            translate("Notes"),
            translate("Added on"),
            translate("Added by"),
        ],
        data: wishListLineCollection.map(o => [
            o.erpNumber,
            o.manufacturerItem,
            o.qtyOrdered.toString(),
            o.unitOfMeasure,
            o.brand?.name || "",
            o.shortDescription,
            o.quoteRequired ? "" : o.pricing?.unitRegularPrice?.toString() || "",
            o.notes,
            o.createdOn.toString(),
            o.createdByDisplayName,
        ]),
    };
};

export const GenerateCsv: HandlerType = async props => {
    if (!props.dataForUnparse) {
        return;
    }

    const { unparse } = await import(/* webpackChunkName: "papaparse" */ "papaparse");
    const csv = unparse(props.dataForUnparse);
    const csvBlob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });

    const fileName = `wishlist_${props.parameter.wishListId}.csv`;
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(csvBlob, fileName);
    } else {
        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(csvBlob);
        downloadLink.setAttribute("download", fileName);
        downloadLink.click();
    }
};

export const chain = [PopulateApiParameter, RequestDataFromApi, LoadRealTimePrices, CreateDataForUnparse, GenerateCsv];

const exportWishList = createHandlerChainRunner(chain, "ExportWishList");
export default exportWishList;
