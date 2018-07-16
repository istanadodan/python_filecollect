import logging
import sys
# 전역변수로 선언함으로써 _get_logger() 호출 시마다 핸들러가 생성되는 것을 방지

def _get_logger():
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.DEBUG)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger

my_logger = _get_logger()

def printlog(msg):
    # logger  = _get_logger()
    my_logger.info(msg)