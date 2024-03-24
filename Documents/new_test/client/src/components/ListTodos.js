import React, { useEffect, useState } from 'react'
import EditTodo from './EditTodo';

const ListTodos = () => {
    const [todos, setTodos] = useState([]);
    const getTodos = async () => {
        try {
            const response = await fetch('http://localhost:8001/todos');
            const data = await response.json();
            setTodos(data);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getTodos();
    }, []);

    const deleteTodo = async id => {
        try {
            await fetch(`http://localhost:8001/todos/${id}`, { method: "DELETE" });
            setTodos(todos.filter(todo => todo.id !== id));
            window.location = '/';
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <>
            <table className="table mt-5 text-center">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {JSON.stringify(todos)}
                </tbody>
            </table>
        </>
    )
}

export default ListTodos