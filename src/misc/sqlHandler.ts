import mariadb from 'mariadb';
import config from '../config';

export default class SqlHandler {
  private pool: mariadb.Pool;
  constructor() {
    this.pool = mariadb.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT??"3306", 10),
      database: process.env.DB_DATABASE,
      multipleStatements: true,
      connectionLimit: 5,
    });
  }

  /**
   * Initializes the DataBase
   */
  public async initDB() {
    let conn;
    try {
      conn = await this.pool.getConnection();
      console.log('DB Connection established');
      await conn.query('CREATE TABLE IF NOT EXISTS `channels` (`id` VARCHAR(255), `replacement` VARCHAR(255), PRIMARY KEY (`id`))');
    } catch (error) {
      throw error;
    } finally {
      if (conn) await conn.end();
    }
  }

  public async saveChannel(channelId: string, replacement: string) {
    let conn;
    let returnValue = true;
    try {
      conn = await this.pool.getConnection();
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

  public async removeChannel(channelId: string) {
    let conn;
    let returnValue = true;
    try {
      conn = await this.pool.getConnection();
      await conn.query(`DELETE FROM channels WHERE id = ${conn.escape(channelId)}`);
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
  public async findChannel(channelId: string) {
    let conn;
    let returnValue;
    try {
      conn = await this.pool.getConnection();
      const rows = await conn.query(`SELECT replacement FROM channels WHERE id = ${conn.escape(channelId)}`);
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
}
