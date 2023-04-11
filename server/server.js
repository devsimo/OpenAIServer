import exepress from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENIA_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = exepress();
app.use(cors());
app.use(exepress.json());

app.get('/', async(req, res) =>{
    res.status(200).send({
        message: 'Hello from CodeX',
    })
})

app.post('/', async(req, res) =>{
    try{
        const prompt = req.body.prompt;

        /*const response = await openai.createCompletion({
            "model": "text-davinci-003",
            "prompt": `${prompt}`,
            "temperature": 0.7,
            "max_tokens": 1900,
            "top_p": 1,
            "frequency_penalty": 0.5,
            "presence_penalty": 0
        });*/

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1900
            });
        res.status(200).send({
            bot: response.data.choices[0].message.content
        })

    }catch(error){
        console.log(error);
        res.status(500).send({error});
    }
})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));