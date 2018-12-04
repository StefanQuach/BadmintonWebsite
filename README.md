Checked out by TA: Harrison Lu

#Badminton Club Ranking Website
This will be a website for tracking the rankings of players in the Badminton Club as well as
some administrative tasks like sending group posts and notifications. Rankings will be established by
challenge matches, which users can request. If User 1 wins a challenge match against User 2, their
rankings will change accordingly. Administrators will be able to monitor activity on the website, as well as post
on an announcement board.  
We plan to use Reactjs for the framework as well as Firebase for our database.
##Grading Rubric
###Preparation (5 points)
* (5 points) Submitting proposal on time

###Users (25 points)
* (5 points) Users have a name, email, and password
* (5 points) Passwords are salted and hashed
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
* (4 points) User settings shows user info (email, name, ranking)
* (1 points) Users can update email information

###Usability (5 points)
* (4 points) Site is easy and intuitive to use
* (1 point) Site is visually appealing

###Creative Portion (20 points)
* Could be email notifications
* Liking global posts
* Changing password
* Email confirmation on account creation and email change


##Assignment Information
###Link:
We used firebase hosting to host our website, linked below:  
https://badminton-87565.firebaseapp.com/

###Creative Portion
####Password Changing
On top of being able to change emails, users can change passwords via the Account Information page

####Public Announcements
Announcements can be made public on creation or editing. Public announcements will appear on the Landing page whereas both
public and private announcements appear on the Home page (which is protected). 

####Deactivating Users
Once a user graduates of leaves the club, an admin can deactivate that user. That user is now unable to be ranked or submit
challenge requests. 

####Cancelling Challenge requests
Admins have the full authority over challenge requests. As such, they are able to dismiss challenge requests if they are incomplete
(as well as approve them if they are complete). Furthermore, the owner (challenger) of the challenge request is able to cancel
their own challenge request.

####Email confirmation 
When a user is changes their email information, a confirmation email is sent to the old email notifying the user of the change.