import cx_Oracle
import os
import getpass
from cryptography.fernet import Fernet

# DB password
raw_pw = 'ooneegha'

# random key from key generator
key = Fernet.generate_key()

# cryptography instance using key
fernet = Fernet(key)

# encrypted pw using encoded byte string
encPW = fernet.encrypt(raw_pw.encode())

#--------------------------------------------------------

user = os.environ.get("PYTHON_USER", "bmack4")
dsn = os.environ.get("PYTHON_CONNECT_SSTRING", "artemis.vsnet.gmu.edu:1521/vse18c.vsnet.gmu.edu")
pw = os.environ.get("PYTHON_PASSWORD", fernet.decrypt(encPW).decode())
