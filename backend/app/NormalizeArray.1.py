from app.ImageElement import Element
# from ImageElement import Element
from config import setting
import math

class Normalize:
    _type = 1
    _limit = setting.view_max_count
    base_width = setting.base_size['width']
    base_height = setting.base_size['height']
    applying_ratio = 1

    def __init__(self):
        pass

    def convert(self,element):
        if not type(element) is Element:
            print("Element 타입으로 변환수행")
            self.element = Element(element)
        else:
            self.element = element
        
        self.width, self.height = self.element.width, self.element.height
        self._setRatio()
        self._makeNorm()
        print('변환완료 %d'% self.element.id)
        return self.getElement()

    def getElement(self):
        return self.element

    def _setRatio(self):
        if self.element.orientation=='landscape':
            self.applying_ratio = self.base_height / self.height # 240 / 2500  = 0.1%
        elif self.element.orientation=='portrait':
            self.applying_ratio = self.base_width / self.width # 240 / 2500  = 0.1%
        else:
            self.applying_ratio = 1

    def _makeNorm(self):

        # 가로세로비율을 계산해 베이스값의 배수로 환산하고 객체내 block변수값으로 등록함.
        if self.element.orientation=='landscape':
            test = self.width * self.applying_ratio / self.base_width
            out_rate = self._check_limit(test)
            self.element.update((out_rate * self.base_width, self.base_height))

        elif self.element.orientation=='portrait':
            test = self.height * self.applying_ratio / self.base_height
            out_rate = self._check_limit(test)
            self.element.update((self.base_width, out_rate * self.base_height))
        else:
            self.element.update((self.base_width, self.base_height))
        
        print("getNorm : %s" % out_rate)
        return self.element

    def _check_limit(self, test):
        if  test <=1:
            return 1
        else:
            # limit을 초과할 수 없다
            return min(math.ceil(test), self._limit)

if __name__ == '__main__':
    test = Element(('url',3000,250))
    nor = Normalize()
    nor.convert(test)
    print(nor.getElement())

    test = Element(('url',320,6500))
    nor.convert(test)
    print(nor.getElement())
