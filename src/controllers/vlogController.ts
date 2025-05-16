import { Request, Response } from 'express';

interface Vlog {
  id: number;
  title: string;
  category: string;
  cover: string;
  createdAt: string;
}

let vlogs: Vlog[] = [
  {
    id: 1,
    title: '第一次旅行',
    category: '旅行',
    cover: 'https://example.com/cover1.jpg',
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    title: '职场日记',
    category: '职场',
    cover: 'https://example.com/cover2.jpg',
    createdAt: '2024-02-01',
  },
];

// 获取全部 vlogs
export const getAllVlogs = (_req: Request, res: Response) => {
  res.json(vlogs);
};

// 根据 ID 获取 vlog
export const getVlogById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const vlog = vlogs.find((v) => v.id === id);
  if (vlog) {
    res.json(vlog);
  } else {
    res.status(404).json({ message: 'Vlog not found' });
  }
};

// 新增 vlog
export const createVlog = (req: Request, res: Response) => {
  const { title, category, cover, createdAt } = req.body;
  const newVlog: Vlog = {
    id: Date.now(),
    title,
    category,
    cover,
    createdAt,
  };
  vlogs.push(newVlog);
  res.status(201).json(newVlog);
};

// 更新 vlog
export const updateVlog = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = vlogs.findIndex((v) => v.id === id);
  if (index !== -1) {
    vlogs[index] = { ...vlogs[index], ...req.body };
    res.json(vlogs[index]);
  } else {
    res.status(404).json({ message: 'Vlog not found' });
  }
};

// 删除 vlog
export const deleteVlog = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = vlogs.findIndex((v) => v.id === id);
  if (index !== -1) {
    const removed = vlogs.splice(index, 1);
    res.json(removed[0]);
  } else {
    res.status(404).json({ message: 'Vlog not found' });
  }
};
