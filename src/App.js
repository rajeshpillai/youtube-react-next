import React, { Component } from 'react';
import './App.css';

const MyContext = React.createContext();

// Create a Provider
class MyProvider extends Component {
  state = {
    tasks: [
      {id: 1, title: "New React Context API"},
      {id: 2, title: "Learn VueJS"},
      {id: 3, title: "Master NodeJS"},
    ],
    notifications: [
      {taskId: 1, message: "Message 1 TaskID 1"},
      {taskId: 1, message: "Message 2 TaskID 1"},
      {taskId: 2, message: "Message 1 for TaskID 2"},
      
    ]
  }

  addTask = (title) => {
    let maxId = Math.max.apply(Math,
      this.state.tasks.map((task)=>{return task.id}));

    let task = {
      id:  maxId + 1 ,
      title: title
    }

    this.setState({
      tasks: [task, ...this.state.tasks]
    })
  }

  deleteTask = (taskId) => {
    let tasks = this.state.tasks.filter((task) => {
      return task.id !== taskId
    })

    this.setState({
      tasks
    })
  }

  render() {
    return (
      <MyContext.Provider value={{
          state: this.state,
          onAddTask: (task) => this.addTask(task),
          onDeleteTask: (taskId) => this.deleteTask(taskId)
      }}>
          {this.props.children}
      </MyContext.Provider>
    )
  }
}

const TaskApp = () => (
  <React.Fragment>
    <TaskForm />
    <ul className = "task-list">
        <TaskList/>
    </ul>
  </React.Fragment>
)

const TaskForm = () => {
  let taskTitle = React.createRef();
  return  (
    <MyContext.Consumer>
      {(context) => (
        <div>
            <input className="input-title" ref={taskTitle} refxx={(title)=>{this.taskTitle = title}} 
              type="text" placeholder="what do you want to do today?" />
            <button className="button-add" type="submit"
              onClick={(e) => {context.onAddTask(taskTitle.current.value)}}>
              &#x271A;
            </button>
        </div>
      )}
    </MyContext.Consumer>
  )
}

class Notification extends Component{
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return(this.props.children !== nextProps.children);
  }
  componentDidMount() {
    console.log(this.props.context.state.notifications);
  }
  render() {
    console.log("Notifications->render");
    return (
      <h2>{this.props.children}</h2>
    );
  }
}

const TaskList = () => {
  const renderUI = (context) => {
    return context.state.tasks.map((task) => {
      return (
        <li className="task-item" key={task.id}>
          <span>{task.title}</span>
          <button className="todo-delete-button"
            onClick={(e) => context.onDeleteTask(task.id)}>
             &#x274C;
          </button>
        </li>
      )
    })
  }
  return (
    <MyContext.Consumer>
      {(context) => (
          renderUI(context)
      )}
    </MyContext.Consumer>
  )
}

class App extends Component {

  render() {
    return (
      <MyProvider>
        <div className="container">
          <h1>Task Management App</h1>
          <TaskApp />
          <MyContext.Consumer>
            {(context) => (
                <Notification context={context} />
            )}
          </MyContext.Consumer>
        </div>
      </MyProvider>
    );
  }
}

export default App;
