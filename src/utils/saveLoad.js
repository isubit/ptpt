// import download from 'js-file-download';
// import calcCentroid from '@turf/centroid';

export const save = data => {
	const date = new Date();
	const contents = JSON.stringify({
		data,
		date,
		version: '1.0',
	}, (name, val) => {
		if (val instanceof Map) {
			return [...val.entries()];
		}
		return val;
	}, 4);

	window.localStorage && localStorage.setItem('data', contents);
	return {
		contents,
		date,
	};
};

export const load = async files => {
	function readFile(file) {
		return new Promise(resolve => {
			const fr = new FileReader();
			fr.onload = e => resolve(e.target.result);
			fr.readAsText(file);
		});
	}

	if (files[0]) {
		try {
			const contents = await readFile(files[0]);
			console.log(contents);
			const parsed = JSON.parse(contents);
			const data = new Map(parsed.data);

			return data;
		} catch (e) {
			console.warn('File is corrupted:', e);
			return false;
		}
	} else {
		console.warn('No file data.');
		return false;
	}
};
