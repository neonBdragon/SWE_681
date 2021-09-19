import random
from button import Button
import pygame


class Game:
    height = 700
    width = 700
    winner = -1
    m1list = []
    m2list = []
    max = -1
    m1 = ""
    m2 = ""
    win = pygame
    list = [1,2,3,4,5,6]
    RandomValue = -1
    operationList = ['*','/','%','+','-']
    operation = ""
    btns = [Button("1*", 50, 400, (0,0,0)), Button("2*", 200, 400, (0,0,0)), Button("3*", 350, 400, (0,0,0)), Button("4*", 500, 400, (0,0,0)), Button("5*", 50, 600, (0,0,0)), Button("6*", 200, 600, (0,0,0)), Button("7*", 350, 600, (0,0,0)), ]
    def __init__(self, id):
        self.p1Went = False
        self.p2Went = False
        self.ready = False
        if(isinstance(id, int) == False and (id != 0 or id != 1)):
            raise ValueError("The value must be an integer equal to 0 or 1")
        else:
            self.id = id
        self.moves = [None, None]
        self.wins = [0,0]
        self.ties = 0
        """
        self.A = ["A", random.choice(self.list)]
        self.list.remove(self.A[1])
        self.B = ["B", random.choice(self.list)]
        self.list.remove(self.B[1])
        self.C = ["C", random.choice(self.list)]
        self.list.remove(self.C[1])
        self.D = ["D", random.choice(self.list)]
        self.list.remove(self.D[1])
        self.E = ["E", random.choice(self.list)]
        self.list.remove(self.E[1])
        self.F = ["F", random.choice(self.list)]
        self.list.remove(self.F[1])
        self.G = ["G", random.choice(self.list)]
        self.list.remove(self.G[1])
        """
        self.A = ["1", 1]
        self.B = ["2", 2]
        self.C = ["3", 3]
        self.D = ["4", 4]
        self.E = ["5", 5]
        self.F = ["6", 6]
        self.G = ["7", 7]
        self.list2 = [self.A, self.B, self.C, self.D, self.E, self.F, self.G]
        self.randomValue = random.choice(self.list)
        self.operation = random.choice(self.operationList)
        self.max = len(self.list2) - 1

    def get_player_move(self, p):
        """
        :param p: [0,1]
        :return: Move
        """
        return self.moves[p]

    def get_operation(self):
        return self.operation

    def play(self, player, move):
        self.moves[player] = move
        if player == 0:
            self.p1Went = True
        else:
            self.p2Went = True

    def connected(self):
        return self.ready

    def bothWent(self):
        return self.p1Went and self.p2Went

    def winner(self):

        p1 = self.moves[0].upper()[0]
        p2 = self.moves[1].upper()[0]
        val1 = 0
        val2 = 0
        for i in self.list2:
            if p1 in i[0]:
                val1 = i[1]
                break
        for i in self.list2:
            if p2 in i[0]:
                val2 = i[1]
                break
        winner = -1
        if self.operation == '*':
            val1 = val1 * self.randomValue
            val2 = val2 * self.randomValue
        elif self.operation == '/':
            val1 = val1 / self.randomValue
            val2 = val2 / self.randomValue
        elif self.operation == '%':
            val1 = val1 % self.randomValue
            val2 = val2 % self.randomValue
        elif self.operation == '+':
            val1 = val1 + self.randomValue
            val2 = val2 + self.randomValue
        elif self.operation == '-':
            val1 = val1 - self.randomValue
            val2 = val2 - self.randomValue
        else:
            print("This value is not in the list!!!")

        if val1 > val2:
            winner = 0
        elif val2 > val1:
            winner = 1
        else:
            winner = -1
        """
        if p1 == "T" and p2 == "F":
            winner = 0
        elif p1 == "F" and p2 == "T":
            winner = 1
        elif p1 == "F" and p2 == "S":
            winner = 0
        elif p1 == "S" and p2 == "F":
            winner = 1
        elif p1 == "S" and p2 == "T":
            winner = 0
        elif p1 == "T" and p2 == "S":
            winner = 1
        """
        self.winner = winner
        if winner == 0:
            self.m2list.append(p2)
            print(self.m2list)
        if winner == 1:
            self.m1list.append(p1)
            print(self.m1list)
        self.m1 = p1
        self.m2 = p2

        return winner, p1, p2, self.m1list, self.m2list, val1, val2

    def resetWent(self):
        self.p1Went = False
        self.p2Went = False

    def redrawWindow(self, win, p, winner, m1, m2, list1, list2, pygame, game):
        win.fill((128,128,128))

        if not(game.connected()):
            font = pygame.font.SysFont("comicsans", 80)
            text = font.render("Waiting for Player...", 1, (255,0,0), True)
            win.blit(text, (self.width/2 - text.get_width()/2, self.height/2 - text.get_height()/2))
        else:
            font = pygame.font.SysFont("comicsans", 60)
            text = font.render(("Value: {} {}").format(self.randomValue, self.operation), 1, (0,0,0))
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
                for btn in game.btns:
                    btn.draw(win)
            if(p == 0 and len(list1) > 0):
                for btn in game.btns:
                    if(btn.text[0] not in list1):
                        btn.draw(win)
            if(p == 1 and len(list2) == 0):
                for btn in game.btns:
                    btn.draw(win)
            if(p == 1 and len(list2) > 0):
                for btn in game.btns:
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

    def menu_screen(self, n, player, pygame, game, win):
        run = True
        clock = pygame.time.Clock()
        while run:
            clock.tick(60)
            self.win = win
            self.win.fill((128, 128, 128))
            font = pygame.font.SysFont("comicsans", 60)
            text = font.render("Click to Play!", 1, (255,0,0))
            self.win.blit(text, (100,200))
            pygame.display.update()

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    run = False
                if event.type == pygame.MOUSEBUTTONDOWN:
                    run = False
                    #game = n.send("reset")
                    run2 = True
                    game = n.send("resetAllVal")
                    game.game_start(run2, n)



    def game_start(self, run2, n):
        player = int(n.getP())
        print("You are player", player)
        pygame.font.init()
        width = 700
        height = 700
        #self.win = pygame.display.set_mode((width, height))
        while run2:
            try:
                game = n.send("get")
            except:
                run = False
                print("Couldn't get game")
                break

            run = game.game_action(n, player, pygame, game)


    def game_action(self, n, player, pygame, game):

        run = True
        clock = pygame.time.Clock()
        pygame.font.init()
        width = 700
        height = 700
        win = pygame.display.set_mode((width, height))
        pygame.display.set_caption("Client")
        self.win = win
        winner = -1
        m1 = ""
        m2 = ""
        list1 = []
        list2 = []
        clock.tick(60)
        print(game.connected())
        if game.bothWent():
            winner = game.winner
            m1 = game.m1
            m2 = game.m2
            list1 = game.m1list
            list2 = game.m2list
            try:
                game = n.send("reset")
            except:
                run = False
                print("Couldn't get game")
            game.redrawWindow(self.win, player, winner, m1, m2, list1, list2, pygame, game)
            pygame.time.delay(500)
            font = pygame.font.SysFont("comicsans", 90)
            winner, m1, m2, list1, list2, val1, val2 = game.winner()
            #write code to indicate the loser and
            if (winner == 1 and player == 1) or (winner == 0 and player == 0):
                text = font.render("You Won!", 1, (0,128,0))
            elif winner == -1:
                text = font.render("Tie Game!", 1, (255,128,0))
            else:
                text = font.render("You Lost...", 1, (255,0,0))

            self.win.blit(text, (self.width/2 - text.get_width()/2, self.height/2 - text.get_height()/2))

            pygame.display.update()
            if(len(list1) == game.max or len(list2) == game.max):
                game.m1list = []
                game.m2list = []
                text = font.render("Game Over!", 1, (0,128,0))
                self.win.blit(text, (self.width/2 - text.get_width()/2, self.height/2 - text.get_height()/2))
                pygame.display.update()
                pygame.time.delay(1000)
                game.menu_screen(n, player, pygame, game, win)
            pygame.time.delay(2000)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False
                pygame.quit()
                game.menu_screen(n, player, pygame, game, win)

            if event.type == pygame.MOUSEBUTTONDOWN:
                pos = pygame.mouse.get_pos()
                for btn in game.btns:
                    #The game.connected makes it so you can't start until another person joins
                    if btn.click(pos) and game.connected():
                        if player == 0:
                            if not game.p1Went:
                                n.send(btn.text)
                        else:
                            if not game.p2Went:
                                n.send(btn.text)

        game.redrawWindow(self.win, player, game.winner, game.m1, game.m2, game.m1list, game.m2list, pygame, game)
        return run

