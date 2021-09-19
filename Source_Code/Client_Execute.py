import pygame
#from network import Network
from network_ssl import Network
import pickle

def main():
    n = Network()
    player = int(n.getP())
    print("You are player", player)

if __name__ == "__main__":
    main()

