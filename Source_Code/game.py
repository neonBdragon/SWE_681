import random



class Game:
    winner = -1
    m1list = []
    m2list = []
    max = -1
    m1 = ""
    m2 = ""
    list = [1,2,3,4,5,6]
    RandomValue = -1
    operationList = ['*','/','%','+','-']
    operation = ""
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