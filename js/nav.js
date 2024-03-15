"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  // console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  // console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  // console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $centerNavLinks.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/* When a user clicks on submit, show the submission form. */
function navSubmitClick(evt) {
  // console.debug("navSubmitClick", evt);
  hidePageComponents();
  $newStoryForm.show();
}
$navSubmit.on('click', navSubmitClick);

/** When a user clicks on my_stories, show user stories list */
function navMyStoriesClick(evt) {
  // console.debug("navMyStoriesClick", evt);
  hidePageComponents();
  addUserStoriesOnPage();
}
$navMyStories.on('click', navMyStoriesClick);

/**When a user clicks on favorites, show user favorites list */
function navFavoritesClick(evt){
  // console.debug("navFavoritesClick", evt);
  hidePageComponents();
  addFavoritedStoriesOnPage();
}
$navFavorites.on('click', navFavoritesClick);

function navUserProfileClick(evt) {
  // console.debug("navUserProfileClick", evt);
  hidePageComponents();
  $userProfile.show();
  generateUserProfile();
  
}
$navUserProfile.on('click', navUserProfileClick);