import React from 'react';
import './App.css';

class App extends React.Component{
  // Creating Constructor then throw in props
  constructor(props){
    //create super then throw in props
    super(props);
    // set our state
      this.state = {
        // Few items then set the list to empty list
        todoList:[],
        activeItem:{
          //it has few attributes 
          id:null,
          title:'', //empty string
          completed:false,
        },
        //Lets us know if we are editing an item or submitting an item, we will set editing by default to false
        editing:false,

      } 
      // Here we are binding our function under our state
      //Gives us access to this method in fetch tasks
      this.fetchTasks = this.fetchTasks.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
      this.getCookie = this.getCookie.bind(this)
      this.startEdit = this.startEdit.bind(this)
      this.deleteItem = this.deleteItem.bind(this)
      this.strikeUnstrike = this.strikeUnstrike.bind(this)
      


  };
  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

  //Life cycle method
  componentWillMount(){
    this.fetchTasks()

  }
//Whenever the component above gets called we are going to trigger another function
// Called fetchTasks which is in charge of making API Calls and rendering that data
  fetchTasks(){
    console.log('Fetching...')

    //Use Fetch to actually make those API Calls to the URL for task-list
    //Calling the URL PATH from port
    fetch('http://127.0.0.1:8000/api/task-list/')
    //COnvert the response to json response
    .then(response => response.json())
    .then(data =>
      this.setState({
        todoList:data
      }
        
      )
      )
  }

  handleChange(e){
    var name = e.target.name
    var value = e.target.value
    console.log('Name',name)
    console.log('Value',value)

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
    
      }
    })
  }

  handleSubmit(e){
    e.preventDefault()
    console.log('ITEM', this.state.activeItem)

    var csrftoken = this.getCookie('csrftoken');
 
    // Taking it as base URL
    var url = 'http://127.0.0.1:8000/api/task-create/'

    if(this.state.editing === true){
      url = 'http://127.0.0.1:8000/api/task-update/$ {this.state.activeItem.id}/'
      this.setState({
        editing:false
      })
    
    }


    fetch(url, {
      method:'POST',
      headers:{
        'content-type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify(this.state.activeItem)
    }).then((response) => {
      this.fetchTasks()
      this.setState({
        activeItem:{
         
          id:null,
          title:'', //empty string
          completed:false,
        }

      })
    }).catch(function(error){
      console.log("ERROR",error)

    })
  }

  startEdit(task){
    this.setState({
      activeItem: task,
      editing:true,
    })
  }

  deleteItem(task){
    var csrftoken = this.getCookie('csrftoken');
    
    //Use fetch to send the delete method to our API
    // eslint-disable-next-line no-template-curly-in-string
    fetch('http://127.0.0.1:8000/api/task-delete/ ${task.id}/',{
      method:'DELETE',
      headers:({
        'content-type': 'application/json',
        'X-CSRFToken': csrftoken,

      })

    }).then((response) => {
      this.fetchTasks()
    })

  }

  strikeUnstrike(task){
    
    task.completed = !task.completed
    var csrftoken = this.getCookie('csrftoken');
    // eslint-disable-next-line no-template-curly-in-string
    var url ='http://127.0.0.1:8000/api/task-update/ ${task.id}/'
    

            fetch(url,{
            method:'POST',
            headers:({
              'content-type': 'application/json',
              'X-CSRFToken': csrftoken,
              }),
              body: JSON.stringify({'completed': task.completed,'title':task.title})
}).then(() => {
  this.fetchTasks()
} )

  console.log('TASK',task.completed)  
}

  render(){
    var tasks = this.state.todoList
    var self = this

    return(
      <div className= "container">

        <div id='task-container'>
          
          <div id='form-wrapper'>
            
            <form onSubmit={this.handleSubmit} id='form'>
              <div className="flex-wrapper">
                <div style={{flex:6}}>
                  <input onChange={this.handleChange} className='form-control' id='title' value={this.state.activeItem.title} type='text' name='title' placeholder='Add Task'></input>
                </div>
                <div style={{flex:5}}>
                  <input id='submit' className='btn btn-warning' type='submit' name='title' placeholder='Submit'></input>
                </div>

              </div>
            </form>

          </div>
          <div id='list-wrapper'>
            
            {tasks.map(function(task,index){

              return(
                <div key={index} className='task-wrapper flex-wrapper'>

                  <div onClick= {() => self.strikeUnstrike(task)}  style={{flex:7}}>

                    {task.completed === false ? (
                         <span>{tasks.title}</span>

                    ):(

                      <strike>{tasks.title}</strike>
                    )}
                    

                  </div>
                  <div style={{flex:1}}>
                    <button onClick= {() => self.startEdit(task)} className='btn btn-sm btn-outline-info'>Edit</button>

                  </div>
                  <div style={{flex:1}}>
                    <button onClick= {() => self.deleteItem(task)}className='btn btn-sm btn-outline-dark delete'>-</button>

                  </div>


                </div>
              )
            }
            
            
            )}



          </div>
        </div>

      </div>
    )
  }
}           
                    




export default App;
