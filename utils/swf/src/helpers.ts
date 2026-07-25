export function getValueAsArray(value: any) {
    if (!value) {
        return [];
    }

    if (value.length) {
        return value;
    }

    return [value];
}
