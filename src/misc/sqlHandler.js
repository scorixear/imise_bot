import mariadb from 'mariadb';
import config from '../config';

const pool = mariadb.createPool({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpassword,
  port: config.dbport,
  database: config.dbDataBase,
  multipleStatements: true,
  connectionLimit: 5,
});

/**
 * Initializes the DataBase
 */
async function initDB() {
  let conn;
  try {
    console.log('Start DB Connection');
    conn = await pool.getConnection();
    console.log('DB Connection established');
    await conn.query('CREATE TABLE IF NOT EXISTS `channels` (`id` VARCHAR(255), `replacement` VARCHAR(255), PRIMARY KEY (`id`))');
  } catch (error) {
    throw error;
  } finally {
    if (conn) return conn.end();
  }
}

async function saveChannel(channelId, replacement) {
  let conn;
  let returnValue = true;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT id FROM channels WHERE \`id\` = ${conn.escape(channelId)}`);
    if (rows && rows[0]) {
      await conn.query(`UPDATE channels SET replacement = ${conn.escape(replacement)} WHERE \`id\` = ${conn.escape(channelId)}`);
    } else {
      await conn.query(`INSERT INTO channels (id, replacement) VALUES (${conn.escape(channelId)}, ${conn.escape(replacement)})`);
    }
  } catch (err) {
    returnValue = false;
    console.error(err);
  } finally {
    if (conn) await conn.end();
  }
  return returnValue;
}

async function removeChannel(channelId) {
  let conn;
  let returnValue = true;
  try {
    conn = await pool.getConnection();
    await conn.query(`DELETE FROM channels WHERE id = ${pool.escape(channelId)}`);
  } catch (err) {
    returnValue = false;
    console.error(err);
  } finally {
    if (conn) conn.end();
  }
  return returnValue;
}

/**
 * finds a Channel in the database by id
 * @param {String} channelId channel id
 */
async function findChannel(channelId) {
  let conn;
  let returnValue;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT replacement FROM channels WHERE id = ${pool.escape(channelId)}`);
    if (rows && rows[0]) {
      returnValue = rows[0].replacement;
    }
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
  }
  return returnValue;
}

export default {
  initDB,
  saveChannel,
  removeChannel,
  findChannel,
};
