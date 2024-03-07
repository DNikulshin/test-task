export const removeDuplicateItems = (array: never[]): unknown[] => Object.values(array.reduce(
    (acc: { [x: string]: string }, val: { id: string }) => {
        acc[val.id] = Object.assign(acc[val.id] ?? {}, val)
        return acc
    }, {}
))
