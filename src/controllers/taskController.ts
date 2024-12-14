import { Request, Response, NextFunction } from "express";
import Task from "../models/Task";


export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let search = req.query.search || "";
    let status = req.query.status;
    let sort = req.query.sort || "desc";
    let sortBy = req.query.sortBy || "createdAt";
    let page = Math.max(Number(req.query.page) || 1, 1);
    let limit = Math.max(Number(req.query.limit) || 10, 1);

    const skip = (page - 1) * limit;

    const searchFilter: any = {};

    if (search) {
      searchFilter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }
    if (status) {
      searchFilter.status = { $regex: status, $options: "i" };
    }
    const validSortBy = ["createdAt", "title", "status"];
    const validSort = ["asc", "desc"];
    if (!validSortBy.includes(sortBy as string)) sortBy = "createdAt";
    if (!validSort.includes(sort as string)) sort = "desc";

    const tasks = await Task.find(searchFilter)
      .sort({ [sortBy as string]: sort === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const totalTasks = await Task.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalTasks / limit);
    res.status(200).json({
      data: tasks,
      totalTasks,
      page,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, status, dueDate } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      status,
      dueDate: new Date(dueDate),
    });

    const task = await newTask.save();
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        status,
        dueDate: new Date(dueDate),
      },
      { new: true }
    );

    if (!updatedTask) {
      res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      res.status(404).json({ message: "Task not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
