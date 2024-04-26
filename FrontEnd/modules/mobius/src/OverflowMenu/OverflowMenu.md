### Example

```jsx
const Clickable = require('../Clickable').default;
const GridContainer = require('../GridContainer').default;
const GridItem = require('../GridItem').default;
const Typography = require('../Typography').default;
const css = require('styled-components').css

const alertClick = () => console.log('clicked item');

<GridContainer>
    <GridItem width={2.4}>
        <div>
            <Typography variant="h5">Start</Typography>
            <OverflowMenu position="start" isOpen={true}>
                <Clickable onClick={alertClick}>Print</Clickable>
                <Clickable href="http://www.hat.com">Email</Clickable>
                <Clickable onClick={alertClick}>Continue shopping on this very long link</Clickable>
            </OverflowMenu> 
        </div>
    </GridItem>
    <GridItem width={2.4}>
        <div>
            <Typography variant="h5">Middle with CSS overrides</Typography>
            <OverflowMenu 
                position="middle" 
                isOpen={true} 
                cssOverrides={{
                    wrapper: css`
                        background: #999;
                        border-radius: 50%;
                    `,
                    menu: css`
                        padding: 3px;
                        background: #222;
                    `,
                    menuItem: css`
                        background: #999;
                    `,
                }}>
                <Clickable onClick={alertClick}>Print</Clickable>
                <Clickable href="http://www.hat.com">Email</Clickable>
                <Clickable onClick={alertClick}>Continue shopping on this very long link</Clickable>
            </OverflowMenu> 
        </div>
    </GridItem>
    <GridItem width={2.4}>
        <div>
            <Typography variant="h5">End</Typography>
            <OverflowMenu position="end" isOpen={true}>
                <Clickable onClick={alertClick}>Print</Clickable>
                <Clickable href="http://www.hat.com">Email</Clickable>
                <Clickable onClick={alertClick}>Continue shopping on this very long link</Clickable>
            </OverflowMenu> 
        </div>
    </GridItem>
    <GridItem width={2.4}>
        <div>
            <Typography variant="h5">Before / Top</Typography>
            <OverflowMenu position="before" yPosition="top" isOpen={true}>
                <Clickable onClick={alertClick}>Print</Clickable>
                <Clickable href="http://www.hat.com">Email</Clickable>
                <Clickable onClick={alertClick}>Continue shopping on this very long link</Clickable>
            </OverflowMenu> 
        </div>
    </GridItem>
    <GridItem width={2.4}>
        <div>
            <Typography variant="h5">After / Top</Typography>
            <OverflowMenu position="after" yPosition="top" isOpen={true}>
                <Clickable onClick={alertClick}>Print</Clickable>
                <Clickable href="http://www.hat.com">Email</Clickable>
                <Clickable onClick={alertClick}>Continue shopping on this very long link</Clickable>
            </OverflowMenu> 
        </div>
    </GridItem>
</GridContainer>
```
