# Contributing

First off, thank you for considering contributing to ngx-color-picker.

Before you submit an issue, please search the issue tracker, maybe an issue for your problem already exists and the discussion might inform you of workarounds readily available.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## <a name="issue"></a> Found a Bug?
If you find a bug in the source code, you can help us by
[submitting an issue][newIssue] to our [GitHub Repository][github]. Even better, you can submit a Pull Request with a fix.

## <a name="feature"></a> Missing a Feature?
You can *request* a new feature by [submitting an issue][newIssue] to our GitHub
Repository. If you would like to *implement* a new feature, please submit an issue with
a proposal for your work first, to be sure that we can use it.
Please consider what kind of change it is:

* For a **Major Feature**, first open an issue and outline your proposal so that it can be
discussed. This will also allow us to better coordinate our efforts, prevent duplication of work,
and help you to craft the change so that it is successfully accepted into the project.
* **Small Features** can be crafted and directly submitted as a Pull Request.


## Pull Request Process

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub][issues] for an open or closed PR
  that relates to your submission. You don't want to duplicate effort.
2. Make your changes in a new git branch:

     ```shell
     git checkout -b my-fix-branch master
     ```

3. Create your patch, **including appropriate test cases**.
4. Run the full test suite and ensure that all tests pass.
5. Commit your changes using a descriptive commit message.

     ```shell
     git commit -a
     ```
    Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

6. Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

7. In GitHub, send a pull request to `ngx-color-picker:master`.
8. If we suggest changes then:
    * Make the required updates.
    * Re-run the Angular test suites to ensure tests are still passing.
    * Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase master -i
    git push -f
    ```

That's it! Thank you for your contribution!


To ensure consistency throughout the source code all features or bug fixes **must be tested** by one or more specs.


[github]: https://github.com/pIvan/ngx-color-picker
[issues]: https://github.com/pIvan/ngx-color-picker/issues
[newIssue]: https://github.com/pIvan/ngx-color-picker/issues/new