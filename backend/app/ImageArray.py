from ImageElement import Element

class Create:
    elements = []
    results = []
    container_width = 30
    available_width = 30
    method='row'

    def __init__(self, elements):
        self.elements = elements
        self.store = Store(self.elements)
        self.buffer = Buffer(self.store)
        self.location = Location(self.method)

    def start(self):

        while True:

            target_element = self.store.pop()
            #갑이 없으면 루프를 빠져나옴
            if not target_element:
                break

            #경계값 확인
            if target_element.width > self.available_width:
                self.buffer.add(target_element)
                continue

            #현재위치값을 저장한다.
            self.location.set(target_element)
            target_element.setXY( *self.location.getPos() )
            
            #충돌을 점검해 충돌객체를 있으면 버퍼에 저장하고 처리를 pass한다.
            collision_element = self._checkCollision(target_element,'1')
            if collision_element:
                self.buffer.add(target_element)
                continue

            #저장할 배열상 row, column을 지정한다.
            target_element.setRC( *self.location.getRC() )
            from copy import deepcopy 
            self.results.append( deepcopy(target_element) )

            self.available_width -= target_element.width

            if self.available_width==0:
                self.location.nextline() #줄을 변경
                self._available_width_reset()

            else:
                #다음칸을 확인하고 방해물이 있으면 그 다음 칸을 반복해 조사한다.
                while True:
                    target_element.setXY(*self.location.getNextPos())
                    collision_element = self._checkCollision(target_element,'2')

                    if not collision_element:
                        break
                    
                    self.available_width -= collision_element.width
                    if self.available_width==0:
                        self.location.nextline() #줄을 변경
                        self._available_width_reset() #초기값으로 변경
                        break

                    self.location.moveTo(collision_element) #다음위치에 이미지가 있으면 그 이미지폭만큼 현위치를 이동시킨다.
            
            #설정값을 확정시킨다. row/column, rowest value, 현재cord
            self.location.confirm()

            self.buffer.transfer()

    def _checkCollision(self,target, strType1):
        if strType1=='1':
            for el in self.results:
                if el.isInBounded(target):
                    return el
        elif strType1=='2':
            for el in self.results:
                if el.isIntersected(target):
                    return el
        else:
            return None

    def _available_width_reset(self):
        self.available_width = self.container_width
        print('container_width reset')


# 작성순서
# 1)Location.init(direction) 2)location.set(element) 3)location.confirm() 4)location.nextline()
# set실행시, nextpos()
# confirm실행시, rowest값, current_pos, current_rc
# moveto실행시, current_pos, nextpos 갱신
class Location:
    
    current_pos = (0,0) #(x,y) 이미지출력될 좌상좌표 (1)같은행에서 (2)행이바뀌었을때
    next_pos = (0,0)
    current_rc = (1,1) #배열위치
    column_dir_rowest_height = 10
    row_dir_rowest_width = 10
    row_change_flag = False #행/열이 바뀌었을때 TRUE

    def __init__(self, direction):
        self.direction = direction

    def getRC(self):
        return self.current_rc

    def getPos(self):
        return self.current_pos

    def getNextPos(self):
        return self.next_pos

    def set(self, elm):
        self.elm = elm
        self._update_nextpos()

    def confirm(self):
        self._update_rowest(self.elm)

        self.current_pos = self.next_pos[:] #깊은복사

        if not self.row_change_flag:
            if self.direction == 'column':
                self.current_rc = (self.current_rc[0]+1,self.current_rc[1])
            elif self.direction == 'row':
                self.current_rc = (self.current_rc[0],self.current_rc[1]+1)

        #한행처리 완료
        self.row_change_flag = False
    
    #행이 바뀌었을때
    def nextline(self):
        if not self.row_change_flag:
            if self.direction == 'column':
                self.current_rc = (1,self.current_rc[1]+1)
                self.next_pos = (self.current_pos[0]+self.row_dir_rowest_width,0)
            elif self.direction == 'row':
                self.current_rc = (self.current_rc[0]+1,1)
                self.next_pos = (0,self.current_pos[1]+self.column_dir_rowest_height)

        # 행처리완료
        self.row_change_flag = True

    #다음 칸에 대상이 있을경우, 그 다음칸으로 현위치 변경
    def moveTo(self,elm):
        print("moveTo")
        self.elm = elm
        if self.direction == 'column':
            self.current_pos = (self.current_pos[0],self.current_pos[1]+ self.elm.height)
        elif self.direction == 'row':
            self.current_pos = (self.current_pos[0]+self.elm.width,self.current_pos[1])

        self._update_nextpos()

    # 같은행에서 다음번 위치
    def _update_nextpos(self):
        if self.direction == 'column':
            self.next_pos = (self.current_pos[0], self.current_pos[1]+self.elm.height)
        elif self.direction == 'row':
            self.next_pos = (self.current_pos[0]+self.elm.width, self.current_pos[1])

    # 행이 바뀌었을때 다음칸을 구하기위해 최소값을 구함. 예 (0, 최소높이값)
    def _update_rowest(self,elm):
        self.row_dir_rowest_width = min(self.row_dir_rowest_width, elm.width)
        self.column_dir_rowest_height = min(self.column_dir_rowest_height, elm.height)

class Buffer:
    buffer=list()
    def __init__(self, store):
        self.store = store

    def add(self,buf):
        self.buffer.append(buf)

    def transfer(self):
        if len(self.buffer) > 0:
            self.store.update(self.buffer)
            self.buffer.clear()
            print('transfer')

class Store:
    source = tuple()
    buffer = list()
    index = 0

    def __init__(self, src):
        self.source = src
        self.size = len(src)
    
    def update(self, buf):
        self.buffer.extend(buf)
        print("store's buffer : %d"% len(self.buffer) )
    
    def pop(self):
        if len(self.buffer) > 0:
            print("store buffer popped out : %s"%self.buffer[0])
            return self.buffer.pop(0) #fifo
        elif self.index >= self.size:
                return False
        else:
            rst = self.source[self.index]
            self.index +=1
            return rst

if __name__ == '__main__':
    data =[
        Element(('u1',10,10)),
        Element(('u2',10,10)),
        Element(('u3',20,10)),
        Element(('u3',10,20)),
    ]
    create = Create(data)
    create.start()

    print(create.results)

    # a =['a','b','c']
    # b =['a1','b1']
    # fetch = Store(a)
    # fetch.update(b)
    # print(fetch.pop())
    # print(fetch.pop())
    # print(fetch.pop())

    # buffer = Buffer(fetch)
    # buffer.add(b)
    # buffer.transfer()
    # print(fetch.pop())
    # print(fetch.pop())
    # print(fetch.pop())

    # from ImageElement import Element
    # elm = Element(('path',10,10))
    # ip = Location('column')
    # ip.set(elm)
    # print(ip.getNextPos())
    # elm = Element(('path',20,10))
    # ip = Location('row')
    # ip.set(elm)
    # print(ip.getNextPos())
    



