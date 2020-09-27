const express = require('express')

const app = express();

app.get('/', (req,res) => {
	//callback code goes here
	res.send("<h1>Hello World!</h1>")
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


