import io, log, json
from sorting import Sorting
from components import Env, Folder, Folder2
import edit

class MenuSwitch(object):

    def __init__(self, arg):
        self.env = Env()
        self.filter_list = self.env('filtered_list')
        menu_name = "menu_" + str(arg)
        menu_selector = getattr(self, menu_name, lambda:'default')
        menu_selector()
        
    def menu_1(self):        
        Folder('root',self.env('vars')).show()
        
    def menu_2(self):
        url = self.env('url')

        log.printlog("Henshu start from {0}".format(url))

        edit.startHenshu(url)

    def menu_3(self):
        log.printlog("view Henshu result")
        
        with io.open('./fileCollection/result.txt','r',encoding='utf-8') as f:
            buff = json.load(f)
            output = list()

            Folder2('root', buff ).show()

            # for index, alb in enumerate( buff ):
            #     output.append(alb)
            #     print("[{0:2}] {1}".format(index+1,alb))
            
            # selAlbName = input("앨범선택:")
            # selAlbum = output[int(selAlbName)-1]
            # print(selAlbum)
            # list1 = filter( self.filter1, buff[selAlbum] )
            # sorted_list = Sorting.perform( filter( self.filter1, buff[selAlbum] ) )

            # for e in sorted_list:
            #     if e["ext"] == 'G1':
            #         print("{} : width {}, height{}".format(e['filename'], e['width'], e['height']))
            #     else:
            #         print("{}".format( e ) )

    def menu_default(self):
        log.printlog("default")

    def filter1(self, e):
        
        for key in self.filter_list:
            if key in e and e[key] < self.filter_list[key]:
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
