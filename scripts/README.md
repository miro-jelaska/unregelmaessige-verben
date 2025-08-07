
Build docker image.
```
docker build -t unregelmaessige-verben .
```

Run container and SSH to it. 
```
docker run \
  --name "unregelmaessige-verben" \
  --mount type=bind,src=./,dst=/scripts \
  --rm \
  --interactive \
  --tty \
  "unregelmaessige-verben"
```
