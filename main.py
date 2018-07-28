import io, log, json
from sorting import Sorting
from components import Env, Folder
import edit

class MenuSwitch(object):
    env = None
    def __new__(cls, arg):
        if not cls.env:
            cls.env = Env()
            log.printlog("MenuSwitch")
        return super(MenuSwitch, cls).__new__(cls)

    def __init__(self, arg):
        menu_name = "menu_" + str(arg)
        menu_selector = getattr(self, menu_name, lambda:'default')
        menu_selector()
        
    def menu_1(self):
        # self.env.show()
        Folder('root',Env.vars).show()
        
    def menu_2(self):
        # url = 'D:\CloudStation'
        url = Env.vars['setting']['url']
        log.printlog("Henshu start from {}".format(url))

        edit.startHenshu(url)

    def menu_3(self):
        log.printlog("view Henshu result")
        
        with io.open('./fileCollection/result.txt','r',encoding='utf-8') as f:
            buff = json.load(f)
            output = list()

            for index, alb in enumerate( buff ):
                output.append(alb)
                print("[{0:2}] {1}".format(index+1,alb))
            
            selAlbName = input("앨범선택:")
            selAlbum = output[int(selAlbName)-1]
            print(selAlbum)
            # sortBy = self.env.get_sortby()
            # sortFunc = lambda v: v[sortBy] if sortBy in v else v['filename']

            # sorted_list = Sorting.perform( list( filter( self.filter1, buff[selAlbum] ) ) )
            sorted_list = Sorting.perform( filter( self.filter1, buff[selAlbum] ) )
            
            # sorted_list = sorted(filter_list, key=sortFunc, reverse=True)

            for e in sorted_list:
                if e["ext"] == 'G1':
                    print("{} : width {}, height{}".format(e['filename'], e['width'], e['height']))
                else:
                    print("{}".format( e ) )

    def menu_default(self):
        log.printlog("default")

    def filter1(self, e):
        filter_list = self.env.get_filtered_list()
        for key in filter_list:
            if key in e and e[key] < filter_list[key]:
                return False
        return True        


def menu():

    while True:
        print("1. 옵션")
        print("2. 집계")
        print("3. 출력")
        print("9. 종료")
        ret = input("작업번호를 입력하세요: ")
        if not ret.isdecimal() or 0> int(ret) > 9:
            continue
        elif int(ret) == 9:
            break

        MenuSwitch(ret)

        
if __name__ == '__main__':
    menu()
