const config = require("config");
const mysql = require("mysql2");

const pool = mysql.createPool({
    host: config.get('db.host'),
    user: config.get('db.user'),
    password: config.get('db.password'),
    database: config.get('db.database')
}).promise();
    
async function getIdentity() {
    const [result] = await pool.query(`
    Select * from contact
    `);

    return result;
};

async function getSingleIdentity(id) {
    const [result] = await pool.query(`
    Select * from contact 
    where id = ?
    `,[id]);

    return result;
}

async function getIdentityByLinkedId(id) {
    const [result] = await pool.query(`
    Select * from contact 
    where linkedId = ?
    `,[id]);

    return result;
}

async function getIdentityByEmail(email) {
    const [result] = await pool.query(`
    Select * from contact 
    where email = ?
    `,[email]);
    return result;
}

async function getIdentityByPhone(phoneNumber) {
    const [result] = await pool.query(`
    Select * from contact 
    where phoneNumber = ?
    `,[phoneNumber]);
    return result;
}

async function getIdentityByEmailPhone(phoneNumber, email) {
    const [result] = await pool.query(`
    Select * from contact 
    where phoneNumber = ?
    and email = ?
    `,[phoneNumber, email]);

    return result;
}

async function createIdentity(phoneNumber, email, linkedId=null, linkPrecedence) {
    const [result] = await pool.query(`
    INSERT INTO contact (phoneNumber, email, linkedId, linkPrecedence) 
    VALUES (?, ?, ?, ?)
    `, [phoneNumber, email, linkedId, linkPrecedence]);

    const newEntity = await getSingleIdentity(result.insertId);

    return newEntity;
}

async function updateIdentity(id, linkedId=null, linkPrecedence, updatedAt) {
    const [result] = await pool.query(`
    UPDATE contact
    SET linkedId = ?, linkPrecedence = ?, updatedAt = ?
    where id = ?
    `, [linkedId, linkPrecedence, updatedAt, id]);

    const updatedEntity = await getSingleIdentity(result.insertId);

    return updatedEntity;
}

module.exports = {
    getIdentity, 
    getSingleIdentity, 
    createIdentity, 
    getIdentityByEmail,
    getIdentityByPhone,
    getIdentityByEmailPhone,
    updateIdentity,
    getIdentityByLinkedId
}