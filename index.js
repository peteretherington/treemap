const movieSales =
	'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';
// const kickstarterPledges =
// 	'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json';
// const videoGameSales =
// 	'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

const treeWidth = 960,
	treeHeight = 570,
	legendHeight = 80,
	legendWidth = 960;

const treeSVG = d3.select('#treeMap').attr('viewBox', [0, 0, treeWidth, treeHeight]);
const legendSVG = d3.select('#legend').attr('viewBox', [0, 0, legendWidth, legendHeight]);
const tooltip = d3.select('#tooltip');

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

const treemap = d3
	.treemap()
	.size([treeWidth, treeHeight])
	.padding(2);

// =========================
const visualize = data => {
	const genreArray = data.children.reduce((acc, cur) => [...acc, cur.name], []);

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
		.attr('transform', d => `translate(${d.x0}, ${d.y0})`)
		.on('mouseover', d => {
			const info = `
				<span>Title: ${d.data.name}</span>
				<br />
				<span>Box Office: ${d3.format('$,')(d.data.value)}</span>
			`;
			tooltip
				.attr('data-value', d.data.value)
				.style('opacity', 1)
				.style('top', `${d3.event.pageY - 75}px`)
				.style('left', `${d3.event.pageX + 10}px`)
				.html(info);
		})
		.on('mouseout', () => tooltip.style('opacity', 0));

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
		.attr('y', (d, i) => i * 10 + 10)
		.attr('fill', 'white')
		.text(d => d);

	// Legend
	const legend = legendSVG
		.selectAll('g')
		.data(genreArray)
		.enter()
		.append('g');

	const legendTile = 20;

	legend
		.append('rect')
		.attr('class', 'legend-item')
		.attr('width', legendTile)
		.attr('height', legendTile)
		.attr('x', (d, i) => (i < 4 ? i * legendTile * 5 : (i - 4) * legendTile * 5))
		.attr('y', (d, i) => (i < 4 ? 0 : legendTile + 10))
		.attr('fill', d => colorScale(d));

	legend
		.append('text')
		.attr('x', (d, i) =>
			i < 4 ? i * legendTile * 5 + legendTile * 1.25 : (i - 4) * legendTile * 5 + legendTile * 1.25
		)
		.attr('y', (d, i) => (i < 4 ? legendTile / 1.5 : legendTile * 2.25))
		.style('fill', 'white')
		.text(d => d);
};

d3.json(movieSales, visualize);

/**
 * Tool Tip
 * - I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.
 * - My tooltip should have a "data-value" property that corresponds to the "data-value" of the active area.
 *  */
