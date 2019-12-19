import _ from 'lodash';

import tree_csg from './tree_csg_raw.json';

// run with quokka

const csgs = Object.keys(tree_csg);
const processed = csgs.reduce((newObj, key) => {
	const arr = tree_csg[key]
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

	newObj.all = newObj.all || {};
	arr.forEach((col, index) => {
		let type;
		switch (index) {
			case 0:
				type = 'hardwood';
				break;
			case 1:
				type = 'evergreen';
				break;
			case 2:
				type = 'shrub';
				break;
			default:
		}
		newObj.all[type] = [...new Set((newObj.all[type] || []).concat(col))];
	});

	newObj[key] = _.flatten(arr);

	return newObj;
}, {});

// processed trees csg
console.log('CSG:', JSON.stringify(
	processed,
	null,
	4
));

// all trees
console.log('All:', JSON.stringify(
	processed.all,
	null,
	4
));