### Styling

```jsx
const Spacer = () => <div style={{display: 'block', height: '32px'}} />;
<>
    <DatePicker
        label="Date"
    />
    <Spacer/>
    <DatePicker
        label="Date (required)"
        required
        dateTimePickerProps={{tileDisabled: ({date}) => {
            const dayNum = date.getDay();
            return dayNum === 0 || dayNum === 6;
        }}}
    />
    <Spacer/>
    <DatePicker
        label="Date (disabled)"
        disabled
        border="underline"
        hint="date hint"
    />
    <Spacer />
    <DatePicker
        label="Date (selected)"
        border="rounded"
        selectedDay={new Date(2019, 8, 12)}
    />
    <Spacer />
    <DatePicker 
        cssOverrides={{formField: 'width: unset; padding-right: 10px;'}}
        month={new Date(2020, 6)}
        border="underline"
        label="From (with days disabled)"
        sizeVariant="small"
        dateTimePickerProps={{
            maxDate: new Date(),
            tileDisabled: ({date}) => {
                const dayNum = date.getDay();
                return dayNum === 0 || dayNum === 6;
            }
        }}
    />
    <DatePicker 
        cssOverrides={{formField: 'width: unset;'}}
        month={new Date(2020, 6)}
        border="underline"
        label="To (fixed weeks)"
        sizeVariant="small"
        dateTimePickerProps={{showFixedNumberOfWeeks: true}}
    />
</>
```

### Date Time Picker
The DatePicker can be used as a date + time picker by passing in a format that contains time, for instance `y-MM-dd h:m a` in the below example.
```jsx
<DatePicker
    label="DateTime"
    format="y-MM-dd h:m a"
/>
```

### Localization
```jsx
<>
    <DatePicker
        label="Date (Italian)"
        locale="it"
        localeObject="it-IT"
        format='d MMM, yy'
        placeholders={{ monthPlaceholder: 'mese' }}
        dateTimePickerProps={{ calendarType: 'ISO 8601' }}
    />
    <div style={{display: 'block', height: '32px'}} />
    <DatePicker
        label="Date (Default)"
    />
</>
```

### Controlled Input

```jsx
const Button = require('../Button').default;
const Typography = require('../Typography').default;

const Spacer = () => <div style={{ width: 50 }} />;
const children = [
            <option key={0} value={0}>Select</option>,
            <option key={1} value={1}>apple</option>,
            <option key={2} value={2}>bananas</option>,
            <option key={3} value={3}>cherries</option>,
];

class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedDay: new Date(2019, 8, 12) };
        this.clearSelect = () => {
            this.handleChange('');
        };
        this.handleChange = ({ selectedDay }) => {
            this.setState({ selectedDay });
        };
    }

    render() {
        return (
            <div style={{ display: 'flex' }}>
                <DatePicker
                    month={new Date(2019, 8)}
                    border="rounded"
                    selectedDay={this.state.selectedDay}
                    onDayChange={this.handleChange}
                />
                <Spacer/>
                <Typography style={{ whiteSpace: 'nowrap' }}>Value: {this.state.selectedDay && this.state.selectedDay.toString()}</Typography>
                <Spacer/>
                <Button onClick={this.clearSelect}>CLEAR</Button>
            </div>
        );
    }
}

<Example />
```