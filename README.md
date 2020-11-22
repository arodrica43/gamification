# Gamification XBlock

#### Gamification Module - XBlock ####

## Table of contents
* [General info](#general-info)
* [Features](#features)
* [Install and Run](#install-and-run)
* [Deploy](#deploy)
* [Usage](#usage)

## General info

This XBlock is designed and developed in order to use the Gamification-App web-app. Thus, the code of the repository works as a client-side application for the Gamification Module, which is integrable in OpenedX frameworks.
With this XBlock you can embed gamification mechanics into your course, forgetting about gamified data management. This is a project from Barcelona University, namely NanoMOOC UB project, so for any use of it, contact with nanomoocsub@gmail.com

## Features ##

The gamification mechanics are displayed according to the XBlock settings, which can control 3 things:

1) Concrete mechanic type to be displayed:

	- Development Tools (Disruptor)
	- Challenges (Disruptor)
	- Easter Eggs (Free spirit)
	- Unlockables (Free spirit)
	- Badges (Achiever)
	- Levels (Achiever)
	- Points (Player)
	- Leaderboards (Player)
	- Lotteries (Player)
	- Gift Openers (Player)
	- Social Networks (Socializer)
	- Social Statuses (Socializer)
	- Sharing Knowledge (Philantropist)
	- Gifts (Philantropist)


2) Gamification mechanic mode:

	- Inadaptative-Static: The displayed mechanic is the same for all users always.
	- Adaptative-Dynamic: The displayed mechanic depend on the user's gamer profile. It changes every time the page is refreshed. 
	- Adaptative-Static: The displayed mechanic depend on the user's gamer profile. It doesn't change when the page is refreshed.


3) Gamification mechanic format:

    - Full: The mechanic is fully displayed, with all possible interactions with wich was designed.
    - Widget: Only a small part of the mechanic is displayed, and could contain a link to the full mechanic, or to a dashboard.


## Install and Run ##

As every XBlock, the Gamification-XBlock can be installed and ran locally through xblock-sdk following this steps:

1) Download and install Xblock-Sdk from this link

https://github.com/edx/xblock-sdk

2) Clone this repository inside the folder xblock-sdk

3) Install the XBlock

```
pip install -e gamification
```

or

```
cd gamification
pip install requirements.txt
```

4) Open the Xblock-Sdk and go to the Gamification page:

```
python manage.py runserver
```

## Deploy ##

Once an OpenedX instance is running (for example https://github.com/edx/devstack or https://docs.tutor.overhang.io/), just follow the [Install and Run](#install-and-run) steps.

## Usage ##

The XBlock is instantiated as an Advanced content in OpenedX Stuido. Once it have been created, you can control the gamification mechanics through the settings in the Edit view. The settings are:


- Title (Display name): Displayed title of the XBlock.
- Gamification Mechanic Format: Controls the display format (Full or Widget)
- Gamification Mechanic Type: Determines the type of the displayed mechanic. If "Adaptative" is selected, the mechanic mode will be Adaptative-Dynamic. Else, it will be Inadaptative-Static.
- Gamification Mechanic Id: If this field is 0, it's ignored. If it's different from 0 (i.e. integer bigger than 0) the Gamification Mechanic Format and Type fields are ignored, and the displayed mechanic is the one that have this Id (on the Gamification-App).

