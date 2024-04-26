type RecursivePartial<Type> = {
    [Property in keyof Type]?: Type[Property] extends (infer PropertyType)[]
        ? RecursivePartial<PropertyType>[]
        : Type[Property] extends object
        ? RecursivePartial<Type[Property]>
        : Type[Property];
};

export default RecursivePartial;
