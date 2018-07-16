import logging,sys
import json
import log

class Env:

    vars = {}
    file = './fileCollection/env.txt'

    def __new__(cls):
        if not cls.vars:
            with open(cls.file, 'r') as f:
                cls.vars = json.load(f)
                log.printlog('complete to loa env vars')
        return super().__new__(cls)
    
    def __init__(self):
        pass

    @staticmethod
    def get_sortby():
        return Env.vars["PrintOption"]["sortby"]

    @staticmethod
    def get_extension_list():
        return Env.vars['extension']
    
    @staticmethod
    def get_filtered_list():
        return Env.vars['filter']['size']

    @classmethod
    def format_check(cls, key):
        setting = cls.vars['setting']
        test_key = key + "_type"
        if test_key in setting and setting[test_key]=='number':
            return True
        else:
            return False

    @classmethod
    def save(cls):
        with open(cls.file, 'w') as f:
            json.dump(cls.vars, f, indent=1, ensure_ascii=False)
            log.printlog('save complete')

class Folder:

    def __init__(self, key, val):
        self.key = key
        self.obj = val
        # logger.info('env',list)
        self._prepare()
    
    def _prepare(self):
        self.menu_list = list( self.obj.items() )
        # logger.info(self.menu_list)
        self.flag_list = ['Folder'  if isinstance(v, dict) else 'File' for k,v in self.obj.items()]
        # logger.info(self.flag_list)

    def show(self):
        Folder.open(self)

    @classmethod
    def open(cls, self):
        menu_list = [item for item in self.obj]
        # logger.info(menu_list)
        for ix, (key, val) in enumerate( self.menu_list ):
            check = 'File'
            if isinstance(val, dict):
                check = 'Folder'
            print("[%s] %s %s [%s]" % (ix+1, key, val, self.flag_list[ix]) )
        else:
            print("[%s] %s" % (ix+2, '추가하기'))
            print("[%s] %s" % (ix+3, '돌아가기'))

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
        if self.flag_list[i_sel] == 'Folder':
            Folder(sel_key, sel_val).show()

        else:
            # 직전 dict객체, 선택키, 저장시숫자변환여부 (상위 키에 대한 )
            File(self.obj, sel_key, Env.format_check(self.key) ).show()

class File:
    '''
    파라미터로서 상위개체, 그리고 전공정에서 선택된 키값을 전달받는다.
    File 클래스는 기존 키값 수정뿐만아니라 신규키를 추가할 수 있다.
    이를 위해서 상위개체를 인수로 전달받는다. 
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
        # 설정값 저장
        Env.save()
            
if __name__ == '__main__':
    env = [{'key':'aaa','show':lambda :print('a')},{'key':'bbb','open':''}]
    menu = Folder('root',env)
    menu.show()
