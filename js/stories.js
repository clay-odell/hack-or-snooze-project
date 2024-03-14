"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}
/** Get Delete Button HTML */
function getDeleteButtonHTML(){
  return`<span class="trash-can">
    <i class="fa fa-trash></i>
    </span>`;
}
/** The HTML for a favorite star based on whether it is or isn't a favorited story */
function getFavoriteStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far"; 
  return `<span class=star">
  <i class="${starType} fa-star"></i>
  </span>`;
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
/**Deletes story from storyList */
async function deleteStory(evt) {
  console.debug("deleteStory");
  const $closestLi = $(evt.target).closest("li");
  storyId = $closestLi.attr("id");
  await storyList.removeStory(currentUser, storyId);
  putStoriesOnPage();
}
$userStoriesList.on("click", ".trash-can", deleteStory);
/** Adds a user submitted story from the newStoryForm on submit button click */
async function addNewStoryOnPage() {
  console.debug("addNewStoryOnPage");
  const title = $("#new-story-title").val();
  const author = $("#new-story-author").val();
  const url = $("#new-story-url").val();
  const username = currentUser.username;
  const newStoryData = { username, title, author, url };
  const story = await storyList.addStory(currentUser, newStoryData);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  $newStoryForm.reset();
  $newStoryForm.hide();
}

$("#story-submit").on("click", addNewStoryOnPage);

async function addUserStoriesOnPage() {
  console.debug("addUserStoriesOnPage");
  $userStoriesList.empty();
  if (currentUser.ownStories.length === 0) {
    $userStoriesList.append(
      `<h4>${currentUser.username} hasn't submitted any stories.</h4>`
    );
  } else {
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story, true);
      $userStoriesList.append($story);
    }
  }
  $userStoriesList.show();
}
async function addFavoritedStoriesOnPage() {
  console.debug("addFavoritedStoriesOnPage");
  $favoritesList.empty();
  if (currentUser.favorites.length === 0) {
    $favoritesList.append(
      `<h4>${currentUser.username} hasn't favorited any stories.</h4>`
    );
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritesList.append($story);
    }
  }
  $favoritesList.show();
}
