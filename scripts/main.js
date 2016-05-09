var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');


//load in the React Router
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var createBrowserHistory = require('history/lib/createBrowserHistory');
var History = ReactRouter.History;

var helpers = require('./helpers');

//firebase
var Rebase = require('re-base');
var base = Rebase.createClass('https://lauriedemoapp1.firebaseio.com');
var Catalyst = require('react-catalyst');



var App = React.createClass({

	mixins: [Catalyst.LinkedStateMixin],

    //before it creates the component, populate with anything that is in these fields
    
  getInitialState : function() {
    return {
      fishes : {},
      order : {}
    }
  }, 

  componentDidMount : function() {
    base.syncState(this.props.params.storeId + '/fishes', {
      context : this,
      state : 'fishes'
    });

    var localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);

    if(localStorageRef){

    	//update our component state to reflect what is in local storage

    	this.setState({

    		order: JSON.parse(localStorageRef)
    	});

    }
   
   },



  componentWillUpdate : function(nextProps, nextState){
   
    localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));

  },




  addToOrder: function(key){

  	//add one to the order state otherwise it is just 1

  	this.state.order[key] = this.state.order[key]+1 || 1;

  	//update the state of the order

  	this.setState({order: this.state.order});

  },

    
   //method to add a fish to the state 
   //give all fishes a unique key
    addFish : function(fish){

    	var timestamp = (new Date()).getTime();

    	//update the state object and use the timestamp as unique ID

    	this.state.fishes['fish-' + timestamp] = fish;

    	//set the state

    	this.setState({fishes : this.state.fishes});

    },

  loadSamples : function() {
    this.setState({
      fishes : require('./sample-fishes')
    });
  },

  renderFish: function(key){

  	return <Fish key={key} index = {key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>

  },


	render: function() {

		//loop over every fish in the object
		return(

		<div className="catch-of-the-day">
			
			<div className = "menu">
				<Header tagline="A test app"/>

				<ul ClassName="list-of-fishes">

				  {Object.keys(this.state.fishes).map(this.renderFish)}

				</ul>

			</div>
				<Order fishes={this.state.fishes} order={this.state.order}/>
				<Inventory addFish = {this.addFish} loadSamples = {this.loadSamples} 
				fishes={this.state.fishes} linkState = {this.linkState} />


		</div>

		)
	}

});

//Fish <Fish/>

var Fish = React.createClass({

	onButtonClick : function(){

		console.log("going to add fish", this.props.index);

		var key= this.props.index;

		this.props.addToOrder(key);

	},

	render: function(){

		var details = this.props.details;

		//check if fish is avaliable

		var isAvaliable = (details.status === 'available' ? true: false);

		//if is avaliable, set the button text to be "add to order" otherwise set the button text to sold out

		//if not avaliable - disable the button 
		var buttonText = (isAvaliable ? 'Add to Order' : 'Sold Out');

		return (

			<li className = "menu-fish">
				<img src={details.image} alt={details.name}/>

				<h3 className="fish-name">{details.name}
					<span className="price">{helpers.formatPrice(details.price)}
					</span>
				</h3>
				<p>{details.desc}</p>


				<button disabled={!isAvaliable} onClick={this.onButtonClick}>{buttonText}</button>

			</li>	
		)
	}
})

//create a form to add a fish which can be accessed from anywhere
//<addFishForm>

var AddFishForm = React.createClass({

	createFish : function(event){

		//1. Stop the form from submitting

		event.preventDefault();

		//2.Take the data from the form and create an object

		var fish = {

			name: this.refs.name.value,
			price: this.refs.price.value,
			status: this.refs.status.value,
			desc: this.refs.desc.value,
			image: this.refs.image.value
		}

		//3.Add the fish to the app state.

		this.props.addFish(fish);

		//reset the form after submit

		this.refs.fishForm.reset();

		console.log(fish);
	},

	render: function(){

		return (

		<form className = "fish-edit" ref="fishForm" onSubmit={this.createFish}>

			<input type="text" ref="name" placeholder = "Fish Name" />
			<input type="text" ref="price" placeholder = "Fish Price" />

			<select ref="status">
			 <option value = "avaliable">Fresh</option>
			 <option value = "sold out">Sold Out</option>
			</select>

			<textarea type="text" ref="desc" placeholder = "Description"></textarea>

			<input type="text" ref="image" placeholder = "URL to Image" />

			<button type = "Submit" > + Add Item </button>
		
		</form>

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

	renderInventory : function (key){

		var linkState = this.props.linkState;

		return(

			<div className="fish-edit" key={key}>

				<input type="text" valueLink={linkState('fishes.'+key+'.name')}/>
				<input type="text" valueLink={linkState('fishes.'+key+'.price')}/>
				<select valueLink valueLink={linkState('fishes.'+key+'.status')}>
					<option value = "available">Fresh</option>
					<option value = "unavaliable">Sold Out</option>
				</select>
				<textarea valueLink={linkState('fishes.'+key+'.desc')}/>
				<input type="text" valueLink={linkState('fishes.'+key+'.image')}/>
				<button> Remove Fish </button>
			</div>

			)

	},

	render : function(){

		return(

			<div>
				<h2>Inventory</h2>

				{Object.keys(this.props.fishes).map(this.renderInventory)}

				<AddFishForm {...this.props}/>
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>

			</div>
		)
	}
});

//Order component

var Order = React.createClass({
  renderOrder : function(key) {
    var fish = this.props.fishes[key];
    var count = this.props.order[key];
 
    if(!fish) {
      return <li key={key}>Sorry, fish no longer available!</li>
    }
 
    return (
      <li key ={key}>
        {count}Kgs 
        {fish.name}
        <span className="price">{helpers.formatPrice(count * fish.price)}</span>
      </li>)
  },

	render : function() {
 
 
    var orderIds = Object.keys(this.props.order);
    
    var total = orderIds.reduce((prevTotal, key)=> {
 
      var fish = this.props.fishes[key];
 
      var count = this.props.order[key];
 
      var isAvailable = fish && fish.status === 'available';
 
      if(fish && isAvailable) {
 
        return prevTotal + (count * parseInt(fish.price) || 0);
      }
 
      return prevTotal;
    }, 0);



		return(

			<div className="order-wrap">
				<h2 className="order-title">Your Order</h2>

					<ul className="order">
					{orderIds.map(this.renderOrder)}
						<li ClassName="total">
						<strong>Total:</strong>
						{helpers.formatPrice(total)}
						</li>
					</ul>
			</div>

		)
	}
});

/* Store picker component */


var StorePicker = React.createClass({

//populate storepicker with a push state on the url

mixins : [History],	

goToStore : function(event){

	event.preventDefault();
	//console.log('Submited the form');

	//get the data from the input - go from <storepicker/> to <app/>
	//reference the input anywhere inside of the component

	var storeID = this.refs.storeID.value;

    //change the URL without having to use hashes. Page does not need to be refreshed.

	this.history.pushState(null, '/store/' + storeID);

	//console.log(storeID);


},

//rendering HTML
	render : function(){
		return(
			<form className="store-selector" onSubmit={this.goToStore}>
				<h2>Please enter a store </h2>
				<input type ="text" ref="storeID" defaultValue = {helpers.getFunName()} required/>
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



 
