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
            res.json(jsonData);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
});

app.put('/updatePrompt', async (req, res) => {
    // const { prompt } = req.body;
    // if (!prompt) {
    //     return res.status(400).send('No prompt provided');
    // }

    // const process = spawn('python', ['/Users/user1/documents/test/todo-pern/server/CryptoAgent.py', prompt]);
    // let scriptOutput = "";

    // process.stdout.on('data', (data) => {
    //     scriptOutput += data.toString();
    // });

    // process.stderr.on('data', (data) => {
    //     console.error(`stderr: ${data}`);
    // });

    // process.on('close', (code) => {
    //     console.log(`Exited with code: ${code}`);
    //     res.json({ response: scriptOutput });

    // });
    try {
        const { prompt } = req.body;
        const apiKey = "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";
        const assistantId = "asst_hi8RuTAIkDea4MRzcQ5SE7zl"

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
app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        await pool.query(
            "UPDATE todo SET description = $1 WHERE id = $2", [description, id]);
        res.json("Todo was updated!");
    } catch (err) {
        console.error(err.message);
    }
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