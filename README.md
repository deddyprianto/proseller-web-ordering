# CRM ORDERING WEB

## + CLONE PROJECT
```
https://github.com/edgeworkssg/crm-web-ordering.git
```

## + RUN
```
npm install
npm start
```

## + MODE WEB ORDERING
```
http://localhost:3000/#/
```
OR
```
http://localhost:3000/webordering/#/
```

## + MODE EMENU
```
http://localhost:3000/emenu/#/
```

## + DEPLOY

### INSTALATION
```
npm install awscli
aws configure
```
Input access key id, secret access key, and default region according to the account that you have created on the AWS console page. https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html

### Deploy to Web Ordering Dev
```
npm run webordering-dev
```

### Deploy to Web Ordering Demo
```
npm run webordering-demo
```

### Deploy to Web Ordering Prod
```
npm run webordering-prod
```

### Deploy to eMenu Dev
```
npm run emenu-dev
```

### Deploy to eMenu Demo
```
npm run emenu-demo
```

### Deploy to eMenu Prod
```
npm run emenu-prod
```