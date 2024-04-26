/* eslint-disable spire/export-styles */
import { MainNavigationStyles, MappedLink } from "@insite/content-library/Widgets/Header/MainNavigation";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer from "@insite/mobius/GridContainer";
import GridItem, { GridWidths } from "@insite/mobius/GridItem";
import ChevronDown from "@insite/mobius/Icons/ChevronDown";
import Link, { StyledIcon } from "@insite/mobius/Link";
import Menu from "@insite/mobius/Menu";
import Popover from "@insite/mobius/Popover";
import * as React from "react";
import { ThemeProps, withTheme } from "styled-components";

interface OwnProps {
    link: MappedLink;
    index: number;
    styles: MainNavigationStyles;
    container: React.RefObject<HTMLElement>;
    isOpen: boolean;
    displayChangeCustomerLink: boolean;
}

type Props = ThemeProps<BaseTheme> & OwnProps;

class MainNavigationItem extends React.Component<Props> {
    element = React.createRef<HTMLElement>();
    popover = React.createRef<HTMLUListElement>();

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (this.props.isOpen && !prevProps.isOpen) {
            this.openPopover();
        } else if (!this.props.isOpen && prevProps.isOpen) {
            this.closePopover();
        }
    }

    closePopover = () => {
        this.popover.current && (this.popover.current! as any).closePopover();
    };

    openPopover = () => {
        this.popover.current && (this.popover.current! as any).openPopover();
    };

    render() {
        const {
            styles,
            link,
            index,
            isOpen,
            theme: {
                breakpoints: { maxWidths },
            },
        } = this.props;
        const downIcon = <StyledIcon src={ChevronDown} {...styles.menuItemIcon} />;
        const hasChildren = link.children && link.children.filter(child => !child.excludeFromNavigation).length > 0;
        const isCascading = hasChildren && link.childrenType === "CascadingMenu";
        const isMega = hasChildren && link.childrenType === "MegaMenu";
        let menuLink = (
            <Link
                typographyProps={styles.menuItemTypography}
                color={styles.menuItemTypography?.color}
                {...styles.menuItem}
                href={link.url}
                target={link.openInNewWindow ? "_blank" : ""}
            >
                {link.title}
                {isCascading && downIcon}
            </Link>
        );
        if (isMega || link.url === "") {
            menuLink = (
                <Link
                    typographyProps={styles.menuItemTypography}
                    color={styles.menuItemTypography?.color}
                    {...styles.menuItem}
                >
                    {link.title}
                    {(isCascading || isMega) && downIcon}
                </Link>
            );
        }

        let menuItem = menuLink;

        if (isCascading && link.children) {
            const menuProps: { maxDepth?: number } = {};
            if (link.maxDepth) {
                menuProps.maxDepth = link.maxDepth;
            }
            menuItem = (
                <Menu
                    data-test-selector={`mainNavigationItem_${index}`}
                    isOpen={isOpen || undefined}
                    descriptionId={`${link.title}_${index}`}
                    menuItems={link.children}
                    menuTrigger={menuLink}
                    displayChangeCustomerLink={this.props.displayChangeCustomerLink}
                    {...menuProps}
                    {...styles.cascadingMenu}
                />
            );
        }

        if (isMega) {
            menuItem = (
                <Popover
                    zIndexKey="menu"
                    {...styles.megaMenu}
                    contentBodyProps={{
                        ...styles.megaMenu?.contentBodyProps,
                        _width: 1140,
                        as: "div",
                    }}
                    controlsId={`${index}_${link.title}`}
                    ref={this.popover}
                    positionFunction={(element: React.RefObject<HTMLUListElement>) => {
                        if (this.props.container.current) {
                            const parentPosition = this.props.container.current.getBoundingClientRect();
                            const rect = element.current?.getBoundingClientRect();
                            const top = rect ? rect.top + (rect.height > 100 ? styles.menuHeight : rect.height) : 0;
                            const cartWidth = 150;
                            const breakpointMaxWidth = maxWidths.find((value: number, index: number) => {
                                return (
                                    parentPosition.width + cartWidth <= value &&
                                    parentPosition.width + cartWidth > maxWidths[index - 1]
                                );
                            });

                            const width = breakpointMaxWidth ? breakpointMaxWidth - 30 : parentPosition.width;

                            return {
                                top,
                                position: "fixed",
                                left: parentPosition.left,
                                width: `${width}px`,
                            };
                        }
                        return { position: "absolute" };
                    }}
                    popoverTrigger={menuLink}
                    insideRefs={[this.element]}
                >
                    <GridContainer
                        data-test-selector={`mainNavigationItem_${index}`}
                        {...styles.megaMenuGridContainer}
                        offsetProps={{ ...styles.megaMenuGridContainer?.offsetProps, as: "ul" }}
                    >
                        {link
                            .children!.filter(child => !child.excludeFromNavigation)
                            .map((child, index) => (
                                <GridItem
                                    width={(12 / link.numberOfColumns!) as GridWidths}
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                    {...styles.megaMenuGridItem}
                                    as="li"
                                >
                                    <Link {...styles.megaMenuHeading} href={child.url} onClick={this.closePopover}>
                                        {child.title}
                                    </Link>
                                    {child.children && (
                                        <ul>
                                            {child.children
                                                .filter(grandChild => {
                                                    if (grandChild.excludeFromNavigation) {
                                                        return false;
                                                    }
                                                    if (
                                                        grandChild.type === "ChangeCustomerPage" &&
                                                        !this.props.displayChangeCustomerLink
                                                    ) {
                                                        return false;
                                                    }
                                                    return true;
                                                })
                                                .map((grandChild, index) => (
                                                    // eslint-disable-next-line react/no-array-index-key
                                                    <li key={index}>
                                                        <Link
                                                            {...styles.megaMenuLink}
                                                            onClick={this.closePopover}
                                                            href={grandChild.url}
                                                        >
                                                            {grandChild.title}
                                                        </Link>
                                                    </li>
                                                ))}
                                        </ul>
                                    )}
                                </GridItem>
                            ))}
                    </GridContainer>
                </Popover>
            );
        }

        return menuItem;
    }
}

export default withTheme(MainNavigationItem);
