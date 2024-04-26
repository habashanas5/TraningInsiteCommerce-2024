export default interface LoadedState<T = {}> {
    readonly value?: T;
    readonly isLoading: boolean;
}
