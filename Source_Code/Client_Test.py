import pygame
#from network import Network
from network_ssl import Network
import pickle
import json

def main():
    run = True
    n = Network()
    player = int(n.getP())
    print("You are player", player)

    while run:
        try:
            game = n.send("get")
        except:
            run = False
            print("Couldn't get game")
            break

        run = game.game_action(n, player, pygame, game)





if __name__ == "__main__":
    main()

