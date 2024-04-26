import merge from "lodash/merge";

/**
 * Recursively merges two objects into the new object
 *
 * @param object1 The first object.
 * @param object2 The second object.
 */
const mergeToNew = <TObject1, TObject2>(object1: TObject1, object2: TObject2): TObject1 & TObject2 => {
    return merge({}, object1, object2);
};

export default mergeToNew;
