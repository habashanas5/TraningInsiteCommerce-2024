import { useEffect, useState } from "react";

const enterKey = 13;

const useAccessibleSubmit = (value: string, onSubmit: (value: string) => void, cartLoadedTime?: number) => {
    const [stateValue, setValue] = useState(value);
    const changeHandler = (event: any) => {
        setValue(event.currentTarget.value);
    };

    const keyDownHandler = (event: any) => {
        if (event.keyCode === enterKey) {
            event.stopPropagation();
            onSubmit(stateValue);
        }
    };

    const blurHandler = () => {
        if (value !== String(stateValue)) {
            onSubmit(stateValue);
        }
    };

    useEffect(() => {
        setValue(value);
    }, [value, cartLoadedTime]);

    return {
        value: stateValue,
        changeHandler,
        keyDownHandler,
        blurHandler,
    };
};

export default useAccessibleSubmit;
