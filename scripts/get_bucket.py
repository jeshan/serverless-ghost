import os
from subprocess import check_output


def go():
    profile = os.environ['AWS_PROFILE']
    region = os.environ['AWS_DEFAULT_REGION']

    output = check_output('python scripts/call_manage_stack.py'.split(' ') + [profile, region])
    lines = output.decode('utf-8').split('\n')
    bucket = lines[-2]

    print(bucket)


if __name__ == '__main__':
    go()
