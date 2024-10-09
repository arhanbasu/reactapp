import React, { useState, useEffect } from 'react';

const KanbanBoard = () => {
  const [data, setData] = useState([]);
  const [groupBy, setGroupBy] = useState('user');

  const priorityOrder = {Urgent: 4, High: 3, Medium: 2, Low: 1, NoPriority: 0};

  // Fetch data from API
  useEffect(() => {
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then(response => response.json())
      .then(data => {
        console.log(data);  // Check structure again
        setData({ tickets: data.tickets || [], users: data.users || [] });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);
   
  
  

  const handleGroupChange = (e) => {
    setGroupBy(e.target.value);
  };

  // Grouping logic
  const groupedData = () => {
    if (groupBy === 'user') {
      return groupByUser();
    } else {
      return groupByPriority();
    }
  };

  const groupByUser = () => {
    if (!Array.isArray(data.tickets)) return {};
    return data.tickets.reduce((acc, task) => {
      (acc[task.userId] = acc[task.userId] || []).push(task);
      return acc;
    }, {});
  };
  
  

  const groupByPriority = () => {
    if (!Array.isArray(data.tickets)) return {};
    return data.tickets.reduce((acc, task) => {
      const priority = task.priority; // Ensure this matches your data
      (acc[priority] = acc[priority] || []).push(task);
      return acc;
    }, {});
  };
  
  

  return (
    <div>
      <div>
        <label>
          Group by:
          <select value={groupBy} onChange={handleGroupChange}>
            <option value="user">User</option>
            <option value="priority">Priority</option>
          </select>
        </label>
      </div>
      {groupBy === "user" ? (
        <div className="kanban-board">
          {Object.entries(groupByUser())
            .sort(([a], [b]) => a.localeCompare(b)) // Sort users by name
            .map(([userName, tasks]) => (
              <div key={userName} className="kanban-column">
                <h3>{userName}</h3>
                {tasks.map(task => (
                  <div key={task.id} className="kanban-card">
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                  </div>
                ))}
              </div>
            ))}
        </div>
      ) : (
        <div className="kanban-board">
          {Object.entries(groupByPriority())
            .sort(([a], [b]) => priorityOrder[b] - priorityOrder[a]) // Sort by priority in descending order
            .map(([priority, tasks]) => (
              <div key={priority} className="kanban-column">
                <h3>{priority}</h3>
                {tasks.map(task => (
                  <div key={task.id} className="kanban-card">
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
  
  
};

export default KanbanBoard;

