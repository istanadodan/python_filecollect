import log, os, io, json
from grouping import Grouping as grp

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

@log.logging
def startHenshu(basepath):
    func ={'G1':getInfoImage,'G2':getInfoZip,'G3':getInfoZip,'G4':getInfoZip,'G5':getInfoZip,'G6':getInfoZip} 
    
    tmpDic = dict()
    for (path, dir, filenames) in os.walk(basepath):

        tmpList=list()        
        for filename in filenames:
            # 확장자 축출 @[1:] .이후 문자를 가져옴
            fext = os.path.splitext(filename)[-1][1:].lower()

            vDic = dict()
            fullpath = os.path.join(path,filename)
            dirname = path.split('\\')[-1]

            # 분류를 위한 평가요소는 확장자, 파일명(키워드포함), 폴더명(키워드포함)
            # 결과 ext는 확장자평가, cat는 파일명/폴더명내 포함된 키워드에 의한 평가
            # 파일명에 확장자 제외
            fn = filename.split('.')[0]
            ext, cat = grp.getKey(fext,fn,dirname)

            # 어느 것에도 기타로 분류될 경우, 대상외로 함.
            if ext=='G6' and cat=='C5':
                continue
            try:
                vDic = func[ ext ](fullpath)
            except:
                # 에러가 발생하더라도 계속 수행
                log.printlog("ERR:{}".format(fullpath))
                continue
            else:    
                # 정상적인 경우 집계절차
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