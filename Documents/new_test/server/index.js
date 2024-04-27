const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const fs = require('fs');
const path = require('path')

//middleware
app.use(cors());
app.use(express.json());

//ROUTES


//get all todos
app.get('/todos', (req, res) => {
    // Read the JSON file
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        try {
            // Parse JSON data
            const jsonData = JSON.parse(data);

            // Respond with the JSON data
            console.log(jsonData)
            res.json(jsonData["test"]["data2"])
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
});

app.put('/updatePrompt', async (req, res) => {

    try {
        const { prompt } = req.body;
        const apiKey = "sk-proj-68iXw6nW2k2urdG2OPDyT3BlbkFJEgTWxEb1rnjauCK4q15h";
        const assistantId = "asst_zK2j7F9qcdplZ5INAItUyn8j"

        console.log("step1");

        // Create a thread
        let threadResponse = await fetch('https://api.openai.com/v1/beta/threads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({})
        });
        const threadData = await threadResponse.json();
        const threadId = threadData.id;
        console.log("step1");
        // Create a message
        await fetch('https://api.openai.com/v1/beta/threads/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                thread_id: threadId,
                role: "user",
                content: prompt
            })
        });
        console.log("step1");
        // Run
        let runResponse = await fetch('https://api.openai.com/v1/beta/threads/runs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                thread_id: threadId,
                assistant_id: assistantId
            })
        });
        const runData = await runResponse.json();
        const runId = runData.id;
        console.log("step1");
        // Check status and wait for completion
        let status = 'pending';
        let timeout = 60000; // Timeout in milliseconds (adjust as needed)
        const startTime = Date.now();
        console.log("runID and threadid", runId, "///", threadId);
        while (status !== 'completed' && (Date.now() - startTime) < timeout) {
            console.log("1.1");
            let statusResponse = await fetch(`https://api.openai.com/v1/beta/threads/runs/${runId}?thread_id=${threadId}`, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            console.log("1.2");
            const statusData = await statusResponse.json();
            status = statusData.status;
            console.log(status)
            await new Promise(resolve => setTimeout(resolve, 2000)); // wait for 2 seconds
            console.log("1.4");
        }
        console.log("step5");
        // Get response
        let responseRequest = await fetch(`https://api.openai.com/v1/beta/threads/messages?thread_id=${threadId}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        const responseData = await responseRequest.json();
        if (responseData.data && responseData.data.length > 0) {
            res.json({ response: responseData.data[0].content.text[0].value });
        } else {
            res.json({ response: '' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//////////////////////////////////////////////////////
//Create a todo
app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]
        );
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});



//get single todo
app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE id = $1", [id]);
        res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//update a todo
app.put("/stable", async (req, res) => {
    const editJsonFile = (filePath, prompt, callback) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading JSON file:', err);
                return callback(err);
            }

            try {
                // Parse JSON data
                const jsonData = JSON.parse(data);

                // Modify the data (for example, add or update a property)
                jsonData.someKey = prompt; // Adjust this line according to your JSON structure

                // Convert back to JSON string
                const updatedJsonData = JSON.stringify(jsonData, null, 2); // Optionally, use null and 2 for pretty-printing

                // Write the updated JSON data back to the file
                fs.writeFile(filePath, updatedJsonData, 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing JSON file:', err);
                        return callback(err);
                    }

                    // Callback with no error
                    callback(null);
                });
            } catch (error) {
                console.error('Error parsing JSON:', error);
                return callback(error);
            }
        });
    }

    const filePath = 'data.json';
    const { prompt } = req.body;
    editJsonFile(filePath, prompt, (err) => {
        if (err) {
            console.error('Error editing JSON file:', err);
            res.status(500).json({ error: 'Internal Server Error' }); // Send appropriate error response
        } else {
            console.log('JSON file edited successfully');
            res.json({ response: prompt }); // Send success response
        }
    });
});

//delete a todo
app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM todo WHERE id = $1", [id]);
        res.json("Todo was deleted!");
    } catch (err) {
        console.log(err.message);
    }
});


app.listen(8001, () => {
    console.log("server has started on port 8001");
});