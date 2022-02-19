import { suite } from "uvu";
import * as assert from "uvu/assert";
import { deepMerge } from "../../src/utils/merge";

const MergeSuite = suite("merge suite");

MergeSuite("should merge", () => {
	const a = {
		a: 1,
		b: ["a", "b", "c"],
		c: {
			d: "str",
			e: {
				f: 1,
			},
		},
	};
	const b = {
		a: 2,
		c: {
			d: "new",
			z: [{ a: 1 }],
			e: {
				a: 1,
			},
		},
	};

	const c = {
		a: 2,
		b: ["a", "b", "c"],
		c: {
			d: "new",
			z: [{ a: 1 }],
			e: {
				f: 1,
				a: 1,
			},
		},
	};

	const res = deepMerge(a, b);
	assert.equal(res, c);
});

MergeSuite.run();
