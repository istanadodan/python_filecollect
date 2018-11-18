from flask import Flask, jsonify,redirect,render_template,request,url_for,Response,send_from_directory,send_file
from flask_multistatic import MultiStaticFlask
from flask_cors import CORS, cross_origin
import logging
from app.service import MenuSwitch, CompactLayout, DefaultLayout
import os
from model.query import Model,Album
from app.ImageElement import Element
from config import setting
from werkzeug.routing import BaseConverter

#logger설정
logging.basicConfig(level="DEBUG", format="%(asctime)s %(levelname)s %(message)s")

menu = MenuSwitch()
dev_mode = setting.dev_mode
# , static_folder='static'
# static_url_path='/static')
# 서버내 폴더위치지정 외, 타 폴더지정시 스테틱폴더옵션을 사용한다.
# js,css등은 서버내 폴더내 위치시켜 /static/js등으로 지정할 수 있다.

# app = Flask(__name__ , static_folder='D:\\내사진\\Album 2017')
# app = Flask(__name__, static_folder='static')
# app = Flask(__name__, static_url_path='/app/static/html')
# app.config['STATIC_FOLDER'] = 'D:\\내사진\\Album 2017'
# app.config['STATIC_FOLDER'] = 'static'

app = MultiStaticFlask(__name__)

# MultistaticFlask
app.static_folder=setting.static_folder

# cross origin 
CORS(app)

@app.route('/')
def init():
    # print(menu.menu_3().keys)
    resp = [key for key,value in menu.menu_3().items()]
    # return render_template('index.html',list=resp)
    print("WED Initial")
    
    model = Model()
    db = model.get_all()
    if len(db) == 0:
        print("DB setup")
        ct = 0
        for key,value in menu.menu_3().items():
            albums = list()
            for item in value:
                if 'width' in item:
                    album = Album(key,
                            item['filename'],
                            item['width'],
                            item['height'],
                            item['Size'])
                    albums.append(album)
                    ++ct

            model.insert_all(albums)
        print("inserted no:{}".format(ct))
    # 동일 쓰레드로 동작될 수 있도록 사용후 필히 닫도록 한다.
    model.close()

    # return send_file(url_for('static',filename='web/index.html'))
    return send_from_directory('static/web','index.html')

@app.route('/api/albumlist',methods = ['GET'])
def angular_get_albumlist2():
    model = Model()
    # resp = [name for name in model.get_album_name()]
    resp = model.get_album_name()
    model.close()
    return jsonify(resp)

@app.route('/apix/albumlist',methods = ['GET'])
def angular_get_albumlist():
    resp = [key for key,value in menu.menu_3().items()]
    return jsonify(resp)

@app.route('/api/disp_type/<string:album_name>/<string:disp_type>',methods = ['GET'])
def angular_disp_type(album_name, disp_type):
    model = Model()
    data = model.get_image_name(album_name)
    # import app.NormalizeArray as nModule, app.ImageArray as imgModule
    # #최대값 6 * 기본크기 (320*180)
    # normal = nModule.Normalize(disp_type)
    # # 데이타를 ImageElement 객체로 변환후 변환객체를 호출한다.
    # elements = [normal.convert(el) for el in data]
    # # 배열을 받고 정렬을 수행한다.
    # items = imgModule.Create(elements)
    # items.start()
    # Layout Factory를 생성하여 위 normalize와 중간데이타인 배열 등을 캡슐화시킴. 
    # 아울러 다른 items으로 간편이 전환이 가능하도록 했음
    builder = CompactLayout(disp_type,data)
    # builder = DefaultLayout(disp_type,data)
    builder.create()
    #items데이타를 반환반음
    items = builder.getLayout()

    logging.info("{0}건 축출, disp_typed :{1}".format(len(items), disp_type))
    
    if dev_mode:
        filelist = [['assets/img/'+ album_name+'/'+item.url,item.block,item.cord_rect,item.id] for item in items]
    else:
        # filelist = [[url_for('static',filename= 'web/assets/img/'+ album_name+'/'+item.url),item.block,item.cord_rect,item.id] for item in items]
        filelist = [[url_for('static',filename= album_name+'/'+item.url),item.block,item.cord_rect,item.id] for item in items]

    model.close()
    return jsonify(filelist)

class ListConverter(BaseConverter):
    def to_python(self, value):
        return value.split('+')
    def to_url(self,values):
        return "+".join(BaseConverter.to_url(value) for value in values)

app.url_map.converters['list'] = ListConverter

@app.route('/api/layout/<list:req_lists>',methods = ['GET'])
def angular_layout_type(req_lists):
    album_name = req_lists[0]
    disp_type = req_lists[1]
    layout = req_lists[2]
    logging.debug("album_name :{},disp_type :{},layout :{}".format(album_name,disp_type,layout))
    model = Model()
    data = model.get_image_name(album_name)
    if layout=='Default':
        builder = DefaultLayout(disp_type,data)
    else:
        builder = CompactLayout(disp_type,data)
    builder.create()
    #items데이타를 반환반음
    items = builder.getLayout()

    logging.info("{0}건 축출, disp_typed :{1}".format(len(items), disp_type))
    
    if dev_mode:
        if layout=='Default':
            filelist = [['assets/img/'+ album_name+'/'+item.url,item.id] for item in items]
        else:
            filelist = [['assets/img/'+ album_name+'/'+item.url,item.block,item.cord_rect,item.id] for item in items]
    else:
        # filelist = [[url_for('static',filename= 'web/assets/img/'+ album_name+'/'+item.url),item.block,item.cord_rect,item.id] for item in items]
        filelist = [[url_for('static',filename= album_name+'/'+item.url),item.block,item.cord_rect,item.id] for item in items]

    model.close()
    return jsonify(filelist)

@app.route('/apix/imagelist/<string:album_name>',methods = ['GET'])
def angular_get_imagelist(album_name):
    data = menu.menu_3()
    filelist = [url_for('static',filename=album_name+'/'+album['filename']) for album in data.get(album_name,'')]
    # print(jsonify(filelist))
    return jsonify(filelist)

@app.route('/edit_image', methods = ['GET','POST'])
def edit_image():
    import json
    param = json.loads(request.data.decode('utf-8'))    
    tmp_path = menu.menu_4(**param)
    ret = dict(data=tmp_path)
    print("app.route %s" % ret)
    return jsonify(ret)
    
@app.route('/angular',methods = ['POST', 'GET'])
def angular_home():
    import os
    root_dir = os.path.dirname(os.getcwd())
    print("root dir : %s" % root_dir)
    return send_from_directory(os.path.join(root_dir, 'python','fileCollection','backend','static', 'html'),'index.html')
    # return app.send_file('static/html/index.html')

@app.route('/result',methods = ['POST', 'GET'])
def get():
    data = menu.menu_3()
    index = request.form['submit'].split(':')[0]
    album_name = request.form['menu' + index]
    # print("index : %s" % index)
    # print("index : %s" % album_name)
    # list = data[album_name]
    filelist = [url_for('static',filename=album_name+'/'+album['filename']) for album in data.get(album_name,'')]
    return render_template("result.html", list = filelist)

@app.route('/album/<path:path>')
def send_js(path):
    print(os.path.join('D:\\내사진\\Album 2017\\', path))
    return Response('<img src="/Album%202017/170110-%EC%8B%A0%EC%A3%BC%EC%BF%A0%EC%82%B0%EC%B1%85/20170106_223247_HDR.jpg">',mimetype="text/html")

if __name__=='__main__':
    app.run(debug=True)