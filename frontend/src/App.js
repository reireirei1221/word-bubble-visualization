// WordBubble.js (Continued)
import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import 'bootstrap/dist/css/bootstrap.min.css' // Import Bootstrap CSS

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

        if (Object.keys(wordCounts).length === 0) {
            // If wordCounts is empty, return
            return;
        }

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

            // svgRef.current = svg;
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
            .force('charge', d3.forceManyBody().strength(50))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius((d) => scale(d.count) + 2).strength(3))
            .force('x', d3.forceX().x((d) => width / 2).strength(1))
            .force('y', d3.forceY().y((d) => height / 2).strength(1));

        const wordGroup = svg
            .selectAll('g')
            .data(words)
            .enter()
            .append('g')
            .attr('transform', (d) => `translate(${width / 2},${height / 2})`)
            .call(
                d3.drag().on('start', dragStarted).on('drag', dragging).on('end', dragEnded)
            );

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

        function dragStarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.03).restart();
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragging(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragEnded(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
            simulation.restart()
        }

        simulation.on('tick', () => {
            wordGroup.attr('transform', (d) => `translate(${boundX(d.x)},${boundY(d.y)})`);
        });

        function boundX(x) {
            return Math.max(scale.range()[1], Math.min(width - scale.range()[1], x));
        }

        function boundY(y) {
            return Math.max(scale.range()[1], Math.min(height - scale.range()[1], y));
        }


    }, [wordCounts]);

    return (
        <div>
            <h1>Word Bubble</h1>
            <div id="word-bubble"></div>
        </div>
    );
};

export default WordBubble;
