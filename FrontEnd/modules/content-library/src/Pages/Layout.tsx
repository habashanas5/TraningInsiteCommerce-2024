import { pageDefinitions } from "@insite/client-framework/Components/ContentItemStore";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import MobiusPage from "@insite/mobius/Page";
import * as React from "react";

const Layout: React.FunctionComponent<PageProps> = ({ id }) => (
    <MobiusPage>
        <Zone contentId={id} zoneName="Content" requireRows />
    </MobiusPage>
);

const pageModule: PageModule = {
    component: Layout,
    definition: {
        hasEditableTitle: false,
        hasEditableUrlSegment: false,
        pageType: "Content",
        fieldDefinitions: [
            {
                name: "allowedForPageType",
                editorTemplate: "DropDownField",
                defaultValue: "",
                fieldType: "General",
                sortOrder: 100,
                isRequired: true,
                options() {
                    return new Promise<
                        {
                            value: string;
                            displayName: string;
                        }[]
                    >(resolve => {
                        const items = Object.keys(pageDefinitions)
                            .map(key => {
                                return { ...pageDefinitions[key], type: key };
                            })
                            .filter(o => o.pageType === "Content" && o.type !== "Layout")
                            .map(pageDefinition => {
                                return { displayName: pageDefinition.type, value: pageDefinition.type };
                            });
                        resolve(items);
                    });
                },
            },
        ],
    },
};

export default pageModule;
