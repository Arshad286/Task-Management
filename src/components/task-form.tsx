import { Form, Input, DatePicker, Select, Button } from "antd";
import { useDispatch } from "react-redux";
import { addTask, updateTask } from "../redux/taskSlice";
import { Task } from "../types/task";
import { v4 as uuidv4 } from "uuid";
import moment, { Moment } from "moment";

interface TaskFormProps {
  initialData?: Task;
  onFinish: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialData, onFinish }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleFinish = (values: Omit<Task, "id"> & { dueDate?: Moment }) => {
    const newTask = {
      id: initialData ? initialData.id : uuidv4(),
      ...values,
      dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : "",
    };
    if (initialData) {
      dispatch(updateTask(newTask));
    } else {
      dispatch(addTask(newTask));
    }
    form.resetFields();
    onFinish();
  };

  const handleClose = () => {
    form.resetFields();
    onFinish();
  };

  return (
    <div className="p-1 bg-white rounded-lg max-w-lg mx-auto">
      <h2 className="text-xl fond-bold text-blue-600 mb-4 text-center">
        {initialData ? "Update Task" : "Add New Task"}
      </h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          ...initialData,
          dueDate: initialData ? moment(initialData.dueDate) : undefined,
        }}
        className="space-y-4"
      >
        <Form.Item name="title" label="Task Title" rules={[{ required: true }]}>
          <Input className="rounded-lg border-gray-300 focus:ring-blue-500" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="dueDate" label="Due Date" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true }]}
        >
          <Select className="rounded-lg border-gray-300">
            <Select.Option value="low">Low</Select.Option>
            <Select.Option value="medium">Medium</Select.Option>
            <Select.Option value="high">High</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select className="rounded-lg border-gray-300">
            <Select.Option value="in-progress">In Progress</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
          </Select>
        </Form.Item>
        <div className="flex space-x-4">
          <Button type="primary" htmlType="submit">
            {initialData ? "Update Task" : "Add Task"}
          </Button>
          <Button type="default" onClick={handleClose}>
            Close
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TaskForm;
