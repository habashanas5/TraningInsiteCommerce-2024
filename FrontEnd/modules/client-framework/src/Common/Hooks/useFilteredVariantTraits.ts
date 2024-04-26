import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { ProductModel, VariantTraitModel } from "@insite/client-framework/Types/ApiModels";
import cloneDeep from "lodash/cloneDeep";

export default function useFilteredVariantTraits(
    variantTraits: VariantTraitModel[],
    variantChildren: ProductModel[],
    variantSelection: SafeDictionary<string>,
) {
    const filteredVariantTraits = cloneDeep(variantTraits.slice());
    const childTraitValueLists = variantChildren.map(o => o.childTraitValues!);

    filteredVariantTraits.forEach(variantTrait => {
        let matchingChildTraitValueLists = cloneDeep(childTraitValueLists);
        Object.keys(variantSelection).forEach(variantTraitId => {
            const selectedTraitValueId = variantSelection[variantTraitId];
            if (!selectedTraitValueId || variantTraitId === variantTrait.id) {
                return;
            }

            matchingChildTraitValueLists = matchingChildTraitValueLists.filter(o =>
                o.some(childTraitValue => childTraitValue.id === selectedTraitValueId),
            );
        });

        const filteredValuesIds: string[] = [];
        matchingChildTraitValueLists.forEach(childTraitList => {
            const currentValue = childTraitList.find(traitValue => traitValue.styleTraitId === variantTrait.id);
            if (!currentValue) {
                return;
            }
            if (!filteredValuesIds.some(filteredValueId => filteredValueId === currentValue.id)) {
                filteredValuesIds.push(currentValue.id);
            }
        });
        variantTrait.traitValues = variantTrait
            .traitValues!.filter(traitValue => filteredValuesIds.indexOf(traitValue.id) > -1)
            .sort((a, b) => a.sortOrder - b.sortOrder);
    });

    return filteredVariantTraits.sort((a, b) => a.sortOrder - b.sortOrder);
}
