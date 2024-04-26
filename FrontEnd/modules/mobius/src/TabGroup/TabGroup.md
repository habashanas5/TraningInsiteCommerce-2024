### Example

```jsx
const Button = require('../Button').default;
const Link = require('../Link').default;
const Tab = require('../Tab').default;
const Typography = require('../Typography').default;
const Icon = require('../Icon').default;
const ArrowLeft = require('../Icons/ArrowLeft').default;
const ArrowRight = require('../Icons/ArrowRight').default;
const ArrowDown = require('../Icons/ArrowDown').default;

<TabGroup current="Accessibility">
    <Tab headline='Tab Component' tabKey='Tab Component' >
        <Typography as='p'>
            Tabs require a headline prop, which is rendered into the tab itself. 
        </Typography>
        <Typography as='p'>
            Tab content is passed to the tab component as children, and displays when the relevant tab is selected.
            The tab content is labelled by the headline of the tab for accessibility purposes. 
        </Typography>
    </Tab>
    <Tab headline='Accessibility' tabKey='Accessibility' >
        <Typography as='p'>
            The currently selected tab in the tablist is accessible via tabbing through the interface, and tabs are navigated
            via the left <Icon src={ArrowLeft} size={18} /> and right <Icon src={ArrowRight} size={18} /> arrows, not via tabing. 
        </Typography>
        <Typography as='p'>
            To provide access to the tabbable content for screenreaders, tab content is focusable from the tabgroup bar by pressing the 
            down<Icon src={ArrowDown} size={18} /> arrow key. 
        </Typography>
        <Typography as='p'>
            <Link href="#">Links</Link> and 
            <Button>Buttons</Button> are only tabbable when the tab containing them is active.  
        </Typography>
    </Tab>
    <Tab headline='Usage' tabKey='Usage' >
        <Typography as='p'>
            This tabbed interface is designed to be used to display information in-page and is not implicitly routable.
        </Typography>
        <Typography as='p'>
            While the tabbed interface pattern can be used as a site navigation menu, doing so should be considered a visual pattern only and the TabGroup 
            component should <Typography weight={600}>not</Typography> be modified to implement this pattern. Instead, to approximate a tabbed interface 
            in a navigation pattern, please use the `TabGroupStyle`, and `TabGroupWrapper` styled components, and the `Tab` component or `TabStyle` styled 
            component.
        </Typography>
    </Tab>
</TabGroup>
```

### Responsive behavior
```jsx
const Tab = require('../Tab').default;
const Typography = require('../Typography').default;

<div style={{width: '375px'}}>
    <TabGroup>
        <Tab headline='Onomatopoeia' tabKey='Onomatopoeia'>
            <Typography as='p'>In a small screen, the tabs will scroll.</Typography>
        </Tab>
        <Tab headline='Elasticization Polymer' tabKey='Elasticization Polymer'>
            <Typography as='p'>Content for tab two.</Typography>
        </Tab>
        <Tab headline='Crouton' tabKey='Crouton'>
            <Typography as='p'>Content for tab three.</Typography>
        </Tab>
    </TabGroup>
</div>
```

### Custom Styling
```jsx
const Icon = require('../Icon').default;
const Tab = require('../Tab').default;
const Typography = require('../Typography').default;
const Users = require('../Icons/Users').default;
const Truck = require('../Icons/Truck').default;
const Gift = require('../Icons/Gift').default;

const tabCss = (props) => `
    text-transform: uppercase;
    padding: 16px 32px;
    border-bottom: 3px solid ${props.selected ? 'deeppink' : 'transparent'};
    &:hover {
        border-bottom: 3px solid coral;
    }
    &:focus {
        outline: 1px dashed white;
        border-bottom: 3px solid purple;
    }
`;
const tabContent = (props) => `
    background: white;
`;
const tabGroup = (props) => `
    box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
    background: ${props.theme.colors.primary.main};
    padding: 0;
    color: white;
`;
const wrapper = (props) => `
    padding: 32px;
    background: ${props.theme.colors.text.accent};
`;
<TabGroup cssOverrides={{ tabContent, tabGroup, wrapper}}>
    <Tab headline={<Icon src={Users} color="white" />} tabKey='Users' css={tabCss} typographyProps={{weight: 500}}>
        <Typography as='p'>This component is being styled with override CSS.</Typography>
    </Tab>
    <Tab headline={<Icon src={Gift} color="white" />} tabKey='Gift' css={tabCss} typographyProps={{weight: 500}}>
        <Typography as='p'>Content for tab two.</Typography>
    </Tab>
    <Tab headline={<Icon src={Truck} color="white" />} tabKey='Truck' css={tabCss} typographyProps={{weight: 500}}>
        <Typography as='p'>Content for tab three.</Typography>
    </Tab>
</TabGroup>
```
