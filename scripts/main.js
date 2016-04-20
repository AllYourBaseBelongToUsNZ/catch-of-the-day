var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');


//load in the React Router
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var createBrowserHistory = require('history/lib/createBrowserHistory');

var App = React.createClass({

	render: function() {

		return(

		<div className="catch-of-the-day">
			
			<div className = "menu">
				<Header tagline="A demo Seafood Market App"/>
			</div>
				<Order/>
				<Inventory/>


		</div>

		)
	}

});

//header component

var Header = React.createClass({

	render : function(){

		console.log(this.props);

		return(

			<header className="top">

				<h1>Catch 
				<span className = "ofThe">
				<span ClassName="of">of</span> 
				<span ClassName="the">the</span> 
				</span>
				day</h1>
				<h3 className="tagline">{this.props.tagline}</h3>


			</header>

		)
	}
});


//inventory component

var Inventory = React.createClass({

	render : function(){

		return(

			<p>Inventory</p>

		)
	}
});

//Order component

var Order = React.createClass({

	render : function(){

		return(

			<p>Order</p>

		)
	}
});

/* Store picker component */


var StorePicker = React.createClass({


//rendering HTML
	render : function(){
		return(
			<form className="store-selector">
				<h2>Please enter a store </h2>
				<input type ="text" ref="storeID" required/>
				<input type = "Submit"/> 
			</form>
		)
	}

});

//not found component

var NotFound = React.createClass({

	render: function(){

		return <h1> 404 - Sorry, These are not the droids you are looking for!
		(Page doesn't exist)</h1>
	}
});

//routing for components
//pass in the history for the routing
var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={StorePicker}/>
    <Route path="/store/:storeId" component={App}/>
    <Route path="*" component={NotFound}/>
  </Router>
)

//mount it to the page on page load and put in in the main div

ReactDOM.render(routes, document.querySelector('#main') );



 
