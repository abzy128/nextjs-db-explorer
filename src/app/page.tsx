"use client";
import EmployeeTable from './components/EmployeeTable';

const Home: React.FC = () => {
  
  async function simulateCPULoad() {
    await fetch('/api/system');
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Employee List</h1>
        <button onClick={simulateCPULoad}>Simulate CPU load</button>
      </div>
      <EmployeeTable />
    </div>
  );
};

export default Home;
