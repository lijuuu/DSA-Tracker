import { useState, useEffect } from 'react';
import data from "./additionals.json";
import { Trash2 } from 'lucide-react';

const Additionals = () => {
    const [checkedTasks, setCheckedTasks] = useState({});

    useEffect(() => {
        const savedCheckedTasks = localStorage.getItem('checkedTasks');
        if (savedCheckedTasks) setCheckedTasks(JSON.parse(savedCheckedTasks));
    }, []);

    useEffect(() => {
        localStorage.setItem('checkedTasks', JSON.stringify(checkedTasks));
    }, [checkedTasks]);

    //always use category+title as unique key
    const getTaskKey = (title, category) => `${category}-${title}`;

    const handleCheckboxChange = (title, category) => {
        const key = getTaskKey(title, category);
        setCheckedTasks((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    const calculateTotalProgress = () => {
        let totalTasks = 0;
        let completedTasks = 0;

        Object.entries(data).forEach(([category, tasks]) => {
            totalTasks += tasks.length;
            completedTasks += tasks.filter((task) => checkedTasks[getTaskKey(task.title, category)]).length;
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

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case "Easy":
                return "green";
            case "Medium":
                return "#856404";
            case "Hard":
                return "red";
            default:
                return "blue";
        }
    };

    return (
        <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '16px' }}>
            {/* header */}
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
                        <a style={{ padding: '10px' }} href="/">Basics</a>
                        <a style={{ padding: '10px' }} target='_blank' rel='noopener noreferrer' href="https://zenxbattle.space/playground">Playground</a>
                        <a style={{ padding: '10px' }} target='_blank' rel='noopener noreferrer' href="https://github.com/ashishps1/awesome-leetcode-resources?tab=readme-ov-file">Study Materials</a>
                        <a style={{ padding: '10px' }} target='_blank' rel='noopener noreferrer' href="https://codolio.com/">Check this out: codolio</a>
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

            {/* task categories */}
            {Object.entries(data).map(([category, tasks]) => (
                <div key={category} style={{ marginBottom: '12px' }}>
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
                        {tasks.map((task) => {
                            const key = getTaskKey(task.title, category);
                            return (
                                <div
                                    key={key}
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
                                            checked={checkedTasks[key] || false}
                                            onChange={() => handleCheckboxChange(task.title, category)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <span
                                            style={{
                                                textDecoration: checkedTasks[key] ? 'line-through' : 'none',
                                                color: checkedTasks[key] ? '#999' : '#000',
                                                fontSize: '14px',
                                            }}
                                        >
                                            <a target='_blank' rel='noopener noreferrer' href={task.link}>{task.title}</a>
                                            <span
                                                style={{
                                                    marginLeft: '8px',
                                                    fontSize: '12px',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    backgroundColor: task.site === 'leetcode' ? '#e6f3ff' : '#e6ffe6',
                                                    color: task.site === 'leetcode' ? '#0057d8' : '#008000',
                                                }}
                                            >
                                                {task.site === 'leetcode' ? 'LeetCode' : 'NeetCode'}
                                            </span>
                                            <span
                                                style={{
                                                    marginLeft: '8px',
                                                    fontSize: '12px',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    backgroundColor: task.difficulty === 'Easy' ? '#e6ffe6' : task.difficulty === 'Medium' ? '#fff3cd' : task.difficulty === 'Hard' ? '#ffcccc' : '#e6f3ff',
                                                    color: getDifficultyColor(task.difficulty),
                                                }}
                                            >
                                                {task.difficulty}
                                            </span>
                                        </span>
                                    </label>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}

            {/* footer */}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                    onClick={() => {
                        setCheckedTasks({});
                        localStorage.removeItem('checkedTasks');
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

export default Additionals;
