# My Online CV

A visual representation of my skills and experiences.

## Timeline

The Timeline chart is built using the awesome [D3 Visualization Library](http://d3js.org/)

## Underscore.js

[Underscore.js](http://documentcloud.github.com/underscore/) is used for parsing the JSON data before being passed into D3, and the template for the tool tip. 

## Social Icons

The social icons are modified versions of the [Pace Social Icons](http://www.designdeck.co.uk/a/1252)

The icons are combined into a sprite map, and CSS image replacement is used to display them. Media queries are used for presenting a 2X resolution version of the sprite maps to Retina Displays. This combination of Image Replacement and Media Queries means that only one version of the sprite map is downloaded, saving any unnecessary requests.

## Compatibility

This site makes use of inline SVG which is only supported on HTML5 compatible browsers. As such this site is only fully supported on 'Modern' browsers, which generally means everything except IE8 and below. See [Inline SVG in HTML5](http://caniuse.com/svg-html5) for SVG compatibility.

This site has been tested against Chrome, Safari, Firefox, Opera, IE9, iOS, Opera Mobile &amp; Android Browser 3+. 

