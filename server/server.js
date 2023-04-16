import exepress from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENIA_API_KEY,
});

function logAPICalls(req, res, next) {

    const requestDate = new Date();
    const requestMethod = req.method;
    const requestUrl = req.originalUrl;
    const requestBody = req.body;
    const requestHeaders = req.headers;

    res.on('finish', () => {
        const responseDate = new Date();
        const responseStatus = res.statusCode;
        const responseBody = res.locals.data;

        const logData = {
            requestDate,
            requestMethod,
            requestUrl,
            requestBody,
            requestHeaders,
            responseDate,
            responseStatus,
            responseBody,
        };

        const logDataString = JSON.stringify(logData);

        console.log('API Response:', logDataString);

        const year = responseDate.getFullYear();
        const month = (responseDate.getMonth() + 1).toString().padStart(2, '0');
        const day = responseDate.getDate().toString().padStart(2, '0');

        fs.appendFile(`logs/${year}${month}${day}.log`, logDataString + '\n', (err) => {
            if (err) {
                console.error(err);
            }
        });
    });

    next();
}

const openai = new OpenAIApi(configuration);

const app = exepress();
app.use(cors());
app.use(exepress.json());
app.use(logAPICalls);

app.get('/', async(req, res) =>{
    res.status(200).send({
        message: 'Hello from Education Simulator',
    })
})

app.post('/', async(req, res) =>{
    try{
        const prompt = req.body.prompt;

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1900
            });

        res.locals.data = response.data.choices[0].message.content;
        res.status(200).send({
            bot: res.locals.data
        })

    }catch(error){
        console.log(error);
        res.status(500).send({error});
    }
})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));