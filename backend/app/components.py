import json
import app.logger as log

class Env:
    vars = {}
    file = './fileCollection/env.txt'

    def __new__(cls):
        if not cls.vars:
            with open(cls.file, 'r') as f:
                cls.vars = json.load(f)
                log.printlog('complete to load env vars')
        return super().__new__(cls)

    def __call__(self, name):
        if not self.vars:
            self._get_env()
        selector = getattr(self, "get_"+name, lambda:'default')
        return selector()

    def get_default(self):
        return {}

    def get_vars(self,key1=None,key2=None):

        if not key1 and not key2:
            return self.vars
        elif key1:
            if not key2:
                return self.vars[key1]
            else:
                return self.vars[key1][key2]
        else:
            return {}

    def get_url(self):
        return self.get_vars('setting','url')

    def get_sortby(self):
        return self.get_vars('PrintOption','sortby')

    def get_extension_list(self):
        return self.get_vars('extension')
    
    def get_filtered_list(self):
        return self.get_vars('filter','size')

    def format_check(self, key):
        setting = self.vars['setting']
        test_key = key + "_type"
        if test_key in setting and setting[test_key]=='number':
            return True
        else:
            return False

    def save(self):
        with open(self.file, 'w') as f:
            json.dump(self.vars, f, indent=1, ensure_ascii=False)
            log.printlog('save complete')

class Folder_template:
    result_msg = {'save_flag': False}

    def __init__(self, key, val):
        self.key = key
        self.obj = val
        self._prepare()
    
    def _prepare(self):
        self.menu_list = list( self.obj.items() )
        self.flag_list = ['Folder'  if isinstance(v, dict) else 'File' for k,v in self.obj.items()]
    
    def getResult(self):
        return self.result_msg

    def show(self):
        menu_list = [item for item in self.obj]
        # logger.info(menu_list)
        for ix, (key, val) in enumerate( self.menu_list ):
            check = 'File'
            if isinstance(val, dict):
                check = 'Folder'
            print("[%2d] %s %s [%s]" % (ix+1, key, str(val)[:50], self.flag_list[ix]) )
        else:
            print("[%2d] %s" % (ix+2, '추가하기'))
            print("[%2d] %s" % (ix+3, '돌아가기'))

        while True:
            sel = input("선택은?")
            if sel.isdecimal() and 1 <= int(sel) <= ix + 3:
                i_sel = int(sel) - 1
                break
        
        if i_sel == ix + 2:
            return

        if i_sel == ix + 1:
            File(self.obj, '', 0).show()
            return

        # sel_menu = menu_list[i_sel]
        sel_menu = self.menu_list[i_sel]
        # (key, value)
        sel_key, sel_val = sel_menu[0], sel_menu[1]

        # if isinstance(self.obj[sel_menu], dict):
        # if isinstance(sel_val, dict):

        # 저장여부 등 정보를 결과오브젝트로서 반환한다.
        return self.open(i_sel, (sel_key, sel_val) )

    def open(self, i_sel, v_sel):
        pass

class Folder(Folder_template):
    
    def __init__(self, key, val):
        self.env = Env()
        super().__init__(key, val)
    
    # i_sel:선택번호, v_sel:선택값튜플
    def open(self, i_sel, v_sel):
        sel_key, sel_val = v_sel[0], v_sel[1]

        if self.flag_list[i_sel] == 'Folder':
            Folder(sel_key, sel_val).show()
        else:
            # 직전 dict객체, 선택키, 저장시숫자변환필요여부 점검(상위 키에 대한 )
            save_flag = File(self.obj, sel_key, self.env.format_check(self.key) ).show()
            self.result_msg['save_flag'] = True
        
class Folder2(Folder_template):
    def __init__(self, key, val):
        super().__init__(key, val)
    
    # i_sel:선택번호, v_sel:(key, val) 선택값튜플
    def open(self, i_sel, v_sel):
        from sorting import Sorting
        env = Env()
        filter_list = env.get_filtered_list()
        sel_key, sel_val = v_sel[0], v_sel[1]
        
        def filter1(e):
            for key in filter_list:
                if key in e and e[key] < filter_list[key]:
                    return False
            return True

        sorted_list = Sorting.perform( filter( filter1, v_sel[1] ) )

        for e in sorted_list:
            if e["ext"] == 'G1':
                print("{} : width {}, height{}".format(e['filename'], e['width'], e['height']))
            else:
                print("{}".format( e ) )

class File:
    '''
    파라미터로서 상위개체, 그리고 전공정에서 선택된 키값을 전달받는다.
    File 클래스는 기존 키값 수정뿐만아니라 신규키를 추가할 수 있다.
    이를 위해서 상위개체를 인수로 전달받는다. 
    b_flag는 숫자변환필요 여부: 1이면 필요.
    '''
    def __init__(self, obj, key, b_flag):
        self.obj = obj
        self.key = key
        self.flag = b_flag
        # logger.info('F.env',obj)

    def show(self):
        File.open(self)

    @classmethod
    def open(cls, self):
        # 신규시에는 표시하지 않음
        if self.key:
            print("[ %s ] %s" % ( self.key, self.obj[self.key]) )

        # 키값이 없으며 추가.
        while not self.key:
            new_key = input("키값을 입력해주세요 : ")
            if new_key.isalnum():
                self.key = new_key
                break

        while True:
            new_value = input("값을 입력해주세요 : ")
            if not new_value:
                # 엔터입력 시, 저장하지않고 되돌아감
                return
            # 문자열 저장시 변환처리 없이 빠져나옴
            if new_value and not self.flag:
                break
            elif new_value and self.flag and new_value.isdecimal():
                new_value = int(new_value)
                break
            
        self.obj[ self.key ] = new_value
        # 설정값 저장 -> 호출문에서 result_flag로 저장여부 판단
        #Env.save()
            
if __name__ == '__main__':
    env = [{'key':'aaa','show':lambda :print('a')},{'key':'bbb','open':''}]
    menu = Folder('root',env)
    menu.show()
