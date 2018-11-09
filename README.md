# campr (alpha)

A CLI for **C**reating **A**nd **M**erging **P**ull **R**equests

##Installation
`npm install -g campr`

##configuration
`cp .env.example .env`

Add your own values to the .env file


| Field     | Description                                                                                                                                                                                                                |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| token     | A github [personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) which proper scopes for the [GraphQL API](https://developer.github.com/v4/guides/forming-calls/) |
| repoOwner | Name of the repository *eg:* https://github.com/**repoOwner**/**repoName**                                                                                                                                                 |