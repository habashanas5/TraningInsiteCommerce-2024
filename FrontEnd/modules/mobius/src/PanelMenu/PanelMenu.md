### Example

The panel menu is intended for use in the `Drawer` or another container that applies `overflow: hidden;`.

```jsx
const menuItems = require('../Menu/menuData.ts').default;
const PanelRow = require('./PanelRow').default;
const Button = require('../Button').default;
const Typography = require('../Typography').default;

<div style={{position: 'relative'}}>
    <div
        style={{
            width: '240px',
            position: 'relative',
            height: '500px',
            border: '3px transparent solid',
            background: '#F8F9FA',
            overflow: 'hidden', // Comment out to see behind-the-scenes menu behavior.
        }}
    >
        <div style={{ height: '50px', width: '100%', background: '#363636' }}></div>
            <PanelMenu
                menuItems={menuItems}
                panelTrigger={
                    <PanelRow color="common.backgroundContrast" hasChildren>
                        <Typography transform="uppercase">Products</Typography>
                    </PanelRow>
                }
                maxDepth={5}
                layer={0}
            />
            <PanelRow href="/quickOrder" color="common.backgroundContrast" css="padding-bottom: 20px;">
                <Typography transform="uppercase">Quick Order</Typography>
            </PanelRow>
    </div>
    {/* If you'd like to see how the panes render and slide in, comment out `overflow: 'hidden'` in the menu's parent div
    and uncomment the below frame div.
    <div style={{
        width: '240px',
        position: 'absolute',
        left: 0,
        top: 0,
        height: '500px',
        border: '3px red dashed',
        pointerEvents: 'none'
    }}></div>
    */}
</div>
```
