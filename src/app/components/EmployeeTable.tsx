"use client";
import React, { useEffect, useState } from 'react';

type Employee = {
  id: number;
  name: string;
  position: string;
  department: string;
};

const EmployeeTable: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Employee>>({});

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data: Employee[] = await response.json();
      setEmployees(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = form.id ? 'PUT' : 'POST';
      const response = await fetch('/api/employees', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error('Failed to save employee');
      }
      setForm({});
      fetchEmployees();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch('/api/employees', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }
      fetchEmployees();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Name"
          value={form.name || ''}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="Position"
          value={form.position || ''}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
          required
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="Department"
          value={form.department || ''}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          required
          style={{ marginRight: '10px' }}
        />
        {form.id && <input type="hidden" value={form.id} />}
        <button type="submit">{form.id ? 'Update' : 'Add'}</button>
      </form>

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Position</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Department</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{employee.id}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{employee.name}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{employee.position}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{employee.department}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                <button onClick={() => setForm(employee)} style={ {marginRight: '10px'}}>Edit</button>
                <button onClick={() => handleDelete(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;