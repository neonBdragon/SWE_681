import cx_Oracle
import os
import getpass
from cryptography.fernet import Fernet

# DB password
raw_pw = '' #Stored in an encrytpted text and read in for security

# random key from key generator
key = Fernet.generate_key()

# cryptography instance using key
fernet = Fernet(key)

# encrypted pw using encoded byte string
encPW = fernet.encrypt(raw_pw.encode())

#--------------------------------------------------------

# database connection variable mappings
user = os.environ.get("PYTHON_USER", "bmack4")
dsn = os.environ.get("PYTHON_CONNECT_SSTRING", "artemis.vsnet.gmu.edu:1521/vse18c.vsnet.gmu.edu")
pw = os.environ.get("PYTHON_PASSWORD", fernet.decrypt(encPW).decode())
