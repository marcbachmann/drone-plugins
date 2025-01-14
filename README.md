# DroneCI Plugins

## eslint
```yaml
steps:
- name: eslint
  image: marcbachmann/eslint:9.18.0
  settings:
    # This can be used to report the status to github, the config is optional
    gh_token:
      from_secret: GH_TOKEN
    # To run only in a subdirectory, please provide it explicitly
    # Multiple directories are supported using `directory: ./dir1, ./dir2`
    directory: ./subpath
```

```bash
cd eslint
docker build -t marcbachmann/eslint:9.18.0 .
docker push marcbachmann/eslint:9.18.0
```
