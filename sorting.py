from components import Env

class Sorting:
    r_list = None
    def __init__(self, t_list):
        self.env = Env()
        self.t_list = list( t_list )
        self.sortby = self.env('sortby')
        self._classify()
        self._sort()

    # 환경변수에 등록된 정렬항목(width, height)이 데이타속성에 존재하는지 확인
    # 존재하지 않으면, 정렬에 사용된는 클래스명을 파일명으로 설정
    def _classify(self):        
        for e in self.t_list:
            if not self.sortby in e:
                self.sortby = 'filename'
                break

    def _sort(self):
        # 환경변수에 등록된 항목을 소팅항목으로 설정
        testfunc = lambda e: e[self.sortby]
        Sorting.r_list = sorted(self.t_list, key=testfunc, reverse=False)

    @classmethod
    def perform(cls, t_list):
        cls(t_list)
        return cls.r_list

if __name__ == '__main__':
    tlist = [{'filename':'dfdfd'},{'filename':'dfdf'}]
    print( Sorting.perform(tlist) )

    tlist = [{'filename':'dfdfd','width':1000,'height':332},{'filename':'dfdf','width':200,'height':200}]
    print( Sorting.perform(tlist) )


