const movieSales =
	'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';
// const kickstarterPledges =
// 	'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json';
// const videoGameSales =
// 	'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

const treeWidth = 960,
	treeHeight = 570,
	tile = (legendHeight = 10),
	legendWidth = 500;

const treeSVG = d3.select('#treeMap').attr('viewBox', [0, 0, treeWidth, treeHeight]);
const legendSVG = d3.select('#legend');

const visualize = data => {
	// const moviesArray = data.children.reduce((acc, cur) => [...acc, ...cur.children], []);
	// const genresArray = data.children.reduce((acc, cur) => [...acc, cur.name], []);
	// const valuesArray = moviesArray.map(el => el.value);

	// const minValue = d3.min(moviesArray, obj => obj.value);
	// const maxValue = d3.max(moviesArray, obj => obj.value);

	// const root = d3.hierarchy(data);
	// const treemap = d3.treemap().size([treeWidth, treeHeight]);
	// const nodes = treemap(
	// 	root.sum(d => d.value).sort((a, b) => b.value - a.value)
	// ).descendants();

	const hierarchy = d3
		.hierarchy(data)
		.sum(d => d.value)
		.sort((a, b) => b.value - a.value);

	const treemap = data => d3.treemap().size([treeWidth, treeHeight])(data);

	const root = treemap(hierarchy);

	const leaf = treeSVG
		.selectAll('g')
		.data(root.leaves())
		.append('g')
		.attr('transform', d => `translate(${d.x0}, ${d.y0})`);
};

d3.json(movieSales, visualize);
