from samcli.lib.bootstrap.bootstrap import manage_stack
import sys

bucket_name = manage_stack(sys.argv[1], sys.argv[2])

print(bucket_name)
