import { Table, Button, Input, notification } from "antd";
import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { deleteTask } from "../redux/taskSlice";
import { Task } from "../types/task";
import TaskForm from "./task-form";
import moment from "moment";

const priorityValue = (priority: string): number => {
  switch (priority) {
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      return 0;
  }
};

const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const openNotificationWithIcon = (
    type: "success" | "info" | "warning" | "error",
    message: string,
    description: string
  ) => {
    notification[type]({
      message,
      description,
    });
  };

  const handleDelete = (id: number) => {
    dispatch(deleteTask(id));
    openNotificationWithIcon(
      "warning",
      "Task Deleted",
      "Task deleted successfully."
    );
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsAddingTask(false);
  };

  const handleAddNewTask = () => {
    setEditingTask(null);
    setIsAddingTask(true);
  };

  const handleFormFinish = () => {
    setEditingTask(null);
    setIsAddingTask(false);
    if (editingTask) {
      openNotificationWithIcon(
        "info",
        "Task Updated",
        " Task updated successfully."
      );
    } else {
      openNotificationWithIcon(
        "success",
        "Task Added",
        "Task added successfully."
      );
    }
  };

  const filteredAndSortedTasks = useMemo(() => {
    const filteredTasks = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredTasks.sort((a, b) => {
      const dateA = moment(a.dueDate).toDate().getTime();
      const dateB = moment(b.dueDate).toDate().getTime();

      if (dateA === dateB) {
        return priorityValue(b.priority) - priorityValue(a.priority);
      }
      return dateA - dateB;
    });
  }, [tasks, searchTerm]);

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (dueDate: string) => moment(dueDate).format("MMM DD, YYYY"),
      sorter: (a: Task, b: Task) =>
        moment(a.dueDate).toDate().getTime() -
        moment(b.dueDate).toDate().getTime(),
    },
    { title: "Priority", dataIndex: "priority", key: "priority" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      render: (task: Task) => (
        <div className="flex space-x-2">
          <Button
            type="link"
            onClick={() => handleEdit(task)}
            className="text-blue-500 hover:text-blue-700"
          >
            Update
          </Button>
          <Button
            type="link"
            onClick={() => handleDelete(task.id)}
            danger
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Input
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
      />

      {!isAddingTask && !editingTask && (
        <Button
          type="primary"
          onClick={handleAddNewTask}
          className="mb-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 px-4"
        >
          Add New Task
        </Button>
      )}

      {!isAddingTask && !editingTask && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <Table
            dataSource={filteredAndSortedTasks}
            columns={columns}
            rowKey="id"
            className="bg-white rounded-lg"
          />
        </div>
      )}

      {(isAddingTask || editingTask) && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <TaskForm
              initialData={editingTask || undefined}
              onFinish={handleFormFinish}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
