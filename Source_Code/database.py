"""
Database file for Oracle SQL -
This will connect to a SQL database
to store and manage credentials.
"""

import cx_Oracle
from cx_Oracle import Error
import db_config


def db_connect():
    conn = None
    try:
        conn = cx_Oracle.connect(db_config.user, db_config.pw, db_config.dsn)
        print("Connection to Oracle Database successful, database version: ", conn.version)
    except Error as e:
        print(f"The error '{e}' occurred")

    return conn


def create_db(connection, query):
    pass


def check_credentials(connection, username, password):
    pass


def main():
    db_connect()


if __name__ == '__main__':
    main()
