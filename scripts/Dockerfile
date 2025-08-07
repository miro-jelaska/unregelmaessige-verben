FROM 'python:3.13.5-slim-bookworm'
WORKDIR /usr/local/app

COPY --from=ghcr.io/astral-sh/uv:0.8.2 /uv /uvx /bin/

ENTRYPOINT ["/bin/bash"]
