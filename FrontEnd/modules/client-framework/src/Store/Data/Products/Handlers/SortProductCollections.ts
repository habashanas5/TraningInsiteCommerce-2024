import { createHandlerChainRunner, Handler, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";
import sortBy from "lodash/sortBy";

type Parameter = {
    products: ProductModel[];
} & HasOnSuccess;

type HandlerType = Handler<Parameter>;

export const SortAttributes: HandlerType = ({ parameter: { products } }) => {
    products.forEach(product => {
        if (!product.attributeTypes) {
            return;
        }

        const attributeTypes = sortBy(
            product.attributeTypes,
            o => o.sortOrder,
            o => o.label,
        );

        attributeTypes.forEach(attributeType => {
            attributeType.attributeValues = sortBy(
                attributeType.attributeValues,
                o => o.sortOrder,
                o => o.valueDisplay,
            );
        });

        product.attributeTypes = attributeTypes;
    });
};

export const SortSpecifications: HandlerType = ({ parameter: { products } }) => {
    products.forEach(product => {
        if (product.specifications) {
            product.specifications = sortBy(product.specifications, o => o.sortOrder);
        }
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [SortAttributes, SortSpecifications, ExecuteOnSuccessCallback];

const sortProductCollections = createHandlerChainRunner(chain, "SortProductCollections");
export default sortProductCollections;
