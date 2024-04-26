import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import saveCostCodes from "@insite/client-framework/Store/Pages/BudgetManagement/Handlers/SaveCostCodes";
import setDisplayedWidgetName from "@insite/client-framework/Store/Pages/BudgetManagement/Handlers/SetDisplayedWidgetName";
import translate from "@insite/client-framework/Translate";
import { CostCodeModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { BudgetManagementPageContext } from "@insite/content-library/Pages/BudgetManagementPage";
import Button, { ButtonProps } from "@insite/mobius/Button";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell from "@insite/mobius/DataTable/DataTableCell";
import { DataTableCellBaseProps } from "@insite/mobius/DataTable/DataTableCellBase";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden from "@insite/mobius/Hidden";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import XCircle from "@insite/mobius/Icons/XCircle";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Tooltip, { TooltipPresentationProps } from "@insite/mobius/Tooltip";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import immer from "immer";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    displayedWidgetName: state.pages.budgetManagement.displayedWidgetName,
    billToState: getCurrentBillToState(state),
});

const mapDispatchToProps = {
    setDisplayedWidgetName,
    saveCostCodes,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CostCodesStyles {
    gridContainer?: GridContainerProps;
    titleText?: TypographyPresentationProps;
    titleGridItems?: GridItemProps;
    buttonsGridItem?: GridItemProps;
    gridItems?: GridItemProps;
    costCodeTitleGridItems?: GridItemProps;
    costCodesTableGridItems?: GridItemProps;
    addCostCodeButtonGridItems?: GridItemProps;
    costCodeTitleText?: TypographyPresentationProps;
    costCodeTitleTooltip?: TooltipPresentationProps;
    cancelButton?: ButtonProps;
    saveButton?: ButtonProps;
    costCodeInstructionsText?: TypographyPresentationProps;
    costCodeTitle?: TextFieldProps;
    dataTable?: DataTableProps;
    dataTableHead?: DataTableHeadProps;
    dataTableBody?: DataTableBodyProps;
    dataTableRows?: DataTableRowProps;
    dataTableHeaders?: DataTableHeaderProps;
    dataTableCells?: DataTableCellBaseProps;
    costCodeTextField?: TextFieldProps;
    removeIcon?: IconPresentationProps;
    addCostCodeButton?: ButtonProps;
    wrapper?: InjectableCss;
}

export const costCodesStyles: CostCodesStyles = {
    titleText: {
        variant: "h4",
        css: css`
            margin: 0;
        `,
    },
    wrapper: {
        css: css`
            width: 100%;
        `,
    },
    titleGridItems: {
        width: [12, 12, 8, 8, 8],
    },
    buttonsGridItem: {
        width: [12, 12, 4, 4, 4],
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        justify-content: flex-start;
                    `,
                    css`
                        justify-content: flex-start;
                    `,
                    css`
                        justify-content: flex-end;
                    `,
                    css`
                        justify-content: flex-end;
                    `,
                    css`
                        justify-content: flex-end;
                    `,
                ])}
        `,
    },
    cancelButton: {
        variant: "tertiary",
    },
    saveButton: {
        css: css`
            margin-left: 10px;
        `,
    },
    gridItems: {
        width: [12, 12, 9, 9, 9],
    },
    costCodeTitleGridItems: {
        width: [12, 12, 6, 6, 4],
        css: css`
            display: block;
        `,
    },
    costCodesTableGridItems: {
        width: [12, 12, 12, 12, 6],
    },
    addCostCodeButtonGridItems: {
        width: 12,
        css: css`
            padding-bottom: 30px;
        `,
    },
    costCodeTitleText: {
        variant: "h6",
        css: css`
            display: inline-block;
            margin-right: 6px;
            margin-bottom: 10px;
        `,
    },
    removeIcon: {
        src: XCircle,
        css: css`
            display: block;
            cursor: pointer;
            margin: auto;
        `,
    },
    addCostCodeButton: {
        css: css`
            display: block;
        `,
        variant: "secondary",
    },
};

const styles = costCodesStyles;

const CostCodes: React.FC<Props> = ({ displayedWidgetName, billToState, setDisplayedWidgetName, saveCostCodes }) => {
    if (displayedWidgetName !== "CostCodes" || billToState.isLoading || !billToState.value) {
        return null;
    }

    const toasterContext = React.useContext(ToasterContext);
    const [costCodeTitle, setCostCodeTitle] = React.useState(billToState.value?.costCodeTitle);
    const [costCodes, setCostCodes] = React.useState(billToState.value?.costCodes);

    const canAddCostCodeRow = () => {
        if (!costCodes) {
            return false;
        }

        if (costCodes.some(costCode => costCode.isActive && costCode.costCode.length === 0)) {
            return false;
        }

        return true;
    };

    const handleCancelButtonClick = () => {
        setDisplayedWidgetName({ value: "ReviewBudget" });
    };

    const handleSaveButtonClick = () => {
        setDisplayedWidgetName({ value: "ReviewBudget" });
        saveCostCodes({
            billToId: billToState.value!.id,
            costCodeTitle: costCodeTitle || billToState.value!.costCodeTitle,
            costCodes: costCodes || billToState.value!.costCodes!,
            onSuccess: onSaveSuccess,
            onComplete(resultProps) {
                if (resultProps.apiResult) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.();
                }
            },
        });
    };

    const onSaveSuccess = () => {
        toasterContext.addToast({ body: translate("Your changes were saved successfully."), messageType: "success" });
    };

    const handleCostCodeTitleChange = (event: React.FormEvent<HTMLInputElement>) => {
        setCostCodeTitle(event.currentTarget.value);
    };

    const handleCostCodeChange = (event: React.FormEvent<HTMLInputElement>, index: number) => {
        if (!costCodes) {
            return;
        }

        const updatedCostCodes = immer(costCodes, draft => {
            draft[index].costCode = event.currentTarget.value;
        });
        setCostCodes(updatedCostCodes);
    };

    const handleDescriptionChange = (event: React.FormEvent<HTMLInputElement>, index: number) => {
        if (!costCodes) {
            return;
        }

        const updatedCostCodes = immer(costCodes, draft => {
            draft[index].description = event.currentTarget.value;
        });
        setCostCodes(updatedCostCodes);
    };

    const handleRemoveIconClick = (index: number) => {
        if (!costCodes) {
            return;
        }

        const updatedCostCodes = immer(costCodes, draft => {
            draft[index].isActive = false;
        });
        setCostCodes(updatedCostCodes);
    };

    const handleAddCostCodeButtonClick = () => {
        if (!canAddCostCodeRow() || !costCodes) {
            return;
        }

        const updatedCostCodes = (costCodes || []).map(costCode => ({ ...costCode }));
        updatedCostCodes.push({ costCode: "", isActive: true } as CostCodeModel);
        setCostCodes(updatedCostCodes);
    };

    const rows = (costCodes || []).map(customerCostCode => {
        return {
            costCode: customerCostCode.costCode,
            description: customerCostCode.description,
            isActive: customerCostCode.isActive,
        };
    });

    return (
        <>
            <GridContainer {...styles.gridContainer}>
                <GridItem {...styles.titleGridItems}>
                    <Typography as="h2" {...styles.titleText}>
                        {translate("Cost Codes")}
                    </Typography>
                </GridItem>
                <GridItem {...styles.buttonsGridItem}>
                    <Button {...styles.cancelButton} onClick={handleCancelButtonClick}>
                        {translate("Cancel")}
                    </Button>
                    <Button {...styles.saveButton} onClick={handleSaveButtonClick}>
                        {translate("Save")}
                    </Button>
                </GridItem>
                <GridItem {...styles.gridItems}>
                    <Typography {...styles.costCodeInstructionsText}>
                        {siteMessage("Budget_CostCodeInstructions")}
                    </Typography>
                </GridItem>
                <GridItem {...styles.costCodeTitleGridItems}>
                    <Typography as="h4" {...styles.costCodeTitleText}>
                        {translate("Cost Code Title")}
                    </Typography>
                    <Tooltip
                        {...styles.costCodeTitleTooltip}
                        text={siteMessage("Budget_CostCodeTitleInstructions").toString()}
                    />
                    <TextField
                        value={costCodeTitle}
                        {...styles.costCodeTextField}
                        data-test-selector="costCodeTitleField"
                        onChange={(event: React.FormEvent<HTMLInputElement>) => handleCostCodeTitleChange(event)}
                    ></TextField>
                </GridItem>
                <StyledWrapper {...styles.wrapper}>
                    <GridItem {...styles.costCodesTableGridItems}>
                        <DataTable {...styles.dataTable}>
                            <DataTableHead {...styles.dataTableHead}>
                                <DataTableHeader {...styles.dataTableHeaders}>{translate("Cost Code")}</DataTableHeader>
                                <DataTableHeader {...styles.dataTableHeaders}>
                                    {translate("Description")}
                                </DataTableHeader>
                                <DataTableHeader {...styles.dataTableHeaders}>
                                    <VisuallyHidden>{translate("Remove")}</VisuallyHidden>
                                </DataTableHeader>
                            </DataTableHead>
                            <DataTableBody {...styles.dataTableBody}>
                                {rows.map(
                                    ({ costCode, description, isActive }, index) =>
                                        isActive && (
                                            <DataTableRow
                                                // eslint-disable-next-line react/no-array-index-key
                                                key={index}
                                                {...styles.dataTableRows}
                                                data-test-selector="costCodeRow"
                                            >
                                                <DataTableCell {...styles.dataTableCells}>
                                                    <TextField
                                                        value={costCode}
                                                        {...styles.costCodeTextField}
                                                        data-test-selector={`costCodeField_${index}`}
                                                        onChange={(event: React.FormEvent<HTMLInputElement>) =>
                                                            handleCostCodeChange(event, index)
                                                        }
                                                    ></TextField>
                                                </DataTableCell>
                                                <DataTableCell {...styles.dataTableCells}>
                                                    <TextField
                                                        value={description}
                                                        {...styles.costCodeTextField}
                                                        onChange={(event: React.FormEvent<HTMLInputElement>) =>
                                                            handleDescriptionChange(event, index)
                                                        }
                                                    ></TextField>
                                                </DataTableCell>
                                                <DataTableCell {...styles.dataTableCells}>
                                                    {/* TODO ISC-12606 needs clickable */}
                                                    <Icon
                                                        {...styles.removeIcon}
                                                        onClick={() => handleRemoveIconClick(index)}
                                                        data-test-selector={`removeCostCode_${index}`}
                                                    />
                                                </DataTableCell>
                                            </DataTableRow>
                                        ),
                                )}
                            </DataTableBody>
                        </DataTable>
                    </GridItem>
                </StyledWrapper>
                {canAddCostCodeRow() && (
                    <GridItem {...styles.addCostCodeButtonGridItems}>
                        <Button
                            {...styles.addCostCodeButton}
                            onClick={handleAddCostCodeButtonClick}
                            data-test-selector="addCostCodeButton"
                        >
                            {translate("Add Cost Code")}
                        </Button>
                    </GridItem>
                )}
                <GridItem {...styles.buttonsGridItem}>
                    <Hidden above="sm">
                        <Button {...styles.cancelButton} onClick={handleCancelButtonClick}>
                            {translate("Cancel")}
                        </Button>
                        <Button
                            {...styles.saveButton}
                            onClick={handleSaveButtonClick}
                            data-test-selector="saveCostCodesButton"
                        >
                            {translate("Save")}
                        </Button>
                    </Hidden>
                </GridItem>
            </GridContainer>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CostCodes),
    definition: {
        group: "BudgetManagement",
        allowedContexts: [BudgetManagementPageContext],
    },
};

export default widgetModule;
