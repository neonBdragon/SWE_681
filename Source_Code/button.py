import pygame


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
