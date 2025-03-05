import React from "react";

const TaskPage = async () => {
  const res = await fetch("http://localhost:3000/api/tasks");
  const tasks = await res.json();
  console.log(tasks);
  return (
    <div>
      <h1 className="text-center font-bold mt-4 text-4xl">TaskPage</h1>
    </div>
  );
};

export default TaskPage;
