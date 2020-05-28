To publish a new npm package follow the steps below:
- Update version inside `projects/formio-editor/package.json`, for instance from `0.0.0` to `0.1.0`
  ```json
  {
    "name": "@davebaol/angular-formio-editor",
    "version": "0.1.0",
    ...
  }
  ```
- Commit this change to github with a commit message specifying the new version, for instance `Release 0.1.0`
- Build the entire project to check that everything is ok
  ```bash
  npm run build-all-prod
  ```
- Test the package, possibly in a new angular app
  ```bash
  npm install dist/formio-editor
  ```
- Publish the package
  ```bash
  cd dist/formio-editor
  npm publish --access public
  ```
- Visit the [public package page](https://www.npmjs.com/package/@davebaol/angular-formio-editor). Public packages will say `public` below the package name on the npm website.
- Create a github release, for intance `0.1.0`