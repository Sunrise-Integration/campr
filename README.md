# campr (alpha)

A CLI for **C**reating **A**nd **M**erging **P**ull **R**equests

## Installation

`npm install -g campr`

## Usage 

`campr "name of pull request"`

This will create a pull request with the name you pass it and then automatically merge it into the branch you specify as the baseRef in the .env file

## Configuration


`cp .env.example .env`

Add your own values to the .env file


| Field     | Description                                                                                                                                                                                                                |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| token     | A github [personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) which proper scopes for the [GraphQL API](https://developer.github.com/v4/guides/forming-calls/) |
| repoOwner | Owner of the repository *eg:* https://github.com/repoOwner/repoName                                                                                                                                                        |
| repoName  | Name of the repository *eg:* https://github.com/repoOwner/repoName                                                                                                                                                         |
| baseRef   | Branch name to merge into *eg:* develop                                                                                                                                                                                    |
| headRef   | Branch name to merge from *eg:* feature-branch-name                                                                                                                                                                        |

<p align="center">Proudly created by:</p>

<p align="center">

<img src="https://borderfree-dev.sunriseintegration.com/img/sunrise-integration-logo.png" alt="Custom software integrations by Sunrise">

</p>