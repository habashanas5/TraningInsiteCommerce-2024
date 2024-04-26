import ContentItemModel from "@insite/client-framework/Types/ContentItemModel";

export default interface WidgetProps extends ContentItemModel {
    zone: string;
    isLayout: boolean;
}
