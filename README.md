<a href="https://ayushma.ohc.network/">
  <p align="center">
    <picture style="">
      <source media="(prefers-color-scheme: dark)" srcset="public/logo_white.svg">
      <img alt="Ayushma Logo" src="public/logo_text.svg" style="max-width:300px;">
    </picture>
  </p>
</a>
<p align="center">
    Ayushma is a digital AI health and nursing assistant to help Nurses and Doctors in the most remote parts of the world. It is a part of the <a href="https://ohc.network"> Open Health Care Network</a>
</p>
<hr>
<h3 align="center"><a href="https://ayushma.ohc.network" target="_blank">🚀 Staging Deployment</a></h3>
<p align="center"><img src="https://vercelbadge.vercel.app/api/coronasafe/ayushma_fe"></p>
<p align="center">Auto deployed to <a href="https://ayushma.ohc.network">ayushma.ohc.in</a> for <code>master</code> branch. All pull requests have preview builds powered by <a href="https://vercel.com">Vercel</a>.</p>

## Getting started

- 💬 Comment on the issue if you are willing to take it up, and link the pull request with the issue.
- 📸 Attach screenshots in the pull requests showing the changes made in the UI.

#### Install the required dependencies

```sh
yarn i-all
```

#### 🏃 Run the app in development mode

```sh
yarn dev
```

Once the development server has started, open [localhost:3000](http://localhost:3000) in your browser. The page will be automatically reloaded when you make edits and save. You will also see any lint errors in the console.

#### 🔑 Staging API Credentials

Authenticate to staging API with the following credentials

```yaml
- email: demo@ayushma.ohc.network
  password: Demo@Ayu
```

You can also register as a new user.

#### 🏷️ Make use of labels to update the PR/issue status

- Mark your PRs as `work-in-progress` if it's still being worked on.
- Once you have solved the related issue, mark your PR with `need testing` and `need review` labels.
- When you’re making a PR with lots of code changes that affects multiple functionalities, or is likely to break, make sure you tag it with `Major Code Change` label.

## 📖 Documentations

- [Swagger API Documentation](https://ayushma-api.ohc.network)

## 💎 Backend

Ayushma's backend is built on Django. You can find documentation on the [Backend Repository](https://github.com/coronasafe/ayushma)

## 🚀 Production

#### Build the app for production

```sh
yarn build
```

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

#### Start a production `http-server`

```sh
yarn start
```

Starts a production http-server in local to run the project with Service worker.
The build is minified and the filenames include the hashes.

**🚀 Your app is ready to be deployed!**

## White Labeling

Ayushma is a white label product. You can customize the app to your needs by changing the following files:

### Images

- `public/logo_text.svg` - Logo with text
- `public/logo_white.svg` - Logo with white text
- `public/logo.svg` - Logo without text
- `public/logo.png` - Logo without text

### Environment Variables

- `NEXT_PUBLIC_API_URL`= Backend API URL
- `NEXT_PUBLIC_LOCAL_STORAGE`= Local storage key name
- `NEXT_PUBLIC_AI_NAME`= Name of the AI (default: Ayushma)
- `NEXT_PUBLIC_AI_DESCRIPTION`= Description of the AI
- `NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY` = Google Recaptcha Site Key
