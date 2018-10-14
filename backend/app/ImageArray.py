from app.ImageElement import Element
# from ImageElement import Element
from app.NormalizeArray import Normalize
from copy import deepcopy
from config import setting


class NewLineAddSate:
    
    def __init__(self):
        self.new_line_element_flag = True
        self.norm = Normalize()

    def add_newline(self, buffer, container_width):

        if self.new_line_element_flag:
            print("한출 추가")
            # new_line_element = self.norm.convert(Element.getLineElement(container_width,5))
            # buffer.add_newline(new_line_element)
        
        self.reverse_flag()
    
    def reverse_flag(self):
        self.new_line_element_flag = not self.new_line_element_flag


class Create:
    method='row'

    def __init__(self, elements):
        self.elements = elements
        self.store = Store(self.elements)
        self.buffer = Buffer(self.store)
        self.location = Location(self.method)
        self.results = list()
        self.container_width = setting.view_max_count * setting.base_size['width']
        self.available_width = self.container_width
        self.nlas = NewLineAddSate()

    def get_target_width(self, e):
        return e.block[0]

    def start(self):

        while True:

            target_element = self.store.pop()
            #값이 없으면 루프를 빠져나옴
            if not target_element:
                break

            #현재위치값을 설정시킨다. (x,y,nx,ny)
            self.location.set(target_element)
            target_element.setXY( *self.location.getPos() )
            print("1.현재값위치설정 :{}".format(target_element.id))
            
            collision_element = self._checkCollision(target_element,'1')
            if collision_element:
                print("방해물 존재")
                #칸을 연속이동하며 방해물이 없는 칸을 찾는다.
                while True:
                    self.location.moveTo(collision_element) #다음위치에 이미지가 있으면 그 이미지폭만큼 현위치를 이동시킨다.

                    self.available_width -= self.get_target_width(collision_element)
                    if self.available_width <= 0:
                        # 새줄항목을 생성해 버퍼에 0번째로 삽입토록 한다.
                        self.nlas.add_newline(self.buffer, self.container_width)

                        self.__new_feeding()
                        break

                    #moveto로 해서 변경된 위치로 대상항목의 설정을 재설정한다.
                    self.location.set(target_element)
                    target_element.setXY(*self.location.getPos())
                    collision_element = self._checkCollision(target_element,'1')

                    if not collision_element:
                        break

                if self.location._new_line_OK:
                    #미처리값을 행변경후 재처리할 수 있도록 버퍼에 넣어두고 confirm하고 transfer토록 한다.
                    self.buffer.add(target_element)
                    #설정값을 확정시킨다. row/column, rowest value, 현재cord
                    # location._new_line_OK = False처리포함
                    self.location.confirm()
                    self.buffer.transfer()
                    continue

            #경계값 확인
            print('2.경계값점검 target %s:avail %s' %(self.get_target_width(target_element),self.available_width))
            # block(width, height)
            if self.get_target_width(target_element) > self.available_width:
                self.buffer.add(target_element)
                print('경계값 초과 target %s :avail %s' %(self.get_target_width(target_element),self.available_width))

                if self.store._is_last_element():
                    self.__new_feeding()
                    self.location.confirm()
                    self.buffer.transfer()
                # elif not self.store._is_last_buffer and self.store._is_last_source:
                #     self.location.confirm()
                #     self.buffer.transfer()

                continue

            #충돌을 점검해 충돌객체가 있으면 버퍼에 저장하고 다음 요소를 가져오기위해 이후처리를 bypass한다.
            print('3.영역점유점검')
            collision_element = self._checkCollision(target_element,'2')
            if collision_element:
                self.buffer.add(target_element)
                # self.buffer.transfer() 일단 버퍼에 쌓아놓다가 소스에서 시도할때 transfer한다.
                # 소스값이 없고 버퍼만 남은 경우, 다음 줄로 변경해서 배치 시도
                if not self.store._is_last_element():
                    continue
        
            else:
                #배열의 row, column을 지정한다. 초기값은 클래스변수값 0,0
                target_element.setRC( *self.location.getRC() )
                self.results.append( deepcopy(target_element) )

                #사용가능폭을 조정한다.
                self.available_width -= self.get_target_width(target_element)

                if self.available_width <= 0:
                    self.__new_feeding()
            
            #설정값을 확정시킨다. row/column, rowest value, 현재cord
            self.location.confirm()
            # 미처리분을 스토어로 옮긴다.
            self.buffer.transfer()

    def __new_feeding(self):
        # self.location.nextline() #줄을 변경
        self.location._new_line_OK = True
        self._available_width_reset()
        print("행 바꿈")

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
        print('available_width is reset to {}'.format(self.available_width))


# 작성순서
# 1)Location.init(direction) 2)location.set(element) 3)location.nextline() 4)location.confirm()
# set실행시, nextpos()을 갱신한다.
# confirm실행시, rowest값, current_pos, current_rc 갱신한다.
# moveto실행시, current_rc, nextpos 갱신한다.
# 컨테이너(줄)의 초기화에 대한 고찰; 새로운 줄을 추가하는 것에 대해 추가줄수를 관리한다. 출수를 추가하고 초기화를 시행
class Location:
    
    current_pos = (0,0) #(x,y) 이미지출력될 좌상좌표 (1)같은행에서 (2)행이바뀌었을때
    next_pos = (0,0)
    current_rc = (1,1) #배열위치
    column_dir_rowest_height = setting.base_size['height']
    row_dir_rowest_width = setting.base_size['width']
    _new_line_OK = False #줄이 바뀌었을때 TRUE

    def __init__(self, direction):
        self.direction = direction

    def getRC(self):
        print(self.current_rc)
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

        if self._new_line_OK:
            # 행처리발생되어 설정값이 변경되었음을 공지한다.
            if self.direction == 'column':
                self.current_rc = (1,self.current_rc[1]+1)
                self.current_pos = (self.current_pos[0]+self.row_dir_rowest_width,0)
            
            elif self.direction == 'row':
                self.current_rc = (self.current_rc[0]+1,1)
                self.current_pos = (0,self.current_pos[1]+self.column_dir_rowest_height)

            print('line feed {0}, height {1}'.format(self.current_pos,self.column_dir_rowest_height ))
            print("행넘기처리 완료 (ID:%s)"%self.elm.id)
             
        else:
            self.current_pos = self.next_pos[:] #깊은복사

            if self.direction == 'column':
                self.current_rc = (self.current_rc[0]+1,self.current_rc[1])
            elif self.direction == 'row':
                self.current_rc = (self.current_rc[0],self.current_rc[1]+1)

        #플래스 초기화
        self._new_line_OK = False
        print("%s 건 처리완료, id:%s"% (self.elm,self.elm.id))
    
    #행이 바뀌었을때
    def nextline(self):
        if self.direction == 'column':
            self.current_rc = (1,self.current_rc[1]+1)
            self.current_pos = (self.current_pos[0]+self.row_dir_rowest_width,0)
            
        elif self.direction == 'row':
            self.current_rc = (self.current_rc[0]+1,1)
            self.current_pos = (0,self.current_pos[1]+self.column_dir_rowest_height)
            print('line feed {0}, height {1}'.format(self.current_pos,self.column_dir_rowest_height ))
        print("nextline %s이다"%self.direction)
        # 행처리발생되어 설정값이 변경되었음을 공지한다.
        self._new_line_OK = True

    #현재 칸에 대상이 있을경우, 그 대상을 기준으로 다음칸위치를 변경.
    def moveTo(self,elm):
        print("moveTo based to {}".format(elm.id))
        self.elm = elm
    
        if self.direction == 'column':
            self.current_rc = (self.current_rc[0],self.current_rc[1]+1)
            self.current_pos = (self.current_pos[0],self.current_pos[1]+self.elm.block[1])
        elif self.direction == 'row':
            self.current_rc = (self.current_rc[0]+1,self.current_rc[1])
            self.current_pos = (self.current_pos[0]+self.elm.block[0],self.current_pos[1])

        self._update_nextpos()

    # 같은행에서 다음번 위치
    def _update_nextpos(self):
        if self.direction == 'column':
            self.next_pos = (self.current_pos[0], self.current_pos[1]+self.elm.block[1]) #y
        elif self.direction == 'row':
            self.next_pos = (self.current_pos[0]+self.elm.block[0], self.current_pos[1]) #x

    # 행이 바뀌었을때 다음칸을 구하기위해 최소값을 구함. 예 (0, 최소높이값)
    def _update_rowest(self,elm):
        self.row_dir_rowest_width = min(self.row_dir_rowest_width, elm.block[0]) #width
        self.column_dir_rowest_height = min(self.column_dir_rowest_height, elm.block[1]) #height

class Buffer:
    buffer=list()
    def __init__(self, store):
        self.store = store

    def add_newline(self,element):
        self.buffer.insert(0,element)

    def add(self,element):
        self.buffer.append(element)
        print('버퍼에 추가후 항목갯수 :{0}개'.format(len(self.buffer)))

    def transfer(self):
        print('transfer entered {}'.format(len(self.buffer)))
        if len(self.buffer) > 0:
            self.store.update(self.buffer)
            self.buffer.clear()
            print('transfer')

class Store:
    source = tuple()
    buffer = list()
    index = 0
    _is_last_buffer = True
    _is_last_source = False

    def __init__(self, src):
        self.source = src
        self.size = len(src)
    
    def update(self, buf):
        self.buffer.extend(buf)
        self._is_last_buffer = False
        print("store's buffer : %d"% len(self.buffer) )

    def _is_last_element(self):
        print("마지막항목 체크 buf {0} src {1}".format(self._is_last_buffer , self._is_last_source))
        print(len(self.buffer))
        return self._is_last_buffer & self._is_last_source

    def pop(self):
        if len(self.buffer) > 0:
            print("store buffer popped out : %s"%self.buffer[0])
            if len(self.buffer) ==1:
                self._is_last_buffer = True
                
            return self.buffer.pop(0) #fifo

        elif self.index >= self.size:
            return False
        else:
            rst = self.source[self.index]
            self.index +=1
            # 더 이상 버퍼및 소스에는 남은 항목이 없음을 공지
            if len(self.source) <= self.index:
                self._is_last_source=True

            return rst

if __name__ == '__main__':
    from NormalizeArray import Normalize
    n = Normalize()
    data =[
        n.convert( Element(('u1',1920,1080)) ),
        n.convert( Element(('u1',1920,1080)) ),
        n.convert( Element(('u1',1920,1080)) ),
        n.convert( Element(('u1',1920,1080)) ),
    ]
    print(data)
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
    



