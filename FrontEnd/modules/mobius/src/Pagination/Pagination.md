### Example
This is an example of a table component that handles pagination. Please note a number of functional considerations: 
* API calls can be used within `onChangePage` and `onChangeResultsPerPage` functions to fetch new data. 
* Note the use of chaining the `onChangePage` function off of the `onChangeResultsPerPage` function to verify presence 
  of new data. If used with `setState`, using the `setState` callback will ensure that your data is accurate.
* Given the ability to change the number of results per page, please ensure that your `onChangeResultsPerPage` function
  modifies the current page if necessary.

```jsx
const DataTable = require('../DataTable').default;
const DataTableHead = require('../DataTable/DataTableHead').default;
const DataTableHeader = require('../DataTable/DataTableHeader').default;
const DataTableBody = require('../DataTable/DataTableBody').default;
const DataTableRow = require('../DataTable/DataTableRow').default;
const DataTableCell = require('../DataTable/DataTableCell').default;
const Link = require('../Link').default;
const Search = require('../Icons/Search').default;
const TextField = require('../TextField').default;

const numberOfResults = 93;

const generateRow = (index) => {
    const arg1 = Math.floor(Math.random() * 100);
    const arg2 = Math.floor(Math.random() * 2) + 1;
    return ({
        invoice: `0${index}0${arg2}0${arg1}`,
        invoiceDate: arg2 === 1 ? '7/20/2020' : '8/14/2019',
        terms: (arg2 * arg1) < 100 ? 'Net 30' : 'Net 60',
        dueDate: (arg2 * arg1) < 50 ? '8/20/2020' : 'Paid',
        address: (arg2 * arg1) < 60 ? 'Edina Warehouse 1' : 'Plymouth Warehouse',
        status: (arg2 * arg1) > 40 ? 'open' : 'overdue',
        invoiceTotal: `${arg1 * arg2}.00`,
        currentBalance: (arg2 * arg1) < 50 ? `${arg1}.00` : '0.00',
    });
}

const items = [];
for(let i = 0; i < 10; i++) { items[i] = generateRow(i) };
const FakeLink = props => <Link href='#' typographyProps={{ size: 13 }} {...props} />;

class PaginatedTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items,
            currentPage: 1,
            resultsPerPage: 10,
        };
        this.changePage = this.changePage.bind(this);
        this.changeNumberOfResultsPerPage = this.changeNumberOfResultsPerPage.bind(this);
    }

    changePage(newPageNumber) {
        const {items, resultsPerPage} = this.state;
        for(let i = (newPageNumber - 1) * resultsPerPage; i < ((newPageNumber + 1) * resultsPerPage); i++) { 
            if (!items[i] && i < numberOfResults) {
                items[i] = generateRow(i);
            }
        }
        this.setState({items, currentPage: newPageNumber});
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
        const data = items.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);
        const paginationComponent = (
            <Pagination 
                resultsPerPage={resultsPerPage}
                resultsCount={numberOfResults}
                currentPage={currentPage}
                resultsPerPageLabel={'Results Per Page'}
                resultsPerPageOptions={[5, 10, 50, 100]}
                onChangeResultsPerPage={this.changeNumberOfResultsPerPage}
                onChangePage={this.changePage}
            />
        )
        return (<>
            {/* note: in the interest of a slightly more concise example, the implementation of the below is not implemented responsively */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <TextField 
                    placeholder="search" 
                    iconProps={{src: Search}}
                    cssOverrides={{formInputWrapper: 'width: 250px', formField: 'width: 250px;'}}
                />
                {paginationComponent}
            </div>
            <DataTable>
                <DataTableHead>
                    <DataTableHeader tight title="Invoice Number">Invoice #</DataTableHeader>
                    <DataTableHeader tight>Invoice Date</DataTableHeader>
                    <DataTableHeader tight>Terms</DataTableHeader>
                    <DataTableHeader tight>Due Date</DataTableHeader>
                    <DataTableHeader>Ship To / Pick Up</DataTableHeader>
                    <DataTableHeader tight>Status</DataTableHeader>
                    <DataTableHeader tight alignX="right">Invoice Total</DataTableHeader>
                    <DataTableHeader tight alignX="right">Current Balance</DataTableHeader>
                </DataTableHead>
                <DataTableBody>
                    {data.map(({ 
                        invoice,
                        invoiceDate,
                        terms,
                        dueDate,
                        address,
                        status,
                        invoiceTotal,
                        currentBalance 
                    }) => (
                        <DataTableRow key={invoice}>
                            <DataTableCell>
                                <FakeLink>{invoice}</FakeLink>
                            </DataTableCell>
                            <DataTableCell>{invoiceDate}</DataTableCell>
                            <DataTableCell>{terms}</DataTableCell>
                            <DataTableCell>{dueDate}</DataTableCell>
                            <DataTableCell>{address}</DataTableCell>
                            <DataTableCell>{status}</DataTableCell>
                            <DataTableCell alignX="right">${invoiceTotal}</DataTableCell>
                            <DataTableCell alignX="right">${currentBalance}</DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTableBody>
            </DataTable>
            {paginationComponent}
        </>)
    }
}

<PaginatedTable />
```