import io, json
import app.logger as log
from app.components import Env, Folder, Folder2
# import edit
env = Env()

class MenuSwitch(object):

    # 인스턴스생성 시, a = A()
    def __init__(self):
        self.url = env('url')
        self.env = env('vars')

    # 생성된 인스턴스가 호출될 때, a()
    def __call__(self, arg):
        menu_name = "menu_" + str(arg)
        menu_selector = getattr(self, menu_name, lambda:'default')
        menu_selector()

    @log.logging
    def menu_1(self):
        menu = Folder('root',self.env )
        menu.show()
        msg = menu.getResult()
        if msg['save_flag']:
            env.save()

    @log.logging("Henshu start from {0}","url")
    # def menu_2(self):
    #     edit.startHenshu(self.url)

    # @log.logging("view Henshu result")
    def menu_3(self):
        # log.printlog("view Henshu result")
        
        with io.open('./fileCollection/result.txt','r',encoding='utf-8') as f:
            buff = json.load(f)
            # output = list()
            
            # Folder2('root', buff ).show()
        return buff

    def menu_4(self, path, angle, resample, translate):
        from PIL import Image
        from time import time
        current_milli_time = lambda: int(round(time() * 1000))
        tmp_file_pathname='assets/img/temp'+str(current_milli_time())+'.jpg'
        
        rs_v = dict({'BICUBIC':Image.BICUBIC,
                    'NEAREST':Image.NEAREST,
                    'BILINEAR':Image.BILINEAR})

        if resample and (resample in rs_v):
            resample = rs_v[resample]
        else:
            resample = rs_v['BICUBIC']
        dd = translate.split(',')
        # print(dd)
        r_translate = tuple((int(dd[0][1:]), int(dd[1][:-1]))) if translate else tuple(0,0)
        print(r_translate)
        if r_translate==(0,0):
            expland = False
        else:
            expland = True
        import os
        # r_dir ="D:\\Project\\python\\fileCollection\\frontend\\src\\"
        r_dir ="D:\\Project\\python\\fileCollection\\backend\\static\\html\\"
        f_path = os.path.join(r_dir,path)
        with Image.open(f_path) as img:
            r_img = img.rotate(int(angle), 
                    expand=expland,
                    resample=Image.BICUBIC,
                    translate=r_translate)
            
            r_img.save(os.path.join(r_dir,tmp_file_pathname))
            # r_img.save(tmp_file_pathname)

        log.printlog(path+'=>'+tmp_file_pathname)

        return tmp_file_pathname


def menu():

    go_menu = MenuSwitch()
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

        go_menu(ret)

        
if __name__ == '__main__':
    menu()
