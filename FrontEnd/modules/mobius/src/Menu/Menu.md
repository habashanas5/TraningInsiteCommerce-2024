### Examples

```jsx
const menuItems = require('./menuData.ts').default;
const Button = require('../Button').default;
const Clickable = require('../Clickable').default;
const Link = require('../Link').default;
const Icon = require('../Icon').default;
const ChevronDown = require('../Icons/ChevronDown').default;
const Users = require('../Icons/Users').default;
const Typography = require('../Typography').default;
const GridContainer = require('../GridContainer').default;
const GridItem = require('../GridItem').default;

<GridContainer>
    <GridItem width={[12,12,4,4,4]} css="display: block;">
        <Menu
            menuItems={menuItems}
            menuTrigger={<Button>Products</Button>}
        />
    </GridItem>
    <GridItem width={[12,12,4,4,4]} css="display: block;">
        <Menu 
            menuItems={menuItems} 
            menuTrigger={<Clickable href="http://www.hats.com" target="_blank">Products<Icon src={ChevronDown} /></Clickable>} 
            maxDepth={2}
        />
    </GridItem>
    <GridItem width={[12,12,4,4,4]} css="display: block;">
        <Menu
            menuItems={menuItems}
            menuTrigger={<Link href="http://www.hats.com" target="_blank" iconProps={{src: ChevronDown}}>Products</Link>}
            maxDepth={1}
            width={220}
        />
    </GridItem>
</GridContainer>

```