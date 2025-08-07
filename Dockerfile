####################
# localhost images #
####################
FROM alpine:3.22 AS yaml_linter
RUN apk add --no-cache yamllint
CMD ["/bin/sh"]

