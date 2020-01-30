const movieSales =
	'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';
// const kickstarterPledges =
// 	'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json';
// const videoGameSales =
// 	'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

const treeWidth = 960,
	treeHeight = 570,
	legendHeight = 10,
	legendWidth = 500;

const treeSVG = d3.select('#treeMap').attr('viewBox', [0, 0, treeWidth, treeHeight]);
const legendSVG = d3.select('#legend');

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

const treemap = d3
	.treemap()
	.size([treeWidth, treeHeight])
	.padding(2);

// =========================
const visualize = data => {
	const nodes = treemap(
		d3
			.hierarchy(data)
			.sum(d => d.value)
			.sort((a, b) => b.height - a.height || b.value - a.value)
	);

	const leaf = treeSVG
		.selectAll('g')
		.data(nodes.leaves())
		.enter()
		.append('g')
		.attr('transform', d => `translate(${d.x0}, ${d.y0})`);

	// Tile properties
	leaf
		.append('rect')
		.attr('class', 'tile')
		.attr('width', d => d.x1 - d.x0)
		.attr('height', d => d.y1 - d.y0)
		.attr('fill', d => {
			let obj = d;
			while (obj.depth > 1) {
				obj = obj.parent;
			}
			return colorScale(obj.data.name);
		})
		.attr('data-name', d => d.data.name)
		.attr('data-category', d => d.data.category)
		.attr('data-value', d => d.data.value);

	// Tile info
	const regex = /(?=\s[A-Za-z])/g;

	leaf
		.append('text')
		.selectAll('tspan')
		.data(d => d.data.name.split(regex).map(d => d.trim()))
		.enter()
		.append('tspan')
		.attr('x', 3)
		.attr('y', (d, i) => 13 + i * 10)
		.text(d => d);
};

d3.json(movieSales, visualize);

/**
 * Chart
 * - My legend should have <rect> elements with a corresponding class="legend-item".
 * - The <rect> elements in the legend should use at least 2 different fill colors.
 *
 * Tool Tip
 * - I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.
 * - My tooltip should have a "data-value" property that corresponds to the "data-value" of the active area.
 *  */
