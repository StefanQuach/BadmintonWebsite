#Badminton Club Ranking Website
This will be a website for tracking the rankings of players in the Badminton Club as well as
some administrative tasks like sending group posts and notifications. Rankings will be established by
challenge matches, which users can request. If User 1 wins a challenge match against User 2, their
rankings will change accordingly. Administrators will be able to monitor activity on the website, as well as post
on an announcement board.  
We plan to use Reactjs for the Framework as well as Firebase for our database.
##Grading Rubric
###Preparation (5 points)
* (5 points) Submitting proposal on Time

###Users (25 points)
* (5 points) Users have a username, name, and password
* (5 points) Usernames are unique and passwords are salted and hashed
* (5 points) Admin accounts exist
* (5 points) Admins can promote users to admins
* (5 points) Admins can demote other admins

###User Interactions (20 points)
* (5 points) Correctly displays rankings, even after ranking updates
* (5 points) The result of challenge match changes global rankings 
* (5 points) Admin users can create posts on news board
* (5 points) Admins can edit/delete ANY posts on news board

###Challenge Matches (20 points)
* (5 points) Users can submit challenge match requests
* (5 points) Admins can view all current challenge requests
* (5 points) Matches must be approved by both parties and an admin before ranking updates
* (5 points) Match scores are verfied (best of 3 sets, first to 21 points, win by two)

###User Settings (5 points)
* (4 points) User settings shows user info (email, name, username, ranking)
* (1 points) Users can update email information

###Usability (5 points)
* (4 points) Site is easy and intuitive to use
* (1 point) Site is visually appealing

###Creative Portion (20 points)
* Could be email notifications
* Liking global posts
* Changing password
* Email confirmation on account creation and email change