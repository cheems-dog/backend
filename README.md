# cheems.dog - backend

cheems.dog is fast and innovative image & file hosting. Currently supporting only images from ShareX, but more features coming soon...

## Installation
### Running in development mode
1. Clone the repo using `git clone https://github.com/cheems-dog/backend.git`
2. Enter main folder `cd backend`
3. Install all modules using `npm i`
5. Run the app using `npm run dev`, server will restart every time a file is modified
  - If you want your app to restart after every file change, use `npm run dev`
  - If you want to push your app to production you need to configure the `config.jsonc` file, as it contains important settings. It's recommended to firstly compile the app using `tsc`, then entering `build` folder and starting the app with `node index.js`

### Running the app in production mode
1. Clone the repo using `git clone https://github.com/cheems-dog/backend.git`
2. Enter main folder `cd backend`
3. Install all modules using `npm i`
5. Compile the app using `tsc` command
6. Run main file using `node build/index.js`
7. [OPTIONAL] If you want you server to not turn off when you close the terminal, you can use [PM2 - Process Manager 2](https://pm2.keymetrics.io) or [GNU screen](https://www.gnu.org/software/screen/)

## Credits
cheems.dog could not ever start with the help of this people:
- 6vz - Idea for a project, frontend, graphics | [Discord](discord.com/users/338075554937044994) [Twitter](https://twitter.com/6vzSaysStuff) [GitHub](https://github.com/6vz)
- JuzioMiecio520 - Head developer, backend | [Discord](discord.com/users/396286593033437185) [Twitter](https://twitter.com/JuzioMiecio520) [GitHub](https://github.com/JuzioMiecio520)

## Contributing
To contribute clone this repo to your local system, mnake changes and create a pull request. Pull request should be reviewed and accepted quickly

Thanks for using cheems!
~ cheems Team