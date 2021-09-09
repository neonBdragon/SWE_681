


list = [1,2,3,4]

for i in list:
    if i == 3:
        print(i)

# function takes in list and prints yes if >2, no else


def greaterThan(list):
    for i in list:
        if i > 2:
            print("Yes")
        else:
            print("No")

greaterThan(list)