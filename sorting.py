from components import Env

class Sorting:
    r_list = None
    def __init__(self, t_list):
        self.t_list = t_list
        self.t_flag = True
        self.t_class = None
        self._classify()
        self._sort()

    def _sort(self):
        testfunc = lambda e : e[self.t_class]
        Sorting.r_list = sorted(self.t_list, key=testfunc, reverse=False)        

    def _classify(self):
        self.t_class = Env.get_sortby()
        
        for e in self.t_list:
            if not self.t_class in e:
                self.t_flag = False
                self.t_class = 'filename'
                break

    @classmethod
    def perform(cls, t_list):
        cls(t_list)
        return cls.r_list

if __name__ == '__main__':
    tlist = [{'filename':'dfdfd'},{'filename':'dfdf'}]
    print( Sorting.perform(tlist) )

    tlist = [{'filename':'dfdfd','width':1000,'height':332},{'filename':'dfdf','width':200,'height':200}]
    print( Sorting.perform(tlist) )


