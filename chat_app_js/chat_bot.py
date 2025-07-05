import os, sys
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from zerogpt.client import Client


def main():
    if len(sys.argv) < 2:
        print('No message provided')
        return
    message = sys.argv[1]
    client = Client()
    try:
        response = client.send_message(message)
    except Exception as e:
        response = f'Error: {e}'
    print(response)

if __name__ == '__main__':
    main()
