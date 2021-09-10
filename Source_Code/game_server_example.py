# Imported libraries
import socket
import ssl

HOST = '127.0.0.1'
PORT = 8082
CERT = '../ssl/public.pem'
KEY = '../ssl/private.pem'
CIPHER = 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384'


def handle(conn):
    print(conn.recv())
    conn.write(b'HTTP/1,1 200 OK\n\n%s' % conn.getperrname()[0].encode())


def main():
    sock = socket.socket()
    sock.bind((HOST, PORT))
    sock.listen(5)

    # Set up SSL variables
    context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    context.load_cert_chain(certfile=CERT, keyfile=KEY)
    context.set_ciphers(CIPHER)

    # Test connection and handle errors
    while True:
        conn = None
        ssock, addr = sock.accept()
        try:
            conn = context.wrap_socket(ssock, server_side=True)
            handle(conn)
        except ssl.SSLError as e:
            print(e)
        finally:
            if conn:
                conn.close()