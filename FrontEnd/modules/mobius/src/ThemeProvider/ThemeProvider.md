### Example

```jsx
const { keyframes, css } = require('styled-components');
const styled = require('styled-components').default;
const Accordion = require('../Accordion').default;
const AccordionSection = require('../AccordionSection').default;
const AccordionSectionPanel = require('../AccordionSection/AccordionSectionPanel').default;
const Breadcrumbs = require('../Breadcrumbs').default;
const { ButtonIcon } = require('../Button');
const Button = require('../Button').default;
const Checkbox = require('../Checkbox').default;
const CheckboxGroup = require('../CheckboxGroup').default;
const Clickable = require('../Clickable').default;
const DataTable = require('../DataTable').default;
const DataTableBody = require('../DataTable/DataTableBody').default;
const DataTableCell = require('../DataTable/DataTableCell').default;
const DataTableHead = require('../DataTable/DataTableHead').default;
const DataTableHeader = require('../DataTable/DataTableHeader').default;
const DataTableRow = require('../DataTable/DataTableRow').default;
const DatePicker = require('../DatePicker').default;
const FileUpload = require('../FileUpload').default;
const globalTheme = require('../globals/baseTheme').default;
const GridContainer = require('../GridContainer').default;
const GridItem = require('../GridItem').default;
const Icon = require('../Icon').default;
const AlertCircle = require('../Icons/AlertCircle').default;
const AlertTriangle = require('../Icons/AlertTriangle').default;
const Home = require('../Icons/Home').default;
const Info = require('../Icons/Info').default;
const LogIn = require('../Icons/LogIn').default;
const Settings = require('../Icons/Settings').default;
const Users = require('../Icons/Users').default;
const Link = require('../Link').default;
const LoadingSpinner = require('../LoadingSpinner').default;
const Modal = require('../Modal').default;
const OverflowMenu = require('../OverflowMenu').default;
const Pagination = require('../Pagination').default;
const Radio = require('../Radio').default;
const RadioGroup = require('../RadioGroup').default;
const Select = require('../Select').default;
const Tab = require('../Tab').default;
const TabGroup = require('../TabGroup').default;
const TextField = require('../TextField').default;
const Toast = require('../Toast').default;
const Toaster = require('../Toast/Toaster').default;
const ToasterContext = require('../Toast/ToasterContext').default;
const Tooltip = require('../Tooltip').default;
const Typography = require('../Typography').default;
const getProp = require('../utilities/getProp').default;
const resolveColor = require('../utilities/resolveColor').default;

const Spacer = ({height}) => <div style={{ height: 30 }} />;
const logValue = (e) => { console.log(options[e.target.value - 1]); };
const Container = ({ children }) => <div style={{ maxWidth: 400 }}>{children}</div>;

const theme = {
    ...globalTheme,
    formField: {
        defaultProps: {
            border: 'rounded',
            sizeVariant: 'small',
            labelProps: {
                variant: 'h3',
                size: 15,
            }
        },
    },
    fieldSet: {
        defaultProps: {
            sizeVariant: 'small',
            color: 'secondary',
        },
        groupDefaultProps: {
            sizeVariant: 'small',
        }
    },
    focus: {
        style: 'dashed',
        width: '4px',
        color: 'deeppink',
    },
    accordion: {
        ...globalTheme.accordion,
        sectionDefaultProps: {
            ...globalTheme.accordion.sectionDefaultProps,
            toggleIconProps: {
                color: 'common.accentContrast',
                size: 20
            },
            titleTypographyProps: {
                color: 'common.accentContrast',
                variant: 'body',
                weight: 'bold',
                as: 'span',
            },
            headerProps: { css: (props) => (`
                background: ${props.theme.colors.common.accent};
                button {
                    border: 1px solid ${props.theme.colors.secondary.main};
                    &:focus {
                        border: 2px solid ${props.theme.colors.primary.main};
                    }
                }
                ${AccordionSectionPanel} + & button {
                    &:focus {
                        border: 2px solid ${props.theme.colors.primary.main};
                    }
                }
            `) },
            panelProps: { css: (props) => (`
                border: 1px solid ${props.theme.colors.secondary.main};
                border-top: none;
            `) }
        }
    },
    button: {
        primary: {
            hoverMode: 'darken',
            hoverAnimation: 'grow',
            activeMode: 'darken',
            shape: 'rounded',
            shadow: true,
            typographyProps: { fontFamily: '\'Baloo\', fantasy' },
            buttonType: 'outline'
        },
        secondary: {
            color: 'common.accent', 
            buttonType: 'solid',
            hoverMode: 'darken',
            hoverAnimation: 'grow',
            activeMode: 'darken',
            shape: 'rounded',
            shadow: true,
            typographyProps: { fontFamily: '\'Baloo\', fantasy' },
        },
        tertiary: {
            sizeVariant: 'small',
            hoverMode: 'lighten',
            hoverAnimation: 'grow',
            buttonType: 'solid',
            activeMode: 'lighten',
            shape: 'rounded',
            color: 'secondary',
            typographyProps: { fontFamily: '\'Baloo\', fantasy' },
        }
    },
    breadcrumbs: { defaultProps: {
        css: (props) => (`
            border-image: linear-gradient(to right, ${props.theme.colors.secondary.main} 0%, ${props.theme.colors.common.accent} 75%) 1;
            border-style: none none solid none;
            border-width: 0 0 5px 0;
        `),
        typographyProps: {
            italic: false,
            size: 14,
    } } },
    clickable: { defaultProps: { css: (props) => (`
        border-radius: 3px;
        border: 2px solid transparent;
        transition: all 0.2s ease-in-out;
        &:hover {
            border: 2px solid ${props.theme.colors.primary.main};
        }
        &:focus {
            border: 2px solid ${props.theme.colors.secondary.main};
            color: ${props.theme.colors.secondary.main};
            outline: none;
        }`
    ) } },
    icon: { defaultProps: {color: 'primary.main', size: 32}},
    link: {
        defaultProps: { 
            color: 'primary.main', 
            hoverMode: 'darken',
            iconProps: { size: 14, css: css` transform: skewX(-14deg); `},
            typographyProps: { italic: true, weight: 800 },
        }
    },
    loadingSpinner: { defaultProps: { 
        size: 35,
        color: 'primary',
        css: (props) => `
            background: ${props.theme.colors.secondary.main}; 
            border-radius: 50%; 
            border: 1px solid ${props.theme.colors.common.accent};
            padding: 4px`
    }},
    modal: {
        defaultProps: {
            ...globalTheme.modal.defaultProps,
            transition: {
                enabled: true,
                length: 700,
                overlayEntryKeyframes: keyframes(['from { margin-left: -1000px; } to { margin-left: 0px; }']),
                overlayExitKeyframes: keyframes(['from { margin-right: 0px; } to { margin-right: -1000px; }']),
                scrimEntryKeyframes: keyframes(['from { opacity: 0; } to { opacity: 1; }']),
                scrimExitKeyframes: keyframes(['from { opacity: 1; } to { opacity: 0; }']),
            }
        }
    },
    overflowMenu: {
        defaultProps: {
            ...globalTheme.overflowMenu.defaultProps,
            buttonProps: {
                color: 'primary',
                buttonType: 'outline',
                shape: 'rounded',
            },
            iconProps: {
                color: 'common.backgroundContrast',
            },
            cssOverrides: {
                menuItem: 'text-decoration: underline;',
            },
        },
    },
    pagination: {
        defaultProps: {
            ...globalTheme.pagination.defaultProps,
            buttonProps: {
                ...globalTheme.pagination.buttonProps,
                activeMode: 'lighten',
                hoverMode: 'lighten',
                buttonType: 'solid',
                hoverAnimation: null,
                color: 'secondary',
            },
            cssOverrides: {
                ...globalTheme.pagination.defaultProps.cssOverrides,
                pagination: 'justify-content: space-between;',
                currentButton: (props) => `
                    background: ${props.theme.colors.primary.main}; 
                    border-color: ${props.theme.colors.primary.main}; 
                    color: ${props.theme.colors.primary.contrast};`
            }
        }
    },
    tab: {
        defaultProps: {
            css: (props) => (`
                padding: 8px 16px;
                border-radius: 10px 10px 0 0;
                background: ${props.theme.colors.common.background};
                margin: 5px 4px 0 0;
                border: 2px solid ${props.theme.colors.secondary.main};
                ${props.selected && 'border-bottom: 0;'}
                transition: margin .4s;
                &:hover {
                    border-bottom: ${props.selected ? '0;' : `2px solid ${props.theme.colors.secondary.main};` }
                    margin-top: 0;
                }
                &:focus {
                    margin-top: 0;
                    border-bottom: ${props.selected ? '0;' : `2px solid ${props.theme.colors.secondary.main};` }
                }`),
            typographyProps: { weight: 300 }
        },
        groupDefaultProps: {
            cssOverrides: {
                tabContent: (props) => (`border: 2px solid ${props.theme.colors.secondary.main};`),
                tabGroup: 'padding: 2px 2px 2px 0;',
            }
        },
    },
    tooltip: {
        defaultProps: {
            ...globalTheme.tooltip.defaultProps,
            cssOverrides: {
                tooltipBody: (props) => (`background: ${props.theme.colors.secondary.main}`),
                tooltipContainer: (props) => (`&::after { content: ""; position: absolute; top: 100%; left: 50%; 
                    margin-left: -6px; border-width: 6px; border-style: solid; 
                    border-color: ${props.theme.colors.secondary.main} transparent transparent transparent;}`)
            },
            iconProps: {
                ...globalTheme.tooltip.defaultProps.iconProps,
                src: Info,
                color: 'primary'
            }
        }
    },
    toast: {
        defaultProps: {
            ...globalTheme.toast.defaultProps,
            transitionDuration: 'long',
            bodyTypographyProps: { lineHeight: 1.5, color: 'common.backgroundContrast' },
            closeButtonProps: { iconProps: { color: 'white' }, shadow: false, ...globalTheme.toast.defaultProps.closeButtonProps },
            iconProps: {color: 'white'},
            cssOverrides: {
                toast: ({messageType, theme}) => `
                    background: linear-gradient(to right, ${resolveColor(messageType, theme)} 0%, ${resolveColor('common.accent', theme)} 15%);
                    border-width: 3px;
                    border-style: solid;`,
                toastBody: ({theme}) => ``,
            }
        },
        toasterProps: {
            position: 'top-left',
            mobilePosition: 'bottom',
        },
    },
    typography: {
        ...globalTheme.typography,
        fontFamilyImportUrl: 'https://fonts.googleapis.com/css?family=Baloo|Lora:400,700|Open+Sans:300,400,600,700,800',
        body: {
            ...globalTheme.typography.body,
            fontFamily: '\'Lora\', serif',
        },
        h1: {
            ...globalTheme.typography.h1,
            fontFamily: '\'Baloo\', fantasy',
        },
        h2: {
            ...globalTheme.typography.h2,
            fontFamily: '\'Baloo\', fantasy',
        },
        h3: {
            size: 28,
            fontFamily: '\'Baloo\', fantasy',
            color: 'text.accent',
            transform: 'uppercase',
        },
        h4: {
            ...globalTheme.typography.h4,
            fontFamily: '\'Baloo\', fantasy',
        },
        h5: {
            ...globalTheme.typography.h5,
            fontFamily: '\'Baloo\', fantasy',
        },
        h6: {
            ...globalTheme.typography.h6,
            fontFamily: '\'Baloo\', fantasy',
        },
    }
};

const logTargetValue = (e) => console.log(e.target.value)
const links = [
    { children: 'Home', onClick: logValue },
    { children: 'Category', onClick: logValue },
    { children: 'Current Page'}
];
class ModalExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({open: true});
    }

    closeModal() {
        this.setState({open: false});
    }

    render() {
        return (
            <>
                <Button onClick={this.openModal} css={ css` margin-top: 16px; `} variant="primary">Open Modal</Button>
                <Modal
                    isOpen={this.state.open}
                    handleClose={this.closeModal}
                    headline='Modal'
                    isCloseable
                    contentLabel='example modal'>
                    <Typography variant="p">A standard modal with a standard paragraph therein.</Typography>
                </Modal>
            </>
        )
    }
}

const numberOfResults = 8;

const generateRow = (index) => {
    const arg1 = Math.floor(Math.random() * 100);
    const arg2 = Math.floor(Math.random() * 2) + 1;
    return ({
        invoice: `0${index}0${arg2}0${arg1}`,
        invoiceDate: arg2 === 1 ? '7/20/2020' : '8/14/2019',
        status: (arg2 * arg1) > 40 ? 'open' : 'overdue',
    });
}

const items = [];
for(let i = 0; i < 8; i++) { items[i] = generateRow(i) };
const FakeLink = props => <Link href='#' typographyProps={{ size: 13 }} {...props} />;

class PaginatedTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items,
            currentPage: 1,
            resultsPerPage: 5,
        };
        this.changePage = this.changePage.bind(this);
        this.changeNumberOfResultsPerPage = this.changeNumberOfResultsPerPage.bind(this);
    }

    changePage(newPageIndex) {
        const {items, resultsPerPage} = this.state;
        for(let i = (newPageIndex) * resultsPerPage; i < ((newPageIndex + 2) * resultsPerPage); i++) { 
            if (!items[i] && i < numberOfResults) {
                items[i] = generateRow(i);
            }
        }
        this.setState({items, currentPage: newPageIndex});
    }

    changeNumberOfResultsPerPage(event) {
        const resultsPerPage = parseInt(event.target.value);
        const finalPageIndex = Math.floor((numberOfResults - 1) / resultsPerPage);
        let currentPage = this.state.currentPage;
        if (currentPage > finalPageIndex) currentPage = finalPageIndex;
        this.setState(
            {resultsPerPage}, 
            () => this.changePage(currentPage)
        );
    }

    render() {
        const { items, currentPage, resultsPerPage } = this.state;
        const data = items.slice(currentPage * resultsPerPage, currentPage * resultsPerPage + resultsPerPage);
        const paginationComponent = (
            <Pagination 
                resultsPerPage={resultsPerPage}
                resultsCount={numberOfResults}
                currentPage={currentPage}
                resultsPerPageLabel={'Results Per Page'}
                resultsPerPageOptions={[2, 5, 10]}
                onChangeResultsPerPage={this.changeNumberOfResultsPerPage}
                onChangePage={this.changePage}
            />
        )
        return (<>
            {paginationComponent}
            <DataTable>
                <DataTableHead>
                    <DataTableHeader tight title="Invoice Number">Invoice #</DataTableHeader>
                    <DataTableHeader tight>Invoice Date</DataTableHeader>
                    <DataTableHeader>Status</DataTableHeader>
                </DataTableHead>
                <DataTableBody>
                    {data.map(({ 
                        invoice,
                        invoiceDate,
                        status,
                    }) => (
                        <DataTableRow key={invoice}>
                            <DataTableCell>
                                <FakeLink>{invoice}</FakeLink>
                            </DataTableCell>
                            <DataTableCell>{invoiceDate}</DataTableCell>
                            <DataTableCell>{status}</DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTableBody>
            </DataTable>
            {paginationComponent}
        </>)
    }
}

const ThemeExample = (props) => (
    <Toaster>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <span><Icon src={Home} /><Typography variant="h2" css={css` display: inline-block; `}>{props.name}</Typography></span>
            <OverflowMenu position="end">
                <Clickable>Print</Clickable>
                <Clickable>Email</Clickable>
                <Clickable>Share</Clickable>
            </OverflowMenu> 
        </div>
        <Breadcrumbs links={links} />
        <Spacer />
        <Typography as="p">
            This text and the components in this box are being skinned based on the {props.name}.
        </Typography>
        <ModalExample />
        <ToasterContext.Consumer>
            {({addToast}) => (
                <>
                    <Button
                        variant='secondary' css={css` margin-left: 10px; `}
                        onClick={() => addToast({
                            body: 'Item(s) added to your cart!',
                            messageType: 'success',
                        })}
                    >
                        Open Toast
                    </Button>
                    <Button variant="tertiary" css={css` margin-left: 10px; `}>Tertiary button</Button>
                    <Spacer />
                    <Typography variant="h5">More toasts</Typography>
                    <Button
                        shape="pill"
                        color="warning"
                        css={css`
                            margin-left: 10px;
                            padding: 0 6px;
                        `}
                        onClick={() => addToast({
                            body: 'Unable to calculate charges due to invalid address. ',
                            messageType: 'warning',
                        })}
                    >
                        <ButtonIcon size={24} src={AlertTriangle} />
                    </Button>
                    <Button
                        shape="pill"
                        color="danger"
                        css={css`
                            margin-left: 10px;
                            padding: 0 6px;
                        `}
                        onClick={() => addToast({
                            body: 'List saved without name.',
                            messageType: 'danger',
                        })}
                    >
                        <ButtonIcon size={24} src={AlertCircle} />
                    </Button>
                    <Button
                        shape="pill"
                        color="info"
                        css={css`
                            margin-left: 10px;
                            padding: 0 6px;
                        `}
                        onClick={() => addToast({
                            body: 'Your cart will expire in 48 hours.',
                            messageType: 'info',
                        })}
                    >
                        <ButtonIcon size={24} src={Info} />
                    </Button>
                </>
            )}
        </ToasterContext.Consumer>
        <Spacer />
        <TabGroup>
            <Tab headline='Form Elements' tabKey="form">
                <Typography as='p'>
                    Form field styles are governed by the `formField` (for text and select fields) and `fieldSet` (for radio and checkboxes)
                    theme objects, but can also be themed as independent components. 
                </Typography>
                <Spacer/>
                <Typography variant="h5">Form Fields</Typography>
                <Container>
                    <Select
                        label="Choose an item from this list"
                        required
                        placeholder="Select"
                        onChange={logValue}
                        value={1}
                    >
                        <option key={0} value={0}>Select</option>
                        <option key={1} value={1}>Item 1</option>
                        <option key={2} value={2}>Item 2</option>
                        <option key={3} value={3}>Item 3</option>
                    </Select>
                    <Spacer/> 
                    <TextField label="Type something here" />
                    <Spacer/>
                    <DatePicker />
                    <Spacer/>
                    <FileUpload label="Profile Photo" />
                    <Spacer/>
                    <Typography variant="h5">Field Sets</Typography>
                    <GridContainer>
                        <GridItem width={[12,12,6,6,6]}>
                            <RadioGroup label="Choose one" name={`${props.name}radio`} onChangeHandler={logTargetValue} value="Option 1">
                                <Radio>Option 1</Radio>
                                <Radio>Option 2</Radio>
                                <Radio disabled>Option 3</Radio>
                            </RadioGroup>
                        </GridItem>
                        <GridItem width={[12,12,6,6,6]}>
                            <CheckboxGroup label="Choose multiple">
                                <Checkbox checked disabled>Option 1</Checkbox>
                                <Checkbox>Option 2</Checkbox>
                                <Checkbox disabled>Option 3</Checkbox>
                                <Checkbox checked >Option 4</Checkbox>
                            </CheckboxGroup>
                        </GridItem>
                    </GridContainer>
                </Container>
            </Tab>
            <Tab headline='Text elements' tabKey="text">
                <Typography as='p'>
                    Here is some text with <Link href="#!/ThemeProvider/1">a link</Link> inside it. 
                </Typography>
                <Typography as='p'>And here is a list of icon links:</Typography>
                <ul css="list-style: none;">
                    <li><Link href="#!/ThemeProvider/1" iconProps={{ src: Users }}>Users</Link></li>
                    <li><Link href="#!/ThemeProvider/1" iconProps={{ src: LogIn }}>Login</Link></li>
                    <li><Link href="#!/ThemeProvider/1" iconProps={{ src: Settings }}>Settings</Link></li>
                </ul>
            </Tab>
            <Tab headline='Left Form Fields' tabKey="left">
                <Select
                        label="Item"
                        required
                        placeholder="Select"
                        onChange={logValue}
                        value={1} 
                        labelPosition="left" 
                    >
                        <option key={0} value={0}>Select</option>
                        <option key={1} value={1}>Item 1</option>
                        <option key={2} value={2}>Item 2</option>
                        <option key={3} value={3}>Item 3</option>
                </Select>
                <Spacer/> 
                <TextField labelPosition="left" label="Name" />
                <Spacer/>
                <DatePicker labelPosition="left" />
                <Spacer/>
                <FileUpload label="Profile Photo" labelPosition="left"/>
            </Tab>
        </TabGroup>
        <Spacer />
        <Spacer/>
        <Accordion headingLevel={4}>
            <AccordionSection title="Loading spinner">
                <LoadingSpinner />
            </AccordionSection>
            <AccordionSection title="Tooltip" expanded={true}>
                <Typography>What's this? </Typography><Tooltip text='some content' />
            </AccordionSection>
            <AccordionSection title="Paginated Table" expanded={true}>
                <PaginatedTable />
            </AccordionSection>
        </Accordion>
    </Toaster>
);

<GridContainer>
    <GridItem width={[12,12,6,6,6]}>
        <ThemeProvider theme={globalTheme} createGlobalStyle={true}>
            <ThemeExample name="Global Skin"/>
        </ThemeProvider>
    </GridItem>
    <GridItem width={[12,12,6,6,6]}>
        <ThemeProvider theme={theme}>
            <ThemeExample name="Custom Skin"/>
        </ThemeProvider>
    </GridItem>
</GridContainer>
```

## Color Themes

```jsx
const css = require('styled-components').css;
const Button = require('../Button').default;
const { ButtonIcon } = require('../Button');
const Checkbox = require('../Checkbox').default;
const CheckboxGroup = require('../CheckboxGroup').default;
const DataTable = require('../DataTable').default;
const DataTableBody = require('../DataTable/DataTableBody').default;
const DataTableCell = require('../DataTable/DataTableCell').default;
const DataTableHead = require('../DataTable/DataTableHead').default;
const DataTableHeader = require('../DataTable/DataTableHeader').default;
const DataTableRow = require('../DataTable/DataTableRow').default;
const DatePicker = require('../DatePicker').default;
const FileUpload = require('../FileUpload').default;
const globalTheme = require('../globals/baseTheme').default;
const GridContainer = require('../GridContainer').default;
const GridItem = require('../GridItem').default;
const AlertCircle = require('../Icons/AlertCircle').default;
const AlertTriangle = require('../Icons/AlertTriangle').default;
const Check = require('../Icons/Check').default;
const Info = require('../Icons/Info').default;
const Link = require('../Link').default;
const Page = require('../Page').default;
const Radio = require('../Radio').default;
const RadioGroup = require('../RadioGroup').default;
const TextField = require('../TextField').default;
const Typography = require('../Typography').default;

const darkTheme = {
    ...globalTheme,
    colors: {
        ...globalTheme.colors,
        common: {
            ...globalTheme.colors.common,
            background: '#0A0A0A',
            backgroundContrast: '#ebecF0',
            accent: '#04005e', 
            accentContrast: '#fff',
            border: '#889292',
            disabled: '#A9BDBD',
        },
        text: {
            ...globalTheme.colors.text,
            main: '#ebecF0',
            disabled: '#A9BDBD',
            link: '#ff2079',
        },
        primary: {
            main: '#535eeb', 
            contrast: '#ebecF0'
        },
        secondary: {
            main: '#bdbdfd',
            contrast: '#000807'
        },
        tertiary: {
            main: '#F7F4F3', 
            contrast: '#000807'
        },
        warning: {
            main: '#faa900',
            contrast: 'black',
        },
        info: {
            main: '#6baee0',
            contrast: 'black',
        },
        success: {
            main: '#52bf90',
            contrast: 'black',
        },
        danger: {
            main: '#c80000',
            contrast: 'black',
        },
    },
    shadows: {
        2: '0px 2px 4px -1px rgba(255,255,255,0.2),0px 4px 5px 0px rgba(255,255,255,0.14),0px 1px 10px 0px rgba(255,255,255,0.12)',
    },
};
const wildTheme = {
    ...globalTheme,
    colors: {
        ...globalTheme.colors,
        common: {
            ...globalTheme.colors.common,
            background: '#0A0A0A',
            backgroundContrast: '#fff',
            accent: '#C24CF6', 
            accentContrast: 'black',
            border: 'limegreen',
        },
        text: {
            ...globalTheme.colors.text,
            main: '#fff',
            disabled: '#A9BDBD',
            link: '#0ff',
        },
        primary: {
            main: '#08F7FE',
            contrast: 'black'
        },
        secondary: {
            main: '#f0f',
            contrast: 'black'
        },
        warning: {
            main: '#fcf340',
            contrast: 'black',
        },
        info: {
            main: '#09FBD3',
            contrast: 'black',
        },
        success: {
            main: '#7fff00',
            contrast: 'black',
        },
        danger: {
            main: '#FC6E22',
            contrast: 'black',
        },
    },
    shadows: {
        1: '0 0 6px 3px #fff, 0 0 10px 6px #f0f, 0 0 14px 9px #0ff',
        2: '0 0 8px 4px #fff, 0 0 20px 10px #f0f;',
    },
    button: {
        ...globalTheme.button,
        defaultProps: {
            ...globalTheme.button.defaultProps,
            shadow: true,
        },
    }
};
const mildTheme = {
    ...globalTheme,
    colors: {
        ...globalTheme.colors,
        common: {
            ...globalTheme.colors.common,
            background: '#efeeee',
            backgroundContrast: '#484848',
            accent: '#e1e1e1', 
            accentContrast: '#484848',
            border: '#c4bdac',
        },
        text: {
            ...globalTheme.colors.text,
            main: '#484848',
            disabled: '#A9BDBD',
            link: '#6baee0',
        },
        primary: {
            main: '#6b5e5b',
            contrast: '#efeeee'
        },
        secondary: {
            main: '#000761',
            contrast: '#efeeee'
        },
        warning: {
            main: '#a84830',
            contrast: '#efeeee',
        },
        info: {
            main: '#4a6084',
            contrast: '#efeeee',
        },
        success: {
            main: '#318256',
            contrast: '#efeeee',
        },
        danger: {
            main: '#783018',
            contrast: '#efeeee',
        },
    },
};

const themes = {
    globalTheme,
    darkTheme,
    wildTheme,
    mildTheme,
};

const items = [
    { invoice: '1', invoiceDate: '7/20/2020', status: 'open' }, 
    { invoice: '2', invoiceDate: '8/14/2019', status: 'paid' }, 
    { invoice: '3', invoiceDate: '9/05/2018', status: 'paid' }, 
    { invoice: '4', invoiceDate: '7/01/2004', status: 'overdue' }, 
];

const logTargetValue = (e) => console.log(e.target.value);
const FakeLink = props => <Link href='#' typographyProps={{ size: 13 }} {...props} />;
const Spacer = ({height}) => <div style={{ height: 30 }} />;

class ColorThemed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: 'globalTheme'
        };
        this.changeTheme = this.changeTheme.bind(this);
    }

    changeTheme(e) {
        this.setState({theme: e.target.value});
    }

    render() {
        return (
            <>
                <ThemeProvider theme={themes[this.state.theme]} createGlobalStyle={false}>
                    <Page css={css` transition: all ease-in-out 500ms; `}>
                        <Typography variant="h3">Color Theme example</Typography>
                        <Typography>The colors in this example will change with the change of this radio group.</Typography>
                        <Spacer />
                        <GridContainer>
                            <GridItem width={[12,12,6,6,6]}>
                                <RadioGroup onChangeHandler={this.changeTheme} label="Choose Theme" required value={this.state.theme}>
                                    <Radio value={'globalTheme'}>Base Theme</Radio>
                                    <Radio value={'mildTheme'}>Mild Theme</Radio>
                                    <Radio value={'darkTheme'}>Dark Theme</Radio>
                                    <Radio value={'wildTheme'}>Wild Theme</Radio>
                                </RadioGroup>
                            </GridItem>
                            <GridItem width={[12,12,6,6,6]}>
                                <CheckboxGroup label="Example Checkboxes">
                                    <Checkbox checked disabled>Disabled</Checkbox>
                                    <Checkbox checked>Enabled</Checkbox>
                                    <Checkbox>Enabled unchecked</Checkbox>
                                    <Checkbox disabled>Disabled unchecked</Checkbox>
                                </CheckboxGroup>
                            </GridItem>
                        </GridContainer>
                        <Spacer />
                        <Button 
                            variant="primary"
                        >
                            Primary Button
                        </Button>
                        <Button 
                            css={css` margin-left: 30px; `}
                            variant="secondary"
                        >
                            Secondary Button
                        </Button>
                        <Button 
                            css={css` margin-left: 30px; `}
                            variant="tertiary"
                        >
                            Tertiary Button
                        </Button>
                        <Spacer />
                        <Button
                            shape="pill"
                            color="warning"
                            css={css` padding: 0 6px; `}
                        >
                            <ButtonIcon size={24} src={AlertTriangle} />
                        </Button>
                        <Button
                            shape="pill"
                            color="danger"
                            css={css`
                                margin-left: 30px;
                                padding: 0 6px;
                            `}
                        >
                            <ButtonIcon size={24} src={AlertCircle} />
                        </Button>
                        <Button
                            shape="pill"
                            color="info"
                            css={css`
                                margin-left: 30px;
                                padding: 0 6px;
                            `}
                        >
                            <ButtonIcon size={24} src={Info} />
                        </Button>
                        <Button
                            shape="pill"
                            color="success"
                            css={css`
                                margin-left: 30px;
                                padding: 0 6px;
                            `}
                        >
                            <ButtonIcon size={24} src={Check} />
                        </Button>
                        <Spacer />
                        <div style={{width: '350px'}}>
                            <DatePicker label="Delivery Date" />
                            <Spacer />
                            <FileUpload label="Profile Photo" />
                            <Spacer />
                            <TextField label="Type something here" />
                            <Spacer />
                        </div>
                        <DataTable>
                            <DataTableHead>
                                <DataTableHeader tight title="Invoice Number">Invoice #</DataTableHeader>
                                <DataTableHeader tight>Invoice Date</DataTableHeader>
                                <DataTableHeader>Status</DataTableHeader>
                            </DataTableHead>
                            <DataTableBody>
                                {items.map(({ invoice, invoiceDate, status }) => (
                                    <DataTableRow key={invoice}>
                                        <DataTableCell>
                                            <FakeLink>{invoice}</FakeLink>
                                        </DataTableCell>
                                        <DataTableCell>{invoiceDate}</DataTableCell>
                                        <DataTableCell>{status}</DataTableCell>
                                    </DataTableRow>
                                ))}
                            </DataTableBody>
                        </DataTable>
                    </Page>
                </ThemeProvider>
            </>
        )
    }
}

<ColorThemed />

```