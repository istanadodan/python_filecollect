from PIL import Image
from os.path import join

class setting:
    static_folder =[
        "D:\\내사진\\Album 2017",
        "static",
        ]
    dev_mode = True

    base_size = dict({'width':240, 'height':180})
    # base_size = dict({'width':120, 'height':90})
    view_max_count = 6

    root_dir = "D:\\Project\\python\\fileCollection\\"

    rs_v = dict({'BICUBIC':Image.BICUBIC, 'NEAREST':Image.NEAREST, 'BILINEAR':Image.BILINEAR})

    @classmethod
    def get_file_path(cls, path):
        if cls.dev_mode:
            return join(cls.root_dir, "frontend/src/",path)
        else:
            return join(cls.root_dir, "backend/static/html/",path)