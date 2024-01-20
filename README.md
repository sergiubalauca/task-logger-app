## Generate App Icon and Splash Screen Images

Side note: since we use Capacitor and not Cordova, it's tricky to generate and replace app logo and splash screen. Here it's a work around:

1. create 1024x1024px icon at `resources/icon.png`

2. create 2732x2732px splash at `resources/splash.png`

3. run `sudo chmod -R 777 scripts/resources.js` on Mac or give permissions for reading/writing on Windows

4. run `npm run resources`

## Prerequisite

1. NodeJS version > 16

## install JsonFileExporter & LogsFileExporter custom plugins (for each plugin follow these steps)

1. from comand line, point to each folder (/json-file-exporter/ & /logs-file-exporter/)

2. run `npm i`

3. run `npm run build`

# Release Process

## Web

Go to : https://dev.azure.com/DatamineCanada/QuickLogger/_release?_a=releases&view=mine&definitionId=1

1. Click on the Acceptance Environment Button
2. Click on deploy

## Source Control - Git

1. Create branch name releases/vx.x.x from the release candidate commit.
2. Push a tag name vx.x.x associated to the release candidate commit.

## Android

1. Make sure you are on the right commit
2. Run `ionic build` REMARK : Change to production build !!!
3. Run `npx cap sync android`
4. Run `npx cap open android`
5. Go into Android Studio Task bar.
6. Click `Build`
7. Click `Generate Signed Bundle\Apk`
8. Select `Android App Bundle`
9. Set the keystore path to the .pks file (this was generated first time the app was uploaded to store)
10. Fill in all info
11. Go to the resulted .aab
12. Open Google Play Console. Login with priviledged account
13. Select Datamine QuickLogger from all apps
14. Go to Production in the left menu
15. If screenshots have changed. Go to Store Presence-> Main Store Listing and update the screenshots.
16. Click on Create new Release
17. Upload the .aab from step 11. Hit Save
18. Press Review Release
19. Start rollout to production
20. If any screenshots go to Publish overview and publish the changes. Make sure you publish these after the version in released to store.

## IOS

1. Go to Apple Developer Portal
2. Create new release (name it x.x.x)
3. Change screenshots if necessary
4. Select the desired build
