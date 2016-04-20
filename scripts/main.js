var React = require('react');
var ReactDOM = require('react-dom');

/* Store picker component */


var StorePicker = React.createClass({


//rendering HTML
	render : function(){
		return(
			<p>hello</p> 
		)
	}

});

//mount it to the page on page load and put in in the main div

ReactDOM.render(<StorePicker/>, document.querySelector('#main') );


 
