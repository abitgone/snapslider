# Contributing to this project

Coding conventions first:

-   For all languages, indent with four spaces, no tabs.
-   Always leave an empty line at end of file.
-   Stick to existing conventions in the files.

If you'd like to contribute to the jQuery Plugins, you'll need to fork the repo first. Once you've created a fork, create a branch based on `master`. If you're fixing a bug, please file an issue first so that you and I can track the fix with a commit.

Next, create a branch. It helps if you include the issue number in your contribution's branch name. If your contribution is based on issue 12, for example, you'd do the following:

```bash
$ git checkout master
$ git pull origin master
$ git checkout -b bugfix/12_name-of-bugfix
```

If you were creating a new feature, based on issue 12, you'd do the following:

```bash
$ git checkout master
$ git pull origin master
$ git checkout -b feature/12_name-of-feature
```

**If you have contributor access to this repository, _do not_ work directly on the `master` branch.**

Keep all commits as small as possible - more smaller commits are preferable over a single large commit. If you keep your commits to a single unit of functionality or single bug fix, that will work nicely.

Push all your commits to your branch in your fork of the repository and then submit a pull request.

Finally, thank you for taking the time to contribute - it really is very much appreciated.
