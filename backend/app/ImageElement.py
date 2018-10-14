
class Element:
    id=0
    block=None
    def __new__(cls, args=None):
        cls.id += 1
        return super().__new__(cls)

    def __init__(self, tpldata):
        self.url = tpldata[0]
        self.width = tpldata[1]
        self.height = tpldata[2]
        self.orientation = 'portrait' if self.width < self.height else 'landscape'
        self.id = Element.id
        
    def __repr__(self):
        if 'position' in self.__dict__:
            ret = (self.id,self.url,self.width,self.height,self.orientation,self.position, self.cord_rect,self.block)
        else:
            ret = (self.id,self.url,self.width,self.height,self.orientation)

        return ",".join(map(str, ret))

    def setXY(self,x,y):
        if self.block:
            self.cord_rect = (x,y, x+self.block[0], y+self.block[1])
        else:
            self.cord_rect = (x,y, x+self.width, y+self.height)
    
    def setRC(self,x,y):
        self.position = (x,y)

    def update(self,dict_data):
        self.block = dict_data

    @staticmethod
    def getLineElement(w,h):
        return Element(('',w,h))

    def isInBounded(self, *argv):
        if len(argv) ==1:
            x, y = argv[0].cord_rect[:2]
        else:
            x, y = argv

        test_x = x >=self.cord_rect[0] and x < self.cord_rect[2]
        test_y = y >=self.cord_rect[1] and y < self.cord_rect[3]
        return test_x and test_y

    def isIntersected(self, *argv):
        if len(argv) ==1:
            x0, y0, x1, y1 = argv[0].cord_rect
        else:
            x0, y0, x1, y1 = argv

        # 4개의 꼭지점이 비교대상과 동털어진 곳 조건을 설정하여 그 반대조건을 유도했다
        test_0 = x1 <= self.cord_rect[0] #촤측
        test_1 = x0 >= self.cord_rect[2] #우측
        test_2 = y1 <= self.cord_rect[1] #상측
        test_3 = y0 >= self.cord_rect[3] #하측
        # 일부 및 전체 교차하는 경우 모두 적용가능
        if test_0 or test_1 or test_2 or test_3:
            return False
        
        # r_test_x0 = x0 <= self.cord_rect[0] and x0 > self.cord_rect[2]
        # r_test_x1 = x1 < self.cord_rect[0] and x1 > self.cord_rect[2]
        # r_test_y0 = y0 <= self.cord_rect[1] and y0 > self.cord_rect[3]
        # r_test_y1 = y1 < self.cord_rect[1] and y1 > self.cord_rect[3]
        
        # # 전체를 포함하는 경우
        # if r_test_x0 and r_test_x1 and r_test_y0 and r_test_y1:
        #     return True

        return True

if __name__ == '__main__':
    tpldata = ('url',10,10)
    element = Element(tpldata)
    element.setXY(0,0)
    print(element.isInBounded(10,0))
    print(element.isIntersected(0,0,1,1))

    tpldata = ('url',10,10)
    element2 = Element(tpldata)
    element2.setXY(1,1)
    print(element.isInBounded(element2))
    print(element.isIntersected(element2))





