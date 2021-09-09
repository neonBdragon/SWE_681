import pygame
#from network import Network
from network_ssl import Network
import pickle
pygame.font.init()

width = 700
height = 700
win = pygame.display.set_mode((width, height))
pygame.display.set_caption("Client")


class Button:
    def __init__(self, text, x, y, color):
        if(isinstance(text, str) == False):
            raise ValueError("The text must be of type string!")
        else:
            self.text = text
        if(isinstance(x, (int, float)) == False):
            raise ValueError("The x value must be numeric!")
        else:
            self.x = x
        if(isinstance(y, (int, float)) == False):
            raise ValueError("The y value must be numeric!")
        else:
            self.y = y
        if(isinstance(color[0], int) == False and color[0] <= 255 or isinstance(color[1], int) == False and color[1] <= 255 or isinstance(color[2], int) == False and color[2] <= 255):
            raise ValueError("All values in the tuple must be integers <= 255 for the RGB value")
        else:
            self.color = color
        self.width = 180
        self.height = 100

    def draw(self, win):
        pygame.draw.rect(win, self.color, (self.x, self.y, self.width, self.height))
        font = pygame.font.SysFont("comicsans", 40)
        text = font.render(self.text, 1, (255,255,255))
        win.blit(text, (self.x + round(self.width/2) - round(text.get_width()/2), self.y + round(self.height/2) - round(text.get_height()/2)))

    def click(self, pos):
        x1 = pos[0]
        y1 = pos[1]
        if self.x <= x1 <= self.x + self.width and self.y <= y1 <= self.y + self.height:
            return True
        else:
            return False


def redrawWindow(win, game, p, winner, m1, m2, list1, list2):
    win.fill((128,128,128))

    if not(game.connected()):
        font = pygame.font.SysFont("comicsans", 80)
        text = font.render("Waiting for Player...", 1, (255,0,0), True)
        win.blit(text, (width/2 - text.get_width()/2, height/2 - text.get_height()/2))
    else:
        font = pygame.font.SysFont("comicsans", 60)
        text = font.render(("Value: {}").format(game.randomValue), 1, (0,0,0))
        win.blit(text, (100, 100))
        text = font.render("Your Move", 1, (0, 128,0))
        win.blit(text, (80, 200))
        text = font.render("Opponents", 1, (255, 0, 0))
        win.blit(text, (380, 200))

        move1 = game.get_player_move(0)
        move2 = game.get_player_move(1)
        if game.bothWent():
            text1 = font.render(move1, 1, (0,0,0))
            text2 = font.render(move2, 1, (0, 0, 0))
        else:
            if game.p1Went and p == 0:
                text1 = font.render(move1, 1, (0,0,0))
            elif game.p1Went:
                text1 = font.render("Locked In", 1, (255, 255, 0))
            else:
                text1 = font.render("Waiting...", 1, (255, 255, 255))

            if game.p2Went and p == 1:
                text2 = font.render(move2, 1, (0,0,0))
            elif game.p2Went:
                text2 = font.render("Locked In", 1, (255, 255, 0))
            else:
                text2 = font.render("Waiting...", 1, (255, 255, 255))

        if p == 1:
            win.blit(text2, (100, 350))
            win.blit(text1, (400, 350))
        else:
            win.blit(text1, (100, 350))
            win.blit(text2, (400, 350))

        if(p == 0 and len(list1) == 0):
            for btn in btns:
                btn.draw(win)
        if(p == 0 and len(list1) > 0):
            for btn in btns:
                if(btn.text[0] not in list1):
                    btn.draw(win)
        if(p == 1 and len(list2) == 0):
            for btn in btns:
                btn.draw(win)
        if(p == 1 and len(list2) > 0):
            for btn in btns:
                if(btn.text[0] not in list2):
                    btn.draw(win)
        """
        if(winner == 0 and p == 0 or winner == -1 and p == 0):
            for btn in btns:
                btn.draw(win)
        elif(winner == 1 and p == 1 or winner == -1 and p == 1):
            for btn in btns:
                btn.draw(win)
        else:
            m = ""
            if winner == 0:
                m = m2
            else:
                m = m1
            for btn in btns:
                if(btn.text[0] != m):
                    btn.draw(win)
                    """



    pygame.display.update()


btns = [Button("1*", 50, 400, (0,0,0)), Button("2*", 200, 400, (0,0,0)), Button("3*", 350, 400, (0,0,0)), Button("4*", 500, 400, (0,0,0)), Button("5*", 50, 600, (0,0,0)), Button("6*", 200, 600, (0,0,0)), Button("7*", 350, 600, (0,0,0)), ]
def main():
    run = True
    clock = pygame.time.Clock()
    n = Network()
    player = int(n.getP())
    print("You are player", player)
    winner = -1
    m1 = ""
    m2 = ""
    list1 = []
    list2 = []
    while run:
        clock.tick(60)
        try:
            game = n.send("get")
        except:
            run = False
            print("Couldn't get game")
            break

        if game.bothWent():
            winner = game.winner
            m1 = game.m1
            m1 = game.m2
            list1 = game.m1list
            list2 = game.m2list
            redrawWindow(win, game, player, winner, m1, m2, list1, list2)
            pygame.time.delay(500)
            try:
                game = n.send("reset")
            except:
                run = False
                print("Couldn't get game")
                break

            font = pygame.font.SysFont("comicsans", 90)
            winner, m1, m2, list1, list2, val1, val2 = game.winner()
            #write code to indicate the loser and
            if (winner == 1 and player == 1) or (winner == 0 and player == 0):
                text = font.render("You Won!", 1, (0,128,0))
            elif winner == -1:
                text = font.render("Tie Game!", 1, (255,128,0))
            else:
                text = font.render("You Lost...", 1, (255,0,0))

            win.blit(text, (width/2 - text.get_width()/2, height/2 - text.get_height()/2))

            pygame.display.update()
            if(len(list1) == game.max or len(list2) == game.max):
                text = font.render("Game Over!", 1, (0,128,0))
                win.blit(text, (width/2 - text.get_width()/2, height/2 - text.get_height()/2))
                pygame.display.update()
                pygame.time.delay(4000)
                menu_screen()
            pygame.time.delay(2000)


        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False
                pygame.quit()

            if event.type == pygame.MOUSEBUTTONDOWN:
                pos = pygame.mouse.get_pos()
                for btn in btns:
                    #The game.connected makes it so you can't start until another person joins
                    if btn.click(pos) and game.connected():
                        if player == 0:
                            if not game.p1Went:
                                n.send(btn.text)
                        else:
                            if not game.p2Went:
                                n.send(btn.text)

        redrawWindow(win, game, player, winner, m1, m2, list1, list2)

def menu_screen():
    run = True
    clock = pygame.time.Clock()

    while run:
        clock.tick(60)
        win.fill((128, 128, 128))
        font = pygame.font.SysFont("comicsans", 60)
        text = font.render("Click to Play!", 1, (255,0,0))
        win.blit(text, (100,200))
        pygame.display.update()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                run = False
            if event.type == pygame.MOUSEBUTTONDOWN:
                run = False
                main()



if __name__ == "__main__":
    main()

while True:
    menu_screen()

