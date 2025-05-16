import express from 'express';
import vlogRoutes from './routes/vlog';

const app = express();

app.use(express.json()); // 解析 JSON 请求
app.use('/api/vlogs', vlogRoutes);

export default app;