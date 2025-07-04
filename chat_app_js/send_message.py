import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from zerogpt import Client

if __name__ == '__main__':
    message = sys.argv[1] if len(sys.argv) > 1 else ''
    client = Client()
    resp = client.send_message(message)
    print(resp)
