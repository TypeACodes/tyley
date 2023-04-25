
## Managing Dependencies with TypeACode's Tyley Package Manager

TypeACode's Tyley Package Manager can help you manage your project's dependencies and keep them up-to-date. It works similarly to other package managers like npm or yarn, but also provides additional features like vulnerability scanning and license compliance checks.

Here's an example of how to use Tyley Package Manager to install a dependency:

1. Install the `tyley` command-line tool globally using npm:

```shell
npm install -g tyley
``` 
or use `prep` instant commands installer
```shell
prep install --yes tyley
```
2. Initialize your project with Tyley:
```shell
tyley init
```
3. Install a dependency using Tyley:
```shell
tyley install
```
Replace `dependency-name` with the name of the actual dependency you want to install. Tyley will download and install the dependency, along with its dependencies, and add it to your project's `tyley.json` file.

Run your project using Tyley:
```shell
tyley run yourscript
```
Replace `your-script` with the name of the script you want to run. Tyley will run the script using the dependencies installed by Tyley, ensuring that all dependencies are up-to-date and secure.
