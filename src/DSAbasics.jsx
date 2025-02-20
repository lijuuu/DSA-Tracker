import { useState, useEffect } from 'react';
import data from "./dsa.json";
import { Trophy, Timer, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

const DSAbasics = () => {
  const [checkedTasks, setCheckedTasks] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [streak, setStreak] = useState(0);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    const savedCheckedTasks = localStorage.getItem('checkedTasks');
    const savedStartDate = localStorage.getItem('startDate');
    const savedStreak = localStorage.getItem('streak');

    if (savedCheckedTasks) setCheckedTasks(JSON.parse(savedCheckedTasks));
    if (savedStartDate) {
      const parsedDate = new Date(savedStartDate);
      if (!isNaN(parsedDate)) setStartDate(parsedDate);
    } else {
      setStartDate(new Date());
    }
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
  }, []);

  useEffect(() => {
    localStorage.setItem('checkedTasks', JSON.stringify(checkedTasks));
    if (startDate) {
      localStorage.setItem('startDate', startDate.toISOString());
    }
    localStorage.setItem('streak', streak.toString());
  }, [checkedTasks, startDate, streak]);

  const handleCheckboxChange = (taskId) => {
    setCheckedTasks((prevState) => {
      const newState = {
        ...prevState,
        [taskId]: !prevState[taskId],
      };
      setStreak((prev) => (newState[taskId] ? prev + 1 : Math.max(0, prev - 1)));
      return newState;
    });
  };

  const calculateTotalProgress = () => {
    let totalTasks = 0;
    let completedTasks = 0;

    Object.entries(data).forEach(([, tasks]) => {
      totalTasks += tasks.length;
      completedTasks += tasks.filter((task, index) =>
        checkedTasks[`${task}-${index}`]
      ).length;
    });

    return { completed: completedTasks, total: totalTasks };
  };

  const toggleCategory = (category) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  const { completed, total } = calculateTotalProgress();
  const percentage = (completed / total) * 100;

  const getColor = (percent) => {
    const value = percent / 100;
    const red = Math.round((1 - value) * 255);
    const green = Math.round(value * 255);
    return `rgb(${red}, ${green}, 0)`;
  };

  const getDaysElapsed = () => {
    if (!startDate) return 0;
    const diff = new Date() - new Date(startDate);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
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
          <h1 style={{ fontSize: '20px', marginBottom:20 }}>DSA Tracker:  
            <a style={{ padding: '10px' }} target='_blank' href="https://github.com/ashishps1/awesome-leetcode-resources?tab=readme-ov-file">Study Materials</a>
            <a style={{ padding: '10px' }} target='_blank' href="https://xcode.lijuu.me/">Compiler</a>
            <a style={{ padding: '10px' }}  href="/blind75">Blind 75</a>
          </h1>
          <div style={{ fontSize: '14px', color: '#666' }}>
            <Trophy size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Streak: {streak} &nbsp; | &nbsp;
            <Timer size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Day {getDaysElapsed()}
          </div>
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
      {Object.entries(data).map(([category, tasks], index) => (
        <div key={index} style={{ marginBottom: '12px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              backgroundColor: '#f9f9f9',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #eee',
            }}
            onClick={() => toggleCategory(category)}
          >
            <span>{category}</span>
            {expandedCategory === category ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
          {expandedCategory === category && (
            <div style={{ padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>
              {tasks.map((task, index) => (
                <div
                  key={index}
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
                      checked={checkedTasks[`${task}-${index}`] || false}
                      onChange={() => handleCheckboxChange(`${task}-${index}`)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span
                      style={{
                        textDecoration: checkedTasks[`${task}-${index}`] ? 'line-through' : 'none',
                        color: checkedTasks[`${task}-${index}`] ? '#999' : '#000',
                        fontSize: '14px',
                      }}
                    >
                      {task}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button
          onClick={() => {
            setCheckedTasks({});
            setStreak(0);
            localStorage.clear();
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
