export function deepMerge(
	obj1: Record<string, unknown>,
	obj2: Record<string, unknown>
): Record<string, unknown> {
	let result: Record<string, unknown> = {};
	for (let [k, v] of Object.entries(obj1)) {
		if (obj2.hasOwnProperty(k)) {
			if (
				typeof v === "string" ||
				typeof v === "number" ||
				typeof v === "undefined"
			) {
				result[k] = obj2[k];
			} else {
				result[k] = deepMerge(obj1[k] as Record<string, unknown>, obj2[k] as Record<string, unknown>);
			}
		} else {
			result[k] = obj1[k];
		}
	}
	for (let [k, v] of Object.entries(obj2)) {
		if (obj1.hasOwnProperty(k)) {
			if (
				typeof v === "string" ||
				typeof v === "number" ||
				typeof v === "undefined"
			) {
				if (!result[k]) result[k] = obj1[k];
			} else {
				result[k] = deepMerge(obj1[k] as Record<string, unknown>, obj2[k] as Record<string, unknown>);
			}
		} else {
			result[k] = obj2[k];
		}
	}
	return result;
}
