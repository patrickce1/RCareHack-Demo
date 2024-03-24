import React, { useState } from 'react'

const InputTodo = () => {
    const [description, setDescription] = useState('');
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const body = { description };
            await fetch('http://localhost:8001/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            window.location = '/';
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <>
            <h1 className="text-center mt-5">Todo List</h1>
            <form className="d-flex mt-5" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="form-control"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <button className="btn btn-info">Add Description</button>
            </form>
        </>
    )
}
export default InputTodo