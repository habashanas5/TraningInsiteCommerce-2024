### Basic Implementation

```jsx
const menuItems = require('../Menu/menuData.ts').default;
const Button = require('../Button').default;
const PanelRow = require('../PanelMenu/PanelRow').default;
const PanelMenu = require('../PanelMenu').default;
const Icon = require('../Icon').default;
const Clickable = require('../Clickable').default;
const User = require('../Icons/User').default;
const DollarSign = require('../Icons/DollarSign').default;
const Globe = require('../Icons/Globe').default;
const MapPin = require('../Icons/MapPin').default;
const Typography = require('../Typography').default;

const logTargetValue = (e) => console.log(e.target.value)
class Example extends React.Component {
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
                <Button onClick={this.openModal} shape="pill" css='margin-right: 20px;'>{`Open ${this.props.position} Drawer`}</Button>
                <Drawer
                    position={this.props.position}
                    size={300}
                    isOpen={this.state.open}
                    handleClose={this.closeModal}
                    contentLabel="menu drawer"
                    {...this.props}
                />
            </>
        )
    }
}

const verticalDrawerProps = {
    headline: (
        <Button
            color="common.backgroundContrast"
            typographyProps={{ transform: 'uppercase', weight: 400 }}
        > 
            <Icon src={User} color="common.background" size={22} css='margin-right: 10px; vertical-align: middle; display: inline-block;' />
            <Typography css='vertical-align: middle; display: inline-block;' size={14}>Sign In</Typography>
        </Button>
    ),
};

const verticalChildren = (
    <>
        <PanelMenu 
            closeOverlay={this.closeModal}
            panelTrigger={<PanelRow color="common.backgroundContrast" hasChildren>
                <Typography transform="uppercase">Products</Typography>
            </PanelRow>}
            menuItems={menuItems}
            layer={0}
        />
        <PanelMenu 
            closeOverlay={this.closeModal}
            panelTrigger={<PanelRow color="common.backgroundContrast" hasChildren>
                <Typography transform="uppercase">Dealers</Typography>
            </PanelRow>}
            layer={0}
            menuItems={[
                {
                    title: 'Northwestern Region', url: '/nw', children: [
                        {title: 'Oregon', url: '/test' },
                        {title: 'Seattle', url: '/test' },
                    ]
                }, { 
                    title: 'Midwestern Region', url: '/mw', children: [
                        {title: 'Iowa', url: '/test' },
                        {title: 'Illinois', url: '/test' },
                    ]
                }, {
                    title: 'Southeastern Region', url: '/se', children: [
                        {title: 'Florida', url: '/test' },
                        {title: 'Alabama', url: '/test' },
                    ]
                }
            ]}
        />
        <PanelRow color="common.accent" href="/whatever" color="common.backgroundContrast">
            <Typography transform="uppercase">Shop Brands</Typography>
        </PanelRow>
        <PanelRow color="common.accent" href="/whatever" color="common.backgroundContrast" css="padding-bottom: 20px;">
            <Typography transform="uppercase">Quick Order</Typography>
        </PanelRow>
        <PanelRow color="common.accent" href="/whatever" css="margin-top: 20px;">
            <Typography transform="uppercase">Locations</Typography>
        </PanelRow>
        <PanelRow color="common.accent" href="/whatever">
            <Typography transform="uppercase">Contact Us</Typography>
        </PanelRow>
        <PanelRow color="common.accent" href="/whatever">
            <Typography transform="uppercase">About Us</Typography>
        </PanelRow>
        <PanelRow color="common.accent" href="/whatever" css="margin-top: 20px;">
            <Typography transform="uppercase">
                <Icon src={DollarSign} size={22} css='margin-right: 10px; vertical-align: middle; display: inline-block;' />
                USD
            </Typography>
        </PanelRow>
        <PanelRow color="common.accent" href="/whatever">
            <Typography transform="uppercase">
                <Icon src={Globe} size={22} css='margin-right: 10px; vertical-align: middle; display: inline-block;' />
                English
            </Typography>
        </PanelRow>
        <PanelRow color="common.accent" href="/whatever">
            <Typography transform="uppercase">
                <Icon src={MapPin} size={22} css='margin-right: 10px; vertical-align: middle; display: inline-block;' />
                Ship To address
            </Typography>
        </PanelRow>
    </>
)

const horizontalDrawerProps = {
    headline: 'Change Bill To and Ship To Address',
    headlineTypographyProps: { color: 'common.backgroundContrast' },
    closeButtonProps: { color: 'common.background' },
    cssOverrides: { drawerTitle: 'background: white;' },
};

const horizontalChildren = <Typography css="padding: 0 45px">Drawer content</Typography>;

<>
    <Example position="left" {...verticalDrawerProps}>
        {verticalChildren}
    </Example>
    <Example position="right" {...verticalDrawerProps}>
        {verticalChildren}
    </Example>
    <Example position="top" {...horizontalDrawerProps}>
        {horizontalChildren}
    </Example>
    <Example position="bottom" {...horizontalDrawerProps}>
        {horizontalChildren}
    </Example>
</>
```