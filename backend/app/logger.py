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

def logging(msg, type=None):
    # @logging 형식으로 호출하는 경우
    def wrapper(*arg,**karg):
        printlog('##### ' + msg.__name__ + ' #####')
        return msg(*arg,**karg)
    # @logging() 형식으로 호출하는 경우
    def func(fn):
        def wrapper(*arg,**karg):
            # 메시지가없는 경우
            if  not msg:
                message = fn.__name__

            # 메시지가있는 경우
            # self.url값을 출력한다.
            elif  type == 'url':
                message = fn.__name__ + '(' + msg.format(arg[0].url) + ')'
            else:
                message = fn.__name__ +  '(' + msg + ')'

            printlog('##### ' + message + ' #####')
            return fn(*arg,**karg)
        return wrapper

    if hasattr(msg,'__call__'):
        return wrapper
    else:
        return func