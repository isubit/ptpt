import _ from 'lodash';

import tree_csg from './tree_csg.json';

const csgs = Object.keys(tree_csg);
const processed = csgs.reduce((newObj, key) => {
	const arr = tree_csg[key];
	const munged = _
		.flatten(arr)
		.map(ea => ea.replace(/\s$/, ''))
		.filter(ea => ea.length > 0);
	newObj[key] = munged;
	return newObj;
}, {});

console.log(JSON.stringify(
	processed,
	null,
	4
));

// run with quokka