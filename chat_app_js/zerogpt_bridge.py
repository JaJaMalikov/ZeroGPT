import sys
import json
from zerogpt import Client

def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'no input'}))
        return
    text = sys.argv[1]
    client = Client()
    try:
        resp = client.send_message(text)
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        return
    print(json.dumps({'response': resp}))

if __name__ == '__main__':
    main()
