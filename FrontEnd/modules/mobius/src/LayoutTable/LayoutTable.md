### Simple Example

```jsx
const LayoutGroup = require('../LayoutGroup').default;
const LayoutCell = require('../LayoutCell').default;
const TextField = require('../TextField').default;

<LayoutTable
    cellFlow="column"
    numberOfGroups={2}
    cellsPerGroup={2}
    gap={15}
>
    <LayoutGroup index={0}>
        <LayoutCell index={0}>
            <TextField label="Ship to Address" hint="This causes the entire row to expand vertically."/>
        </LayoutCell>
        <LayoutCell index={1}>
            <TextField label="Status"/>
        </LayoutCell>
    </LayoutGroup>
    <LayoutGroup index={1}>
        <LayoutCell index={0}>
            <TextField label="PO #"/>
        </LayoutCell>
        <LayoutCell index={1}>
            <TextField label="Order #"/>
        </LayoutCell>
    </LayoutGroup>
</LayoutTable>
```

### Content Flow

In both examples below, the content reads in semantic order, top to bottom in the markup. One example of when this
may be useful is a product catalog, where the layout needs to align visually as a table but needs to maintain semantic
order for accessibility. A screen reader would read **both** tables below as "A1, A2, A3, B1, B2, B3, C1, C2, C3",
which is impossible to do using HTML tables.

```jsx
const styled = require('styled-components').default;
const LayoutGroup = require('../LayoutGroup').default;
const LayoutCell = require('../LayoutCell').default;
const Typography = require('../Typography').default;

const Red = styled.div(['background: #fcc']);
const Green = styled.div(['background: #cfc']);
const Blue = styled.div(['background: #ccf']);

const content = (
    <>
        <LayoutGroup index={0}>
            <LayoutCell index={0}><Red>A1</Red></LayoutCell>
            <LayoutCell index={1}><Red>A2</Red></LayoutCell>
            <LayoutCell index={2}><Red>A3</Red></LayoutCell>
        </LayoutGroup>
        <LayoutGroup index={1}>
            <LayoutCell index={0}><Green>B1</Green></LayoutCell>
            <LayoutCell index={1}><Green>B2</Green></LayoutCell>
            <LayoutCell index={2}><Green>B3</Green></LayoutCell>
        </LayoutGroup>
        <LayoutGroup index={2}>
            <LayoutCell index={0}><Blue>C1</Blue></LayoutCell>
            <LayoutCell index={1}><Blue>C2</Blue></LayoutCell>
            <LayoutCell index={2}><Blue>C3</Blue></LayoutCell>
        </LayoutGroup>
    </>
);

<>
    <Typography variant="h4">Column Flow</Typography>
    <LayoutTable cellFlow="column" gap={1} numberOfGroups={3} cellsPerGroup={3}>{content}</LayoutTable>
    <br/>
    <Typography variant="h4">Row Flow</Typography>
    <LayoutTable cellFlow="row" gap={1} numberOfGroups={3} cellsPerGroup={3}>{content}</LayoutTable>
</>
```

### Complex Column Flow example

```jsx
const Button = require('../Button').default;
const LayoutGroup = require('../LayoutGroup').default;
const LayoutCell = require('../LayoutCell').default;
const LazyImage = require('../LazyImage').default;
const TextField = require('../TextField').default;
const Typography = require('../Typography').default;

const ProductTile = ({ code, imgSrc, index, inStock, name, price }) => (
    <LayoutGroup index={index}>
        <LayoutCell index={0}>
            <LazyImage src={imgSrc} alt="" width="100%"/>
        </LayoutCell>
        <LayoutCell index={1}>
            <Typography>{name}</Typography>
        </LayoutCell>
        <LayoutCell index={2}>
            <Typography color="text.accent">{code}</Typography>
        </LayoutCell>
        <LayoutCell index={3}>
            <Typography weight="bold">{price}</Typography> / ea.
        </LayoutCell>
        <LayoutCell index={4}>
            <Typography weight="bold" color={inStock ? 'success' : 'danger'}>
                {inStock ? 'In' : 'Out of'} Stock
            </Typography>
        </LayoutCell>
        <LayoutCell index={5}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div style={{ width: '4em' }}>
                    <TextField value={1} onChange={() => {}}/>
                </div>
                <Button style={{ maxWidth: '100%' }}>Add to Cart</Button>
            </div>
        </LayoutCell>
    </LayoutGroup>
);

const products = [{
    imgSrc: 'https://images.unsplash.com/photo-1541474424879-14480b8e249d?fit=crop&w=250&h=250',
    name: 'Variable Speed 48V Cordless Drill',
    code: 'VSCD-48',
    price: '$99.00',
    inStock: true
}, {
    imgSrc: 'https://images.unsplash.com/photo-1541474464679-82ae2f57e864?fit=crop&w=250&h=250',
    name: 'Wood Handle Coarse Hair Paintbrush',
    code: 'WHCHP-1',
    price: '$4.49',
    inStock: true
}, {
    imgSrc: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?fit=crop&w=250&h=250',
    name: 'Heavy Duty Circular Saw w/ FingerGuard™',
    code: 'HDCS-FG',
    price: '$189.00',
    inStock: false
}];

<div style={{ border: '1px solid #ccc', padding: 15 }}>
    <LayoutTable
        cellFlow="column"
        gap={15}
        numberOfGroups={products.length}
        cellsPerGroup={6}
    >
        {products.map((product, index) => (
            <ProductTile key={product.code} index={index} {...product} />
        ))}
    </LayoutTable>
</div>
```
