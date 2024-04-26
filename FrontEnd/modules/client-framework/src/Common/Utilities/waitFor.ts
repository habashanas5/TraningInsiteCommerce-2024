async function waitFor(isDone: () => boolean, waitTimeInMilliseconds = 30000, intervalInMilliseconds = 50) {
    const loopCount = waitTimeInMilliseconds / intervalInMilliseconds;
    let x = 0;
    while (x < loopCount) {
        // wait 30 seconds max
        if (isDone()) {
            return true;
        }
        await wait(intervalInMilliseconds);
        x += 1;
    }

    return false;
}

export const wait = (milliseconds: number) => new Promise(result => setTimeout(result, milliseconds));

export default waitFor;
