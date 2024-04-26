### Example

```jsx
const Button = require('../Button').default;
const DataTableHead = require('./DataTableHead').default;
const DataTableHeader = require('./DataTableHeader').default;
const DataTableBody = require('./DataTableBody').default;
const DataTableRow = require('./DataTableRow').default;
const DataTableCell = require('./DataTableCell').default;
const Link = require('../Link').default;

const ReorderButton = () => <Button color="secondary" sizeVariant="small">Reorder</Button>;
const FakeLink = props => <Link href='#' typographyProps={{ size: 13 }} {...props} />;

const data = [{
    date: '1/5/2018',
    order: 1234504,
    shipTo: 'MFG Co., 123 North Fifth, Minneapolis, MN 55406',
    status: 'Submitted',
    po: 10000,
    total: 805.92
}, {
    date: '1/4/2018',
    order: 1234503,
    shipTo: 'MFG Co., 123 North Fifth, Minneapolis, MN 55406',
    status: 'Shipped',
    po: 10000,
    total: 44.01
}, {
    date: '1/3/2018',
    order: 1234502,
    shipTo: 'MFG Co., 123 North Fifth, Minneapolis, MN 55406',
    status: 'RMA',
    po: 10000,
    total: 123.45
}, {
    date: '1/2/2018',
    order: 1234501,
    shipTo: 'MFG Co., 123 North Fifth, Minneapolis, MN 55406',
    status: 'Complete',
    po: 10000,
    total: 44.01
}, {
    date: '1/1/2018',
    order: 1234500,
    shipTo: 'MFG Co., 123 North Fifth, Minneapolis, MN 55406',
    status: 'Complete',
    po: 10000,
    total: 123.45
}];

<DataTable>
    <DataTableHead>
        <DataTableHeader onSortClick={() => console.log('sorting')} tight>Date</DataTableHeader>
        <DataTableHeader onSortClick={() => console.log('sorting')} tight title="Order Number">Order #</DataTableHeader>
        <DataTableHeader>Ship To</DataTableHeader>
        <DataTableHeader onSortClick={() => console.log('sorting')} sorted="descending" tight>Status</DataTableHeader>
        <DataTableHeader onSortClick={() => console.log('sorting')} tight title="Purchase Order Number">PO #</DataTableHeader>
        <DataTableHeader tight alignX="right">Order Total</DataTableHeader>
        <DataTableHeader tight title="reorder"></DataTableHeader>
    </DataTableHead>
    <DataTableBody>
        {data.map(({ date, order, shipTo, status, po, total }) => (
            <DataTableRow key={order}>
                <DataTableCell>
                    <FakeLink>{date}</FakeLink>
                </DataTableCell>
                <DataTableCell>
                    <FakeLink>{order}</FakeLink>
                </DataTableCell>
                <DataTableCell>{shipTo}</DataTableCell>
                <DataTableCell>{status}</DataTableCell>
                <DataTableCell>{po}</DataTableCell>
                <DataTableCell alignX="right">${total}</DataTableCell>
                <DataTableCell>
                    <ReorderButton />
                </DataTableCell>
            </DataTableRow>
        ))}
    </DataTableBody>
</DataTable>
```
