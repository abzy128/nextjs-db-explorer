import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const defaultPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '7787878',
  port: 5432,
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'employees',
  password: '7787878',
  port: 5432,
});

const ensureTableExists = async () => {
  try {
    const res = await defaultPool.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = 'employees';`);
    console.log(`checking if employees database exists`);
    if (res.rowCount === 0) {
      console.log(`employees database not found, creating it.`);
      await defaultPool.query(`CREATE DATABASE "employees";`);
      console.log(`created database employees`);
    } else {
      console.log(`employees database exists.`);
    }
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL
      )
    `);
  } catch (error) {
    console.error('Error ensuring table exists:', error);
    throw error;
  }
};

export async function GET() {
  try {
    await ensureTableExists();
    console.log("fetching employees");
    const result = await pool.query('SELECT id, name, position, department FROM employees');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureTableExists();
    const body = await request.json();
    const { name, position, department } = body;
    await pool.query('INSERT INTO employees (name, position, department) VALUES ($1, $2, $3)', [name, position, department]);
    return NextResponse.json({ message: 'Employee added successfully' });
  } catch (error) {
    console.error('Error adding employee:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await ensureTableExists();
    const body = await request.json();
    const { id, name, position, department } = body;
    await pool.query('UPDATE employees SET name = $1, position = $2, department = $3 WHERE id = $4', [name, position, department, id]);
    return NextResponse.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureTableExists();
    const body = await request.json();
    const { id } = body;
    await pool.query('DELETE FROM employees WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}