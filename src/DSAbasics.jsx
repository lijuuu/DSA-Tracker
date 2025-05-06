import { useState, useEffect } from 'react';
import data from "./dsa.json";
import {  Trash2 } from 'lucide-react';

const DSAbasics = () => {
  const [checkedTasks, setCheckedTasks] = useState({});
  const [startDate, setStartDate] = useState(null);

  useEffect(() => {
    const savedCheckedTasks = localStorage.getItem('checkedTasks');
    const savedStartDate = localStorage.getItem('startDate');

    if (savedCheckedTasks) setCheckedTasks(JSON.parse(savedCheckedTasks));
    if (savedStartDate) {
      const parsedDate = new Date(savedStartDate);
      if (!isNaN(parsedDate)) setStartDate(parsedDate);
    } else {
      setStartDate(new Date());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('checkedTasks', JSON.stringify(checkedTasks));
    if (startDate) {
      localStorage.setItem('startDate', startDate.toISOString());
    }
  }, [checkedTasks, startDate]);

  const handleCheckboxChange = (taskId) => {
    setCheckedTasks((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  const calculateTotalProgress = () => {
    let totalTasks = 0;
    let completedTasks = 0;

    Object.entries(data).forEach(([ ,tasks]) => {
      totalTasks += tasks.length;
      completedTasks += tasks.filter((task, taskIndex) => checkedTasks[`${task}-${taskIndex}`]).length;
    });

    return { completed: completedTasks, total: totalTasks };
  };

  const { completed, total } = calculateTotalProgress();
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  const getColor = (percent) => {
    const value = percent / 100;
    const red = Math.round((1 - value) * 255);
    const green = Math.round(value * 255);
    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '16px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        borderBottom: '1px solid #eee',
        paddingBottom: '8px',
      }}>
        <div>
          <h1 style={{ fontSize: '20px', marginBottom: 20 }}>DSA Tracker:
            <a style={{ padding: '10px' }} href="/additionals">Additionals</a>
            <a style={{ padding: '10px' }} target='_blank' rel='noopener noreferrer' href="https://zenxbattle.space/playground">Playground</a>
            <a style={{ padding: '10px' }} target='_blank' rel='noopener noreferrer' href="https://github.com/ashishps1/awesome-leetcode-resources?tab=readme-ov-file">Study Materials</a>
          </h1>
          
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: getColor(percentage),
          }}>
            {percentage.toFixed(1)}% Complete
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {completed}/{total} Tasks
          </div>
        </div>
      </div>

      {/* Task Categories */}
      {Object.entries(data).map(([category, tasks], catIndex) => (
        <div key={catIndex} style={{ marginBottom: '12px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f9f9f9',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #eee',
            }}
          >
            <span>{category}</span>
          </div>
          <div style={{ padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>
            {tasks.map((task, taskIndex) => (
              <div
                key={taskIndex}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={checkedTasks[`${task}-${taskIndex}`] || false}
                    onChange={() => handleCheckboxChange(`${task}-${taskIndex}`)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span
                    style={{
                      textDecoration: checkedTasks[`${task}-${taskIndex}`] ? 'line-through' : 'none',
                      color: checkedTasks[`${task}-${taskIndex}`] ? '#999' : '#000',
                      fontSize: '14px',
                    }}
                  >
                    {task}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button
          onClick={() => {
            setCheckedTasks({});
            localStorage.removeItem('checkedTasks');
            localStorage.removeItem('startDate');
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          <Trash2 size={16} style={{ marginRight: '4px' }} />
          Reset Progress
        </button>
      </div>
    </div>
  );
};

export default DSAbasics;