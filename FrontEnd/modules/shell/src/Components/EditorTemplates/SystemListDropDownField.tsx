import logger from "@insite/client-framework/Logger";
import { SystemListDropDownFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import DropDownField from "@insite/shell/Components/EditorTemplates/DropDownField";
import { ArchiveFilter, getAdminSystemListValues } from "@insite/shell/Services/AdminService";
import * as React from "react";

type Props = EditorTemplateProps<string, SystemListDropDownFieldDefinition>;

export default class SystemListDropDownField extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        if (!this.props.fieldDefinition.systemListName) {
            logger.error(
                `There was no systemListName defined in the properties for the fieldDefinition ${this.props.fieldDefinition.name}`,
            );
        }
    }

    getOptions = async () => {
        const listValues = await getAdminSystemListValues({
            archiveFilter: ArchiveFilter.Active,
            $filter: `systemList/name eq '${this.props.fieldDefinition.systemListName}'`,
            $select: "name",
        });
        return listValues.map(o => ({
            value: o.name,
            displayName: o.name,
        }));
    };

    render() {
        const dropDownProps = {
            ...this.props,
            fieldDefinition: {
                ...this.props.fieldDefinition,
                editorTemplate: "DropDownField",
                options: this.getOptions,
            },
        } as any;
        return <DropDownField {...dropDownProps} />;
    }
}
