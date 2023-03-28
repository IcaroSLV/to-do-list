import './App.css';
import { useState, useEffect } from 'react'
import {BsFillTrashFill, BsBookmarkCheck, BsBookmarkCheckFill} from "react-icons/bs"

function App() {
  const [tittle, setTittle] = useState("")
  const [time, setTime] = useState("")
  const [todos, setTodos] = useState([])
  const [Loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

      const todo = {
        id : Math.random(),
        tittle,
        time,
        done: false,
      };

      await fetch("http://localhost:5000/todos",{
        method: "POST",
        body: JSON.stringify(todo),
        headers: {
          "Content-type": "application/json",
        }
      })

      

      setTodos((prevStates) => [...prevStates, todo]);

      setTittle("")
      setTime("")

  }

  useEffect( () => {

    const loadData = async() => {
    
    setLoading(true)

    const res = await fetch("http://localhost:5000/todos")
    .then(resp => resp.json())
    .then(data => data)
    .catch(err => console.log(err))

    setTodos(res)
    setLoading(false)

    }

    loadData()
  }, [])

  const handleDelete = async(id) => {

    await fetch("http://localhost:5000/todos/" + id,{
        method: "DELETE",
      })

      setTodos((prevStates) => prevStates.filter((todo) => todo.id !== id))
  }

  const HandleEdit = async(todo) => {
    todo.done = !todo.done

    const data = await fetch("http://localhost:5000/todos" + todo.id,{
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json",
      }
    })

    setTodos((prevStates) => prevStates.map((t) => (t.id === data.id ? t = data : t)))
  }

  return (
    <div className="App">
      <div className="todo-card">
        <div className="todo-header">
          <h1>LISTA DE TAREFAS</h1>
        </div>
        <div className="todo-form">
          <form onSubmit={handleSubmit}>
            <h1>Insira sua nova tarefa:</h1>
            <div className="form-control">
              <label>Digite sua Tarefa:</label>
              <input 
              type="text"
              name="tittle"
              value={tittle || ""}
              placeholder="Qual a tarefa que vai ser feita?"
              onChange={(e) => setTittle(e.target.value)}
              required
              ></input>
            </div>
            <div className="form-control">
              <label>Tempo estimado da tarefa:</label>
              <input 
              type="number"
              name="time"
              value={time || ""}
              placeholder="tempo para a tarefa? (Em Horas)"
              onChange={(e) => setTime(e.target.value)}
              required
              ></input>
            </div>
            <button onSubmit={handleSubmit}>Enviar</button>
          </form>
        </div>
        <div className="todo-list">
          {todos.length === 0 && <div>Não há tarefas!</div>}
          {todos.map((todo) => (
            <div className='todo' key={todo.id}>
              <h3 className={todo.done? "todo-done" : ""}>{(todo.tittle).toUpperCase()}</h3>
              <p>Duração: {todo.time} hora(s)</p>
              <div className='actions'>
                <span>
                <BsFillTrashFill onClick={() => {handleDelete(todo.id)}}/>
                </span>
                <span onClick={() => HandleEdit(todo)}>
                  {todo.done? <BsBookmarkCheckFill/> : <BsBookmarkCheck/>}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
