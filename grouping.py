from components import Env

class Grouping:
    cache = dict()

    def __new__(cls,ext, fname, dirname):
        env = Env()
        cls.ext = env('vars')['group_ext']
        cls.cat = env('vars')['group_cat']
        cls.makeCategory(ext, fname, dirname)
        return super().__new__(cls)
    
    @classmethod
    def getKey(cls,ext, fname, dirname):
        # print('ext:{},fname:{},dirname:{}'.format(ext,fname,dirname))
        cls(ext, fname, dirname)
        return cls.grouping_ext, cls.grouping_cat
    # def __init__(self, ext, fname, dirname):
    #     self.ext = ext
    #     self.fname = fname
    #     self.dirname = dirname
    #     self.makeCategory(ext, fname, dirname)
    def __str__(self):
        return "ext:{}, cat:{}".format(self.grouping_ext, self.grouping_cat)

    @classmethod
    def makeCategory(cls,ext,fn,dn):
        # 확장자가 목록에 있는 키를 반환
        ext_key =  [key for key, values in cls.ext.items() if ext in values]
        if ext_key:
            cls.grouping_ext = ext_key[0]
        else:
            cls.grouping_ext = list( cls.ext.keys() )[-1]

        # 파일명에 키워드존 재여부를 체크
        cat_key =  [key for key, values in cls.cat.items() if values[1] in fn]
        if cat_key:
            cls.grouping_cat = cat_key[0]
        else: 
            # 키워가 존재하지 않는 경우, 카테고리 마지막항목을 할당한다.
            cls.grouping_cat = list( cls.cat.keys() )[-1]

        # 디렉토리명에 키워드존 재여부를 체크
        # 디렉토리명에 대한 키워드가 우선이 되게 함.
        cat_key = [key for key, values in cls.cat.items() if values[1] in dn]
        if cat_key:
            cls.grouping_cat = cat_key[0]

if __name__ == '__main__':
    print( Grouping.getKey('jpg1','hello_mem','dirtory_bak') )
    print( Grouping.getKey('xlsx1','xlsx_doc','dirtory_bak') )
    print( Grouping.getKey('zip1','zi','dirtory') )

