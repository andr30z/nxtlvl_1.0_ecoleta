import express from "express";
import routes from "./routes";
import cors from 'cors';
import path from "path";
import {errors} from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/temp', express.static(path.resolve(__dirname, '..','tmp')));
app.use(errors());

app.listen(3333);