import socket
import pickle
import ssl


# Network class for defining a network object for each client
class Network:
    def __init__(self):
        self.server_sni_hostname = 'example.com'
        self.server_cert = 'server.crt'
        self.client_cert = 'client.crt'
        self.client_key = 'client.key'
        self.client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.context = ssl.create_default_context(ssl.Purpose.SERVER_AUTH, cafile=self.server_cert)
        self.context.load_cert_chain(certfile=self.client_cert, keyfile=self.client_key)
        self.server = "127.0.0.1"
        self.port = 8082
        self.client = self.context.wrap_socket(self.client, server_side=False, server_hostname=self.server_sni_hostname)
        self.addr = (self.server, self.port)
        self.p = self.connect()

# Return an integer of 0 or 1 to indicate player 1 or 2.
    def getP(self):
        return self.p
# Creating a client/server connection for the game.
    def connect(self):
        try:
            self.client.connect(self.addr)
            return self.client.recv(2048).decode()
        except:
            pass



    def send(self, data):
        try:
            self.client.send(str.encode(data))
            return pickle.loads(self.client.recv(2048*2))
        except socket.error as e:
            print(e)


