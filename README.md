# DroneCI Plugins

## eslint
```yaml
steps:
- name: eslint
  image: marcbachmann/eslint:8.47.0
  environment:
    # This can be used to report the status to github, the config is optional
    GH_TOKEN:
      from_secret: GH_TOKEN
```

```bash
cd eslint
docker build -t marcbachmann/eslint:8.47.0 .
docker push marcbachmann/eslint:8.47.0
```
