import _ from 'lodash';
import shortid from 'shortid';

import tree_csg from './tree_csg_raw.json';

// run with quokka

const csgs = Object.keys(tree_csg);
const types = [
	[shortid(), 'hardwood'],
	[shortid(), 'evergreen'],
	[shortid(), 'shrub'],
];
const reverseTypes = types.map(ea => [...ea].reverse());

const classification = csgs.reduce((obj, key) => {
	const typeClassificationMap = obj.type;
	const csgClassificationMap = obj.csg;

	const list = tree_csg[key]
		.map(col => col
			.map(ea => {
				let cleaned = ea.replace(/\s\(.+\)/, ''); // Remove parenthesis notes.
				cleaned = cleaned.replace(/\s\-.+/, ''); // Remove dash notes.
				cleaned = cleaned.replace(/\s$/, ''); // Remove trailing spaces.
				cleaned = cleaned.replace(/E\.\s/, 'Eastern ');
				cleaned = cleaned.replace(/W\.\s/, 'Western ');
				cleaned = cleaned.replace(/N\.\s/, 'Northern ');
				cleaned = cleaned.replace(/S\.\s/, 'Southern ');
				return cleaned;
			})
			.filter(ea => ea.length > 0));


	list.forEach((col, i) => {
		const type = types[i][1];
		const typeList = typeClassificationMap.get(type) || [];
		typeClassificationMap.set(type, [...new Set(typeList.concat(col))]);
	});

	csgClassificationMap.set(key, [...new Set(_.flatten(list))]);

	return obj;
}, {
	type: new Map(),
	csg: new Map(),
});

let all = [];

// Iterate each tree in classification by type (unique by nature) to populate list of all trees.
classification.type.forEach((list, type) => {
	all.push(list.map(ea => ({
		id: shortid(),
		type: new Map(reverseTypes).get(type),
		display: ea,
		csgs: [...classification.csg.keys()].filter(where => classification.csg.get(where).includes(ea)),
	})));
});

all = _.flatten([...all.values()]);

console.log(JSON.stringify(types.map(ea => ({
	id: ea[0],
	value: ea[1],
})), null, 4));
console.log(JSON.stringify(all, null, 4));
