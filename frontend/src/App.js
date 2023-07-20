// WordBubble.js (Continued)
import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

const WordBubble = () => {
    const [wordCounts, setWordCounts] = useState({});
    const svgRef = useRef(null);

    useEffect(() => {
        // Fetch word counts from the backend
        fetch('http://localhost:5000/wordCounts')
            .then((response) => response.json())
            .then((data) => setWordCounts(data))
            .catch((error) => console.error('Error fetching word counts:', error));
    }, []);

    useEffect(() => {
        // D3.js code to render the word bubble based on the wordCounts data
        const width = 500;
        const height = 300;

        let svg;
        if (svgRef.current) {
            svg = d3.select(svgRef.current);
            svg.selectAll('*').remove();
        } else {
            svg = d3
                .select('#word-bubble')
                .append('svg')
                .attr('width', width)
                .attr('height', height);
        }

        // const svg = d3
        //     .select('#word-bubble')
        //     .append('svg')
        //     .attr('width', width)
        //     .attr('height', height);

        // Assuming wordCounts is an object with words as keys and counts as values
        const words = Object.keys(wordCounts).map((word) => ({
            word,
            count: wordCounts[word],
        }));

        const scale = d3.scaleLinear().domain([0, d3.max(words, (d) => d.count)]).range([10, 50]);

        const simulation = d3
            .forceSimulation(words)
            .force('charge', d3.forceManyBody().strength(5))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius((d) => scale(d.count) + 2));

        const wordGroup = svg
            .selectAll('g')
            .data(words)
            .enter()
            .append('g')
            .attr('transform', (d) => `translate(${width / 2},${height / 2})`);

        wordGroup
            .append('circle')
            .attr('r', (d) => scale(d.count))
            .style('fill', 'lightblue');

        wordGroup
            .append('text')
            .text((d) => d.word)
            .attr('text-anchor', 'middle')
            .attr('dy', '.3em')
            .style('font-size', (d) => scale(d.count) * 3 / (d.word).length + 'px')
            .style('fill', 'white');

        simulation.on('tick', () => {
            wordGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
        });
    }, [wordCounts]);

    return (
        <div>
            <h1>Word Bubble Visualization</h1>
            <div id="word-bubble"></div>
        </div>
    );
};

export default WordBubble;
