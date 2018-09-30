import io, json, os
import app.logger as log
from app.components import Env
from config import setting
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

    # @log.logging("view Henshu result")
    def menu_3(self):
        # log.printlog("view Henshu result")
        
        with io.open('./fileCollection/result.txt','r',encoding='utf-8') as f:
            buff = json.load(f)
            # output = list()
            
            # Folder2('root', buff ).show()
        return buff

    @log.logging("image edit handler start")
    def menu_4(self, path, angle, resample, translate):
        from PIL import Image
        from time import time
        #변경후 파일명을 변경해 브라우져에 인식시킨다.
        current_milli_time = lambda: int(round(time() * 1000))
        tmp_file_pathname='assets/img/temp'+str(current_milli_time())+'.jpg'
        
        # 이미지변환처리방식 3가지;
        if resample and (resample in setting.rs_v):
            resample = setting.rs_v[resample]
        else:
            resample = setting.rs_v['BICUBIC']

        # 이미지 위치이격
        dd = translate.split(',')
        r_translate = tuple((int(dd[0][1:]), int(dd[1][:-1]))) if translate else tuple(0,0)
        
        if r_translate==(0,0):
            expland = False
        else:
            expland = True
        
        # 개발모드에 따른 경로취득
        f_path = setting.get_file_path(path)
        
        with Image.open(f_path) as img:
            r_img = img.rotate(int(angle), 
                    expand=expland,
                    resample=Image.BICUBIC,
                    translate=r_translate)
            
            r_img.save(setting.get_file_path(tmp_file_pathname))

        log.printlog(path+'=>'+tmp_file_pathname)

        return tmp_file_pathname