const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sritel_package',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function INSERT3(table, columns, values) {
    try {
        const [result] = await pool.query(`INSERT INTO ${table} ${columns} VALUES ${values}`);
        console.log(result);
        return result;
    } catch (err) {
        console.error('Error executing INSERT query:', err);
        throw err;
    }
}

async function UPDATE3(query) {
    try {
        const [result] = await pool.query(query);
        console.log(result);
        return result;
    } catch (err) {
        console.error('Error executing UPDATE query:', err);
        throw err;
    }
}

async function DELETE3(query) {
    try {
        const [result] = await pool.query(query);
        console.log(result);
        return result;
    } catch (err) {
        console.error('Error executing DELETE query:', err);
        throw err;
    }
}

async function SELECT3(table) {
    try {
        const [rows] = await pool.query(`SELECT * FROM ${table}`);
        return rows;
    } catch (err) {
        console.error('Error executing SELECT query:', err);
        throw err;
    }
}

async function SELECT_WHERE3(table, column, value) {
    try {
        const [rows] = await pool.query(`SELECT * FROM ${table} WHERE ${column} = ?`, [value]);
        return rows;
    } catch (err) {
        console.error('Error executing SELECT_WHERE query:', err);
        throw err;
    }
}

async function QUERY3(query) 
{
    try {
        const [result] = await pool.query(query);
        return result;
    } catch (err) {
        console.error('Error executing QUERY:', err);
        throw err;
    }
}

module.exports = { INSERT3, UPDATE3, DELETE3, SELECT3, SELECT_WHERE3, QUERY3 };