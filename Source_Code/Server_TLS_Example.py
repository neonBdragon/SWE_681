#Imported classes and packages
import socket
from socket import AF_INET, SOCK_STREAM, SO_REUSEADDR, SOL_SOCKET, SHUT_RDWR
import ssl
from _thread import *
from Player import Player
import pickle
import sys
from game import Game
import os


# Variables for server IP, open port number, location of server/client certs and keys
server = '127.0.0.1'
port = 8082
server_cert = 'server.crt'
server_key = 'server.key'
client_certs = 'client.crt'

# Variables for creating SSL/TLS connection
context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
context.verify_mode = ssl.CERT_REQUIRED
context.load_cert_chain(certfile=server_cert, keyfile=server_key)
context.load_verify_locations(cafile=client_certs)

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)


# Error handling for binding socket for connection
try:
    s.bind((server, port))
except socket.error as e:
    print(str(e))


s.listen(2)
print("Waiting for a connection, Server Started")


connected = set()
games = {}
idCount = 0


def threaded_client(conn, p, gameId):
    global idCount
    conn.send(str.encode(str(p)))

    reply = ""
    while True:
        try:
            data = conn.recv(4096).decode()

            if gameId in games:
                game = games[gameId]

                if not data:
                    break
                else:
                    if data == "reset":
                        game.resetWent()
                    elif data != "get":
                        game.play(p, data)

                    conn.sendall(pickle.dumps(game))
            else:
                break
        except:
            break

    print("Lost connection")
    try:
        del games[gameId]
        print("Closing Game", gameId)
    except:
        pass
    idCount -= 1
    conn.close()



while True:
    newsocket, addr = s.accept()
    conn = context.wrap_socket(newsocket, server_side=True)
    print("Connected to:", addr)

    idCount += 1
    p = 0
    gameId = (idCount - 1)//2
    if idCount % 2 == 1:
        games[gameId] = Game(gameId)
        print("Creating a new game...")
    else:
        games[gameId].ready = True
        p = 1


    start_new_thread(threaded_client, (conn, p, gameId))