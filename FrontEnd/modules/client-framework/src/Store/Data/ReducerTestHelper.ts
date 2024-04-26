import { getDataViewKey, setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";

export class ExpectedState {
    private state: any;

    constructor(initialState: any) {
        this.state = initialState;
    }

    public getState(): any {
        return this.state;
    }

    public resetDataView() {
        this.state.dataView = {};
        return this;
    }

    public addDataViewIsLoading(parameter: object) {
        this.state.dataViews[getDataViewKey(parameter)] = {
            isLoading: true,
            pagination: null,
        };
        return this;
    }

    public addDataViewWithValue(parameter: object, collection: any, valueNames: string[]) {
        let value: any;
        if (valueNames.length === 1) {
            value = collection[valueNames[0]];
        } else {
            value = {};
            for (const name of valueNames) {
                value[name] = collection[name];
            }
        }

        this.state.dataViews[getDataViewKey(parameter)] = {
            isLoading: false,
            value,
            pagination: null,
        };

        return this;
    }

    public resetStateById() {
        this.state.state.byId = {};
        return this;
    }

    public addById(model: any) {
        if (model === undefined) {
            this.resetStateById();
        } else {
            this.state.byId[model.id] = model;
        }
        return this;
    }

    public addIsLoading(id: string) {
        this.state.isLoading[id] = true;
        return this;
    }

    public setStateDataViewLoading(parameter: Record<string, any>) {
        setDataViewLoading(this.state, parameter);
        return this;
    }

    public setStateDataViewLoaded(
        parameter: Record<string, any>,
        collection: any,
        reducerName: string,
        cb?: (value: any) => void,
        extraData?: any,
    ) {
        setDataViewLoaded(
            this.state,
            parameter,
            collection,
            collection => collection[reducerName]!,
            cb,
            (dataView: any) => {
                if (extraData) {
                    for (const key in extraData) {
                        dataView[key] = extraData[key];
                    }
                }
            },
        );
        return this;
    }

    public setStateWithParameter(propertyName: string, parameter: object, value: any) {
        this.state[propertyName][getDataViewKey(parameter)] = value;
        return this;
    }
    public setState(propertyName: string, value: any) {
        this.state[propertyName] = value;
        return this;
    }
}
