import TaskList from './components/task-list';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center p-4">
      <div className="container max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Task Manager</h1>
        <TaskList />
      </div>
    </div>
  );
};

export default App;
