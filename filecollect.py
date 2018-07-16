import io,os
import json
# from util import MenuSelction
import log
from grouping import Grouping as grp
from components import Env, Folder

def getInfoZip(filepath):
    import time
    attrs = {'Access_time':os.path.getatime,
            'Modified_time':os.path.getmtime,
            'Change_time':os.path.getctime,
            'Size':os.path.getsize}

    return {k:time.ctime( v(filepath) ) for k, v in attrs.items()}
                
def getInfoImage(filepath):
    from PIL import Image
    with Image.open(filepath) as img:
        width, height = img.size
    ret = {'width':width, 'height':height}
    # ret.update(getInfoZip(filepath))    
    return ret

def startHenshu(basepath, env):
    func ={'G1':getInfoImage,'G2':getInfoZip,'G3':getInfoZip,'G4':getInfoZip,'G5':getInfoZip,'G6':getInfoZip} 
    # func = env.vars["func"]
    # ext = {'jpg':'img','xlsx':'ms','Bzip':'ms'}
    # ext = env.get_extension_list()
    tmpDic = dict()
    for (path, dir, filenames) in os.walk(basepath):
        tmpList=list()
        
        for filename in filenames:
            fext = os.path.splitext(filename)[-1][1:].lower()

            vDic = dict()
            fullpath = os.path.join(path,filename)
            dirname = path.split('\\')[-1]

            # if fext in ext.keys():
            ext, cat = grp.getKey(fext,filename,dirname)
            try:
                vDic = func[ ext ](fullpath)
            except:
                log.printlog("ERR:{}".format(fullpath))
                pass
            else:    
                vDic['filename'] = filename
                vDic['ext'], vDic['cat'] = ext, cat
                tmpList.append(vDic)

        if tmpList:            
            tmpDic[dirname] = tmpList
            log.printlog(str(dirname))
    # print(tmpDic)
    with io.open('./fileCollection/result.txt','w',encoding='utf-8') as f:            
        json.dump(tmpDic,f,ensure_ascii=False, indent=1)

    log.printlog("********Henshu complete*******")

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
        log.printlog("Henshu start")
        
        url = 'D:\CloudStation'
        startHenshu(url, self.env)

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
            sortBy = self.env.get_sortby()
            sortFunc = lambda v: v[sortBy] if sortBy in v else v['filename']
            filter_list = filter(self.filter1, buff[selAlbum]  )
            sorted_list = sorted(filter_list, key=sortFunc, reverse=True)

            for e in sorted_list:
                if e["ext"] == 'G1':
                    print("{} : width {}, height{}".format(e['filename'], e['width'], e['height']))
                else:
                    print("out: {}".format( e ) )

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
